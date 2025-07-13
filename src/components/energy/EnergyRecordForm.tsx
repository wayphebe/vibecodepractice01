import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface EnergyRecordFormProps {
  onSubmit: (record: {
    activity: string;
    energyLevel: number;
    duration: number;
    tags: string[];
    mood: string;
    notes: string;
  }) => void;
}

export const EnergyRecordForm = ({ onSubmit }: EnergyRecordFormProps) => {
  const [formData, setFormData] = useState({
    activity: '',
    energyLevel: 0,
    duration: 30,
    tags: [],
    mood: 'neutral',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-content mx-auto">
      <form onSubmit={handleSubmit} className="space-y-md">
        <div>
          <label htmlFor="activity" className="block text-text-primary font-medium mb-2">
            活动名称
          </label>
          <input
            type="text"
            id="activity"
            value={formData.activity}
            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            className="w-full rounded-btn border-divider focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-text-primary font-medium mb-2">
            能量影响 ({formData.energyLevel})
          </label>
          <input
            type="range"
            min="-5"
            max="5"
            value={formData.energyLevel}
            onChange={(e) => setFormData({ ...formData, energyLevel: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-text-primary font-medium mb-2">
            持续时间（分钟）
          </label>
          <input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            className="w-full rounded-btn border-divider focus:border-primary focus:ring-primary"
            min="5"
            step="5"
            required
          />
        </div>

        <div>
          <label htmlFor="mood" className="block text-text-primary font-medium mb-2">
            心情状态
          </label>
          <select
            id="mood"
            value={formData.mood}
            onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
            className="w-full rounded-btn border-divider focus:border-primary focus:ring-primary"
          >
            <option value="great">很好</option>
            <option value="good">好</option>
            <option value="neutral">一般</option>
            <option value="bad">不好</option>
            <option value="terrible">很差</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-text-primary font-medium mb-2">
            备注
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-btn border-divider focus:border-primary focus:ring-primary"
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full">
          记录能量
        </Button>
      </form>
    </Card>
  );
}; 