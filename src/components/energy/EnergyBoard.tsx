import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskReflectionData } from '@/types/task';
import { EnergyReflectionForm } from './EnergyReflectionForm';
import { TaskCard } from '../task/TaskCard';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

interface EnergyBoardProps {
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}

const timeRangeTabs = [
  { id: 'day', label: '今日' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' },
  { id: 'year', label: '今年' },
];

const categoryLabels: Record<string, string> = {
  work: '工作',
  study: '学习',
  life: '生活',
  health: '健康',
  social: '社交',
};

export const EnergyBoard: React.FC<EnergyBoardProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  const { tasks, addReflection, getTaskStats } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const stats = getTaskStats(timeRange);

  const tasksForReview = tasks.filter(
    (task) =>
      task.status === 'completed' &&
      !task.energyImpact &&
      !task.moodImpact &&
      !task.focusLevel
  );

  const completedTasks = tasks.filter(
    (task) =>
      task.status === 'completed' &&
      task.energyImpact !== undefined &&
      task.moodImpact !== undefined &&
      task.focusLevel !== undefined
  );

  const handleReflectionSubmit = (data: TaskReflectionData) => {
    if (selectedTask) {
      addReflection(selectedTask.id, data);
      setSelectedTask(null);
    }
  };

  const getEnergyColor = (value: number) => {
    if (value > 3) return 'text-energy-very-positive';
    if (value > 0) return 'text-energy-positive';
    if (value < -3) return 'text-energy-very-negative';
    if (value < 0) return 'text-energy-negative';
    return 'text-energy-neutral';
  };

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">能量看板</h2>
        <Tabs
          tabs={timeRangeTabs}
          activeTab={timeRange}
          onChange={(id) => onTimeRangeChange(id as 'day' | 'week' | 'month' | 'year')}
        />
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className={`text-2xl font-bold ${getEnergyColor(stats.averageEnergyImpact)}`}>
            {stats.averageEnergyImpact > 0 ? '+' : ''}
            {stats.averageEnergyImpact.toFixed(1)}
          </div>
          <div className="text-sm text-text-secondary">平均能量影响</div>
        </Card>
        <Card className="p-4">
          <div className={`text-2xl font-bold ${getEnergyColor(stats.averageMoodImpact)}`}>
            {stats.averageMoodImpact > 0 ? '+' : ''}
            {stats.averageMoodImpact.toFixed(1)}
          </div>
          <div className="text-sm text-text-secondary">平均心情影响</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {stats.averageFocusLevel.toFixed(1)}/5
          </div>
          <div className="text-sm text-text-secondary">平均专注度</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-info">
            {tasksForReview.length}
          </div>
          <div className="text-sm text-text-secondary">待复盘任务</div>
        </Card>
      </div>

      {/* 分类统计 */}
      <div className="grid grid-cols-2 gap-6">
        {/* 能量影响分布 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            各类别能量影响
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.tasksByCategory).map(([category, count]) => {
              const categoryTasks = completedTasks.filter(
                (task) => task.category === category
              );
              const avgEnergyImpact =
                categoryTasks.reduce(
                  (sum, task) => sum + (task.energyImpact || 0),
                  0
                ) / (categoryTasks.length || 1);

              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="info">{categoryLabels[category]}</Badge>
                    <span className="text-sm text-text-secondary">
                      ({count}个任务)
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getEnergyColor(
                      avgEnergyImpact
                    )}`}
                  >
                    {avgEnergyImpact > 0 ? '+' : ''}
                    {avgEnergyImpact.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 心情影响分布 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            各类别心情影响
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.tasksByCategory).map(([category, count]) => {
              const categoryTasks = completedTasks.filter(
                (task) => task.category === category
              );
              const avgMoodImpact =
                categoryTasks.reduce(
                  (sum, task) => sum + (task.moodImpact || 0),
                  0
                ) / (categoryTasks.length || 1);

              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="info">{categoryLabels[category]}</Badge>
                    <span className="text-sm text-text-secondary">
                      ({count}个任务)
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${getEnergyColor(
                      avgMoodImpact
                    )}`}
                  >
                    {avgMoodImpact > 0 ? '+' : ''}
                    {avgMoodImpact.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 待复盘任务 */}
      {selectedTask ? (
        <EnergyReflectionForm
          taskTitle={selectedTask.title}
          taskCategory={categoryLabels[selectedTask.category]}
          onSubmit={handleReflectionSubmit}
          onCancel={() => setSelectedTask(null)}
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">待复盘任务</h3>
          <div className="grid grid-cols-2 gap-4">
            {tasksForReview.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setSelectedTask(task)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 已复盘任务 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">已复盘任务</h3>
        <div className="grid grid-cols-2 gap-4">
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setSelectedTask(task)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 