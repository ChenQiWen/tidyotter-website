import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, IconButton } from '@mui/material';
import { Close, CheckCircle, Error, Info } from '@mui/icons-material';

interface ToastProps {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | null;
  onClose: () => void;
  autoHideDuration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  message,
  type,
  onClose,
  autoHideDuration = 5000,
}) => {
  React.useEffect(() => {
    if (open && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'info':
      default:
        return <Info />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.15) 0%, rgba(255, 217, 61, 0.1) 100%)',
          borderColor: '#FF8C42',
          iconColor: '#FF8C42',
          textColor: '#996633',
          shadowColor: 'rgba(255, 140, 66, 0.3)',
        };
      case 'error':
        return {
          background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(255, 140, 66, 0.1) 100%)',
          borderColor: '#f44336',
          iconColor: '#f44336',
          textColor: '#d32f2f',
          shadowColor: 'rgba(244, 67, 54, 0.3)',
        };
      case 'info':
      default:
        return {
          background: 'linear-gradient(135deg, rgba(255, 217, 61, 0.15) 0%, rgba(255, 140, 66, 0.1) 100%)',
          borderColor: '#FFD93D',
          iconColor: '#FFD93D',
          textColor: '#996633',
          shadowColor: 'rgba(255, 217, 61, 0.3)',
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {open && message && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.5
          }}
          className="fixed top-4 right-4 z-[9999] max-w-md"
        >
          <div
            className="rounded-2xl border-2 backdrop-blur-lg shadow-2xl"
            style={{
              background: colors.background,
              borderColor: colors.borderColor,
              boxShadow: `0 12px 30px ${colors.shadowColor}, 0 6px 20px rgba(0, 0, 0, 0.1)`,
            }}
          >
            <div className="flex items-center p-4">
              <div 
                className="flex-shrink-0 mr-3"
                style={{ color: colors.iconColor }}
              >
                {getIcon()}
              </div>
              <div 
                className="flex-1 text-sm font-medium"
                style={{ color: colors.textColor }}
              >
                {message}
              </div>
              <IconButton
                size="small"
                onClick={onClose}
                className="ml-2 flex-shrink-0"
                sx={{
                  color: colors.iconColor,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </div>
            
            {/* 进度条 */}
            {autoHideDuration > 0 && (
              <motion.div
                className="h-1 rounded-b-2xl"
                style={{ backgroundColor: colors.borderColor }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: autoHideDuration / 1000, ease: 'linear' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;