'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { Button } from '@/components';
import { 
  AutoAwesome, 
  Security, 
  Speed, 
  Backup,
  Download,
  PlayArrow,
  GitHub,
  Twitter,
  CalendarToday
} from '@mui/icons-material';
import { MainLayout, ReservationForm } from '@/components';
import { cn } from '@/utils';
import { event } from '@/lib/analytics';



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
        'relative min-h-[80vh] flex items-center',
        'bg-gradient-to-br from-primary-50 via-white to-secondary-50',
        'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
      )}
    >
      {/* 背景装饰 */}
      <Box
        className={cn(
          'absolute inset-0 overflow-hidden',
          'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]',
          'from-blue-100 via-transparent to-purple-100',
          'dark:from-blue-900/20 dark:to-purple-900/20'
        )}
      />
      
      <Container maxWidth="lg" className="relative z-10">
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Box>
            <Box className="space-y-6">
              <Typography
                variant="h1"
                className={cn(
                  'text-4xl md:text-6xl font-bold',
                  'bg-gradient-to-r from-primary-600 to-secondary-600',
                  'bg-clip-text text-transparent'
                )}
              >
                {t('title')}
              </Typography>
              
              <Typography
                variant="h2"
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
              >
                {t('subtitle')}
              </Typography>
              
              <Typography
                variant="body1"
                className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed"
              >
                {t('description')}
              </Typography>
              
              <Box className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CalendarToday />}
                  onClick={handleReservationClick}
                  className={cn(
                    'px-10 py-4 text-xl font-bold',
                    'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500',
                    'hover:from-orange-600 hover:via-red-600 hover:to-pink-600',
                    'shadow-2xl hover:shadow-orange-500/25',
                    'transform hover:scale-110 transition-all duration-300',
                    'border-2 border-white/20',
                    'relative overflow-hidden',
                    'before:absolute before:inset-0',
                    'before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0',
                    'before:translate-x-[-100%] hover:before:translate-x-[100%]',
                    'before:transition-transform before:duration-700',
                    'animate-bounce hover:animate-none',
                    'ring-4 ring-orange-200/50 hover:ring-orange-300/70'
                  )}
                >
                  🎯 预约体验
                </Button>
                
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Download />}
                  onClick={handleDownloadClick}
                  className={cn(
                    'px-8 py-3 text-lg font-semibold',
                    'bg-gradient-to-r from-primary-500 to-primary-600',
                    'hover:from-primary-600 hover:to-primary-700',
                    'shadow-lg hover:shadow-xl',
                    'transform hover:scale-105 transition-all duration-200'
                  )}
                >
                  {t('cta_primary')}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleWatchDemoClick}
                  className={cn(
                    'px-8 py-3 text-lg font-semibold',
                    'border-2 hover:border-primary-500',
                    'hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  )}
                >
                  {t('watch_demo')}
                </Button>
              </Box>
            </Box>
          </Box>
          
          <Box>
            <Box className="relative">
              {/* 产品预览图占位 */}
              <Box
                className={cn(
                  'aspect-video rounded-2xl',
                  'bg-gradient-to-br from-gray-100 to-gray-200',
                  'dark:from-gray-700 dark:to-gray-800',
                  'flex items-center justify-center',
                  'shadow-2xl',
                  'border border-gray-200 dark:border-gray-600'
                )}
              >
                <Typography
                  variant="h6"
                  className="text-gray-500 dark:text-gray-400"
                >
                  产品演示图
                </Typography>
              </Box>
              
              {/* 装饰元素 */}
              <Box
                className={cn(
                  'absolute -top-4 -right-4 w-24 h-24',
                  'bg-gradient-to-br from-yellow-400 to-orange-500',
                  'rounded-full opacity-20 blur-xl'
                )}
              />
              <Box
                className={cn(
                  'absolute -bottom-4 -left-4 w-32 h-32',
                  'bg-gradient-to-br from-blue-400 to-purple-500',
                  'rounded-full opacity-20 blur-xl'
                )}
              />
            </Box>
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
    <Box component="section" className="py-20 bg-gray-50 dark:bg-gray-900">
      <Container maxWidth="lg">
        <Box className="text-center mb-16">
          <Typography
            variant="h2"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {t('title')}
          </Typography>
          <Typography
            variant="body1"
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </Typography>
        </Box>
        
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <Box key={feature.key}>
                <Card
                  className={cn(
                    'h-full transition-all duration-300',
                    'hover:shadow-lg hover:-translate-y-1',
                    'border-0 shadow-md',
                    'bg-white dark:bg-gray-800'
                  )}
                >
                  <CardContent className="p-6 text-center">
                    <Box
                      className={cn(
                        'w-16 h-16 mx-auto mb-4 rounded-full',
                        'flex items-center justify-center',
                        'bg-gradient-to-br',
                        feature.color === 'primary' && 'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
                        feature.color === 'secondary' && 'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
                        feature.color === 'success' && 'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30',
                        feature.color === 'warning' && 'from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30'
                      )}
                    >
                      <IconComponent
                        className={cn(
                          'w-8 h-8',
                          feature.color === 'primary' && 'text-blue-600 dark:text-blue-400',
                          feature.color === 'secondary' && 'text-purple-600 dark:text-purple-400',
                          feature.color === 'success' && 'text-green-600 dark:text-green-400',
                          feature.color === 'warning' && 'text-orange-600 dark:text-orange-400'
                        )}
                      />
                    </Box>
                    
                    <Typography
                      variant="h6"
                      className="font-semibold mb-2"
                    >
                      {t(`${feature.key}.title`)}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      className="text-gray-600 dark:text-gray-300 leading-relaxed"
                    >
                      {t(`${feature.key}.description`)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
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
    <Box component="section" className="py-16 bg-white dark:bg-gray-800">
      <Container maxWidth="sm">
        <Box className="text-center">
          <Typography
            variant="h3"
            className="text-2xl font-bold mb-8"
          >
            关注我们的最新动态
          </Typography>
          
          <Box className="flex justify-center gap-6">
            <Button
              variant="outlined"
              startIcon={<GitHub />}
              onClick={handleGitHubClick}
              className={cn(
                'px-6 py-3',
                'border-gray-300 hover:border-gray-900',
                'text-gray-700 hover:text-gray-900',
                'dark:border-gray-600 dark:hover:border-gray-300',
                'dark:text-gray-300 dark:hover:text-white'
              )}
            >
              GitHub
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Twitter />}
              onClick={handleTwitterClick}
              className={cn(
                'px-6 py-3',
                'border-blue-300 hover:border-blue-500',
                'text-blue-600 hover:text-blue-700',
                'dark:border-blue-600 dark:hover:border-blue-400',
                'dark:text-blue-400 dark:hover:text-blue-300'
              )}
            >
              Twitter
            </Button>
          </Box>
        </Box>
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