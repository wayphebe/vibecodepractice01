'use client';

import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { TaskBoard } from '@/components/task/TaskBoard';
import { EnergyBoard } from '@/components/energy/EnergyBoard';
import { TaskForm } from '@/components/task/TaskForm';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { Tabs } from '@/components/ui/Tabs';

type ActiveTab = 'dashboard' | 'tasks' | 'energy';

const tabs = [
  { id: 'dashboard', label: '概览' },
  { id: 'tasks', label: '任务看板' },
  { id: 'energy', label: '能量看板' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

  const { addTask } = useTaskStore();

  const handleTaskSubmit = (data: any) => {
    addTask(data);
    setShowTaskForm(false);
  };

  return (
    <main className="min-h-screen bg-surface-background">
      <div className="container mx-auto px-4 py-8">
        {/* 导航栏 */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as ActiveTab)}
          className="mb-8"
        />

        {/* 任务表单 */}
        {showTaskForm && (
          <div className="mb-8">
            <TaskForm
              onSubmit={handleTaskSubmit}
              onCancel={() => setShowTaskForm(false)}
            />
          </div>
        )}

        {/* 内容区域 */}
        {activeTab === 'dashboard' && (
          <DashboardView
            onCreateTask={() => setShowTaskForm(true)}
            timeRange={timeRange}
          />
        )}
        {activeTab === 'tasks' && (
          <TaskBoard
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        )}
        {activeTab === 'energy' && (
          <EnergyBoard
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        )}
      </div>
    </main>
  );
}
