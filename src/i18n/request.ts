import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // 确保locale有值，如果没有则使用默认语言
  const validLocale = locale || routing.defaultLocale;
  
  // 验证传入的语言是否在支持的语言列表中
  if (!routing.locales.includes(validLocale as any)) {
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../messages/${routing.defaultLocale}.json`)).default
    };
  }

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default
  };
});