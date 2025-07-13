import React from 'react';
import { useForm } from 'react-hook-form';
import { TaskFormData, TaskCategory, TaskPriority } from '@/types/task';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
}

const categoryOptions = [
  { value: 'work', label: '工作' },
  { value: 'study', label: '学习' },
  { value: 'life', label: '生活' },
  { value: 'health', label: '健康' },
  { value: 'social', label: '社交' },
];

const priorityOptions = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'work',
      priority: initialData?.priority || 'medium',
      estimatedDuration: initialData?.estimatedDuration || 30,
      dueDate: initialData?.dueDate,
    },
  });

  const handleFormSubmit = (data: TaskFormData) => {
    // Convert date string to Date object if exists
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="任务标题"
        {...register('title', { required: '请输入任务标题' })}
        error={errors.title?.message}
      />

      <Textarea
        label="任务描述"
        {...register('description')}
        error={errors.description?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="任务类别"
          options={categoryOptions}
          {...register('category')}
          error={errors.category?.message}
        />

        <Select
          label="优先级"
          options={priorityOptions}
          {...register('priority')}
          error={errors.priority?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="预估时长（分钟）"
          min={1}
          {...register('estimatedDuration', {
            required: '请输入预估时长',
            min: { value: 1, message: '时长必须大于0' },
            valueAsNumber: true
          })}
          error={errors.estimatedDuration?.message}
        />

        <Input
          type="date"
          label="截止日期"
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">创建任务</Button>
      </div>
    </form>
  );
}; 