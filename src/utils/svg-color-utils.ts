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
  console.log('🔧 replaceSVGColors: 开始颜色替换');
  console.log('  - 颜色映射条目数:', Object.keys(colorMapping).length);
  console.log('  - 颜色映射:', colorMapping);
  
  let result = svgContent;
  let replacementCount = 0;
  
  Object.entries(colorMapping).forEach(([oldColor, newColor]) => {
    const beforeLength = result.length;
    const beforeMatches = (result.match(new RegExp(oldColor.replace('#', '\\#'), 'gi')) || []).length;
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
    
    const afterLength = result.length;
    const afterMatches = (result.match(new RegExp(newColor.replace('#', '\\#'), 'gi')) || []).length;
    
    if (beforeMatches > 0) {
      console.log(`  ✨ 替换 ${oldColor} -> ${newColor}:`);
      console.log(`    - 替换前匹配数: ${beforeMatches}`);
      console.log(`    - 替换后新颜色数: ${afterMatches}`);
      replacementCount++;
    }
  });
  
  console.log(`🎯 replaceSVGColors: 完成替换，共处理 ${replacementCount} 种颜色`);
  console.log(`  - 内容长度变化: ${svgContent.length} -> ${result.length}`);
  
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
      
      // SVG中实际存在的其他颜色保持不变
      '#260B1A': '#260B1A', // 深色
      '#D7DCE4': '#D7DCE4', // 浅灰
      '#E4E7EA': '#E4E7EA', // 极浅灰
      '#E8683A': '#E8683A', // 橙红色
      '#F58948': '#F58948', // 橙色
      '#FCFAF6': '#FCFAF6', // 极浅色
      '#FD9F2B': '#FD9F2B', // 黄橙色
      '#FDEDD0': '#FDEDD0', // 浅黄色
      '#FEA531': '#FEA531', // 橙黄色
      '#FF9D0E': '#FF9D0E', // 橙色
      '#FFBF35': '#FFBF35', // 黄色
      '#FFC745': '#FFC745', // 浅黄色
      '#FFCC56': '#FFCC56', // 淡黄色
      '#FFCEA6': '#FFCEA6', // 极浅橙色
      
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
      // 水獭身体 - 黑色主调
      '#FDE1BC': '#1A1A1A', // 浅橙色 -> 深黑色
      '#823746': '#2D2D2D', // 深红棕色 -> 深灰色
      '#FCDCB4': '#404040', // 浅橙色 -> 中灰色
      '#FFFFFE': '#E5E5E5', // 白色 -> 浅银灰色
      
      // 文件夹主体 - 黑灰色系渐变
      '#260B1A': '#0F0F0F', // 深色 -> 极深黑色
      '#D7DCE4': '#B8B8B8', // 浅灰 -> 银灰色
      '#E4E7EA': '#D0D0D0', // 极浅灰 -> 浅银灰色
      '#E8683A': '#2D2D2D', // 橙红色 -> 深灰色
      '#F58948': '#1A1A1A', // 橙色 -> 深黑色
      '#FCFAF6': '#F5F5F5', // 极浅色 -> 极浅灰色
      '#FD9F2B': '#404040', // 黄橙色 -> 中灰色
      '#FDEDD0': '#808080', // 浅黄色 -> 中银灰色
      '#FEA531': '#2D2D2D', // 橙黄色 -> 深灰色
      '#FF9D0E': '#1A1A1A', // 橙色 -> 深黑色
      '#FFBF35': '#404040', // 黄色 -> 中灰色
      '#FFC745': '#808080', // 浅黄色 -> 中银灰色
      '#FFCC56': '#A0A0A0', // 淡黄色 -> 浅银灰色
      '#FFCEA6': '#E5E5E5', // 极浅橙色 -> 浅银灰色
      
      // 细节装饰 - 深灰色系
      '#F97316': '#2D2D2D', // 橙色 -> 深灰色
      '#FB923C': '#404040', // 浅橙色 -> 中灰色
      '#FED7AA': '#A0A0A0', // 极浅橙色 -> 浅银灰色
      '#FDBA74': '#808080', // 中橙色 -> 中银灰色
      '#F59E0B': '#2D2D2D', // 琥珀色 -> 深灰色
      '#D97706': '#1A1A1A', // 深橙色 -> 深黑色
      '#92400E': '#1A1A1A', // 极深橙色 -> 深黑色
      
      // 边框和线条 - 银灰色系
      '#FF6B35': '#2D2D2D',
      '#FF8C42': '#404040', 
      '#FFA726': '#808080',
      '#FFB74D': '#A0A0A0',
      '#FFCC80': '#E5E5E5',
      
      // 深色部分使用黑灰色
      '#2C3E50': '#1F1F1F',
      '#34495E': '#2A2A2A',
      '#1A1A1A': '#333333',
      '#333333': '#4A4A4A',
      
      // 浅色部分使用银灰色
      '#F8F9FA': '#2A2A2A',
      '#FFFFFF': '#333333',
      '#E9ECEF': '#4A4A4A'
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
  console.log('🎨 applySVGTheme: 开始应用主题');
  console.log('  - 主题:', theme);
  console.log('  - SVG内容长度:', svgContent.length);
  console.log('  - 是否有自定义映射:', !!customMapping);
  
  // 提取SVG中的实际颜色
  const extractedColors = extractColorsFromSVG(svgContent);
  console.log('  - SVG中提取的颜色:', extractedColors);
  
  const themeMapping = getThemeColorMapping(theme);
  const finalMapping = customMapping ? { ...themeMapping, ...customMapping } : themeMapping;
  
  console.log('  - 最终颜色映射键数:', Object.keys(finalMapping).length);
  
  const result = replaceSVGColors(svgContent, finalMapping);
  
  console.log('🏁 applySVGTheme: 主题应用完成');
  console.log('  - 结果长度:', result.length);
  console.log('  - 内容是否改变:', svgContent !== result);
  
  return result;
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