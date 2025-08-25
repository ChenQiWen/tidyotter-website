'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@/components/icons';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function Header() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');
  const router = useRouter();
  
  // 使用统一的主题响应式logo
  const logoSrc = '/logo/1x.png';
  const logoSrcSet = '/logo/1x.png 1x, /logo/2x.png 2x, /logo/3x.png 3x';

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleReservationClick = useCallback(() => {
    router.push('/reservation');
  }, [router]);

  useEffect(() => {
    if (isMd) {
      setMobileMenuOpen(false);
    }
  }, [isMd]);

  const navigationItems = [
    { key: 'features', href: '/features' },
    { key: 'download', href: '/download' },
    { key: 'pricing', href: '/pricing' },
    { key: 'about', href: '/about' },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.8
      }}
    >
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 240, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255, 140, 66, 0.15)',
              boxShadow: '0 8px 32px rgba(255, 140, 66, 0.12)',
              transition: 'all 0.3s ease-in-out',
              borderRadius: '0 0 16px 16px',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(255, 140, 66, 0.18)',
              },
            }}
        >
          <Container maxWidth="xl">
            <Toolbar 
              disableGutters 
              sx={{ 
                minHeight: { xs: 64, md: 80 },
                py: { xs: 1, md: 1.5 },
              }}
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/" className="flex items-center">
                  <Box
                    sx={{
                      width: { xs: 48, md: 52 },
                      height: { xs: 48, md: 52 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={logoSrc}
                      alt="FileZen Logo"
                      width={36}
                      height={36}
                      className="w-9 h-9 md:w-10 md:h-10 transition-all duration-300"
                      style={{
                        filter: 'drop-shadow(0 2px 4px rgba(255, 140, 66, 0.3))',
                      }}
                      sizes="(max-width: 768px) 36px, 40px"
                      srcSet={logoSrcSet}
                    />
                  </Box>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              {isMd && (
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', ml: 8 }}>
                  <nav className="flex space-x-8">
                    {navigationItems.map((item, index) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: 0.1 + index * 0.1,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                        whileHover={{ y: -2, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={item.href}
                          className="relative px-4 py-2 font-semibold text-lg hover:text-white transition-all duration-300 group"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.25) 0%, rgba(255, 217, 61, 0.25) 100%)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 140, 66, 0.4)',
                            boxShadow: '0 4px 15px rgba(255, 140, 66, 0.2)',
                            color: '#FF8C42',
                          }}
                        >
                          <span className="relative z-10 font-bold" style={{
                            color: '#FF8C42',
                          }}>
                            {t(item.key)}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-yellow-500/30 to-red-400/30 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl"></div>
                          <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-400 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </Box>
              )}

              {/* Mobile: Spacer to push actions to right */}
              {!isMd && <Box sx={{ flexGrow: 1 }} />}

              {/* Right side actions */}
              <div className="flex items-center space-x-4">
                {/* Reservation Button - Desktop */}
                {isMd && (
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleReservationClick}
                      sx={{
                        ml: 2,
                        background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 50%, #FF6B6B 100%)',
                        borderRadius: 2.5,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 6px 20px rgba(255, 140, 66, 0.5)',
                        border: '2px solid rgba(255, 140, 66, 0.6)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFD93D 100%)',
                          boxShadow: '0 12px 35px rgba(255, 140, 66, 0.6)',
                          transform: 'scale(1.05) translateY(-2px)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                      }}
                    >
                      {t('reservation')}
                    </Button>
                  </motion.div>
                )}

                {/* Mobile Menu Toggle */}
                {!isMd && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <IconButton
                      onClick={handleMobileMenuToggle}
                      sx={{
                        color: 'text.primary',
                        background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.12) 0%, rgba(255, 217, 61, 0.12) 100%)',
                        border: '1px solid rgba(255, 140, 66, 0.2)',
                        borderRadius: 2,
                        ml: 1,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.2) 0%, rgba(255, 217, 61, 0.2) 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(255, 140, 66, 0.2)',
                        },
                      }}
                    >
                      {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>
                  </motion.div>
                )}
              </div>
            </Toolbar>
          </Container>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {!isMd && mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.4, 0, 0.2, 1],
                  staggerChildren: 0.1
                }}
                className="md:hidden border-t border-gradient-to-r from-orange-200/30 to-yellow-200/30 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 240, 0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderTop: '1px solid rgba(255, 140, 66, 0.18)',
                  boxShadow: '0 10px 25px rgba(255, 140, 66, 0.12)'
                }}
              >
                <nav className="px-6 py-6 space-y-3">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ x: -30, opacity: 0, scale: 0.95 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        delay: 0.1 + index * 0.08
                      }}
                      whileHover={{ x: 8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Link
                        href={item.href}
                        className="block px-5 py-4 rounded-2xl font-semibold text-lg hover:text-white transition-all duration-500 relative overflow-hidden group"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.25) 0%, rgba(255, 217, 61, 0.25) 100%)',
                          border: '1px solid rgba(255, 140, 66, 0.4)',
                          boxShadow: '0 4px 15px rgba(255, 140, 66, 0.2)',
                          color: '#FF8C42',
                        }}
                      >
                        <span className="relative z-10 flex items-center space-x-3">
                          <span className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-125"></span>
                          <span style={{
                            color: '#FF8C42',
                            fontWeight: 'bold'
                          }}>{t(item.key)}</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-red-400 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl transform scale-x-0 group-hover:scale-x-100 origin-left"></div>
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      delay: 0.3 + navigationItems.length * 0.08
                    }}
                    className="pt-6 mt-4 border-t border-gradient-to-r from-orange-100 to-yellow-100"
                    style={{
                      borderTop: '1px solid rgba(255, 140, 66, 0.18)'
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={handleReservationClick}
                        sx={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 50%, #FF6B6B 100%)',
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1.125rem',
                          boxShadow: '0 8px 25px rgba(255, 140, 66, 0.5)',
                          border: '2px solid rgba(255, 140, 66, 0.6)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFD93D 100%)',
                            boxShadow: '0 12px 35px rgba(255, 140, 66, 0.6)',
                            transform: 'scale(1.05) translateY(-2px)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                            transition: 'left 0.5s',
                          },
                          '&:hover::before': {
                            left: '100%',
                          },
                        }}
                      >
                        {t('reservation')}
                      </Button>
                    </motion.div>
                  </motion.div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </AppBar>
    </motion.div>
  );
}