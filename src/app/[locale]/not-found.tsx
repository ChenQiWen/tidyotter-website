'use client';

import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { Container, Typography, Box, Button } from '@mui/material';
import { Home, ArrowBack, Search } from '@/components/icons';
import Link from 'next/link';
import { MainLayout } from '@/components';
import { cn } from '@/utils';

export const metadata: Metadata = {
  title: '页面未找到 - FileZen',
  description: '抱歉，您访问的页面不存在。',
  robots: 'noindex, nofollow',
};

export default function NotFoundPage() {
  const t = useTranslations('common');
  
  return (
    <MainLayout showHeader={true} showFooter={false}>
      <Box
        component="section"
        className={cn(
          'min-h-[70vh] flex items-center justify-center',
          'bg-gradient-to-br from-gray-50 to-gray-100',
          'dark:from-gray-900 dark:to-gray-800'
        )}
      >
        <Container maxWidth="md">
          <Box className="text-center space-y-8">
            {/* 404 大号数字 */}
            <Typography
              variant="h1"
              className={cn(
                'text-8xl md:text-9xl font-bold',
                'bg-gradient-to-r from-primary-500 to-secondary-500',
                'bg-clip-text text-transparent',
                'leading-none'
              )}
            >
              404
            </Typography>
            
            {/* 错误信息 */}
            <Box className="space-y-4">
              <Typography
                variant="h2"
                className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200"
              >
                页面未找到
              </Typography>
              
              <Typography
                variant="body1"
                className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto"
              >
                抱歉，您访问的页面不存在或已被移动。请检查网址是否正确，或返回首页继续浏览。
              </Typography>
            </Box>
            
            {/* 操作按钮 */}
            <Box className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                component={Link}
                href="/"
                variant="contained"
                size="large"
                startIcon={<Home />}
                className={cn(
                  'px-8 py-3',
                  'bg-gradient-to-r from-primary-500 to-primary-600',
                  'hover:from-primary-600 hover:to-primary-700',
                  'shadow-lg hover:shadow-xl',
                  'transform hover:scale-105 transition-all duration-200'
                )}
              >
                返回首页
              </Button>
              
              <Button
                onClick={() => window.history.back()}
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                className={cn(
                  'px-8 py-3',
                  'border-2 hover:border-primary-500',
                  'hover:bg-primary-50 dark:hover:bg-primary-900/20'
                )}
              >
                返回上页
              </Button>
            </Box>
            
            {/* 搜索建议 */}
            <Box className="pt-8">
              <Typography
                variant="body2"
                className="text-gray-500 dark:text-gray-400 mb-4"
              >
                您可能在寻找：
              </Typography>
              
              <Box className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: '功能特性', href: '/#features' },
                  { label: '下载', href: '/#download' },
                  { label: '预约体验', href: '/#reservation' },
                  { label: '关于我们', href: '/about' },
                ].map((link) => (
                  <Button
                    key={link.label}
                    component={Link}
                    href={link.href}
                    variant="text"
                    size="small"
                    className={cn(
                      'text-primary-600 hover:text-primary-700',
                      'dark:text-primary-400 dark:hover:text-primary-300',
                      'hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    )}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Box>
            
            {/* 装饰性图标 */}
            <Box className="pt-8">
              <Search 
                className={cn(
                  'w-16 h-16 mx-auto',
                  'text-gray-300 dark:text-gray-600'
                )}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}