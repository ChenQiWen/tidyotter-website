'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import { applySVGTheme, loadSVGFromURL, ColorMapping } from '@/utils/svg-color-utils';

interface ThemeLogoProps {
  /** Logo文件路径 */
  src?: string;
  /** 图片alt属性 */
  alt?: string;
  /** 宽度 */
  width?: number | string;
  /** 高度 */
  height?: number | string;
  /** CSS类名 */
  className?: string;
  /** 强制使用指定主题，不跟随当前主题 */
  forceTheme?: 'light' | 'dark';
  /** 自定义颜色映射 */
  customColorMapping?: {
    light?: ColorMapping;
    dark?: ColorMapping;
  };
  /** 加载失败时的回调 */
  onError?: () => void;
  /** 加载成功时的回调 */
  onLoad?: () => void;
}

/**
 * 支持主题切换的Logo组件
 * 自动根据当前主题调整SVG中的颜色
 */
export function ThemeLogo({
  src = '/logo/logo.svg',
  alt = 'Logo',
  width = 'auto',
  height = 'auto',
  className = '',
  forceTheme,
  customColorMapping,
  onError,
  onLoad
}: ThemeLogoProps) {
  const { isDark } = useTheme();
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载SVG内容
  useEffect(() => {
    let isMounted = true;

    const loadSVG = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const content = await loadSVGFromURL(src);
        
        if (isMounted) {
          setSvgContent(content);
          onLoad?.();
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load SVG';
          setError(errorMessage);
          onError?.();
          console.error('ThemeLogo: Failed to load SVG:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSVG();

    return () => {
      isMounted = false;
    };
  }, [src, onError, onLoad]);

  // 应用主题颜色
  const themedSvgContent = React.useMemo(() => {
    if (!svgContent) return '';

    // 使用强制主题或当前主题
    const theme = forceTheme || (isDark ? 'dark' : 'light');
    const customMapping = customColorMapping?.[theme];
    
    return applySVGTheme(svgContent, theme, customMapping);
  }, [svgContent, isDark, forceTheme, customColorMapping]);

  // 处理SVG尺寸
  const processedSvgContent = React.useMemo(() => {
    if (!themedSvgContent) return '';

    // 如果指定了宽度或高度，需要更新SVG的属性
    let processed = themedSvgContent;
    
    if (width !== 'auto' || height !== 'auto') {
      // 更新width属性
      if (width !== 'auto') {
        processed = processed.replace(/width="[^"]*"/, `width="${width}"`);
      }
      
      // 更新height属性
      if (height !== 'auto') {
        processed = processed.replace(/height="[^"]*"/, `height="${height}"`);
      }
    }

    return processed;
  }, [themedSvgContent, width, height]);

  // 加载状态
  if (isLoading) {
    return (
      <div 
        className={`inline-flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded" 
             style={{ width: width === 'auto' ? '100px' : width, height: height === 'auto' ? '100px' : height }} />
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div 
        className={`inline-flex items-center justify-center text-gray-400 ${className}`}
        style={{ width, height }}
        title={`Failed to load logo: ${error}`}
      >
        <svg 
          width={width === 'auto' ? '100' : width} 
          height={height === 'auto' ? '100' : height} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
    );
  }

  // 正常显示SVG
  return (
    <div 
      className={`inline-flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: processedSvgContent }}
      style={{
        width: width === 'auto' ? undefined : width,
        height: height === 'auto' ? undefined : height
      }}
    />
  );
}

// 导出默认配置的Logo组件
export function DefaultThemeLogo(props: Omit<ThemeLogoProps, 'src'>) {
  return (
    <ThemeLogo
      src="/logo/logo.svg"
      {...props}
    />
  );
}