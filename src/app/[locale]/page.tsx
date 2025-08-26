'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Container, Typography, Box, Button } from '@mui/material';
import { Download, CalendarToday } from '@/components/icons';
import { MainLayout, ReservationForm } from '@/components';
import { ThemeLogo } from '@/components/ui/ThemeLogo';
import { cn } from '@/utils';




// Hero 区域组件 - 简化版主页
function HeroSection({ onReservationClick }: { onReservationClick: () => void }) {
  const handleDownloadClick = useCallback(() => {
    // TODO: 实际下载逻辑
    console.log('Download clicked');
  }, []);
  
  const handleReservationClick = useCallback(() => {
    onReservationClick();
  }, [onReservationClick]);
  
  return (
    <Box
      component="section"
      className={cn(
        'relative h-screen w-full flex items-center justify-center',
        'bg-gradient-to-br from-orange-400 via-yellow-400 to-pink-400'
      )}
    >
      <Container maxWidth="md" className="relative z-10">
        <Box className="w-full text-center space-y-8">
          {/* Logo */}
          <Box className="flex justify-center mb-12">
            <ThemeLogo
              src="/logo/logo.svg"
              width={200}
              height={200}
              className="w-40 h-40 md:w-48 md:h-48 mb-6 mx-auto"
              alt="FileZen Logo"
            />
          </Box>
          
          {/* TidyOtter 标题 */}
          <Typography
            variant="h1"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-white mb-4"
          >
            TidyOtter
          </Typography>
          
          {/* Slogan */}
          <Typography
            variant="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/90 font-bold mb-8"
          >
            文件 各归其位
          </Typography>
          
          {/* 按钮组 */}
          <Box className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-4 mt-20">
            <Button
              variant="contained"
              size="large"
              startIcon={<Download />}
              onClick={handleDownloadClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                boxShadow: '0 6px 24px rgba(255, 140, 66, 0.3)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF7A28 0%, #FF5722 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(255, 140, 66, 0.4)',
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            >
              立即下载
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<CalendarToday />}
              onClick={handleReservationClick}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '50px',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)',
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            >
              预约体验
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
      
      {/* 预约体验弹窗 */}
      <ReservationForm 
        variant="modal" 
        open={isReservationOpen}
        onClose={handleReservationClose}
      />
    </MainLayout>
  );
}