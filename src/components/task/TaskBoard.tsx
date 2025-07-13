import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task, TaskFormData, TaskCompletionData } from '@/types/task';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskCompletionForm } from './TaskCompletionForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';

interface TaskBoardProps {
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}

const timeRangeTabs = [
  { id: 'day', label: '今日' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' },
  { id: 'year', label: '今年' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({
  timeRange,
  onTimeRangeChange,
}) => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    cancelTask,
    getTaskStats,
  } = useTaskStore();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = getTaskStats(timeRange);

  const handleTaskSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      addTask(data);
    }
    setShowTaskForm(false);
  };

  const handleTaskComplete = (task: Task) => {
    setSelectedTask(task);
    setShowCompletionForm(true);
  };

  const handleCompletionSubmit = (data: TaskCompletionData) => {
    if (selectedTask) {
      completeTask(selectedTask.id, data);
      setSelectedTask(null);
      setShowCompletionForm(false);
    }
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const inProgressTasks = tasks.filter((task) => task.status === 'in_progress');
  const completedTasks = tasks.filter((task) => task.status === 'completed');

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">任务看板</h2>
        <Tabs
          tabs={timeRangeTabs}
          activeTab={timeRange}
          onChange={(id) => onTimeRangeChange(id as 'day' | 'week' | 'month' | 'year')}
        />
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">
            {stats.totalTasks}
          </div>
          <div className="text-sm text-text-secondary">总任务数</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-success">
            {stats.completedTasks}
          </div>
          <div className="text-sm text-text-secondary">已完成</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-info">
            {(stats.completionRate * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-text-secondary">完成率</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-warning">
            {stats.averageEnergyImpact.toFixed(1)}
          </div>
          <div className="text-sm text-text-secondary">平均能量影响</div>
        </Card>
      </div>

      {/* 任务表单 */}
      {showTaskForm && (
        <div className="mb-6">
          <TaskForm
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            initialData={editingTask || undefined}
          />
        </div>
      )}

      {/* 完成表单 */}
      {showCompletionForm && selectedTask && (
        <div className="mb-6">
          <TaskCompletionForm
            onSubmit={handleCompletionSubmit}
            onCancel={() => {
              setShowCompletionForm(false);
              setSelectedTask(null);
            }}
            estimatedDuration={selectedTask.estimatedDuration}
          />
        </div>
      )}

      {/* 任务列表 */}
      <div className="grid grid-cols-3 gap-6">
        {/* 待开始 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-text-primary">待开始</h3>
            <Button size="sm" onClick={() => setShowTaskForm(true)}>
              新建任务
            </Button>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStart={() => startTask(task.id)}
                onCancel={() => cancelTask(task.id)}
                onEdit={() => handleTaskEdit(task)}
              />
            ))}
          </div>
        </div>

        {/* 进行中 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">进行中</h3>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => handleTaskComplete(task)}
                onCancel={() => cancelTask(task.id)}
                onEdit={() => handleTaskEdit(task)}
              />
            ))}
          </div>
        </div>

        {/* 已完成 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">已完成</h3>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => handleTaskEdit(task)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 