'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Email, Person, Phone, Message } from '@mui/icons-material';
import { Button, Input, Card } from '@/components/ui';
import { useForm } from '@/hooks';
import { isValidEmail, isValidPhone } from '@/utils';
import { trackingEvents } from '@/lib/analytics';
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
  message: '',
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

  // Message validation (optional but has length limit)
  if (values.message && values.message.length > 500) {
    errors.message = 'Message must be less than 500 characters';
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

      // Track successful submission
      trackingEvents.submitReservation(true);

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

      // Track failed submission
      trackingEvents.submitReservation(false);
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
      {/* Status Alert */}
      {submitStatus.type && (
        <Alert
          severity={submitStatus.type}
          className="mb-4"
        >
          {submitStatus.message}
        </Alert>
      )}

      {/* Email Field */}
      <Input
        label={t('form.email.label')}
        placeholder={t('form.email.placeholder')}
        type="email"
        value={values.email}
        onChange={handleFieldChange('email')}
        onBlur={handleFieldBlur('email')}
        error={touched.email && Boolean(errors.email)}
        helperText={touched.email && errors.email}
        startIcon={<Email />}
        required
        fullWidth
      />

      {/* Name Field */}
      <Input
        label={t('form.name.label')}
        placeholder={t('form.name.placeholder')}
        value={values.name}
        onChange={handleFieldChange('name')}
        onBlur={handleFieldBlur('name')}
        error={touched.name && Boolean(errors.name)}
        helperText={touched.name && errors.name}
        startIcon={<Person />}
        required
        fullWidth
      />

      {/* Phone Field */}
      <Input
        label={t('form.phone.label')}
        placeholder={t('form.phone.placeholder')}
        type="tel"
        value={values.phone}
        onChange={handleFieldChange('phone')}
        onBlur={handleFieldBlur('phone')}
        error={touched.phone && Boolean(errors.phone)}
        helperText={touched.phone && errors.phone}
        startIcon={<Phone />}
        fullWidth
      />

      {/* Message Field */}
      <Input
        label={t('form.message.label')}
        placeholder={t('form.message.placeholder')}
        multiline
        rows={4}
        value={values.message}
        onChange={handleFieldChange('message')}
        onBlur={handleFieldBlur('message')}
        error={touched.message && Boolean(errors.message)}
        helperText={touched.message && errors.message}
        startIcon={<Message />}
        fullWidth
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={!isValid || isSubmitting || submitStatus.type === 'success'}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <CircularProgress size={20} className="mr-2" />
            {t('form.submitting')}
          </>
        ) : (
          t('form.submit')
        )}
      </Button>

      {/* Privacy Notice */}
      <Typography
        variant="caption"
        className="text-gray-600 dark:text-gray-400 text-center block"
      >
        {t('form.privacy_notice')}
      </Typography>
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
        PaperProps={{
          className: isMobile ? 'rounded-none' : 'rounded-2xl',
          sx: {
            margin: isMobile ? 0 : 2,
            maxHeight: isMobile ? '100vh' : '90vh',
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: isMobile ? 'flex-start' : 'center',
          },
        }}
      >
        <DialogTitle className="text-center">
          <Typography component="div" className="font-bold text-gray-900 dark:text-white text-xl">
            {t('title')}
          </Typography>
          <Typography variant="body2" className="text-gray-600 dark:text-gray-400 mt-2">
            {t('subtitle')}
          </Typography>
        </DialogTitle>
        
        <DialogContent className="px-6 pb-6">
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className={className} padding="large">
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