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
  const colors = new Set<string>();
  
  // 匹配 fill 属性
  const fillMatches = svgContent.match(/fill=["']([^"']+)["']/g);
  if (fillMatches) {
    fillMatches.forEach(match => {
      const color = match.match(/fill=["']([^"']+)["']/)?.[1];
      if (color && color !== 'none' && color !== 'transparent') {
        colors.add(color.toUpperCase()); // 统一转换为大写
      }
    });
  }
  
  // 匹配 stroke 属性
  const strokeMatches = svgContent.match(/stroke=["']([^"']+)["']/g);
  if (strokeMatches) {
    strokeMatches.forEach(match => {
      const color = match.match(/stroke=["']([^"']+)["']/)?.[1];
      if (color && color !== 'none' && color !== 'transparent') {
        colors.add(color.toUpperCase()); // 统一转换为大写
      }
    });
  }
  
  // 匹配十六进制颜色（包括3位和6位）
  const hexMatches = svgContent.match(/#[0-9A-Fa-f]{3,6}/g);
  if (hexMatches) {
    hexMatches.forEach(color => {
      // 将3位十六进制转换为6位
      if (color.length === 4) {
        const expanded = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        colors.add(expanded.toUpperCase());
      } else {
        colors.add(color.toUpperCase());
      }
    });
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
  
  Object.entries(colorMapping).forEach(([oldColor, newColor]) => {
    const oldColorUpper = oldColor.toUpperCase();
    const oldColorLower = oldColor.toLowerCase();
    
    // 创建转义后的颜色字符串
    const escapedUpper = oldColorUpper.replace('#', '\\#');
    const escapedLower = oldColorLower.replace('#', '\\#');
    
    // 替换 fill 属性中的颜色（支持双引号和单引号）
    result = result.replace(
      new RegExp(`fill=["']${escapedUpper}["']`, 'gi'),
      `fill="${newColor}"`
    );
    result = result.replace(
      new RegExp(`fill=["']${escapedLower}["']`, 'gi'),
      `fill="${newColor}"`
    );
    
    // 替换 stroke 属性中的颜色（支持双引号和单引号）
    result = result.replace(
      new RegExp(`stroke=["']${escapedUpper}["']`, 'gi'),
      `stroke="${newColor}"`
    );
    result = result.replace(
      new RegExp(`stroke=["']${escapedLower}["']`, 'gi'),
      `stroke="${newColor}"`
    );
    
    // 替换 stop-color 属性（用于渐变）
    result = result.replace(
      new RegExp(`stop-color=["']${escapedUpper}["']`, 'gi'),
      `stop-color="${newColor}"`
    );
    result = result.replace(
      new RegExp(`stop-color=["']${escapedLower}["']`, 'gi'),
      `stop-color="${newColor}"`
    );
    
    // 替换 flood-color 属性（用于滤镜）
    result = result.replace(
      new RegExp(`flood-color=["']${escapedUpper}["']`, 'gi'),
      `flood-color="${newColor}"`
    );
    result = result.replace(
      new RegExp(`flood-color=["']${escapedLower}["']`, 'gi'),
      `flood-color="${newColor}"`
    );
    
    // 替换CSS样式中的颜色
    result = result.replace(
      new RegExp(`color:\\s*${escapedUpper}`, 'gi'),
      `color: ${newColor}`
    );
    result = result.replace(
      new RegExp(`color:\\s*${escapedLower}`, 'gi'),
      `color: ${newColor}`
    );
    
    // 替换其他直接的颜色引用（更精确的匹配）
    result = result.replace(
      new RegExp(`(?<![a-fA-F0-9])${escapedUpper}(?![a-fA-F0-9])`, 'g'),
      newColor
    );
    result = result.replace(
      new RegExp(`(?<![a-fA-F0-9])${escapedLower}(?![a-fA-F0])`, 'g'),
      newColor
    );
  });
  
  return result;
}

/**
 * 根据主题获取颜色映射
 * @param theme 主题类型 ('light' | 'dark')
 * @returns 颜色映射对象
 */
export function getThemeColorMapping(theme: 'light' | 'dark'): ColorMapping {
  const mappings: Record<'light' | 'dark', ColorMapping> = {
    light: {
      // SVG中实际存在的颜色保持不变
      '#FDE1BC': '#FDE1BC', // 水獭身体浅橙色
      '#823746': '#823746', // 水獭轮廓深红棕色
      '#FCDCB4': '#FCDCB4', // 水獭细节浅肉色
      '#FFFFFE': '#FFFFFE', // 高亮白色
      
      // 其他可能的橙色系
      '#F97316': '#F97316', // 橙色
      '#FB923C': '#FB923C', // 浅橙色
      '#FED7AA': '#FED7AA', // 极浅橙色
      '#FDBA74': '#FDBA74', // 中橙色
      '#F59E0B': '#F59E0B', // 琥珀色
      '#D97706': '#D97706', // 深橙色
      '#92400E': '#92400E', // 极深橙色
      
      // 通用橙色系
      '#FF6B35': '#FF6B35',
      '#FF8C42': '#FF8C42', 
      '#FFA726': '#FFA726',
      '#FFB74D': '#FFB74D',
      '#FFCC80': '#FFCC80',
      
      // 深色部分
      '#2C3E50': '#34495E',
      '#34495E': '#3A4A5C',
      '#1A1A1A': '#2C2C2C',
      '#333333': '#404040',
      
      // 浅色部分
      '#F8F9FA': '#F8F9FA',
      '#FFFFFF': '#FFFFFF',
      '#E9ECEF': '#E9ECEF'
    },
    dark: {
      // SVG中实际存在的颜色映射为紫蓝色系
      '#FDE1BC': '#8B5CF6', // 水獭身体：浅橙色 -> 紫色
      '#823746': '#312E81', // 水獭轮廓：深红棕色 -> 深紫蓝色
      '#FCDCB4': '#A78BFA', // 水獭细节：浅肉色 -> 浅紫色
      '#FFFFFE': '#E0E7FF', // 高亮：白色 -> 极浅紫色
      
      // 其他橙色系调整为紫蓝色系
      '#F97316': '#6366F1', // 橙色 -> 靛蓝色
      '#FB923C': '#818CF8', // 浅橙色 -> 浅靛蓝色
      '#FED7AA': '#C7D2FE', // 极浅橙色 -> 极浅靛蓝色
      '#FDBA74': '#A5B4FC', // 中橙色 -> 中靛蓝色
      '#F59E0B': '#4F46E5', // 琥珀色 -> 深靛蓝色
      '#D97706': '#3730A3', // 深橙色 -> 极深靛蓝色
      '#92400E': '#1E1B4B', // 极深橙色 -> 最深紫蓝色
      
      // 通用橙色系调整为紫蓝色系
      '#FF6B35': '#7C3AED',
      '#FF8C42': '#8B5CF6', 
      '#FFA726': '#A78BFA',
      '#FFB74D': '#C4B5FD',
      '#FFCC80': '#DDD6FE',
      
      // 深色部分变为浅色
      '#2C3E50': '#B0BEC5',
      '#34495E': '#CFD8DC',
      '#1A1A1A': '#ECEFF1',
      '#333333': '#F5F5F5',
      
      // 浅色部分变为深色
      '#F8F9FA': '#263238',
      '#FFFFFF': '#37474F',
      '#E9ECEF': '#455A64'
    }
  };
  
  return mappings[theme];
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