'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glowEffect?: boolean;
}

const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft hover:shadow-medium',
  secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-soft hover:shadow-medium',
  accent: 'bg-accent-600 hover:bg-accent-700 text-white shadow-soft hover:shadow-medium',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  ghost: 'text-primary-600 hover:bg-primary-50 hover:text-primary-700',
  gradient: 'bg-gradient-primary text-white shadow-soft hover:shadow-medium',
  glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

const glowVariants = {
  primary: 'hover:shadow-glow-primary',
  secondary: 'hover:shadow-glow-secondary',
  accent: 'hover:shadow-glow-accent',
  outline: 'hover:shadow-glow-primary',
  ghost: '',
  gradient: 'hover:shadow-glow-primary',
  glass: 'hover:shadow-glow-primary'
};

const buttonAnimation = {
  whileHover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  whileTap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  href,
  target,
  type = 'button',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  glowEffect = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = buttonVariants[variant];
  const sizeClasses = sizeVariants[size];
  const glowClasses = glowEffect ? glowVariants[variant] : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const buttonClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    glowClasses,
    widthClasses,
    className
  );

  const content = (
    <>
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        className={buttonClasses}
        {...buttonAnimation}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
      {...buttonAnimation}
    >
      {content}
    </motion.button>
  );
};

export default ModernButton;