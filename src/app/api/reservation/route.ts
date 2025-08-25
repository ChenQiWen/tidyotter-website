import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createClient } from 'redis';
// 移除trackEvent导入，服务端不使用客户端分析

// Redis客户端实例
let redisClient: any = null;

// 初始化Redis连接
async function getRedisClient() {
  if (!redisClient) {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL environment variable is required');
    }
    
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    
    redisClient.on('error', (err: any) => {
      console.error('Redis Client Error:', err);
    });
    
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  }
  
  return redisClient;
}

// KV存储接口
interface KVInterface {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any, options?: { ex?: number }): Promise<void>;
  lpush(key: string, ...values: string[]): Promise<number>;
  ltrim(key: string, start: number, stop: number): Promise<void>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  ping(): Promise<string>;
}

// Redis KV实现
const redisKV: KVInterface = {
  async get<T = any>(key: string): Promise<T | null> {
    const client = await getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  },
  async set(key: string, value: any, options?: { ex?: number }): Promise<void> {
    const client = await getRedisClient();
    const serializedValue = JSON.stringify(value);
    if (options?.ex) {
      await client.setEx(key, options.ex, serializedValue);
    } else {
      await client.set(key, serializedValue);
    }
  },
  async lpush(key: string, ...values: string[]): Promise<number> {
    const client = await getRedisClient();
    return await client.lPush(key, values);
  },
  async ltrim(key: string, start: number, stop: number): Promise<void> {
    const client = await getRedisClient();
    await client.lTrim(key, start, stop);
  },
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const client = await getRedisClient();
    return await client.lRange(key, start, stop);
  },
  async ping(): Promise<string> {
    const client = await getRedisClient();
    return await client.ping();
  }
};

// 获取KV实现（强制使用Redis）
function getKV(): KVInterface {
  return redisKV;
}

// 初始化 Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// 预约表单验证 schema
const reservationSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  name: z.string().min(1, '请输入姓名').max(50, '姓名不能超过50个字符'),
  phone: z.string().optional(),
  locale: z.string().optional(),
});

// 速率限制配置
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15分钟
  maxRequests: 5, // 最多5次请求
};

// 检查速率限制
async function checkRateLimit(ip: string): Promise<boolean> {
  try {
    const kv = getKV();
    const key = `rate_limit:${ip}`;
    const current = await kv.get<number>(key) || 0;
    
    if (current >= RATE_LIMIT.maxRequests) {
      return false;
    }
    
    await kv.set(key, current + 1, { ex: Math.floor(RATE_LIMIT.windowMs / 1000) });
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // 如果Redis失败，允许请求继续
  }
}

// 保存预约信息到Redis
async function saveReservation(data: any): Promise<void> {
  try {
    const kv = getKV();
    const reservationId = `reservation:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const reservationData = {
      ...data,
      id: reservationId,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    
    // 保存到Redis
    await kv.set(reservationId, reservationData);
    
    // 添加到预约列表
    await kv.lpush('reservations:list', reservationId);
    
    // 保持列表最多1000条记录
    await kv.ltrim('reservations:list', 0, 999);
    
    console.log('Reservation saved:', reservationId);
  } catch (error) {
    console.error('Failed to save reservation:', error);
    throw new Error('保存预约信息失败');
  }
}

// 发送确认邮件
async function sendConfirmationEmail(data: any): Promise<void> {
  try {
    if (!resend) {
      console.warn('RESEND_API_KEY not configured, skipping email');
      return;
    }
    
    const isZh = data.locale === 'zh';
    
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@tidyotter.app',
      to: [data.email],
      subject: isZh ? 'TidyOtter 预约确认' : 'TidyOtter Reservation Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">${isZh ? 'TidyOtter 预约确认' : 'TidyOtter Reservation Confirmation'}</h2>
          <p>${isZh ? `亲爱的 ${data.name}，` : `Dear ${data.name},`}</p>
          <p>${isZh 
            ? '感谢您对 TidyOtter 的关注！我们已收到您的预约申请，将在产品正式发布时第一时间通知您。' 
            : 'Thank you for your interest in TidyOtter! We have received your reservation and will notify you first when the product is officially released.'
          }</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${isZh ? '预约信息' : 'Reservation Details'}</h3>
            <p><strong>${isZh ? '邮箱' : 'Email'}:</strong> ${data.email}</p>
            <p><strong>${isZh ? '姓名' : 'Name'}:</strong> ${data.name}</p>
            ${data.phone ? `<p><strong>${isZh ? '手机' : 'Phone'}:</strong> ${data.phone}</p>` : ''}
          </div>
          
          <p>${isZh 
            ? 'TidyOtter 是一款智能桌面文件整理工具，致力于让您的工作空间更加整洁有序。' 
            : 'TidyOtter is a smart desktop file organizer designed to keep your workspace clean and organized.'
          }</p>
          
          <p style="color: #666; font-size: 14px;">
            ${isZh 
              ? '此邮件由系统自动发送，请勿回复。如有疑问，请访问我们的网站或联系客服。' 
              : 'This email is sent automatically, please do not reply. If you have any questions, please visit our website or contact customer service.'
            }
          </p>
        </div>
      `,
    });
    
    console.log('Confirmation email sent to:', data.email);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    // 不抛出错误，因为邮件发送失败不应该影响预约成功
  }
}

// 发送通知邮件给管理员
async function sendNotificationEmail(data: any): Promise<void> {
  try {
    if (!resend || !process.env.ADMIN_EMAIL) {
      console.warn('Email configuration missing, skipping admin notification');
      return;
    }
    
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@tidyotter.app',
      to: [process.env.ADMIN_EMAIL],
      subject: 'TidyOtter 新预约通知',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">TidyOtter 新预约通知</h2>
          <p>收到新的预约申请：</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>邮箱:</strong> ${data.email}</p>
            <p><strong>姓名:</strong> ${data.name}</p>
            ${data.phone ? `<p><strong>手机:</strong> ${data.phone}</p>` : ''}
            <p><strong>语言:</strong> ${data.locale || 'zh'}</p>
            <p><strong>时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      `,
    });
    
    console.log('Admin notification sent');
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

// 获取客户端IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP并检查速率限制
    const clientIP = getClientIP(request);
    const rateLimitOk = await checkRateLimit(clientIP);
    
    if (!rateLimitOk) {
      return NextResponse.json(
        { 
          error: '请求过于频繁，请稍后再试',
          code: 'RATE_LIMIT_EXCEEDED' 
        },
        { status: 429 }
      );
    }
    
    // 解析请求体
    const body = await request.json();
    
    // 验证数据
    const validatedData = reservationSchema.parse(body);
    
    // 检查邮箱是否已存在
    try {
      const kv = getKV();
      const existingReservations = await kv.lrange('reservations:list', 0, -1);
      for (const reservationId of existingReservations) {
        const reservation = await kv.get(reservationId);
        if (reservation && (reservation as any).email === validatedData.email) {
          return NextResponse.json(
            { 
              error: '该邮箱已预约过，请勿重复提交',
              code: 'EMAIL_EXISTS' 
            },
            { status: 400 }
          );
        }
      }
    } catch (error) {
      console.error('Failed to check existing reservations:', error);
      // 继续处理，不因为检查失败而阻止预约
    }
    
    // 保存预约信息
    await saveReservation(validatedData);
    
    // 发送确认邮件（异步，不等待结果）
    sendConfirmationEmail(validatedData).catch(console.error);
    
    // 发送管理员通知（异步，不等待结果）
    sendNotificationEmail(validatedData).catch(console.error);
    
    // 记录分析事件（服务端日志）
    console.log('Reservation submitted:', {
      email: validatedData.email,
      locale: validatedData.locale || 'zh',
      hasPhone: !!validatedData.phone,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        success: true,
        message: '预约成功！我们会尽快与您联系。'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Reservation API error:', error);
    
    // Zod 验证错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: '请检查输入信息',
          details: error.issues,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }
    
    // 其他错误
    return NextResponse.json(
      { 
        error: '服务器错误，请稍后重试',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// 简单的token验证
function validateToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // 简单的token验证，可以设置环境变量或使用固定token
  const validToken = process.env.ADMIN_TOKEN || 'admin-token-2024';
  return token === validToken;
}

// 获取预约列表
async function getReservationList(page: number = 1, limit: number = 10): Promise<{
  reservations: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const kv = getKV();
    
    // 获取所有预约ID
    const allReservationIds = await kv.lrange('reservations:list', 0, -1);
    const total = allReservationIds.length;
    
    // 计算分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIds = allReservationIds.slice(startIndex, endIndex);
    
    // 获取预约详情
    const reservations = [];
    for (const id of paginatedIds) {
      try {
        const reservation = await kv.get(id);
        if (reservation) {
          // 格式化数据，移除敏感信息
          const formattedReservation = {
            id: (reservation as any).id,
            email: (reservation as any).email,
            name: (reservation as any).name,
            phone: (reservation as any).phone || '',
            locale: (reservation as any).locale || 'zh',
            status: (reservation as any).status || 'pending',
            createdAt: (reservation as any).createdAt,
            createdAtFormatted: new Date((reservation as any).createdAt).toLocaleString('zh-CN')
          };
          reservations.push(formattedReservation);
        }
      } catch (error) {
        console.error(`Failed to get reservation ${id}:`, error);
      }
    }
    
    return {
      reservations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Failed to get reservation list:', error);
    throw error;
  }
}

// GET方法 - 支持健康检查和预约列表查询
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const list = searchParams.get('list');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // 最大100条
    
    // 如果没有查询参数，返回健康检查
    if (!list) {
      const kv = getKV();
      await kv.ping();
      
      return NextResponse.json(
        { 
          status: 'healthy',
          timestamp: new Date().toISOString(),
          services: {
            redis: 'connected',
            email: process.env.RESEND_API_KEY ? 'configured' : 'not_configured'
          }
        },
        { status: 200 }
      );
    }
    
    // 如果请求预约列表，需要验证token
    if (list === 'true') {
      if (!validateToken(request)) {
        return NextResponse.json(
          { 
            error: '未授权访问',
            code: 'UNAUTHORIZED'
          },
          { status: 401 }
        );
      }
      
      // 验证分页参数
      if (page < 1 || limit < 1) {
        return NextResponse.json(
          { 
            error: '无效的分页参数',
            code: 'INVALID_PARAMS'
          },
          { status: 400 }
        );
      }
      
      // 获取预约列表
      const result = await getReservationList(page, limit);
      
      return NextResponse.json(
        {
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    }
    
    // 其他查询参数暂不支持
    return NextResponse.json(
      { 
        error: '不支持的查询参数',
        code: 'UNSUPPORTED_QUERY'
      },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('GET API error:', error);
    
    return NextResponse.json(
      { 
        error: '服务器错误',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}