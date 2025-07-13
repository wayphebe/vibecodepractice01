import React from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TaskCategory, TaskPriority } from '../../store/todoStore';

interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedDuration: number;
  dueDate?: string;
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
}

const categoryOptions = [
  { value: 'work', label: '工作' },
  { value: 'study', label: '学习' },
  { value: 'life', label: '生活' },
  { value: 'health', label: '健康' },
  { value: 'social', label: '社交' }
];

const priorityOptions = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
];

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
    defaultValues: {
      category: 'work',
      priority: 'medium',
      estimatedDuration: 60
    }
  });

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">创建新任务</h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务标题 *
          </label>
          <input
            type="text"
            {...register('title', { required: '请输入任务标题' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入任务标题"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            任务描述
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="描述任务详情"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              任务类别 *
            </label>
            <select
              {...register('category', { required: '请选择任务类别' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              优先级 *
            </label>
            <select
              {...register('priority', { required: '请选择优先级' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预估时长 (分钟) *
            </label>
            <input
              type="number"
              {...register('estimatedDuration', { 
                required: '请输入预估时长',
                min: { value: 1, message: '时长必须大于0' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60"
            />
            {errors.estimatedDuration && (
              <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              截止日期
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button type="submit">
            创建任务
          </Button>
        </div>
      </form>
    </Card>
  );
}; 