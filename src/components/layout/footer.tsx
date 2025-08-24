'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  Container,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  GitHub,
  Twitter,
  LinkedIn,
  Email,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { cn } from '@/utils';
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
      href: 'https://github.com/filezen',
      color: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
    },
    {
      name: 'Twitter',
      icon: <Twitter />,
      href: 'https://twitter.com/filezen',
      color: 'text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      href: 'https://linkedin.com/company/filezen',
      color: 'text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500',
    },
    {
      name: 'Email',
      icon: <Email />,
      href: 'mailto:hello@filezen.com',
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
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <Container maxWidth="xl" className="py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="space-y-4">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FZ</span>
                </div>
                <Typography
                  variant="h5"
                  className="font-bold text-gray-900 dark:text-white"
                >
                  FileZen
                </Typography>
              </Link>

              {/* Description */}
              <Typography
                variant="body2"
                className="text-gray-600 dark:text-gray-400 max-w-sm"
              >
                {t('description')}
              </Typography>

              {/* Social Links */}
              <div className="flex space-x-2">
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.name}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn('transition-colors', social.color)}
                    onClick={() => handleSocialClick(social.name)}
                    size="small"
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <div className="space-y-3">
                    <Typography
                      variant="subtitle2"
                      className="font-semibold text-gray-900 dark:text-white uppercase tracking-wider"
                    >
                      {section.title}
                    </Typography>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.key}>
                          <Link
                            href={link.href}
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                            onClick={() => handleLinkClick(section.title, link.key)}
                          >
                            {t(`${section.section}.${link.key}`)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Divider className="my-8 border-gray-200 dark:border-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Copyright */}
          <Typography
            variant="body2"
            className="text-gray-600 dark:text-gray-400 text-center sm:text-left"
          >
            © {currentYear} FileZen. {t('copyright')}
          </Typography>

          {/* Language & Additional Info */}
          <div className="flex items-center space-x-4">
            {/* Current Language */}
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <LanguageIcon fontSize="small" />
              <Typography variant="body2">
                {locale === 'zh' ? '中文' : 'English'}
              </Typography>
            </div>

            {/* Version Info */}
            <Typography
              variant="body2"
              className="text-gray-500 dark:text-gray-500 hidden sm:block"
            >
              v1.0.0
            </Typography>
          </div>
        </div>

        {/* Additional Footer Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Typography
            variant="caption"
            className="text-gray-500 dark:text-gray-500 text-center block"
          >
            {t('additional_info')}
          </Typography>
        </div>
      </Container>
    </footer>
  );
}