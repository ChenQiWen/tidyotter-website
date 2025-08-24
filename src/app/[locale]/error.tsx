'use client';

import { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { ErrorOutline, Refresh, Home, BugReport } from '@mui/icons-material';
import Link from 'next/link';
import { MainLayout } from '@/components';
import { cn } from '@/utils';
import { event } from '@/lib/analytics';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 记录错误到分析系统
    console.error('Application error:', error);
    
    // 发送错误事件到分析
    event('error_occurred', {
      error_message: error.message,
      error_digest: error.digest,
      error_stack: error.stack?.substring(0, 500), // 限制长度
      page_url: window.location.href,
    });
    
    // 如果有 Sentry 等错误监控服务，在这里发送
    // Sentry.captureException(error);
  }, [error]);
  
  const handleRetry = () => {
    event('error_retry_clicked');
    reset();
  };
  
  const handleReportBug = () => {
    event('error_report_clicked');
    
    // 构建错误报告邮件
    const subject = encodeURIComponent('FileZen 错误报告');
    const body = encodeURIComponent(
      `错误信息：${error.message}\n\n` +
      `错误摘要：${error.digest || 'N/A'}\n\n` +
      `页面地址：${window.location.href}\n\n` +
      `用户代理：${navigator.userAgent}\n\n` +
      `时间：${new Date().toISOString()}\n\n` +
      `请描述您在遇到此错误前的操作步骤：\n\n`
    );
    
    window.open(`mailto:support@filezen.app?subject=${subject}&body=${body}`);
  };
  
  // 判断是否为开发环境
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <MainLayout showHeader={true} showFooter={false}>
      <Box
        component="section"
        className={cn(
          'min-h-[70vh] flex items-center justify-center',
          'bg-gradient-to-br from-red-50 to-orange-50',
          'dark:from-red-900/10 dark:to-orange-900/10'
        )}
      >
        <Container maxWidth="md">
          <Box className="text-center space-y-8">
            {/* 错误图标 */}
            <Box className="relative">
              <ErrorOutline
                className={cn(
                  'w-24 h-24 mx-auto',
                  'text-red-500 dark:text-red-400',
                  'animate-pulse'
                )}
              />
              
              {/* 装饰性圆圈 */}
              <Box
                className={cn(
                  'absolute inset-0 -m-4',
                  'border-4 border-red-200 dark:border-red-800',
                  'rounded-full animate-ping opacity-20'
                )}
              />
            </Box>
            
            {/* 错误信息 */}
            <Box className="space-y-4">
              <Typography
                variant="h2"
                className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200"
              >
                出现了一些问题
              </Typography>
              
              <Typography
                variant="body1"
                className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto"
              >
                抱歉，应用程序遇到了意外错误。我们已经记录了这个问题，请尝试刷新页面或返回首页。
              </Typography>
              
              {/* 开发环境显示详细错误信息 */}
              {isDevelopment && (
                <Box
                  className={cn(
                    'mt-6 p-4 rounded-lg',
                    'bg-gray-100 dark:bg-gray-800',
                    'border border-gray-200 dark:border-gray-700',
                    'text-left max-w-2xl mx-auto'
                  )}
                >
                  <Typography
                    variant="subtitle2"
                    className="font-semibold text-red-600 dark:text-red-400 mb-2"
                  >
                    开发环境错误详情：
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-mono text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                  >
                    {error.message}
                  </Typography>
                  {error.digest && (
                    <Typography
                      variant="body2"
                      className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-2"
                    >
                      Digest: {error.digest}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
            
            {/* 操作按钮 */}
            <Box className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleRetry}
                variant="contained"
                size="large"
                startIcon={<Refresh />}
                className={cn(
                  'px-8 py-3',
                  'bg-gradient-to-r from-primary-500 to-primary-600',
                  'hover:from-primary-600 hover:to-primary-700',
                  'shadow-lg hover:shadow-xl',
                  'transform hover:scale-105 transition-all duration-200'
                )}
              >
                重试
              </Button>
              
              <Button
                component={Link}
                href="/"
                variant="outlined"
                size="large"
                startIcon={<Home />}
                className={cn(
                  'px-8 py-3',
                  'border-2 hover:border-primary-500',
                  'hover:bg-primary-50 dark:hover:bg-primary-900/20'
                )}
              >
                返回首页
              </Button>
              
              <Button
                onClick={handleReportBug}
                variant="text"
                size="large"
                startIcon={<BugReport />}
                className={cn(
                  'px-8 py-3',
                  'text-gray-600 hover:text-gray-800',
                  'dark:text-gray-400 dark:hover:text-gray-200',
                  'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                报告问题
              </Button>
            </Box>
            
            {/* 帮助信息 */}
            <Box className="pt-8">
              <Typography
                variant="body2"
                className="text-gray-500 dark:text-gray-400"
              >
                如果问题持续存在，请联系我们的技术支持：
                <br />
                <a 
                  href="mailto:support@filezen.app"
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  support@filezen.app
                </a>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}