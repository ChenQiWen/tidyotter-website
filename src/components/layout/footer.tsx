'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Container,
  Typography,
  IconButton,
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  Language as LanguageIcon,
} from '@mui/icons-material';
import type { Locale } from '@/types';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale() as Locale;
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('product.title'),
      section: 'product',
      links: [
        { key: 'features', href: '#features' },
        { key: 'download', href: '#download' },
        { key: 'pricing', href: '#pricing' },
        { key: 'changelog', href: '/changelog' },
      ],
    },
    {
      title: t('support.title'),
      section: 'support',
      links: [
        { key: 'help', href: '/help' },
        { key: 'contact', href: '/contact' },
        { key: 'faq', href: '/faq' },
        { key: 'feedback', href: '/feedback' },
      ],
    },
    {
      title: t('company.title'),
      section: 'company',
      links: [
        { key: 'about', href: '/about' },
        { key: 'blog', href: '/blog' },
        { key: 'careers', href: '/careers' },
        { key: 'press', href: '/press' },
      ],
    },
    {
      title: t('legal.title'),
      section: 'legal',
      links: [
        { key: 'privacy', href: '/privacy' },
        { key: 'terms', href: '/terms' },
        { key: 'cookies', href: '/cookies' },
        { key: 'security', href: '/security' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <GitHub />,
      href: 'https://github.com/tidyotter',
      color: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
    },
    {
      name: 'Twitter',
      icon: <Twitter />,
      href: 'https://twitter.com/tidyotter',
      color: 'text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      href: 'https://linkedin.com/company/tidyotter',
      color: 'text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500',
    },
    {
      name: 'Email',
      icon: <Email />,
      href: 'mailto:hello@tidyotter.com',
      color: 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400',
    },
  ];

  const handleLinkClick = (section: string, link: string) => {
    // Link click handled
  };

  const handleSocialClick = (platform: string) => {
    // Social link click handled
  };

  return (
    <footer className="relative overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-orange-950 dark:via-yellow-950 dark:to-pink-950" />
      
      {/* 装饰性背景图案 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-pink-400 rounded-full blur-2xl" />
      </div>

      <Container maxWidth="xl" className="relative py-16">
        {/* 链接区域 */}
        <div className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {footerSections.map((section) => (
              <div key={section.title} className="text-center px-4 md:px-8">
                <Typography
                  variant="h5"
                  className="font-bold text-orange-700 dark:text-orange-300 mb-8 text-lg md:text-xl"
                >
                  {section.title}
                </Typography>
                <ul className="space-y-5">
                  {section.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 transition-colors text-base font-medium hover:underline decoration-2 decoration-orange-300"
                        onClick={() => handleLinkClick(section.title, link.key)}
                      >
                        {t(`${section.section}.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 社交媒体链接 */}
        <div className="flex justify-center items-center gap-8 mb-16">
          {socialLinks.map((social) => (
            <IconButton
              key={social.name}
              component="a"
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              onClick={() => handleSocialClick(social.name)}
            >
              {social.icon}
            </IconButton>
          ))}
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent mb-12" />

        {/* 底部信息 */}
        <div className="text-center space-y-6">
          {/* 版权信息 */}
          <Typography
            variant="body1"
            className="text-orange-600 dark:text-orange-400"
          >
            © {currentYear} TidyOtter. {t('copyright')}
          </Typography>

          {/* 语言和版本 */}
          <div className="flex justify-center items-center space-x-8">
            <div className="flex items-center space-x-3 px-6 py-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <LanguageIcon className="text-orange-600 dark:text-orange-400" fontSize="small" />
              <Typography variant="body1" className="text-orange-700 dark:text-orange-300 font-medium">
                {locale === 'zh' ? '中文' : 'English'}
              </Typography>
            </div>
            <Typography
              variant="body1"
              className="text-orange-500 dark:text-orange-500 px-4 py-2 bg-orange-50 dark:bg-orange-950 rounded-full"
            >
              v1.0.0
            </Typography>
          </div>

          {/* 额外信息 */}
          <Typography
            variant="body2"
            className="text-orange-500 dark:text-orange-500 block mt-8"
          >
            {t('additional_info')}
          </Typography>
        </div>
      </Container>
    </footer>
  );
}