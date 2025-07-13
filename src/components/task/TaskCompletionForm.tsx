import React from 'react';
import { useForm } from 'react-hook-form';
import { TaskCompletionData } from '@/types/task';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';

interface TaskCompletionFormProps {
  onSubmit: (data: TaskCompletionData) => void;
  onCancel: () => void;
  estimatedDuration: number;
}

export const TaskCompletionForm: React.FC<TaskCompletionFormProps> = ({
  onSubmit,
  onCancel,
  estimatedDuration,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskCompletionData>({
    defaultValues: {
      completionPercentage: 100,
      actualDuration: estimatedDuration,
    },
  });

  const completionPercentage = watch('completionPercentage');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary">
          完成度
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Slider
              {...register('completionPercentage', {
                required: '请选择完成度',
                min: { value: 0, message: '完成度不能小于0' },
                max: { value: 100, message: '完成度不能大于100' },
                valueAsNumber: true,
              })}
              min={0}
              max={100}
              step={5}
            />
          </div>
          <span className="text-sm font-medium text-text-secondary w-12">
            {completionPercentage}%
          </span>
        </div>
        {errors.completionPercentage && (
          <p className="text-sm text-danger">
            {errors.completionPercentage.message}
          </p>
        )}
      </div>

      <Input
        type="number"
        label="实际用时（分钟）"
        min={1}
        {...register('actualDuration', {
          required: '请输入实际用时',
          min: { value: 1, message: '用时必须大于0' },
          valueAsNumber: true,
        })}
        error={errors.actualDuration?.message}
      />

      <Textarea
        label="快速反思"
        placeholder="简单记录一下完成任务的感受..."
        {...register('quickReflection')}
        error={errors.quickReflection?.message}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">确认完成</Button>
      </div>
    </form>
  );
}; 