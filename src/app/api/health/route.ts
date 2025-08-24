import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// 健康检查结果接口
interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceStatus;
    redis: ServiceStatus;
    email: ServiceStatus;
    external: ServiceStatus;
  };
  metrics: {
    memory: MemoryMetrics;
    response_time: number;
  };
  details?: any;
}

interface ServiceStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  response_time?: number;
  error?: string;
  last_check?: string;
}

interface MemoryMetrics {
  used: number;
  total: number;
  percentage: number;
}

// 检查Redis连接
async function checkRedis(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // 尝试设置和获取一个测试值
    const testKey = 'health_check_test';
    const testValue = Date.now().toString();
    
    await kv.set(testKey, testValue, { ex: 60 }); // 60秒过期
    const retrievedValue = await kv.get(testKey);
    
    if (retrievedValue !== testValue) {
      throw new Error('Redis read/write test failed');
    }
    
    // 清理测试数据
    await kv.del(testKey);
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      response_time: responseTime,
      last_check: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown Redis error',
      last_check: new Date().toISOString(),
    };
  }
}

// 检查邮件服务
async function checkEmailService(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // 检查Resend API密钥是否配置
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      return {
        status: 'unhealthy',
        error: 'Resend API key not configured',
        last_check: new Date().toISOString(),
      };
    }
    
    // 在生产环境中，可以尝试发送测试邮件或调用Resend API
    // 这里简化为检查配置
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      response_time: responseTime,
      last_check: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown email service error',
      last_check: new Date().toISOString(),
    };
  }
}

// 检查外部服务
async function checkExternalServices(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // 检查关键的外部服务配置
    const checks = {
      statsig: !!process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY,
      vercelAnalytics: !!process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    };
    
    const failedChecks = Object.entries(checks)
      .filter(([_, isConfigured]) => !isConfigured)
      .map(([service]) => service);
    
    const responseTime = Date.now() - startTime;
    
    if (failedChecks.length === 0) {
      return {
        status: 'healthy',
        response_time: responseTime,
        last_check: new Date().toISOString(),
      };
    } else if (failedChecks.length < Object.keys(checks).length) {
      return {
        status: 'degraded',
        response_time: responseTime,
        error: `Some services not configured: ${failedChecks.join(', ')}`,
        last_check: new Date().toISOString(),
      };
    } else {
      return {
        status: 'unhealthy',
        response_time: responseTime,
        error: 'No external services configured',
        last_check: new Date().toISOString(),
      };
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown external service error',
      last_check: new Date().toISOString(),
    };
  }
}

// 检查数据库（这里主要是配置检查）
async function checkDatabase(): Promise<ServiceStatus> {
  const startTime = Date.now();
  
  try {
    // 由于我们主要使用Vercel KV，这里检查KV配置
    const kvUrl = process.env.KV_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;
    
    if (!kvUrl || !kvToken) {
      return {
        status: 'unhealthy',
        error: 'Vercel KV not configured',
        last_check: new Date().toISOString(),
      };
    }
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      response_time: responseTime,
      last_check: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      response_time: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown database error',
      last_check: new Date().toISOString(),
    };
  }
}

// 获取内存使用情况
function getMemoryMetrics(): MemoryMetrics {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage();
    const used = usage.heapUsed;
    const total = usage.heapTotal;
    
    return {
      used: Math.round(used / 1024 / 1024), // MB
      total: Math.round(total / 1024 / 1024), // MB
      percentage: Math.round((used / total) * 100),
    };
  }
  
  return {
    used: 0,
    total: 0,
    percentage: 0,
  };
}

// 计算应用运行时间
function getUptime(): number {
  if (typeof process !== 'undefined' && process.uptime) {
    return Math.round(process.uptime());
  }
  return 0;
}

// 主健康检查函数
async function performHealthCheck(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  // 并行执行所有检查
  const [redisStatus, emailStatus, externalStatus, databaseStatus] = await Promise.all([
    checkRedis(),
    checkEmailService(),
    checkExternalServices(),
    checkDatabase(),
  ]);
  
  const services = {
    database: databaseStatus,
    redis: redisStatus,
    email: emailStatus,
    external: externalStatus,
  };
  
  // 确定整体状态
  const serviceStatuses = Object.values(services).map(s => s.status);
  let overallStatus: 'healthy' | 'unhealthy' | 'degraded';
  
  if (serviceStatuses.every(status => status === 'healthy')) {
    overallStatus = 'healthy';
  } else if (serviceStatuses.some(status => status === 'unhealthy')) {
    overallStatus = 'unhealthy';
  } else {
    overallStatus = 'degraded';
  }
  
  const responseTime = Date.now() - startTime;
  
  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: getUptime(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'unknown',
    services,
    metrics: {
      memory: getMemoryMetrics(),
      response_time: responseTime,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    const healthCheck = await performHealthCheck();
    
    // 根据健康状态设置HTTP状态码
    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;
    
    return NextResponse.json(healthCheck, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    const errorResponse: HealthCheckResult = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: getUptime(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'unknown',
      services: {
        database: { status: 'unhealthy', error: 'Health check failed' },
        redis: { status: 'unhealthy', error: 'Health check failed' },
        email: { status: 'unhealthy', error: 'Health check failed' },
        external: { status: 'unhealthy', error: 'Health check failed' },
      },
      metrics: {
        memory: getMemoryMetrics(),
        response_time: 0,
      },
      details: error instanceof Error ? error.message : 'Unknown error',
    };
    
    return NextResponse.json(errorResponse, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

// 支持HEAD请求
export async function HEAD(request: NextRequest) {
  try {
    const healthCheck = await performHealthCheck();
    const httpStatus = healthCheck.status === 'healthy' ? 200 : 
                      healthCheck.status === 'degraded' ? 200 : 503;
    
    return new NextResponse(null, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}