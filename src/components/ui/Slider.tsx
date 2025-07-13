import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({
  className,
  label,
  error,
  min = 0,
  max = 100,
  step = 1,
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
        type="range"
        ref={ref}
        min={min}
        max={max}
        step={step}
        className={cn(
          'w-full h-2 bg-surface-background rounded-lg appearance-none cursor-pointer',
          'range-slider:h-2 range-slider:rounded-lg range-slider:bg-primary/20',
          'range-thumb:appearance-none range-thumb:w-4 range-thumb:h-4',
          'range-thumb:rounded-full range-thumb:bg-primary',
          'range-thumb:cursor-pointer range-thumb:transition-colors',
          'range-thumb:hover:bg-primary/90',
          'disabled:opacity-50 disabled:cursor-not-allowed',
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