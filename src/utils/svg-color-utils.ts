/**
 * SVG颜色工具函数
 * 用于解析和替换SVG中的颜色定义，支持主题切换
 */

// 颜色映射类型定义
export interface ColorMapping {
  [originalColor: string]: string;
}

// 主题颜色配置
export interface ThemeColors {
  light: ColorMapping;
  dark: ColorMapping;
}

/**
 * 从SVG字符串中提取所有颜色值
 * @param svgContent SVG内容字符串
 * @returns 提取到的颜色数组
 */
export function extractColorsFromSVG(svgContent: string): string[] {
  const colorRegex = /(fill|stroke)="([^"]*)"/g;
  const colors = new Set<string>();
  let match;

  while ((match = colorRegex.exec(svgContent)) !== null) {
    const color = match[2];
    // 过滤掉 "none" 和 URL 引用
    if (color && color !== 'none' && !color.startsWith('url(')) {
      colors.add(color);
    }
  }

  return Array.from(colors);
}

/**
 * 替换SVG中的颜色
 * @param svgContent 原始SVG内容
 * @param colorMapping 颜色映射对象
 * @returns 替换后的SVG内容
 */
export function replaceSVGColors(svgContent: string, colorMapping: ColorMapping): string {
  let result = svgContent;

  // 替换 fill 属性中的颜色
  Object.entries(colorMapping).forEach(([originalColor, newColor]) => {
    const fillRegex = new RegExp(`fill="${originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    const strokeRegex = new RegExp(`stroke="${originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    
    result = result.replace(fillRegex, `fill="${newColor}"`);
    result = result.replace(strokeRegex, `stroke="${newColor}"`);
  });

  return result;
}

/**
 * 根据主题获取颜色映射
 * @param theme 主题类型 ('light' | 'dark')
 * @returns 颜色映射对象
 */
export function getThemeColorMapping(theme: 'light' | 'dark'): ColorMapping {
  // 基于SVG中发现的颜色定义主题映射
  const themeColors: ThemeColors = {
    light: {
      // 主要颜色 - 橙色系
      '#FF6B35': '#FF6B35', // 保持原橙色
      '#FF8C42': '#FF8C42', // 保持原橙色
      '#FFA726': '#FFA726', // 保持原橙色
      
      // 深色部分 - 在浅色主题下保持深色
      '#823746': '#2D1B69', // 深紫色
      '#5D4E75': '#2D1B69', // 深紫色
      
      // 浅色部分 - 在浅色主题下稍微调整
      '#FDE1BC': '#FFF3E0', // 更浅的橙色背景
      '#FCDCB4': '#FFE0B2', // 浅橙色
      '#FFFFFE': '#FFFFFF', // 纯白色
    },
    dark: {
      // 主要颜色 - 在深色主题下调整橙色
      '#FF6B35': '#FF8A50', // 稍微亮一点的橙色
      '#FF8C42': '#FFB74D', // 稍微亮一点的橙色
      '#FFA726': '#FFCC02', // 更亮的黄橙色
      
      // 深色部分 - 在深色主题下变为浅色
      '#823746': '#E1BEE7', // 浅紫色
      '#5D4E75': '#B39DDB', // 浅紫色
      
      // 浅色部分 - 在深色主题下变为深色
      '#FDE1BC': '#3E2723', // 深棕色
      '#FCDCB4': '#5D4037', // 中等棕色
      '#FFFFFE': '#424242', // 深灰色
    }
  };

  return themeColors[theme];
}

/**
 * 应用主题到SVG
 * @param svgContent 原始SVG内容
 * @param theme 主题类型
 * @param customMapping 自定义颜色映射（可选）
 * @returns 应用主题后的SVG内容
 */
export function applySVGTheme(
  svgContent: string, 
  theme: 'light' | 'dark',
  customMapping?: ColorMapping
): string {
  const themeMapping = getThemeColorMapping(theme);
  const finalMapping = customMapping ? { ...themeMapping, ...customMapping } : themeMapping;
  
  return replaceSVGColors(svgContent, finalMapping);
}

/**
 * 从URL加载SVG内容
 * @param url SVG文件URL
 * @returns Promise<string> SVG内容
 */
export async function loadSVGFromURL(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading SVG:', error);
    throw error;
  }
}