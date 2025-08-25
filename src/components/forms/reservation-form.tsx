'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  CircularProgress,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  InputAdornment,
  Slide,
  Zoom,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Email, Person, Phone } from '@/components/icons';
import { Input, Card } from '@/components/ui';
import { useForm } from '@/hooks';
import { isValidEmail, isValidPhone } from '@/utils';

import type { ReservationFormData, ApiResponse } from '@/types';

export interface ReservationFormProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: (data: ReservationFormData) => void;
  variant?: 'modal' | 'inline';
  className?: string;
}

const initialValues: ReservationFormData = {
  email: '',
  name: '',
  phone: '',
};

const validateForm = (values: ReservationFormData) => {
  const errors: Partial<Record<keyof ReservationFormData, string>> = {};

  // Email validation
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Name validation
  if (!values.name) {
    errors.name = 'Name is required';
  } else if (values.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Phone validation (optional but must be valid if provided)
  if (values.phone && !isValidPhone(values.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return errors;
};

export function ReservationForm({
  open = false,
  onClose,
  onSuccess,
  variant = 'modal',
  className,
}: ReservationFormProps) {
  const t = useTranslations('reservation');
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    isValid,
  } = useForm(initialValues, validateForm);

  const submitReservation = async (formData: ReservationFormData) => {
    try {
      setSubmitStatus({ type: null, message: '' });

      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit reservation');
      }

      // Success
      setSubmitStatus({
        type: 'success',
        message: t('success_message'),
      });



      // Call success callback
      onSuccess?.(formData);

      // Reset form after delay
      setTimeout(() => {
        reset();
        setSubmitStatus({ type: null, message: '' });
        if (variant === 'modal') {
          onClose?.();
        }
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage,
      });


    }
  };

  const handleFieldChange = (field: keyof ReservationFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(field, event.target.value);
  };

  const handleFieldBlur = (field: keyof ReservationFormData) => () => {
    setFieldTouched(field, true);
  };

  // Move hooks to top level to comply with Rules of Hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formContent = (
    <form onSubmit={handleSubmit(submitReservation)} className="space-y-6">
      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus.message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity={submitStatus.type || 'info'} 
              className="mb-4"
              onClose={() => setSubmitStatus({ type: null, message: '' })}
              sx={{
                borderRadius: '12px',
                border: '2px solid',
                borderColor: submitStatus.type === 'success' ? '#FF8C42' : submitStatus.type === 'error' ? '#f44336' : '#FFD93D',
                background: submitStatus.type === 'success' 
                  ? 'linear-gradient(135deg, rgba(255, 140, 66, 0.15) 0%, rgba(255, 217, 61, 0.1) 100%)' 
                  : submitStatus.type === 'error' 
                  ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(255, 140, 66, 0.1) 100%)' 
                  : 'linear-gradient(135deg, rgba(255, 217, 61, 0.15) 0%, rgba(255, 140, 66, 0.1) 100%)',
                backdropFilter: 'blur(8px)',
                boxShadow: submitStatus.type === 'success' 
                  ? '0 8px 25px rgba(255, 140, 66, 0.2)' 
                  : submitStatus.type === 'error' 
                  ? '0 8px 25px rgba(244, 67, 54, 0.2)' 
                  : '0 8px 25px rgba(255, 217, 61, 0.2)',
                '& .MuiAlert-icon': {
                  color: submitStatus.type === 'success' ? '#FF8C42' : submitStatus.type === 'error' ? '#f44336' : '#FFD93D',
                },
                '& .MuiAlert-message': {
                  color: submitStatus.type === 'success' ? '#996633' : submitStatus.type === 'error' ? '#d32f2f' : '#996633',
                  fontWeight: 500,
                },
                '& .MuiAlert-action': {
                  '& .MuiIconButton-root': {
                    color: submitStatus.type === 'success' ? '#FF8C42' : submitStatus.type === 'error' ? '#f44336' : '#FFD93D',
                  },
                },
              }}
            >
              {submitStatus.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Input
        label={t('form.email.label')}
        placeholder={t('form.email.placeholder')}
        type="email"
        value={values.email}
        onChange={handleFieldChange('email')}
        onBlur={handleFieldBlur('email')}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
        required
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            minHeight: '72px',
            backgroundColor: 'rgba(255, 248, 240, 0.8)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: '#FFE4CC',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#FF8C42',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF8C42',
              borderWidth: '2px',
              boxShadow: '0 0 0 3px rgba(255, 140, 66, 0.1)',
            },
            '&.Mui-error fieldset': {
              borderColor: '#f44336',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#996633',
            fontWeight: 600,
            fontSize: '1.2rem',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            '&.Mui-focused': {
              color: '#FF8C42',
            },
          },
          '& .MuiInputBase-input': {
            color: '#663311',
            fontWeight: 500,
            fontSize: '1.1rem',
            padding: '20px 16px 20px 56px', // 增加左侧padding为图标留出空间
          },
        }}
        />
      </motion.div>

      {/* Name Field */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Input
        label={t('form.name.label')}
        placeholder={t('form.name.placeholder')}
        value={values.name}
        onChange={handleFieldChange('name')}
        onBlur={handleFieldBlur('name')}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
        required
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            minHeight: '72px',
            backgroundColor: 'rgba(255, 248, 240, 0.8)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: '#FFE4CC',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#FF8C42',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF8C42',
              borderWidth: '2px',
              boxShadow: '0 0 0 3px rgba(255, 140, 66, 0.1)',
            },
            '&.Mui-error fieldset': {
              borderColor: '#f44336',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#996633',
            fontWeight: 600,
            fontSize: '1.2rem',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            '&.Mui-focused': {
              color: '#FF8C42',
            },
          },
          '& .MuiInputBase-input': {
            color: '#663311',
            fontWeight: 500,
            fontSize: '1.1rem',
            padding: '20px 16px 20px 56px', // 增加左侧padding为图标留出空间
          },
        }}
        />
      </motion.div>

      {/* Phone Field */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Input
        label={t('form.phone.label')}
        placeholder={t('form.phone.placeholder')}
        type="tel"
        value={values.phone}
        onChange={handleFieldChange('phone')}
        onBlur={handleFieldBlur('phone')}
        error={touched.phone && Boolean(errors.phone)}
        helperText={touched.phone && errors.phone}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone />
            </InputAdornment>
          ),
        }}
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            minHeight: '72px',
            backgroundColor: 'rgba(255, 248, 240, 0.8)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: '#FFE4CC',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#FF8C42',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FF8C42',
              borderWidth: '2px',
              boxShadow: '0 0 0 3px rgba(255, 140, 66, 0.1)',
            },
            '&.Mui-error fieldset': {
              borderColor: '#f44336',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#996633',
            fontWeight: 600,
            fontSize: '1.2rem',
            overflow: 'visible',
            whiteSpace: 'nowrap',
            '&.Mui-focused': {
              color: '#FF8C42',
            },
          },
          '& .MuiInputBase-input': {
            color: '#663311',
            fontWeight: 500,
            fontSize: '1.1rem',
            padding: '20px 16px 20px 56px', // 增加左侧padding为图标留出空间
          },
        }}
        />
      </motion.div>



      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={!isValid || isSubmitting || submitStatus.type === 'success'}
        className="w-full"
        sx={{
          background: `
            linear-gradient(135deg, 
              #FF8C42 0%, 
              #FFB366 25%, 
              #FFD93D 50%, 
              #FFB366 75%, 
              #FF8C42 100%
            )
          `,
          backgroundSize: '200% 100%',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          padding: '14px 32px',
          borderRadius: '50px',
          textTransform: 'none',
          boxShadow: `
            0 12px 30px rgba(255, 140, 66, 0.4),
            0 6px 20px rgba(255, 217, 61, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          border: '2px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'gradientShift 6s ease-in-out infinite',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            transition: 'left 0.6s ease',
            zIndex: 1,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '0',
            height: '0',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.4s ease',
            zIndex: 0,
          },
          '&:hover': {
            background: `
              linear-gradient(135deg, 
                #E6732A 0%, 
                #FF9A4D 25%, 
                #E6C42A 50%, 
                #FF9A4D 75%, 
                #E6732A 100%
              )
            `,
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: `
              0 16px 40px rgba(255, 140, 66, 0.5),
              0 8px 25px rgba(255, 217, 61, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1)
            `,
            '&::before': {
              left: '100%',
            },
            '&::after': {
              width: '100%',
              height: '100%',
            },
          },
          '&:active': {
            transform: 'translateY(-1px) scale(0.98)',
          },
          '&:disabled': {
            background: 'linear-gradient(135deg, #CCCCCC 0%, #E0E0E0 100%)',
            color: '#999999',
            transform: 'none',
            boxShadow: 'none',
            animation: 'none',
          },
          '@keyframes gradientShift': {
            '0%, 100%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
          },
        }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} className="mr-2" sx={{ color: 'white' }} />
            {t('form.submitting')}
          </>
        ) : (
          t('form.submit')
        )}
        </Button>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Typography
        variant="caption"
        className="text-gray-600 dark:text-gray-400 text-center block"
        >
          {t('form.privacy_notice')}
        </Typography>
      </motion.div>
    </form>
  );

  if (variant === 'modal') {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        TransitionComponent={isMobile ? Slide : Zoom}
        TransitionProps={{
          timeout: {
            enter: 600,
            exit: 400,
          },
          ...(isMobile && { direction: 'up' }),
        }}
        PaperProps={{
          component: motion.div,
          initial: { scale: 0.8, opacity: 0, y: 50, rotateX: 15 },
          animate: { scale: 1, opacity: 1, y: 0, rotateX: 0 },
          exit: { scale: 0.8, opacity: 0, y: 50, rotateX: 15 },
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6
          },
          className: isMobile ? 'rounded-none' : 'rounded-3xl',
          sx: {
            margin: isMobile ? 0 : 2,
            maxHeight: isMobile ? '100vh' : '90vh',
            background: `
              radial-gradient(circle at 20% 20%, rgba(255, 140, 66, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 217, 61, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, 
                rgba(255, 248, 240, 0.95) 0%, 
                rgba(255, 240, 220, 0.98) 25%,
                rgba(255, 235, 200, 0.95) 50%,
                rgba(255, 240, 220, 0.98) 75%,
                rgba(255, 248, 240, 0.95) 100%
              )
            `,
            border: '3px solid transparent',
            backgroundClip: 'padding-box',
            boxShadow: `
              0 32px 64px -12px rgba(255, 140, 66, 0.3),
              0 20px 40px -8px rgba(255, 217, 61, 0.2),
              0 8px 32px rgba(255, 140, 66, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              inset 0 -1px 0 rgba(255, 140, 66, 0.1)
            `,
            backdropFilter: 'blur(24px) saturate(1.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: `
                linear-gradient(90deg, 
                  #FF8C42 0%, 
                  #FFB366 25%, 
                  #FFD93D 50%, 
                  #FFB366 75%, 
                  #FF8C42 100%
                )
              `,
              zIndex: 1,
              animation: 'shimmer 4s ease-in-out infinite',
              borderRadius: isMobile ? '0' : '24px 24px 0 0',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              background: `
                linear-gradient(135deg, 
                  #FF8C42 0%, 
                  #FFB366 25%, 
                  #FFD93D 50%, 
                  #FFB366 75%, 
                  #FF8C42 100%
                )
              `,
              borderRadius: 'inherit',
              zIndex: -1,
              opacity: 0.8,
            },
            '@keyframes shimmer': {
              '0%, 100%': {
                backgroundPosition: '0% 50%',
                backgroundSize: '200% 100%',
              },
              '50%': {
                backgroundPosition: '100% 50%',
                backgroundSize: '200% 100%',
              },
            },
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: isMobile ? 'flex-start' : 'center',
          },
          '& .MuiBackdrop-root': {
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 140, 66, 0.25) 0%, transparent 70%),
              radial-gradient(circle at 70% 70%, rgba(255, 217, 61, 0.2) 0%, transparent 70%),
              linear-gradient(135deg, 
                rgba(255, 140, 66, 0.1) 0%, 
                rgba(255, 217, 61, 0.08) 50%, 
                rgba(255, 140, 66, 0.1) 100%
              )
            `,
            backdropFilter: 'blur(16px) saturate(1.3)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        }}
      >
        <DialogTitle className="text-center relative z-10" sx={{ pb: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Typography 
              component="div" 
              className="font-bold text-3xl mb-2"
              sx={{
                color: '#FF8C42',
                textShadow: '0 2px 4px rgba(255, 140, 66, 0.2)',
                position: 'relative',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  background: '#FF8C42',
                  borderRadius: '2px',
                  opacity: 0.8,
                },
              }}
            >
              {t('title')}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Typography 
              variant="body1" 
              sx={{
                color: '#996633',
                fontWeight: 500,
                opacity: 0.9,
                mt: 2,
              }}
            >
              {t('subtitle')}
            </Typography>
          </motion.div>
        </DialogTitle>
        
        <DialogContent className="px-6 pb-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {formContent}
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className={className} sx={{ padding: 3 }}>
      <div className="text-center mb-6">
        <Typography component="h2" className="font-bold text-gray-900 dark:text-white mb-2 text-xl">
          {t('title')}
        </Typography>
        <Typography variant="body2" className="text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </Typography>
      </div>
      {formContent}
    </Card>
  );
}