'use client';

// Google Tag Manager 配置
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// GTM 脚本
export const gtmScript = `
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','${GTM_ID}');
`;

// 声明全局 gtag 函数
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// 初始化 dataLayer
export function initializeDataLayer() {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

// 页面浏览事件
export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// 自定义事件
export function event(action: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, parameters);
  }
}

// 预定义事件
export const trackingEvents = {
  // 页面交互
  clickDownload: () => event('click_download', { event_category: 'engagement' }),
  clickReservation: () => event('click_reservation', { event_category: 'engagement' }),
  submitReservation: (success: boolean) => event('submit_reservation', { 
    event_category: 'form',
    success: success ? 'true' : 'false'
  }),
  
  // 主题切换
  switchTheme: (theme: string) => event('switch_theme', { 
    event_category: 'ui',
    theme_mode: theme
  }),
  
  // 语言切换
  switchLanguage: (language: string) => event('switch_language', { 
    event_category: 'ui',
    language: language
  }),
  
  // 功能使用
  viewFeatures: () => event('view_features', { event_category: 'engagement' }),
  scrollToSection: (section: string) => event('scroll_to_section', { 
    event_category: 'navigation',
    section: section
  }),
};

// 用户属性设置
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      custom_map: properties,
    });
  }
}

// 电商事件（为未来扩展准备）
export function trackPurchase(transactionId: string, value: number, currency = 'CNY') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
    });
  }
}