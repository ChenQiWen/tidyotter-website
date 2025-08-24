// 基础类型定义
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 预约相关类型
export interface Reservation {
  id: string;
  email: string;
  name: string;
  phone?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    ip?: string;
    userAgent?: string;
    source?: string;
  };
}

export interface ReservationFormData {
  email: string;
  name: string;
  phone?: string;
  message?: string;
}

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 语言相关类型
export type Locale = 'zh' | 'en';

// 功能开关类型
export interface FeatureFlags {
  analytics: boolean;
  reservation: boolean;
  darkMode: boolean;
  multiLanguage: boolean;
  testFeature: boolean;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分析事件类型
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

// 导航菜单类型
export interface NavItem {
  key: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// SEO 元数据类型
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  locale?: Locale;
  alternateLocales?: Locale[];
}

// 组件通用 Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 表单验证错误类型
export interface FormErrors {
  [key: string]: string | undefined;
}

// 加载状态类型
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// 分页类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 排序类型
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// 过滤类型
export interface FilterConfig {
  [key: string]: any;
}

// 通用列表响应类型
export interface ListResponse<T> {
  items: T[];
  pagination: Pagination;
  filters?: FilterConfig;
  sort?: SortConfig;
}

// 环境变量类型
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_APP_NAME: string;
  NEXT_PUBLIC_APP_DESCRIPTION: string;
  NEXT_PUBLIC_GTM_ID?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
  NEXT_PUBLIC_STATSIG_CLIENT_KEY?: string;
  VERCEL_URL?: string;
  VERCEL_ENV?: 'development' | 'preview' | 'production';
  KV_URL?: string;
  KV_REST_API_URL?: string;
  KV_REST_API_TOKEN?: string;
  KV_REST_API_READ_ONLY_TOKEN?: string;
}

// 错误类型
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};