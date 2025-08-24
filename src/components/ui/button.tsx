'use client';

import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'contained', 
    size = 'medium', 
    startIcon, 
    endIcon, 
    children, 
    className, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      {
        // Size variants
        'px-3 py-1.5 text-sm': size === 'small',
        'px-4 py-2 text-base': size === 'medium',
        'px-6 py-3 text-lg': size === 'large',
        
        // Style variants
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': 
          variant === 'contained' && !disabled,
        'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:hover:bg-blue-900/20': 
          variant === 'outlined' && !disabled,
        'text-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:hover:bg-blue-900/20': 
          variant === 'text' && !disabled,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled}
        {...props}
      >
        {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
        <span>{children}</span>
        {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export type { ButtonProps };