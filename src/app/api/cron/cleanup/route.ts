import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// 验证cron请求的授权
function validateCronRequest(request: NextRequest): boolean {
  // Vercel Cron Jobs 会设置特殊的header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // 如果设置了CRON_SECRET，验证授权
  if (cronSecret) {
    return authHeader === `Bearer ${cronSecret}`;
  }
  
  // 验证Vercel的cron header
  const vercelCronHeader = request.headers.get('x-vercel-cron');
  if (vercelCronHeader === '1') {
    return true;
  }
  
  // 开发环境允许本地调用
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return false;
}

// 清理过期的预约数据
async function cleanupExpiredReservations(): Promise<{ cleaned: number; errors: number }> {
  let cleaned = 0;
  let errors = 0;
  
  try {
    // 获取所有预约ID
    const reservationIds = await kv.lrange('reservations:list', 0, -1);
    
    if (!reservationIds || reservationIds.length === 0) {
      return { cleaned: 0, errors: 0 };
    }
    
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000); // 6个月前
    
    for (const reservationId of reservationIds) {
      try {
        const reservation = await kv.get(reservationId as string);
        
        if (!reservation) {
          // 如果预约数据不存在，从列表中移除ID
          await kv.lrem('reservations:list', 1, reservationId);
          cleaned++;
          continue;
        }
        
        const reservationData = reservation as any;
        const createdAt = new Date(reservationData.createdAt);
        
        // 如果预约超过6个月，删除它
        if (createdAt < sixMonthsAgo) {
          await kv.del(reservationId as string);
          await kv.lrem('reservations:list', 1, reservationId);
          cleaned++;
        }
      } catch (error) {
        console.error(`Error processing reservation ${reservationId}:`, error);
        errors++;
      }
    }
  } catch (error) {
    console.error('Error in cleanupExpiredReservations:', error);
    errors++;
  }
  
  return { cleaned, errors };
}

// 清理过期的速率限制数据
async function cleanupRateLimitData(): Promise<{ cleaned: number; errors: number }> {
  let cleaned = 0;
  let errors = 0;
  
  try {
    // 获取所有以rate_limit:开头的key
    const keys = await kv.keys('rate_limit:*');
    
    if (!keys || keys.length === 0) {
      return { cleaned: 0, errors: 0 };
    }
    
    for (const key of keys) {
      try {
        // 检查key是否还存在（可能已过期）
        const exists = await kv.exists(key);
        if (!exists) {
          cleaned++;
        }
      } catch (error) {
        console.error(`Error checking rate limit key ${key}:`, error);
        errors++;
      }
    }
  } catch (error) {
    console.error('Error in cleanupRateLimitData:', error);
    errors++;
  }
  
  return { cleaned, errors };
}

// 清理过期的会话数据（如果有的话）
async function cleanupSessionData(): Promise<{ cleaned: number; errors: number }> {
  let cleaned = 0;
  let errors = 0;
  
  try {
    // 获取所有以session:开头的key
    const keys = await kv.keys('session:*');
    
    if (!keys || keys.length === 0) {
      return { cleaned: 0, errors: 0 };
    }
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1周前
    
    for (const key of keys) {
      try {
        const sessionData = await kv.get(key);
        
        if (!sessionData) {
          cleaned++;
          continue;
        }
        
        const session = sessionData as any;
        const lastAccess = new Date(session.lastAccess || session.createdAt);
        
        // 如果会话超过1周未访问，删除它
        if (lastAccess < oneWeekAgo) {
          await kv.del(key);
          cleaned++;
        }
      } catch (error) {
        console.error(`Error processing session ${key}:`, error);
        errors++;
      }
    }
  } catch (error) {
    console.error('Error in cleanupSessionData:', error);
    errors++;
  }
  
  return { cleaned, errors };
}

// 清理临时文件或缓存数据
async function cleanupTempData(): Promise<{ cleaned: number; errors: number }> {
  let cleaned = 0;
  let errors = 0;
  
  try {
    // 清理临时缓存
    const tempKeys = await kv.keys('temp:*');
    const cacheKeys = await kv.keys('cache:*');
    
    const allTempKeys = [...(tempKeys || []), ...(cacheKeys || [])];
    
    if (allTempKeys.length === 0) {
      return { cleaned: 0, errors: 0 };
    }
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1天前
    
    for (const key of allTempKeys) {
      try {
        const data = await kv.get(key);
        
        if (!data) {
          cleaned++;
          continue;
        }
        
        const tempData = data as any;
        const createdAt = new Date(tempData.createdAt || tempData.timestamp);
        
        // 如果临时数据超过1天，删除它
        if (createdAt < oneDayAgo) {
          await kv.del(key);
          cleaned++;
        }
      } catch (error) {
        console.error(`Error processing temp data ${key}:`, error);
        errors++;
      }
    }
  } catch (error) {
    console.error('Error in cleanupTempData:', error);
    errors++;
  }
  
  return { cleaned, errors };
}

export async function GET(request: NextRequest) {
  try {
    // 验证请求授权
    if (!validateCronRequest(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('Starting cleanup job at:', new Date().toISOString());
    
    // 执行各种清理任务
    const [reservationResult, rateLimitResult, sessionResult, tempResult] = await Promise.all([
      cleanupExpiredReservations(),
      cleanupRateLimitData(),
      cleanupSessionData(),
      cleanupTempData(),
    ]);
    
    const totalCleaned = 
      reservationResult.cleaned + 
      rateLimitResult.cleaned + 
      sessionResult.cleaned + 
      tempResult.cleaned;
    
    const totalErrors = 
      reservationResult.errors + 
      rateLimitResult.errors + 
      sessionResult.errors + 
      tempResult.errors;
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalCleaned,
        totalErrors,
      },
      details: {
        reservations: reservationResult,
        rateLimit: rateLimitResult,
        sessions: sessionResult,
        temp: tempResult,
      },
    };
    
    console.log('Cleanup job completed:', result);
    
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    console.error('Cleanup job failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Cleanup job failed',
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 支持POST请求（手动触发清理）
export async function POST(request: NextRequest) {
  return GET(request);
}