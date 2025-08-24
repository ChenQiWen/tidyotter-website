'use client';

import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { Header } from './header';
import { Footer } from './footer';
import { cn } from '@/utils';
import type { BaseComponentProps } from '@/types';

export interface MainLayoutProps extends BaseComponentProps {
  showHeader?: boolean;
  showFooter?: boolean;
  headerProps?: any;
  footerProps?: any;
  contentClassName?: string;
}

export function MainLayout({
  children,
  className,
  showHeader = true,
  showFooter = true,
  headerProps,
  footerProps,
  contentClassName,
}: MainLayoutProps) {
  return (
    <Box className={cn('min-h-screen flex flex-col', className)}>
      {/* Header */}
      {showHeader && <Header {...headerProps} />}
      
      {/* Main Content */}
      <Box
        component="main"
        className={cn(
          'flex-1 flex flex-col',
          showHeader && 'pt-16', // Account for fixed header
          contentClassName
        )}
      >
        {/* Spacer for fixed header removed */}
        
        {/* Page Content */}
        <Box className="flex-1">
          {children}
        </Box>
      </Box>
      
      {/* Footer */}
      {showFooter && <Footer {...footerProps} />}
    </Box>
  );
}