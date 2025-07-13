import React from 'react';
import { Card } from '../ui/Card';
import { Task } from '../../store/todoStore';

interface TaskListProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onSelectTask }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card
          key={task.id}
          className="p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => onSelectTask(task)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {task.timeEstimate}分钟
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  task.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : task.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {task.status === 'completed'
                  ? '已完成'
                  : task.status === 'in_progress'
                  ? '进行中'
                  : '待开始'}
              </span>
            </div>
          </div>
          
          {task.type === 'sprint' && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                3小时冲刺
              </span>
              {task.energyLevel && (
                <span className="text-xs text-gray-600">
                  能量水平: {task.energyLevel}/5
                </span>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}; 