import React from 'react';
import { useForm } from 'react-hook-form';
import { TaskReflectionData } from '@/types/task';
import { Slider } from '@/components/ui/Slider';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface EnergyReflectionFormProps {
  onSubmit: (data: TaskReflectionData) => void;
  onCancel: () => void;
  taskTitle: string;
  taskCategory: string;
}

export const EnergyReflectionForm: React.FC<EnergyReflectionFormProps> = ({
  onSubmit,
  onCancel,
  taskTitle,
  taskCategory,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskReflectionData>({
    defaultValues: {
      energyImpact: 0,
      moodImpact: 0,
      focusLevel: 3,
    },
  });

  const energyImpact = watch('energyImpact');
  const moodImpact = watch('moodImpact');
  const focusLevel = watch('focusLevel');

  const getEnergyColor = (value: number) => {
    if (value > 3) return 'text-energy-very-positive';
    if (value > 0) return 'text-energy-positive';
    if (value < -3) return 'text-energy-very-negative';
    if (value < 0) return 'text-energy-negative';
    return 'text-energy-neutral';
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {taskTitle}
          </h3>
          <p className="text-sm text-text-secondary">{taskCategory}</p>
        </div>

        {/* 能量影响 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-primary">
              能量影响
            </label>
            <span
              className={`text-sm font-medium ${getEnergyColor(energyImpact)}`}
            >
              {energyImpact > 0 ? '+' : ''}
              {energyImpact}
            </span>
          </div>
          <Slider
            {...register('energyImpact', { valueAsNumber: true })}
            min={-5}
            max={5}
            step={1}
          />
          <p className="text-xs text-text-secondary">
            -5 表示严重消耗，0 表示中性，+5 表示非常充能
          </p>
        </div>

        {/* 心情影响 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-primary">
              心情影响
            </label>
            <span
              className={`text-sm font-medium ${getEnergyColor(moodImpact)}`}
            >
              {moodImpact > 0 ? '+' : ''}
              {moodImpact}
            </span>
          </div>
          <Slider
            {...register('moodImpact', { valueAsNumber: true })}
            min={-5}
            max={5}
            step={1}
          />
          <p className="text-xs text-text-secondary">
            -5 表示非常糟糕，0 表示中性，+5 表示非常愉悦
          </p>
        </div>

        {/* 专注度 */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-primary">
              专注度
            </label>
            <span className="text-sm font-medium text-primary">
              {focusLevel}/5
            </span>
          </div>
          <Slider
            {...register('focusLevel', { valueAsNumber: true })}
            min={1}
            max={5}
            step={1}
          />
          <p className="text-xs text-text-secondary">
            1 表示很难专注，5 表示深度专注
          </p>
        </div>

        {/* 详细反思 */}
        <Textarea
          label="详细反思"
          placeholder="记录一下任务执行过程中的具体感受、收获和改进建议..."
          {...register('detailedReflection')}
          error={errors.detailedReflection?.message}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">提交反思</Button>
        </div>
      </form>
    </Card>
  );
}; 