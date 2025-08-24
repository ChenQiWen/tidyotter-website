import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // 支持的语言列表
  locales,
  
  // 默认语言
  defaultLocale,
  
  // 语言检测策略
  localeDetection: true,
  
  // 路径名本地化
  pathnames: {
    '/': '/',
    '/features': {
      zh: '/features',
      en: '/features'
    },
    '/about': {
      zh: '/about', 
      en: '/about'
    },
    '/contact': {
      zh: '/contact',
      en: '/contact'
    }
  }
});

export const config = {
  // 匹配所有路径，除了以下路径：
  // - api 路由
  // - _next 静态文件
  // - _vercel 内部文件
  // - 静态资源文件
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/',
    '/(zh|en)/:path*'
  ]
};