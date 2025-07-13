import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export const Card: React.FC<CardProps> = ({
  className,
  interactive = false,
  priority,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        // Base styles
        'rounded-card bg-surface-card p-4 shadow-card transition-shadow',
        
        // Interactive styles
        {
          'cursor-pointer hover:shadow-card-hover hover:translate-y-[-1px] transition-transform': 
            interactive,
          
          // Priority border styles
          'border-l-4 border-priority-high': priority === 'high',
          'border-l-4 border-priority-medium': priority === 'medium',
          'border-l-4 border-priority-low': priority === 'low',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 