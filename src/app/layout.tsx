import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GTM_ID, gtmScript } from '@/lib/analytics';
import "./globals.css";

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

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html suppressHydrationWarning>
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
        
        {children}
         <Analytics />
         <SpeedInsights />
       </body>
     </html>
   );
}
