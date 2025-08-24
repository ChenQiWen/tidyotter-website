import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 静态导入所有语言文件
import zhMessages from '../messages/zh.json';
import enMessages from '../messages/en.json';

// 支持的语言列表
export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'zh';

// 语言消息映射
const messages = {
  zh: zhMessages,
  en: enMessages,
} as const;

export default getRequestConfig(async ({ locale }) => {
  // 验证传入的语言是否支持
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  const validLocale = locale as Locale;

  return {
    locale: validLocale,
    messages: messages[validLocale],
    timeZone: 'Asia/Shanghai',
    now: new Date(),
  };
});