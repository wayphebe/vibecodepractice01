import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface SprintTaskProps {
  title: string;
  description: string;
  duration: number; // in minutes
  onStart: () => void;
  onComplete: () => void;
}

export const SprintTask: React.FC<SprintTaskProps> = ({
  title,
  description,
  duration,
  onStart,
  onComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [energyLevel, setEnergyLevel] = useState(5);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
    onStart();
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete();
  };

  return (
    <Card className="p-4 max-w-md">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-2xl font-mono">{formatTime(timeLeft)}</div>
          <div className="flex gap-2">
            {!isActive ? (
              <Button onClick={handleStart}>开始冲刺</Button>
            ) : (
              <Button onClick={handleComplete} variant="outline">
                完成任务
              </Button>
            )}
          </div>
        </div>

        {isActive && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              当前能量水平
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="text-center text-sm text-gray-600">
              {energyLevel} / 5
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}; 