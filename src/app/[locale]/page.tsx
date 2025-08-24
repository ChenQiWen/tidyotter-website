'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Container, Typography, Box, Button } from '@mui/material';
import { Download, CalendarToday } from '@/components/icons';
import { MainLayout, ReservationForm } from '@/components';
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
            <img 
              src="/logo/logo.png" 
              alt="FileZen Logo" 
              className="w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44"
            />
          </Box>
          
          {/* FileZen 标题 */}
          <Typography
            variant="h1"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4"
          >
            FileZen
          </Typography>
          
          {/* Slogan */}
          <Typography
            variant="h2"
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 font-medium mb-8"
          >
            文件 各归其位
          </Typography>
          
          {/* 按钮组 */}
          <Box className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-4">
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
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF7A28 0%, #FF5722 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(255, 140, 66, 0.4)',
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