'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Container, Typography, Box } from '@mui/material';
// import { Card, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { 
  AutoAwesome, 
  Security, 
  Speed,
  Backup,
  Download,
  PlayArrow,
  GitHub,
  Twitter,
  CalendarToday,
  Shield,
  People
} from '@mui/icons-material';
import { MainLayout, ReservationForm } from '@/components';
import { cn } from '@/utils';
import { event } from '@/lib/analytics';
import ScrollAnimation from '@/components/animations/ScrollAnimation';
import GradientText from '@/components/ui/GradientText';
import ModernButton from '@/components/ui/ModernButton';
import FloatingCard, { FeatureCard } from '@/components/ui/FloatingCard';
import { Sparkles, Rocket, Zap } from 'lucide-react';


// 功能特性数据
const features = [
  {
    key: 'auto_organize',
    icon: AutoAwesome,
    color: 'primary' as const,
  },
  {
    key: 'smart_rules',
    icon: Security,
    color: 'secondary' as const,
  },
  {
    key: 'batch_operations',
    icon: Speed,
    color: 'success' as const,
  },
  {
    key: 'safe_backup',
    icon: Backup,
    color: 'warning' as const,
  },
];

// Hero 区域组件 - 占满浏览器可视区域的门面
function HeroSection({ onReservationClick }: { onReservationClick: () => void }) {
  const t = useTranslations('hero');
  
  const handleDownloadClick = useCallback(() => {
    event('download_clicked', { source: 'hero' });
    // TODO: 实际下载逻辑
    console.log('Download clicked');
  }, []);
  
  const handleWatchDemoClick = useCallback(() => {
    event('demo_clicked', { source: 'hero' });
    // TODO: 演示视频逻辑
    console.log('Watch demo clicked');
  }, []);
  
  const handleReservationClick = useCallback(() => {
    event('reservation_clicked', { source: 'hero' });
    onReservationClick();
  }, [onReservationClick]);
  
  return (
    <Box
      component="section"
      className={cn(
        'relative h-screen w-full flex items-center justify-center',
        'bg-gradient-to-br from-orange-400 via-yellow-400 to-pink-400',
        'overflow-hidden'
      )}
    >
      {/* 动态背景装饰 */}
      <Box
        className={cn(
          'absolute inset-0 overflow-hidden opacity-20',
          'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
        )}
      />
      
      {/* 额外的动态背景元素 */}
      <Box className="absolute inset-0 overflow-hidden">
        <Box className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <Box className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-4000" />
      </Box>
      
      {/* 浮动装饰元素 */}
      <FloatingCard 
        className="absolute top-20 left-10 w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-300/30"
        floatAnimation={true}
        delay={0}
      >
        <Sparkles className="w-8 h-8 text-white" />
      </FloatingCard>
      
      <FloatingCard 
        className="absolute top-40 right-20 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-300/30"
        floatAnimation={true}
        delay={1}
      >
        <Rocket className="w-6 h-6 text-white" />
      </FloatingCard>
      
      <FloatingCard 
        className="absolute bottom-32 left-20 w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-300/30"
        floatAnimation={true}
        delay={2}
      >
        <People className="w-7 h-7 text-white" />
      </FloatingCard>
      
      <Container maxWidth="xl" className="relative z-10 h-full flex items-center">
        <Box className="w-full text-center">
          <ScrollAnimation animation="fadeInUp">
            <GradientText 
              as="h1" 
              gradient="custom" 
              customGradient="linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)"
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight"
              animated={true}
            >
              {t('title')}
            </GradientText>
          </ScrollAnimation>
            
          <ScrollAnimation animation="fadeInUp" delay={0.2}>
            <Typography
              variant="h3"
              className="mb-8 opacity-95 leading-relaxed text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium"
            >
              {t('subtitle')}
            </Typography>
          </ScrollAnimation>
          
          <ScrollAnimation animation="fadeInUp" delay={0.3}>
            <Typography
              variant="h6"
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed mb-12 max-w-4xl mx-auto"
            >
              {t('description')}
            </Typography>
          </ScrollAnimation>
            
          <ScrollAnimation animation="fadeInUp" delay={0.4}>
            <Box className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <ModernButton
                variant="gradient"
                size="lg"
                icon={<CalendarToday className="w-7 h-7" />}
                iconPosition="left"
                glowEffect={true}
                onClick={handleReservationClick}
                className={cn(
                  'px-16 py-6 text-xl md:text-2xl lg:text-3xl font-bold text-white',
                  'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
                  'hover:from-orange-600 hover:via-red-600 hover:to-pink-600',
                  'shadow-2xl hover:shadow-orange-500/25',
                  'transform hover:scale-110 transition-all duration-300',
                  'animate-bounce hover:animate-none'
                )}
              >
                🎯 预约体验
              </ModernButton>
              
              <ModernButton
                variant="glass"
                size="lg"
                icon={<Download className="w-6 h-6" />}
                iconPosition="left"
                onClick={handleDownloadClick}
                className="text-white font-semibold border-white/50 hover:bg-white/10 px-12 py-6 text-lg md:text-xl"
              >
                {t('cta_primary')}
              </ModernButton>
              
              <ModernButton
                variant="outline"
                size="lg"
                icon={<PlayArrow className="w-6 h-6" />}
                iconPosition="left"
                onClick={handleWatchDemoClick}
                className="border-white/50 text-white hover:bg-white/10 hover:border-white px-12 py-6 text-lg md:text-xl"
              >
                {t('watch_demo')}
              </ModernButton>
            </Box>
          </ScrollAnimation>
          
          {/* 产品预览区域 */}
          <ScrollAnimation animation="fadeInUp" delay={0.5}>
            <Box className="relative max-w-2xl mx-auto">
              <FloatingCard
                variant="glass"
                hoverEffect="tilt"
                className="w-full h-64 md:h-80 lg:h-96 flex items-center justify-center border border-white/30 rounded-3xl shadow-2xl shadow-orange-300/20 bg-white/10 backdrop-blur-md"
              >
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto bg-gradient-to-br from-orange-300 to-yellow-300 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                      <Zap className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
                    </div>
                  </div>
                  <Typography 
                    variant="h4" 
                    className="text-white opacity-95 font-bold text-2xl md:text-3xl lg:text-4xl mb-4"
                  >
                    🎨 产品演示图
                  </Typography>
                  <Typography 
                    variant="h6" 
                    className="text-white opacity-80 text-lg md:text-xl lg:text-2xl"
                  >
                    体验可爱的文件管理
                  </Typography>
                </div>
              </FloatingCard>
            </Box>
          </ScrollAnimation>
        </Box>
      </Container>
    </Box>
  );
}

// 功能特性区域组件
function FeaturesSection() {
  const t = useTranslations('features');
  
  return (
    <Box 
      component="section" 
      className={cn(
        'py-24 relative overflow-hidden',
        'bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50',
        'dark:from-gray-900 dark:via-orange-900/20 dark:to-pink-900/30'
      )}
    >
      {/* 背景装饰 */}
      <Box className="absolute inset-0 opacity-40">
        <Box className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <Box className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <Box className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </Box>
      
      <Container maxWidth="lg" className="relative z-10">
        <ScrollAnimation animation="fadeInUp">
          <Box className="text-center mb-20">
            <GradientText 
              as="h2" 
              gradient="primary" 
              className="text-5xl md:text-6xl font-bold mb-6"
              animated={true}
            >
              {t('title')}
            </GradientText>
            <Typography
              variant="body1"
              className="text-mobile-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-extra-loose"
            >
              {t('subtitle')}
            </Typography>
          </Box>
        </ScrollAnimation>
        
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            
            return (
              <ScrollAnimation 
                key={feature.key}
                animation="fadeInUp"
                delay={index * 0.1}
              >
                <FeatureCard
                  icon={
                    <Box
                      className={cn(
                        'w-16 h-16 rounded-2xl flex items-center justify-center',
                        'bg-gradient-to-br shadow-lg',
                        feature.color === 'primary' && 'from-orange-400 to-orange-500 shadow-orange-400/30',
                        feature.color === 'secondary' && 'from-yellow-400 to-yellow-500 shadow-yellow-400/30',
                        feature.color === 'success' && 'from-pink-400 to-pink-500 shadow-pink-400/30',
                        feature.color === 'warning' && 'from-orange-500 to-red-400 shadow-orange-500/30'
                      )}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </Box>
                  }
                  title={t(`${feature.key}.title`)}
                  description={t(`${feature.key}.description`)}
                  className={cn(
                    'h-full group cursor-pointer',
                    'bg-white/90 dark:bg-gray-800/90',
                    'backdrop-blur-sm border border-orange-200/30 rounded-2xl',
                    'hover:bg-white dark:hover:bg-gray-800',
                    'transition-all duration-300',
                    'hover:shadow-2xl hover:shadow-orange-200/40 hover:scale-105',
                    'dark:hover:shadow-orange-900/30'
                  )}
                />
              </ScrollAnimation>
            );
          })}
        </Box>
        
        {/* 底部装饰性统计数据 */}
        <ScrollAnimation animation="fadeInUp" delay={0.6}>
          <Box className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
               { number: '10K+', label: '活跃用户', icon: People },
               { number: '99.9%', label: '稳定性', icon: Shield },
               { number: '50%', label: '效率提升', icon: Zap },
               { number: '24/7', label: '技术支持', icon: AutoAwesome }
             ].map((stat) => {
              const IconComponent = stat.icon;
              return (
                <FloatingCard
                  key={stat.label}
                  variant="glass"
                  hoverEffect="lift"
                  className="text-center p-6 bg-white/70 dark:bg-gray-800/70 border border-orange-200/40 rounded-2xl shadow-lg hover:shadow-orange-200/30"
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3 text-orange-500 dark:text-orange-400" />
                  <GradientText 
                    as="div" 
                    gradient="primary" 
                    className="text-3xl font-bold mb-1"
                  >
                    {stat.number}
                  </GradientText>
                  <Typography 
                    variant="body2" 
                    className="text-lg text-gray-600 dark:text-gray-300 font-medium"
                  >
                    {stat.label}
                  </Typography>
                </FloatingCard>
              );
            })}
          </Box>
        </ScrollAnimation>
      </Container>
    </Box>
  );
}



// 社交链接区域组件
function SocialSection() {
  const handleGitHubClick = useCallback(() => {
    event('social_clicked', { platform: 'github' });
    window.open(process.env.NEXT_PUBLIC_GITHUB_URL, '_blank');
  }, []);
  
  const handleTwitterClick = useCallback(() => {
    event('social_clicked', { platform: 'twitter' });
    window.open(`https://twitter.com/${process.env.NEXT_PUBLIC_TWITTER_HANDLE?.replace('@', '')}`, '_blank');
  }, []);
  
  return (
    <Box 
      component="section" 
      className={cn(
        'py-20 relative overflow-hidden',
        'bg-gradient-to-r from-orange-500 via-pink-500 to-red-500'
      )}
    >
      {/* 背景装饰 */}
      <Box className="absolute inset-0">
        <Box className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <Box className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </Box>
      
      <Container maxWidth="md" className="relative z-10">
        <ScrollAnimation animation="fadeInUp">
          <Box className="text-center">
            <GradientText 
              as="h3" 
              gradient="custom"
              customGradient="linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)"
              className="text-3xl md:text-4xl font-bold mb-4"
              animated={true}
            >
              关注我们的最新动态
            </GradientText>
            
            <Typography
              variant="body1"
              className="text-white/80 text-lg mb-10 max-w-lg mx-auto"
            >
              获取产品更新、技术分享和社区动态
            </Typography>
            
            <Box className="flex flex-col sm:flex-row justify-center gap-4">
              <ModernButton
                variant="glass"
                size="lg"
                icon={<GitHub className="w-5 h-5" />}
                iconPosition="left"
                onClick={handleGitHubClick}
                className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                GitHub
              </ModernButton>
              
              <ModernButton
                variant="glass"
                size="lg"
                icon={<Twitter className="w-5 h-5" />}
                iconPosition="left"
                onClick={handleTwitterClick}
                className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                Twitter
              </ModernButton>
            </Box>
          </Box>
        </ScrollAnimation>
      </Container>
    </Box>
  );
}

// 主页组件
export default function HomePage() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  
  const handleReservationOpen = useCallback(() => {
    setIsReservationOpen(true);
  }, []);
  
  const handleReservationClose = useCallback(() => {
    setIsReservationOpen(false);
  }, []);
  
  return (
    <MainLayout>
      <HeroSection onReservationClick={handleReservationOpen} />
      <FeaturesSection />
      <SocialSection />
      
      {/* 预约体验弹窗 */}
      <ReservationForm 
        variant="modal" 
        open={isReservationOpen}
        onClose={handleReservationClose}
      />
    </MainLayout>
  );
}