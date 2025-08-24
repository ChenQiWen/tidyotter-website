'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  LightMode,
  DarkMode,
  SettingsBrightness,
} from '@mui/icons-material';
import { useThemeToggle, useBreakpoint } from '@/hooks';
import { Button } from '@/components/ui';
import { cn } from '@/utils';
import { event, trackingEvents } from '@/lib/analytics';
import type { Locale, ThemeMode } from '@/types';

interface HideOnScrollProps {
  children: React.ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function Header() {
  const t = useTranslations('navigation');
  const locale = useLocale() as Locale;
  const { themeMode, setThemeMode, isDark } = useThemeToggle();
  const { isMd } = useBreakpoint();
  
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [languageMenuAnchor, setLanguageMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = React.useState<null | HTMLElement>(null);

  const navigationItems = [
    { key: 'features', href: '#features' },
    { key: 'download', href: '#download' },
    { key: 'pricing', href: '#pricing' },
    { key: 'about', href: '#about' },
  ];

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchor(null);
  };

  const handleLanguageChange = (newLocale: Locale) => {
    // 语言切换逻辑
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
    
    event('language_change', {
      event_category: 'navigation',
      language: newLocale,
    });
    
    handleLanguageMenuClose();
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    
    event('theme_change', {
      event_category: 'navigation',
      theme_mode: mode,
    });
    
    handleThemeMenuClose();
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleReservationClick = () => {
    trackingEvents.clickReservation();
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'system':
        return <SettingsBrightness />;
      default:
        return <SettingsBrightness />;
    }
  };

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        className={cn(
          'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20',
          'shadow-sm'
        )}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar className="justify-between py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FZ</span>
              </div>
              <Typography
                variant="h6"
                className="font-bold text-gray-900 dark:text-white hidden sm:block"
              >
                FileZen
              </Typography>
            </Link>

            {/* Desktop Navigation */}
            {isMd && (
              <nav className="hidden md:flex items-center space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <IconButton
                onClick={handleLanguageMenuOpen}
                className="text-gray-700 dark:text-gray-300"
                size="small"
              >
                <LanguageIcon />
              </IconButton>
              <Menu
                anchorEl={languageMenuAnchor}
                open={Boolean(languageMenuAnchor)}
                onClose={handleLanguageMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => handleLanguageChange('zh')}
                  selected={locale === 'zh'}
                >
                  中文
                </MenuItem>
                <MenuItem
                  onClick={() => handleLanguageChange('en')}
                  selected={locale === 'en'}
                >
                  English
                </MenuItem>
              </Menu>

              {/* Theme Selector */}
              <IconButton
                onClick={handleThemeMenuOpen}
                className="text-gray-700 dark:text-gray-300"
                size="small"
              >
                {getThemeIcon(themeMode)}
              </IconButton>
              <Menu
                anchorEl={themeMenuAnchor}
                open={Boolean(themeMenuAnchor)}
                onClose={handleThemeMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem
                  onClick={() => handleThemeChange('light')}
                  selected={themeMode === 'light'}
                  className="flex items-center space-x-2"
                >
                  <LightMode fontSize="small" />
                  <span>{t('theme.light')}</span>
                </MenuItem>
                <MenuItem
                  onClick={() => handleThemeChange('dark')}
                  selected={themeMode === 'dark'}
                  className="flex items-center space-x-2"
                >
                  <DarkMode fontSize="small" />
                  <span>{t('theme.dark')}</span>
                </MenuItem>
                <MenuItem
                  onClick={() => handleThemeChange('system')}
                  selected={themeMode === 'system'}
                  className="flex items-center space-x-2"
                >
                  <SettingsBrightness fontSize="small" />
                  <span>{t('theme.system')}</span>
                </MenuItem>
              </Menu>

              {/* CTA Button */}
              {isMd && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleReservationClick}
                  className="ml-4"
                >
                  {t('reservation')}
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              {!isMd && (
                <IconButton
                  onClick={handleMobileMenuToggle}
                  className="text-gray-700 dark:text-gray-300 ml-2"
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              )}
            </div>
          </Toolbar>

          {/* Mobile Navigation */}
          {!isMd && mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <nav className="px-4 py-4 space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={handleReservationClick}
                    className="w-full"
                  >
                    {t('reservation')}
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}