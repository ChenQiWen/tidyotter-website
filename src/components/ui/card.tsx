'use client';

import React from 'react';
import { Paper, PaperProps } from '@mui/material';
import { cn } from '@/utils';
import type { BaseComponentProps } from '@/types';

export interface CardProps extends Omit<PaperProps, 'elevation' | 'variant'>, BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'medium',
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    const getPadding = () => {
      switch (padding) {
        case 'none':
          return 'p-0';
        case 'small':
          return 'p-4';
        case 'medium':
          return 'p-6';
        case 'large':
          return 'p-8';
        default:
          return 'p-6';
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'outlined':
          return 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-none';
        case 'elevated':
          return 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl';
        case 'glass':
          return 'glass-effect border border-white/20 dark:border-gray-700/50';
        default:
          return 'bg-white dark:bg-gray-800 shadow-md';
      }
    };

    return (
      <Paper
        ref={ref}
        elevation={0}
        className={cn(
          'rounded-2xl transition-all duration-300',
          getVariantStyles(),
          getPadding(),
          {
            'hover:shadow-lg hover:-translate-y-1': hover && variant !== 'glass',
            'hover:bg-white/20 dark:hover:bg-gray-800/40': hover && variant === 'glass',
          },
          className
        )}
        {...props}
      >
        {children}
      </Paper>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends BaseComponentProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between space-x-4 pb-4',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Content Component
export interface CardContentProps extends BaseComponentProps {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-gray-700 dark:text-gray-300', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// Card Footer Component
export interface CardFooterProps extends BaseComponentProps {
  align?: 'left' | 'center' | 'right' | 'between';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    const getAlignmentClass = () => {
      switch (align) {
        case 'left':
          return 'justify-start';
        case 'center':
          return 'justify-center';
        case 'right':
          return 'justify-end';
        case 'between':
          return 'justify-between';
        default:
          return 'justify-end';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700',
          getAlignmentClass(),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };