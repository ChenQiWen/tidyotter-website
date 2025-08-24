'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  gradient?: 'primary' | 'secondary' | 'accent' | 'warm' | 'cool' | 'custom';
  customGradient?: string;
  className?: string;
  animated?: boolean;
  animationDuration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const gradientClasses = {
  primary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800',
  secondary: 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800',
  accent: 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
  warm: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
  cool: 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500',
  custom: ''
};

const animationVariants = {
  initial: {
    backgroundPosition: '0% 50%'
  },
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
  }
};

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = 'primary',
  customGradient,
  className = '',
  animated = false,
  animationDuration = 3,
  as: Component = 'span'
}) => {
  const gradientClass = gradient === 'custom' && customGradient 
    ? '' 
    : gradientClasses[gradient];

  const baseClasses = 'bg-clip-text text-transparent font-bold';
  
  const style = gradient === 'custom' && customGradient 
    ? {
        background: customGradient,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        backgroundSize: animated ? '200% 200%' : 'auto'
      }
    : {
        backgroundSize: animated ? '200% 200%' : 'auto'
      };

  if (animated) {
    return (
      <motion.div
        className={cn(baseClasses, gradientClass, className)}
        style={style}
        variants={animationVariants}
        initial="initial"
        animate="animate"
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Component>{children}</Component>
      </motion.div>
    );
  }

  return (
    <Component 
      className={cn(baseClasses, gradientClass, className)}
      style={style}
    >
      {children}
    </Component>
  );
};

export default GradientText;