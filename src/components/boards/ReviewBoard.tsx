import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Task, useTodoStore } from '../../store/todoStore';

interface ReviewBoardProps {
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}

interface EnergyFormData {
  energyImpact: number;
  moodImpact: number;
  focusLevel: number;
  notes: string;
}

const EnergyForm: React.FC<{
  task: Task;
  onSubmit: (data: EnergyFormData) => void;
  onCancel: () => void;
}> = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<EnergyFormData>({
    energyImpact: task.energyImpact || 0,
    moodImpact: task.moodImpact || 0,
    focusLevel: task.focusLevel || 3,
    notes: task.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    min: number,
    max: number,
    step: number = 1
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">复盘任务: {task.title}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {renderSlider(
          '能量影响',
          formData.energyImpact,
          (value) => setFormData(prev => ({ ...prev, energyImpact: value })),
          -5,
          5
        )}
        
        {renderSlider(
          '心情影响',
          formData.moodImpact,
          (value) => setFormData(prev => ({ ...prev, moodImpact: value })),
          -5,
          5
        )}
        
        {renderSlider(
          '专注度',
          formData.focusLevel,
          (value) => setFormData(prev => ({ ...prev, focusLevel: value })),
          1,
          5
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            备注
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="记录你的感受和想法..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit">
            保存复盘
          </Button>
        </div>
      </form>
    </Card>
  );
};

const categoryLabels = {
  work: '工作',
  study: '学习',
  life: '生活',
  health: '健康',
  social: '社交'
};

export const ReviewBoard: React.FC<ReviewBoardProps> = ({ timeRange, onTimeRangeChange }) => {
  const { getCompletedTasksForReview, addEnergyRecord, tasks } = useTodoStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const tasksForReview = getCompletedTasksForReview();

  const handleEnergySubmit = (data: EnergyFormData) => {
    if (selectedTask) {
      addEnergyRecord({
        taskId: selectedTask.id,
        energyImpact: data.energyImpact,
        moodImpact: data.moodImpact,
        focusLevel: data.focusLevel,
        notes: data.notes
      });
      setSelectedTask(null);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getEnergyColor = (value: number) => {
    if (value > 2) return 'text-green-600';
    if (value < -2) return 'text-red-600';
    return 'text-gray-600';
  };

  const timeRangeLabels = {
    day: '今日',
    week: '本周',
    month: '本月',
    year: '今年'
  };

  if (selectedTask) {
    return (
      <EnergyForm
        task={selectedTask}
        onSubmit={handleEnergySubmit}
        onCancel={() => setSelectedTask(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">任务复盘</h2>
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

      {/* 待复盘任务 */}
      {tasksForReview.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-600">
            待复盘任务 ({tasksForReview.length})
          </h3>
          <div className="grid gap-4">
            {tasksForReview.map(task => (
              <Card key={task.id} className="p-4 border-l-4 border-l-orange-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {categoryLabels[task.category]}
                      </span>
                      <span>{formatDuration(task.estimatedDuration)}</span>
                      {task.completedAt && (
                        <span>完成于 {task.completedAt.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setSelectedTask(task)}
                  >
                    开始复盘
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 已复盘任务 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          已复盘任务 ({completedTasks.filter(t => t.energyImpact !== undefined).length})
        </h3>
        <div className="grid gap-4">
          {completedTasks
            .filter(task => task.energyImpact !== undefined)
            .map(task => (
              <Card key={task.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">能量:</span>
                        <span className={`font-medium ${getEnergyColor(task.energyImpact!)}`}>
                          {task.energyImpact! > 0 ? '+' : ''}{task.energyImpact}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">心情:</span>
                        <span className={`font-medium ${getEnergyColor(task.moodImpact!)}`}>
                          {task.moodImpact! > 0 ? '+' : ''}{task.moodImpact}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">专注度:</span>
                        <span className="font-medium">{task.focusLevel}/5</span>
                      </div>
                    </div>
                    
                    {task.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">"{task.notes}"</p>
                    )}
                  </div>
                  
                  <Button 
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedTask(task)}
                  >
                    重新复盘
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      </div>

      {tasksForReview.length === 0 && completedTasks.filter(t => t.energyImpact !== undefined).length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">暂无可复盘的任务</p>
        </Card>
      )}
    </div>
  );
}; 