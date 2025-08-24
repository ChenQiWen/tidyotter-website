import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { kv } from '@vercel/kv';
import { Resend } from 'resend';
// 移除trackEvent导入，服务端不使用客户端分析

// 初始化 Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// 预约表单验证 schema
const reservationSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  name: z.string().min(1, '请输入姓名').max(50, '姓名不能超过50个字符'),
  phone: z.string().optional(),
  message: z.string().max(500, '留言不能超过500个字符').optional(),
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
      from: process.env.FROM_EMAIL || 'noreply@filezen.app',
      to: [data.email],
      subject: isZh ? 'FileZen 预约确认' : 'FileZen Reservation Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">${isZh ? 'FileZen 预约确认' : 'FileZen Reservation Confirmation'}</h2>
          <p>${isZh ? `亲爱的 ${data.name}，` : `Dear ${data.name},`}</p>
          <p>${isZh 
            ? '感谢您对 FileZen 的关注！我们已收到您的预约申请，将在产品正式发布时第一时间通知您。' 
            : 'Thank you for your interest in FileZen! We have received your reservation and will notify you first when the product is officially released.'
          }</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${isZh ? '预约信息' : 'Reservation Details'}</h3>
            <p><strong>${isZh ? '邮箱' : 'Email'}:</strong> ${data.email}</p>
            <p><strong>${isZh ? '姓名' : 'Name'}:</strong> ${data.name}</p>
            ${data.phone ? `<p><strong>${isZh ? '手机' : 'Phone'}:</strong> ${data.phone}</p>` : ''}
            ${data.message ? `<p><strong>${isZh ? '留言' : 'Message'}:</strong> ${data.message}</p>` : ''}
          </div>
          
          <p>${isZh 
            ? 'FileZen 是一款智能桌面文件整理工具，致力于让您的工作空间更加整洁有序。' 
            : 'FileZen is a smart desktop file organizer designed to keep your workspace clean and organized.'
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
      from: process.env.FROM_EMAIL || 'noreply@filezen.app',
      to: [process.env.ADMIN_EMAIL],
      subject: 'FileZen 新预约通知',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">FileZen 新预约通知</h2>
          <p>收到新的预约申请：</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>邮箱:</strong> ${data.email}</p>
            <p><strong>姓名:</strong> ${data.name}</p>
            ${data.phone ? `<p><strong>手机:</strong> ${data.phone}</p>` : ''}
            ${data.message ? `<p><strong>留言:</strong> ${data.message}</p>` : ''}
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
      hasMessage: !!validatedData.message,
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

// 健康检查端点
export async function GET() {
  try {
    // 检查Redis连接
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
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Service check failed',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}