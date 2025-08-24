import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['zh', 'en'],

  // Used when no locale matches
  defaultLocale: 'zh',

  // The prefix for the default locale
  localePrefix: {
    mode: 'as-needed'
  },

  // The pathnames for each locale
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

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];