'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { zhCN, enUS } from '@mui/material/locale';

// 定义自定义颜色 - 可爱卡通风格暖色调
const colors = {
  primary: {
    main: '#FF8C42', // 主橙色
    light: '#FFB366',
    dark: '#E6732A',
  },
  secondary: {
    main: '#FFD93D', // 主黄色
    light: '#FFE066',
    dark: '#E6C42A',
  },
  success: {
    main: '#4ECDC4', // 薄荷绿
    light: '#7EDDD6',
    dark: '#3BB5AD',
  },
  warning: {
    main: '#FFB347', // 温暖橙
    light: '#FFC266',
    dark: '#E69A2E',
  },
  error: {
    main: '#FF6B6B', // 温和红
    light: '#FF8A8A',
    dark: '#E65252',
  },
  info: {
    main: '#74B9FF', // 天空蓝
    light: '#93C7FF',
    dark: '#5BA3E6',
  },
};

// 基础主题配置 - 国际化字体系统
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: [
      'Nunito',
      'Noto Sans SC',
      'Noto Sans TC',
      'Noto Sans JP',
      'Noto Sans KR',
      'Hiragino Sans GB',
      'Microsoft YaHei',
      'WenQuanYi Micro Hei',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: ['Comfortaa', 'Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: ['Comfortaa', 'Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: ['Comfortaa', 'Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: ['Comfortaa', 'Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: ['Comfortaa', 'Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: ['Comfortaa', 'Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    button: {
      fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
    },
    overline: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontFamily: ['Nunito', 'Noto Sans SC', 'Noto Sans TC', 'Noto Sans JP', 'Noto Sans KR', 'sans-serif'].join(','),
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
};

// 浅色主题 - 可爱卡通风格
export const lightTheme = (locale: 'zh' | 'en' = 'zh') => createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    ...colors,
    background: {
      default: '#FFF8F0', // 温暖的奶白色背景
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748', // 温和的深灰色
      secondary: '#718096', // 中性灰色
    },
    divider: '#E2E8F0',
  },
}, locale === 'zh' ? zhCN : enUS);

// 深色主题
export const darkTheme = (locale: 'zh' | 'en' = 'zh') => createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    ...colors,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
}, locale === 'zh' ? zhCN : enUS);