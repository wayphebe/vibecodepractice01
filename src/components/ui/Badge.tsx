import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'info',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center rounded-full px-2 py-0.5 text-caption font-medium',
        
        // Variants
        {
          'bg-success/10 text-success': variant === 'success',
          'bg-warning/10 text-warning': variant === 'warning',
          'bg-danger/10 text-danger': variant === 'danger',
          'bg-info/10 text-info': variant === 'info',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}; 