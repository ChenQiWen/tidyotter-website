'use client';

import React from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { cn } from '@/utils';

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'outlined',
      type = 'text',
      startIcon,
      endIcon,
      showPasswordToggle = false,
      InputProps,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    const startAdornment = startIcon ? (
      <InputAdornment position="start">
        <span className="flex items-center text-gray-500">{startIcon}</span>
      </InputAdornment>
    ) : undefined;

    const endAdornment = (
      <InputAdornment position="end">
        <div className="flex items-center space-x-1">
          {endIcon && (
            <span className="flex items-center text-gray-500">{endIcon}</span>
          )}
          {isPasswordField && showPasswordToggle && (
            <IconButton
              onClick={handleTogglePassword}
              edge="end"
              size="small"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          )}
        </div>
      </InputAdornment>
    );

    return (
      <TextField
        ref={ref}
        type={inputType}
        variant={variant}
        className={cn(
          'w-full',
          {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgb(209 213 219)', // gray-300
              },
              '&:hover fieldset': {
                borderColor: 'rgb(156 163 175)', // gray-400
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(59 130 246)', // blue-500
                borderWidth: '2px',
              },
              '&.Mui-error fieldset': {
                borderColor: 'rgb(239 68 68)', // red-500
              },
            },
          },
          className
        )}
        InputProps={{
          startAdornment,
          endAdornment: (startIcon || endIcon || (isPasswordField && showPasswordToggle)) ? endAdornment : undefined,
          className: cn(
            'transition-all duration-200',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-500 dark:placeholder:text-gray-400'
          ),
          ...InputProps,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };