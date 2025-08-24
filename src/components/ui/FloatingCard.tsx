'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'bordered';
  hoverEffect?: 'lift' | 'glow' | 'scale' | 'tilt';
  floatAnimation?: boolean;
  delay?: number;
  onClick?: () => void;
  href?: string;
  target?: string;
}

const cardVariants = {
  default: 'bg-white dark:bg-gray-800 shadow-soft hover:shadow-medium',
  glass: 'bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20',
  gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-soft',
  bordered: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300'
};

const hoverEffects = {
  lift: {
    whileHover: { 
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },
  glow: {
    whileHover: { 
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 }
    }
  },
  scale: {
    whileHover: { 
      scale: 1.03,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },
  tilt: {
    whileHover: { 
      rotateY: 5,
      rotateX: 5,
      transition: { duration: 0.3 }
    }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const tapAnimation = {
  whileTap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = 'lift',
  floatAnimation: enableFloat = false,
  delay = 0,
  onClick,
  href,
  target
}) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300 cursor-pointer';
  const variantClasses = cardVariants[variant];
  
  const cardClasses = cn(
    baseClasses,
    variantClasses,
    className
  );

  const motionProps = {
    className: cardClasses,
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      ...(enableFloat ? floatAnimation.animate : {})
    },
    transition: { 
      duration: 0.6, 
      delay,
      ease: "easeOut"
    },
    ...hoverEffects[hoverEffect],
    ...(onClick || href ? tapAnimation : {})
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      onClick={handleClick}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// 特殊的功能卡片组件
export const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}> = ({ icon, title, description, className }) => {
  return (
    <FloatingCard 
      variant="glass" 
      hoverEffect="lift" 
      className={cn("text-center group", className)}
    >
      <motion.div 
        className="mb-4 flex justify-center"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-3 rounded-full bg-gradient-primary text-white shadow-glow-primary">
          {icon}
        </div>
      </motion.div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </FloatingCard>
  );
};

export default FloatingCard;