import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Card } from '../ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EnergyFlowChartProps {
  data: {
    timestamp: string;
    energyLevel: number;
  }[];
  period: 'day' | 'week' | 'month';
}

export const EnergyFlowChart = ({ data, period }: EnergyFlowChartProps) => {
  const chartData: ChartData<'line'> = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: '能量水平',
        data: data.map(d => d.energyLevel),
        borderColor: '#2B7FFF',
        backgroundColor: '#6CD6FF',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `能量流动图表 - ${period === 'day' ? '今日' : period === 'week' ? '本周' : '本月'}`,
      },
    },
    scales: {
      y: {
        min: -5,
        max: 5,
        grid: {
          color: '#EEEEEE',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="max-w-content mx-auto">
      <Line data={chartData} options={options} />
    </Card>
  );
}; 