'use client';

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { cn } from '@/utils';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'medium',
      loading = false,
      disabled,
      children,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const getVariant = (): MuiButtonProps['variant'] => {
      switch (variant) {
        case 'primary':
          return 'contained';
        case 'secondary':
          return 'contained';
        case 'outline':
          return 'outlined';
        case 'ghost':
        case 'text':
          return 'text';
        default:
          return 'contained';
      }
    };

    const getColor = (): MuiButtonProps['color'] => {
      switch (variant) {
        case 'primary':
          return 'primary';
        case 'secondary':
          return 'secondary';
        default:
          return 'primary';
      }
    };

    const buttonContent = (
      <>
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {icon && iconPosition === 'left' && (
          <span className={cn('flex items-center', children && 'mr-2')}>
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className={cn('flex items-center', children && 'ml-2')}>
            {icon}
          </span>
        )}
      </>
    );

    return (
      <MuiButton
        ref={ref}
        variant={getVariant()}
        color={getColor()}
        size={size}
        disabled={disabled || loading}
        className={cn(
          'transition-all duration-200',
          {
            'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800':
              variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600':
              variant === 'secondary',
            'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20':
              variant === 'outline',
            'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20':
              variant === 'ghost',
            'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800':
              variant === 'text',
            'opacity-50 cursor-not-allowed': disabled || loading,
          },
          className
        )}
        {...props}
      >
        {buttonContent}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };