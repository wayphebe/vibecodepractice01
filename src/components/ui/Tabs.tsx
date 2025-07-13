import React from 'react';
import { cn } from '@/lib/utils';

export interface Tab {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex space-x-1 p-1 bg-surface-background rounded-lg',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'hover:text-text-primary hover:bg-surface-card/60',
            {
              'bg-surface-card text-primary shadow-sm': activeTab === tab.id,
              'text-text-secondary': activeTab !== tab.id,
            }
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}; 