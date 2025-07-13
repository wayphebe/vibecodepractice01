import React from 'react';
import { Task } from '@/types/task';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TaskCardProps {
  task: Task;
  onStart?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
}

const categoryLabels: Record<string, string> = {
  work: '工作',
  study: '学习',
  life: '生活',
  health: '健康',
  social: '社交',
};

const statusVariants: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
  pending: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'danger',
};

const statusLabels: Record<string, string> = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成',
  cancelled: '已取消',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStart,
  onComplete,
  onCancel,
  onEdit,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}小时${remainingMinutes}分钟`
      : `${hours}小时`;
  };

  return (
    <Card
      priority={task.priority}
      className="relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-text-primary">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <Badge variant={statusVariants[task.status]}>
          {statusLabels[task.status]}
        </Badge>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Badge variant="info">{categoryLabels[task.category]}</Badge>
          <span>•</span>
          <span>预计 {formatDuration(task.estimatedDuration)}</span>
          {task.actualDuration && (
            <>
              <span>•</span>
              <span>实际 {formatDuration(task.actualDuration)}</span>
            </>
          )}
        </div>

        {task.dueDate && (
          <div className="text-sm text-text-secondary">
            截止日期：{formatDate(task.dueDate)}
          </div>
        )}

        {task.completionPercentage !== undefined && (
          <div className="text-sm text-text-secondary">
            完成度：{task.completionPercentage}%
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        {task.status === 'pending' && onStart && (
          <Button size="sm" onClick={onStart}>
            开始
          </Button>
        )}
        {task.status === 'in_progress' && onComplete && (
          <Button size="sm" onClick={onComplete}>
            完成
          </Button>
        )}
        {['pending', 'in_progress'].includes(task.status) && onCancel && (
          <Button size="sm" variant="destructive" onClick={onCancel}>
            取消
          </Button>
        )}
        {onEdit && (
          <Button size="sm" variant="secondary" onClick={onEdit}>
            编辑
          </Button>
        )}
      </div>
    </Card>
  );
}; 