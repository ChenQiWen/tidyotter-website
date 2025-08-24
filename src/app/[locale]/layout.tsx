import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';

import '../globals.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const metadata: Metadata = {
  title: {
    template: '%s | FileZen',
    default: 'FileZen - 智能桌面文件整理工具',
  },
  description: '一键自动整理，让您的桌面井然有序。纯离线本地运行，支持根据内容重命名，自定义规则，手动/定时整理，低内存占用。',
  keywords: ['文件整理', '桌面清理', '文件管理', '自动整理', '智能重命名'],
  authors: [{ name: 'FileZen Team' }],
  creator: 'FileZen',
  publisher: 'FileZen',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://filezen.app',
    title: 'FileZen - 智能桌面文件整理工具',
    description: '一键自动整理，让您的桌面井然有序',
    siteName: 'FileZen',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FileZen - 智能桌面文件整理工具',
    description: '一键自动整理，让您的桌面井然有序',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  
  // 验证语言参数
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 获取国际化消息
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>

        {/* Favicon 配置 */}
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="msapplication-TileColor" content="#6366f1" />
        
        {/* 预连接到外部资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Fonts - 国际化字体配置 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Comfortaa:wght@300..700&family=Quicksand:wght@300..700&family=Noto+Sans+SC:wght@100..900&family=Noto+Sans+TC:wght@100..900&family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+KR:wght@100..900&display=swap"
          rel="stylesheet"
        />
        

      </head>
      <body className="antialiased">

        
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}