import { Box, CircularProgress, Typography } from '@mui/material';
import { cn } from '@/utils';

export default function LoadingPage() {
  return (
    <Box
      className={cn(
        'min-h-screen flex flex-col items-center justify-center',
        'bg-gradient-to-br from-primary-50 via-white to-secondary-50',
        'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'
      )}
    >
      {/* 主加载指示器 */}
      <Box className="relative mb-8">
        <CircularProgress
          size={60}
          thickness={4}
          className="text-primary-500"
        />
        
        {/* 内部装饰圆圈 */}
        <Box
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'w-15 h-15 rounded-full',
            'bg-gradient-to-br from-primary-100 to-secondary-100',
            'dark:from-primary-900/30 dark:to-secondary-900/30'
          )}
        >
          <Box
            className={cn(
              'w-6 h-6 rounded-full',
              'bg-gradient-to-br from-primary-400 to-secondary-400',
              'animate-pulse'
            )}
          />
        </Box>
      </Box>
      
      {/* 加载文本 */}
      <Typography
        variant="h6"
        className={cn(
          'text-gray-600 dark:text-gray-300',
          'font-medium mb-2',
          'animate-pulse'
        )}
      >
        FileZen
      </Typography>
      
      <Typography
        variant="body2"
        className="text-gray-500 dark:text-gray-400"
      >
        正在加载...
      </Typography>
      
      {/* 装饰性动画点 */}
      <Box className="flex gap-1 mt-6">
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            className={cn(
              'w-2 h-2 rounded-full',
              'bg-primary-400 dark:bg-primary-500',
              'animate-bounce'
            )}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </Box>
      
      {/* 背景装饰 */}
      <Box
        className={cn(
          'absolute top-20 left-20 w-32 h-32',
          'bg-gradient-to-br from-blue-200 to-purple-200',
          'dark:from-blue-900/20 dark:to-purple-900/20',
          'rounded-full opacity-30 blur-xl',
          'animate-pulse'
        )}
      />
      
      <Box
        className={cn(
          'absolute bottom-20 right-20 w-24 h-24',
          'bg-gradient-to-br from-yellow-200 to-orange-200',
          'dark:from-yellow-900/20 dark:to-orange-900/20',
          'rounded-full opacity-30 blur-xl',
          'animate-pulse'
        )}
        style={{ animationDelay: '0.5s' }}
      />
    </Box>
  );
}