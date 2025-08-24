'use client';

import Statsig, { StatsigUser } from 'statsig-js';

// Statsig 配置
const STATSIG_CLIENT_KEY = process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY || '';

// 功能开关键名
export const FeatureFlags = {
  ENABLE_ANALYTICS: 'enable_analytics',
  ENABLE_RESERVATION: 'enable_reservation',
  ENABLE_DARK_MODE: 'enable_dark_mode',
  ENABLE_MULTILANG: 'enable_multilang',
  SHOW_BETA_FEATURES: 'show_beta_features',
} as const;

// 初始化 Statsig
export async function initializeStatsig(user?: StatsigUser) {
  if (!STATSIG_CLIENT_KEY) {
    console.warn('Statsig client key not found');
    return;
  }

  try {
    await Statsig.initialize(STATSIG_CLIENT_KEY, user, {
      environment: {
        tier: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      },
    });
  } catch (error) {
    console.error('Failed to initialize Statsig:', error);
  }
}

// 检查功能开关
export function checkFeatureFlag(flagName: string): boolean {
  try {
    return Statsig.checkGate(flagName);
  } catch (error) {
    console.error(`Failed to check feature flag ${flagName}:`, error);
    return false;
  }
}

// 获取配置值
export function getConfig(configName: string): any {
  try {
    return Statsig.getConfig(configName);
  } catch (error) {
    console.error(`Failed to get config ${configName}:`, error);
    return null;
  }
}

// 记录事件
export function logEvent(eventName: string, value?: string | number, metadata?: Record<string, any>) {
  try {
    Statsig.logEvent(eventName, value, metadata);
  } catch (error) {
    console.error(`Failed to log event ${eventName}:`, error);
  }
}

// 更新用户信息
export async function updateUser(user: StatsigUser) {
  try {
    await Statsig.updateUser(user);
  } catch (error) {
    console.error('Failed to update user:', error);
  }
}

// 关闭 Statsig
export function shutdownStatsig() {
  try {
    Statsig.shutdown();
  } catch (error) {
    console.error('Failed to shutdown Statsig:', error);
  }
}