import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
        'disabled:pointer-events-none disabled:opacity-50',
        
        // Variants
        {
          // Primary variant
          'bg-primary text-white hover:bg-primary/90 active:bg-primary/80': 
            variant === 'primary',
          
          // Secondary variant
          'bg-white text-text-primary border border-border-subtle hover:bg-surface-background active:bg-border-subtle': 
            variant === 'secondary',
          
          // Destructive variant
          'bg-danger text-white hover:bg-danger/90 active:bg-danger/80': 
            variant === 'destructive',
          
          // Ghost variant
          'text-text-primary hover:bg-surface-background active:bg-border-subtle': 
            variant === 'ghost',
          
          // Sizes
          'h-8 px-3 text-sm rounded-btn': size === 'sm',
          'h-10 px-4 text-base rounded-btn': size === 'md',
          'h-12 px-6 text-base rounded-btn': size === 'lg',
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}; 