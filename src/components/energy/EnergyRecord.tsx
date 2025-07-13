import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface EnergyRecordProps {
  onSave: (data: {
    energyLevel: number;
    focusLevel: number;
    moodLevel: number;
    note: string;
  }) => void;
}

export const EnergyRecord: React.FC<EnergyRecordProps> = ({ onSave }) => {
  const [energyLevel, setEnergyLevel] = useState(3);
  const [focusLevel, setFocusLevel] = useState(3);
  const [moodLevel, setMoodLevel] = useState(3);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      energyLevel,
      focusLevel,
      moodLevel,
      note,
    });
    setNote('');
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            能量水平
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            专注度
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={focusLevel}
            onChange={(e) => setFocusLevel(parseInt(e.target.value))}
            className="w-full mt-2"
          />
          <div className="text-center text-sm text-gray-600">
            {focusLevel} / 5
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            心情
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={moodLevel}
            onChange={(e) => setMoodLevel(parseInt(e.target.value))}
            className="w-full mt-2"
          />
          <div className="text-center text-sm text-gray-600">
            {moodLevel} / 5
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            备注
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
          />
        </div>

        <Button type="submit">保存记录</Button>
      </form>
    </Card>
  );
}; 