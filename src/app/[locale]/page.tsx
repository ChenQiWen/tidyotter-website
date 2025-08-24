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

// Hero 区域组件
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
        'relative min-h-[100vh] flex items-center',
        'bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800',
        'overflow-hidden'
      )}
    >
      {/* 动态背景装饰 */}
      <Box
        className={cn(
          'absolute inset-0 overflow-hidden opacity-10',
          'bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]'
        )}
      />
      
      {/* 浮动装饰元素 */}
      <FloatingCard 
        className="absolute top-20 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        floatAnimation={true}
        delay={0}
      >
        <Sparkles className="w-8 h-8 text-white" />
      </FloatingCard>
      
      <FloatingCard 
        className="absolute top-40 right-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        floatAnimation={true}
        delay={1}
      >
        <Rocket className="w-6 h-6 text-white" />
      </FloatingCard>
      
      <FloatingCard 
        className="absolute bottom-32 left-20 w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
        floatAnimation={true}
        delay={2}
      >
        <People className="w-7 h-7 text-white" />
      </FloatingCard>
      
      <Container maxWidth="lg" className="relative z-10">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Box>
            <ScrollAnimation animation="fadeInLeft">
              <GradientText 
                as="h1" 
                gradient="custom" 
                customGradient="linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)"
                className="text-mobile-2xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight"
                animated={true}
              >
                {t('title')}
              </GradientText>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fadeInLeft" delay={0.2}>
              <Typography
                variant="h5"
                className="mb-6 opacity-90 leading-loose text-white text-mobile-lg sm:text-xl md:text-2xl"
              >
                {t('subtitle')}
              </Typography>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fadeInLeft" delay={0.3}>
              <Typography
                variant="body1"
                className="text-mobile-base sm:text-xl text-white/80 leading-loose mb-8"
              >
                {t('description')}
              </Typography>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fadeInUp" delay={0.4}>
              <Box className="flex flex-col sm:flex-row gap-4">
                <ModernButton
                  variant="gradient"
                  size="lg"
                  icon={<CalendarToday className="w-6 h-6" />}
                  iconPosition="left"
                  glowEffect={true}
                  onClick={handleReservationClick}
                  className={cn(
                    'px-12 py-5 text-2xl font-bold text-white',
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
                  icon={<Download className="w-5 h-5" />}
                  iconPosition="left"
                  onClick={handleDownloadClick}
                  className="text-white font-semibold border-white/50 hover:bg-white/10"
                >
                  {t('cta_primary')}
                </ModernButton>
                
                <ModernButton
                  variant="outline"
                  size="lg"
                  icon={<PlayArrow className="w-5 h-5" />}
                  iconPosition="left"
                  onClick={handleWatchDemoClick}
                  className="border-white/50 text-white hover:bg-white/10 hover:border-white"
                >
                  {t('watch_demo')}
                </ModernButton>
              </Box>
            </ScrollAnimation>
          </Box>
          
          <Box>
            <ScrollAnimation animation="fadeInRight" delay={0.3}>
              <Box className="relative">
                <FloatingCard
                  variant="glass"
                  hoverEffect="tilt"
                  className="w-full max-w-md mx-auto h-80 flex items-center justify-center border border-white/20"
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <Typography 
                      variant="h6" 
                      className="text-white opacity-90 font-bold"
                    >
                      产品演示图
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="text-white opacity-70 mt-1"
                    >
                      体验现代化的文件管理
                    </Typography>
                  </div>
                </FloatingCard>
              </Box>
            </ScrollAnimation>
          </Box>
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
        'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100',
        'dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/30'
      )}
    >
      {/* 背景装饰 */}
      <Box className="absolute inset-0 opacity-30">
        <Box className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <Box className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
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
                        feature.color === 'primary' && 'from-blue-500 to-blue-600 shadow-blue-500/25',
                        feature.color === 'secondary' && 'from-purple-500 to-purple-600 shadow-purple-500/25',
                        feature.color === 'success' && 'from-green-500 to-green-600 shadow-green-500/25',
                        feature.color === 'warning' && 'from-orange-500 to-orange-600 shadow-orange-500/25'
                      )}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </Box>
                  }
                  title={t(`${feature.key}.title`)}
                  description={t(`${feature.key}.description`)}
                  className={cn(
                    'h-full group cursor-pointer',
                    'bg-white/80 dark:bg-gray-800/80',
                    'backdrop-blur-sm border border-white/20',
                    'hover:bg-white dark:hover:bg-gray-800',
                    'transition-all duration-300',
                    'hover:shadow-xl hover:shadow-gray-200/50',
                    'dark:hover:shadow-gray-900/50'
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
                  className="text-center p-6 bg-white/60 dark:bg-gray-800/60 border border-white/30"
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
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
        'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700'
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