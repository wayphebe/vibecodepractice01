import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full rounded-input border-border-subtle bg-surface-card px-3 py-2',
          'focus:border-primary focus:ring-1 focus:ring-primary/20',
          'disabled:bg-surface-background disabled:text-text-secondary',
          {
            'border-danger focus:border-danger focus:ring-danger/20': error,
          },
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  );
}); 