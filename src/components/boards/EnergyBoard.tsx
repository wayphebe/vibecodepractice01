import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTodoStore } from '../../store/todoStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface EnergyBoardProps {
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}

const categoryLabels = {
  work: '工作',
  study: '学习',
  life: '生活',
  health: '健康',
  social: '社交'
};

export const EnergyBoard: React.FC<EnergyBoardProps> = ({ timeRange, onTimeRangeChange }) => {
  const { getEnergyTrends, getTaskStats } = useTodoStore();
  
  const trends = getEnergyTrends(timeRange);
  const stats = getTaskStats(timeRange);

  const timeRangeLabels = {
    day: '今日',
    week: '本周',
    month: '本月',
    year: '今年'
  };

  // 准备分类数据
  const categoryData = Object.entries(stats.categoryStats).map(([category, data]) => ({
    category: categoryLabels[category as keyof typeof categoryLabels],
    energyImpact: data.averageEnergyImpact,
    moodImpact: data.averageMoodImpact,
    count: data.completed
  })).filter(item => item.count > 0);

  // 格式化趋势数据
  const trendData = trends.map(item => ({
    date: item.date.toLocaleDateString(),
    能量: item.averageEnergy,
    心情: item.averageMood,
    任务数: item.taskCount
  }));

  const getValueColor = (value: number) => {
    if (value > 2) return 'text-green-600';
    if (value < -2) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">能量看板</h2>
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

      {/* 总体统计 */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className={`text-2xl font-bold ${getValueColor(stats.averageEnergyImpact)}`}>
            {stats.averageEnergyImpact > 0 ? '+' : ''}{stats.averageEnergyImpact.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">平均能量影响</div>
        </Card>
        <Card className="p-4">
          <div className={`text-2xl font-bold ${getValueColor(stats.averageMoodImpact)}`}>
            {stats.averageMoodImpact > 0 ? '+' : ''}{stats.averageMoodImpact.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">平均心情影响</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stats.averageFocusLevel.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">平均专注度</div>
        </Card>
      </div>

      {/* 趋势图表 */}
      {trendData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">能量和心情趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[-5, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="能量" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
              <Line 
                type="monotone" 
                dataKey="心情" 
                stroke="#dc2626" 
                strokeWidth={2}
                dot={{ fill: '#dc2626' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* 分类影响分析 */}
      {categoryData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">各类别任务影响分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis domain={[-5, 5]} />
              <Tooltip />
              <Bar dataKey="energyImpact" fill="#2563eb" name="能量影响" />
              <Bar dataKey="moodImpact" fill="#dc2626" name="心情影响" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* 详细分类统计 */}
      {categoryData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">分类详细统计</h3>
          <div className="grid gap-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm text-gray-500 ml-2">({item.count} 个任务)</span>
                </div>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">能量:</span>
                    <span className={`font-medium ${getValueColor(item.energyImpact)}`}>
                      {item.energyImpact > 0 ? '+' : ''}{item.energyImpact.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">心情:</span>
                    <span className={`font-medium ${getValueColor(item.moodImpact)}`}>
                      {item.moodImpact > 0 ? '+' : ''}{item.moodImpact.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 建议卡片 */}
      {stats.completedTasks > 0 && (
        <Card className="p-6 bg-blue-50">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">个性化建议</h3>
          <div className="space-y-2 text-sm text-blue-700">
            {stats.averageEnergyImpact > 2 && (
              <p>✅ 你的整体能量状态很好，继续保持当前的任务安排！</p>
            )}
            {stats.averageEnergyImpact < -2 && (
              <p>⚠️ 最近的任务消耗了较多能量，建议增加一些能量补充活动。</p>
            )}
            {stats.averageMoodImpact > 2 && (
              <p>😊 你的心情状态很棒，当前的任务类型很适合你！</p>
            )}
            {stats.averageMoodImpact < -2 && (
              <p>😔 最近的任务对心情有负面影响，考虑调整任务类型或增加愉悦活动。</p>
            )}
            {categoryData.length > 0 && (
              <p>
                💡 从分类数据看，
                {categoryData.reduce((best, current) => 
                  current.energyImpact > best.energyImpact ? current : best
                ).category}
                类任务对你的能量影响最积极。
              </p>
            )}
          </div>
        </Card>
      )}

      {/* 无数据状态 */}
      {stats.completedTasks === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">暂无能量数据，完成任务并进行复盘后即可查看分析</p>
        </Card>
      )}
    </div>
  );
}; 