import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  error,
  options,
  ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <select
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-danger">{error}</p>
      )}
    </div>
  );
}); 