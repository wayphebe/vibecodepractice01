import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Task, TaskStatus, useTodoStore } from '../../store/todoStore';

interface TaskBoardProps {
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}

const statusLabels = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const priorityColors = {
  low: 'border-l-gray-400',
  medium: 'border-l-yellow-400',
  high: 'border-l-red-400'
};

const categoryLabels = {
  work: '工作',
  study: '学习',
  life: '生活',
  health: '健康',
  social: '社交'
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onEdit }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <Card className={`p-4 border-l-4 ${priorityColors[task.priority]} ${isOverdue ? 'border-red-200' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-2">
          <span className="bg-gray-100 px-2 py-1 rounded">
            {categoryLabels[task.category]}
          </span>
          <span>{formatDuration(task.estimatedDuration)}</span>
        </div>
        {task.dueDate && (
          <span className={isOverdue ? 'text-red-600' : ''}>
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        {task.status === 'pending' && (
          <Button 
            size="sm" 
            onClick={() => onStatusChange(task.id, 'in_progress')}
          >
            开始
          </Button>
        )}
        {task.status === 'in_progress' && (
          <Button 
            size="sm" 
            onClick={() => onStatusChange(task.id, 'completed')}
          >
            完成
          </Button>
        )}
        {task.status !== 'completed' && (
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onStatusChange(task.id, 'cancelled')}
          >
            取消
          </Button>
        )}
        {onEdit && (
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => onEdit(task)}
          >
            编辑
          </Button>
        )}
      </div>
    </Card>
  );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ timeRange, onTimeRangeChange }) => {
  const { tasks, updateTask, getTaskStats } = useTodoStore();
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all');
  
  const stats = getTaskStats(timeRange);
  
  const filteredTasks = tasks.filter(task => {
    if (selectedStatus === 'all') return true;
    return task.status === selectedStatus;
  });

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updates: Partial<Task> = { status: newStatus };
    if (newStatus === 'completed') {
      updates.completedAt = new Date();
    }
    updateTask(taskId, updates);
  };

  const timeRangeLabels = {
    day: '今日',
    week: '本周',
    month: '本月',
    year: '今年'
  };

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">任务看板</h2>
        <div className="flex space-x-2">
          {Object.entries(timeRangeLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={timeRange === key ? 'primary' : 'secondary'}
              onClick={() => onTimeRangeChange(key as 'day' | 'week' | 'month' | 'year')}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.totalTasks}</div>
          <div className="text-sm text-gray-600">总任务数</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
          <div className="text-sm text-gray-600">已完成</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {(stats.completionRate * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">完成率</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {stats.averageEnergyImpact.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">平均能量影响</div>
        </Card>
      </div>

      {/* 状态筛选 */}
      <div className="flex space-x-2">
        <Button
          variant={selectedStatus === 'all' ? 'primary' : 'secondary'}
          onClick={() => setSelectedStatus('all')}
        >
          全部
        </Button>
        {Object.entries(statusLabels).map(([status, label]) => (
          <Button
            key={status}
            variant={selectedStatus === status ? 'primary' : 'secondary'}
            onClick={() => setSelectedStatus(status as TaskStatus)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* 任务列表 */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">暂无任务</p>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}; 