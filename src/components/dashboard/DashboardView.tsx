'use client';

import React, { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { TaskCard } from '@/components/task/TaskCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Task, TaskCategory } from '@/types/task';

interface DashboardStats {
  pendingTasks: Task[];
  inProgressTasks: Task[];
  tasksForReview: Task[];
  taskStats: {
    completedTasks: number;
    averageEnergyImpact: number;
    averageMoodImpact: number;
    averageFocusLevel: number;
    tasksByCategory: Record<TaskCategory, number>;
    totalTasks: number;
  };
}

interface DashboardViewProps {
  onCreateTask: () => void;
  timeRange: 'day' | 'week' | 'month' | 'year';
}

const categoryLabels: Record<string, string> = {
  work: '工作',
  study: '学习',
  life: '生活',
  health: '健康',
  social: '社交',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onCreateTask,
  timeRange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    pendingTasks: [],
    inProgressTasks: [],
    tasksForReview: [],
    taskStats: {
      completedTasks: 0,
      averageEnergyImpact: 0,
      averageMoodImpact: 0,
      averageFocusLevel: 0,
      tasksByCategory: {} as Record<TaskCategory, number>,
      totalTasks: 0,
    }
  });

  const {
    tasks,
    completeTask,
    cancelTask,
    getTaskStats,
  } = useTaskStore();

  useEffect(() => {
    const taskStats = getTaskStats(timeRange);
    const pendingTasks = tasks.filter((task) => task.status === 'pending');
    const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');
    const tasksForReview = tasks.filter(
      (task) =>
        task.status === 'completed' &&
        !task.energyImpact &&
        !task.moodImpact &&
        !task.focusLevel
    );

    setStats({
      pendingTasks,
      inProgressTasks,
      tasksForReview,
      taskStats,
    });
    setIsLoading(false);
  }, [tasks, timeRange, getTaskStats]);

  const getEnergyColor = (value: number) => {
    if (value > 3) return 'text-energy-very-positive';
    if (value > 0) return 'text-energy-positive';
    if (value < -3) return 'text-energy-very-negative';
    if (value < 0) return 'text-energy-negative';
    return 'text-energy-neutral';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-heading-1 text-text-primary">Energy Flow</h1>
        <Button onClick={onCreateTask}>
          创建新任务
        </Button>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {stats.pendingTasks.length}
          </div>
          <div className="text-sm text-text-secondary">待开始</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">
            {stats.inProgressTasks.length}
          </div>
          <div className="text-sm text-text-secondary">进行中</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-success">
            {stats.taskStats.completedTasks}
          </div>
          <div className="text-sm text-text-secondary">已完成</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-info">
            {stats.tasksForReview.length}
          </div>
          <div className="text-sm text-text-secondary">待复盘</div>
        </Card>
      </div>

      {/* 能量状态 */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            本周能量状态
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">平均能量影响</span>
              <span
                className={`font-medium ${getEnergyColor(
                  stats.taskStats.averageEnergyImpact
                )}`}
              >
                {stats.taskStats.averageEnergyImpact > 0 ? '+' : ''}
                {stats.taskStats.averageEnergyImpact.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">平均心情影响</span>
              <span
                className={`font-medium ${getEnergyColor(
                  stats.taskStats.averageMoodImpact
                )}`}
              >
                {stats.taskStats.averageMoodImpact > 0 ? '+' : ''}
                {stats.taskStats.averageMoodImpact.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">平均专注度</span>
              <span className="font-medium text-primary">
                {stats.taskStats.averageFocusLevel.toFixed(1)}/5
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            任务分布
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.taskStats.tasksByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="info">{categoryLabels[category]}</Badge>
                  <span className="text-sm text-text-secondary">
                    ({count}个任务)
                  </span>
                </div>
                <span className="text-sm font-medium text-text-secondary">
                  {((count / stats.taskStats.totalTasks) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 待处理任务 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">进行中的任务</h2>
          <div className="space-y-3">
            {stats.inProgressTasks.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => completeTask(task.id, { completionPercentage: 100, actualDuration: task.estimatedDuration })}
                onCancel={() => cancelTask(task.id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">待复盘任务</h2>
          <div className="space-y-3">
            {stats.tasksForReview.slice(0, 3).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 