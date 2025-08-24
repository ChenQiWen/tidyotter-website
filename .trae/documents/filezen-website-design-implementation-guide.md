# FileZen 官网设计改进实施指南

## 1. 环境准备

### 1.1 依赖安装

```bash
# 安装核心动画库
npm install framer-motion@^11.0.0

# 安装辅助库
npm install react-intersection-observer@^9.0.0
npm install lottie-react@^2.4.0

# 安装 Tailwind CSS 插件
npm install @tailwindcss/typography@^0.5.0
npm install @tailwindcss/forms@^0.5.0
```

### 1.2 Tailwind CSS 配置更新

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'gradient-cool': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'large': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-secondary': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-accent': '0 0 20px rgba(249, 115, 22, 0.5)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

## 2. 核心组件实现

### 2.1 动画组件系统

```typescript
// src/components/ui/animations/ScrollAnimation.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
  duration?: number;
  className?: string;
}

const animationVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 }
  },
  fadeInDown: {
    initial: { opacity: 0, y: -60 },
    animate: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  }
};

export const ScrollAnimation = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  className = ''
}: ScrollAnimationProps) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const variant = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      initial={variant.initial}
      animate={inView ? variant.animate : variant.initial}
      transition={{
        duration,
        delay,
        ease: [0.33, 1, 0.68, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
```

```typescript
// src/components/ui/animations/GradientText.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  gradient?: 'primary' | 'secondary' | 'accent' | 'warm' | 'cool';
  className?: string;
  animate?: boolean;
}

const gradientClasses = {
  primary: 'bg-gradient-primary',
  secondary: 'bg-gradient-secondary', 
  accent: 'bg-gradient-accent',
  warm: 'bg-gradient-warm',
  cool: 'bg-gradient-cool'
};

export const GradientText = ({
  children,
  gradient = 'primary',
  className = '',
  animate = false
}: GradientTextProps) => {
  const Component = animate ? motion.span : 'span';
  const animationProps = animate ? {
    initial: { backgroundPosition: '0% 50%' },
    animate: { backgroundPosition: '100% 50%' },
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse' as const
    }
  } : {};

  return (
    <Component
      className={`
        ${gradientClasses[gradient]}
        bg-clip-text text-transparent
        bg-[length:200%_200%]
        ${className}
      `}
      {...animationProps}
    >
      {children}
    </Component>
  );
};
```

### 2.2 现代化按钮组件

```typescript
// src/components/ui/ModernButton.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  gradient?: boolean;
  children: ReactNode;
}

const variantClasses = {
  primary: {
    base: 'bg-primary-600 text-white border-primary-600',
    hover: 'hover:bg-primary-700 hover:border-primary-700',
    gradient: 'bg-gradient-primary border-transparent'
  },
  secondary: {
    base: 'bg-secondary-600 text-white border-secondary-600',
    hover: 'hover:bg-secondary-700 hover:border-secondary-700', 
    gradient: 'bg-gradient-secondary border-transparent'
  },
  ghost: {
    base: 'bg-transparent text-gray-700 dark:text-gray-300 border-transparent',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    gradient: 'bg-transparent border-transparent'
  },
  outline: {
    base: 'bg-transparent text-primary-600 border-primary-600',
    hover: 'hover:bg-primary-50 dark:hover:bg-primary-900/20',
    gradient: 'bg-transparent border-gradient-primary'
  }
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
};

export const ModernButton = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  gradient = false,
  children,
  className = '',
  disabled,
  ...props
}: ModernButtonProps) => {
  const variantClass = variantClasses[variant];
  const baseClasses = gradient ? variantClass.gradient : variantClass.base;
  const hoverClasses = !gradient ? variantClass.hover : '';
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg border
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-soft hover:shadow-medium
        ${baseClasses}
        ${hoverClasses}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  );
};
```

### 2.3 悬浮卡片组件

```typescript
// src/components/ui/FloatingCard.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  hoverEffect?: 'lift' | 'glow' | 'tilt' | 'scale';
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'accent';
}

const glowClasses = {
  primary: 'hover:shadow-glow-primary',
  secondary: 'hover:shadow-glow-secondary',
  accent: 'hover:shadow-glow-accent'
};

const hoverAnimations = {
  lift: {
    whileHover: { y: -8, transition: { duration: 0.2 } }
  },
  glow: {
    whileHover: { 
      transition: { duration: 0.2 }
    }
  },
  tilt: {
    whileHover: { 
      rotateY: 5,
      rotateX: 5,
      transition: { duration: 0.2 }
    }
  },
  scale: {
    whileHover: { 
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  }
};

export const FloatingCard = ({
  children,
  hoverEffect = 'lift',
  className = '',
  glowColor = 'primary'
}: FloatingCardProps) => {
  const animation = hoverAnimations[hoverEffect];
  const glowClass = hoverEffect === 'glow' ? glowClasses[glowColor] : '';
  
  return (
    <motion.div
      {...animation}
      className={`
        bg-white dark:bg-gray-800
        rounded-xl border border-gray-200 dark:border-gray-700
        shadow-soft hover:shadow-medium
        transition-all duration-200
        ${glowClass}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  );
};
```

## 3. 页面组件重构

### 3.1 Hero 区域重新设计

```typescript
// src/components/sections/ModernHeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Download, Play, ArrowRight } from 'lucide-react';
import { GradientText } from '@/components/ui/animations/GradientText';
import { ScrollAnimation } from '@/components/ui/animations/ScrollAnimation';
import { ModernButton } from '@/components/ui/ModernButton';
import { ParticleBackground } from '@/components/ui/ParticleBackground';

interface ModernHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA: { text: string; href: string };
}

export const ModernHeroSection = ({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA
}: ModernHeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 动态背景 */}
      <ParticleBackground />
      
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* 内容区域 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* 副标题 */}
          <ScrollAnimation animation="fadeInDown" delay={0.2}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse" />
              {subtitle}
            </motion.div>
          </ScrollAnimation>
          
          {/* 主标题 */}
          <ScrollAnimation animation="fadeInUp" delay={0.4}>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <GradientText gradient="primary" animate>
                {title}
              </GradientText>
            </h1>
          </ScrollAnimation>
          
          {/* 描述文字 */}
          <ScrollAnimation animation="fadeInUp" delay={0.6}>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </ScrollAnimation>
          
          {/* CTA 按钮组 */}
          <ScrollAnimation animation="fadeInUp" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ModernButton
                variant="primary"
                size="lg"
                gradient
                icon={<Download className="w-5 h-5" />}
                className="min-w-[200px]"
              >
                {primaryCTA.text}
              </ModernButton>
              
              <ModernButton
                variant="ghost"
                size="lg"
                icon={<Play className="w-5 h-5" />}
                className="min-w-[200px] group"
              >
                {secondaryCTA.text}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </ModernButton>
            </div>
          </ScrollAnimation>
          
          {/* 产品预览图 */}
          <ScrollAnimation animation="scaleIn" delay={1.0}>
            <motion.div
              className="mt-16 relative"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative mx-auto max-w-4xl">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20 scale-105" />
                <img
                  src="/images/app-preview.png"
                  alt="FileZen Preview"
                  className="relative rounded-2xl shadow-large border border-gray-200 dark:border-gray-700"
                />
              </div>
            </motion.div>
          </ScrollAnimation>
        </div>
      </div>
      
      {/* 滚动指示器 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};
```

### 3.2 功能特性区域优化

```typescript
// src/components/sections/ModernFeaturesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ScrollAnimation } from '@/components/ui/animations/ScrollAnimation';
import { FloatingCard } from '@/components/ui/FloatingCard';
import { GradientText } from '@/components/ui/animations/GradientText';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: 'primary' | 'secondary' | 'accent';
}

interface ModernFeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
}

export const ModernFeaturesSection = ({
  title,
  subtitle,
  features
}: ModernFeaturesSectionProps) => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <ScrollAnimation animation="fadeInUp">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <GradientText gradient="primary">
                {title}
              </GradientText>
            </h2>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fadeInUp" delay={0.2}>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </ScrollAnimation>
        </div>
        
        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollAnimation
              key={index}
              animation="fadeInUp"
              delay={0.1 * index}
            >
              <FloatingCard
                hoverEffect="lift"
                glowColor={feature.gradient}
                className="p-8 h-full"
              >
                {/* 图标区域 */}
                <motion.div
                  className={`
                    w-16 h-16 rounded-2xl mb-6 flex items-center justify-center
                    bg-gradient-${feature.gradient}
                  `}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-white text-2xl">
                    {feature.icon}
                  </div>
                </motion.div>
                
                {/* 内容区域 */}
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* 装饰性元素 */}
                <div className="mt-6 flex items-center text-primary-600 dark:text-primary-400 font-medium group cursor-pointer">
                  <span>了解更多</span>
                  <motion.svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>
              </FloatingCard>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## 4. 全局样式更新

### 4.1 更新 globals.css

```css
/* src/app/globals.css - 在现有样式基础上添加 */

/* 现代化设计系统变量 */
:root {
  /* 渐变色板 */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-accent: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --gradient-warm: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  --gradient-cool: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  
  /* 现代化阴影系统 */
  --shadow-soft: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-medium: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-large: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-glow-primary: 0 0 20px rgba(59, 130, 246, 0.5);
  --shadow-glow-secondary: 0 0 20px rgba(168, 85, 247, 0.5);
  --shadow-glow-accent: 0 0 20px rgba(249, 115, 22, 0.5);
  
  /* 动画缓动函数 */
  --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 现代化滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: all 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
}

/* 现代化选择样式 */
::selection {
  background: rgba(59, 130, 246, 0.2);
  color: inherit;
}

::-moz-selection {
  background: rgba(59, 130, 246, 0.2);
  color: inherit;
}

/* 现代化焦点样式 */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* 性能优化 */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 动画性能优化 */
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

/* 现代化工具类 */
.text-balance {
  text-wrap: balance;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-effect-dark {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 渐变边框效果 */
.gradient-border {
  position: relative;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  padding: 2px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 2px;
  background: white;
  border-radius: 10px;
  z-index: -1;
}

.dark .gradient-border::before {
  background: #1f2937;
}

/* 响应式动画控制 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .gradient-text {
    background: none !important;
    color: currentColor !important;
  }
}
```

## 5. 使用示例

### 5.1 更新主页组件

```typescript
// src/app/[locale]/page.tsx - 更新示例
import { ModernHeroSection } from '@/components/sections/ModernHeroSection';
import { ModernFeaturesSection } from '@/components/sections/ModernFeaturesSection';
import { FolderOpen, Zap, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <FolderOpen />,
    title: '智能文件整理',
    description: '基于 AI 的智能文件分类和整理，让您的桌面始终保持整洁有序。',
    gradient: 'primary' as const
  },
  {
    icon: <Zap />,
    title: '极速处理',
    description: '毫秒级的文件处理速度，大量文件整理也能瞬间完成。',
    gradient: 'secondary' as const
  },
  {
    icon: <Shield />,
    title: '安全可靠',
    description: '本地处理，数据不上传，保护您的隐私和文件安全。',
    gradient: 'accent' as const
  }
];

export default function HomePage() {
  return (
    <main>
      <ModernHeroSection
        title="让您的桌面保持整洁，提升工作效率"
        subtitle="🚀 全新设计"
        description="FileZen 是一款强大的桌面文件整理工具，帮您自动整理杂乱文件，让工作空间更有序。"
        primaryCTA={{ text: "立即下载", href: "/download" }}
        secondaryCTA={{ text: "观看演示", href: "/demo" }}
      />
      
      <ModernFeaturesSection
        title="为什么选择 FileZen？"
        subtitle="强大的功能，简单的操作，让文件管理变得轻松愉快"
        features={features}
      />
    </main>
  );
}
```

## 6. 部署和优化

### 6.1 性能优化检查清单

- [ ] 启用 Framer Motion 的 `layoutId` 优化
- [ ] 使用 `will-change` 属性优化动画性能
- [ ] 实现动画的条件渲染（基于设备性能）
- [ ] 添加 `prefers-reduced-motion` 支持
- [ ] 优化图片加载和懒加载
- [ ] 监控 Core Web Vitals 指标

### 6.2 测试建议

1. **视觉回归测试**：确保设计在不同设备上的一致性
2. **性能测试**：使用 Lighthouse 检查性能指标
3. **可访问性测试**：确保动画不影响可访问性
4. **跨浏览器测试**：验证在主流浏览器中的兼容性

这个实施指南提供了完整的代码示例和配置，可以直接用于改进 FileZen 官网的设计。所有组件都是模块化的，可以根据需要进行调整和扩展。