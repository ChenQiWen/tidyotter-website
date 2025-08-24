import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { routing } from '@/i18n/routing';
import { GTM_ID, gtmScript } from '@/lib/analytics';
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
        {/* Google Tag Manager */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: gtmScript,
            }}
          />
        )}
        {/* 预连接到外部资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        
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