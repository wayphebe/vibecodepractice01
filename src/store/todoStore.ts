import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskCategory = 'work' | 'study' | 'life' | 'health' | 'social';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  // 能量影响评分 (任务完成后填写)
  energyImpact?: number; // -5 to +5
  moodImpact?: number; // -5 to +5
  focusLevel?: number; // 1 to 5
  notes?: string;
}

export interface EnergyRecord {
  id: string;
  taskId: string;
  energyImpact: number; // -5 to +5
  moodImpact: number; // -5 to +5
  focusLevel: number; // 1 to 5
  notes?: string;
  recordedAt: Date;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageEnergyImpact: number;
  averageMoodImpact: number;
  averageFocusLevel: number;
  categoryStats: Record<TaskCategory, {
    count: number;
    completed: number;
    averageEnergyImpact: number;
    averageMoodImpact: number;
  }>;
}

interface TodoStore {
  tasks: Task[];
  energyRecords: EnergyRecord[];
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  
  // Energy actions
  addEnergyRecord: (record: Omit<EnergyRecord, 'id' | 'recordedAt'>) => void;
  updateEnergyRecord: (id: string, updates: Partial<EnergyRecord>) => void;
  
  // Analytics
  getTaskStats: (timeRange?: 'day' | 'week' | 'month' | 'year') => TaskStats;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategory: (category: TaskCategory) => Task[];
  getCompletedTasksForReview: () => Task[];
  getEnergyTrends: (timeRange: 'day' | 'week' | 'month' | 'year') => Array<{
    date: Date;
    averageEnergy: number;
    averageMood: number;
    taskCount: number;
  }>;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      energyRecords: [],
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date()
        }]
      })),
      
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      })),
      
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      completeTask: (id) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { 
            ...task, 
            status: 'completed' as TaskStatus,
            completedAt: new Date()
          } : task
        )
      })),
      
      addEnergyRecord: (record) => set((state) => ({
        energyRecords: [...state.energyRecords, {
          ...record,
          id: crypto.randomUUID(),
          recordedAt: new Date()
        }],
        // 同时更新对应任务的能量数据
        tasks: state.tasks.map(task => 
          task.id === record.taskId ? {
            ...task,
            energyImpact: record.energyImpact,
            moodImpact: record.moodImpact,
            focusLevel: record.focusLevel,
            notes: record.notes
          } : task
        )
      })),
      
      updateEnergyRecord: (id, updates) => set((state) => ({
        energyRecords: state.energyRecords.map(record =>
          record.id === id ? { ...record, ...updates } : record
        )
      })),
      
      getTaskStats: (timeRange = 'week') => {
        const tasks = get().tasks;
        const now = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case 'day':
            startDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        const filteredTasks = tasks.filter(task => 
          task.createdAt >= startDate
        );
        
        const completedTasks = filteredTasks.filter(t => t.status === 'completed');
        
        // 计算分类统计
        const categoryStats: Record<TaskCategory, any> = {
          work: { count: 0, completed: 0, averageEnergyImpact: 0, averageMoodImpact: 0 },
          study: { count: 0, completed: 0, averageEnergyImpact: 0, averageMoodImpact: 0 },
          life: { count: 0, completed: 0, averageEnergyImpact: 0, averageMoodImpact: 0 },
          health: { count: 0, completed: 0, averageEnergyImpact: 0, averageMoodImpact: 0 },
          social: { count: 0, completed: 0, averageEnergyImpact: 0, averageMoodImpact: 0 }
        };
        
        filteredTasks.forEach(task => {
          categoryStats[task.category].count++;
          if (task.status === 'completed') {
            categoryStats[task.category].completed++;
            if (task.energyImpact !== undefined) {
              categoryStats[task.category].averageEnergyImpact += task.energyImpact;
            }
            if (task.moodImpact !== undefined) {
              categoryStats[task.category].averageMoodImpact += task.moodImpact;
            }
          }
        });
        
        // 计算平均值
        Object.keys(categoryStats).forEach(category => {
          const cat = category as TaskCategory;
          const completed = categoryStats[cat].completed;
          if (completed > 0) {
            categoryStats[cat].averageEnergyImpact /= completed;
            categoryStats[cat].averageMoodImpact /= completed;
          }
        });
        
        return {
          totalTasks: filteredTasks.length,
          completedTasks: completedTasks.length,
          completionRate: filteredTasks.length > 0 ? completedTasks.length / filteredTasks.length : 0,
          averageEnergyImpact: completedTasks.length > 0 
            ? completedTasks.reduce((acc, t) => acc + (t.energyImpact || 0), 0) / completedTasks.length
            : 0,
          averageMoodImpact: completedTasks.length > 0
            ? completedTasks.reduce((acc, t) => acc + (t.moodImpact || 0), 0) / completedTasks.length
            : 0,
          averageFocusLevel: completedTasks.length > 0
            ? completedTasks.reduce((acc, t) => acc + (t.focusLevel || 0), 0) / completedTasks.length
            : 0,
          categoryStats
        };
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter(task => task.status === status);
      },
      
      getTasksByCategory: (category) => {
        return get().tasks.filter(task => task.category === category);
      },
      
      getCompletedTasksForReview: () => {
        return get().tasks.filter(task => 
          task.status === 'completed' && 
          (task.energyImpact === undefined || task.moodImpact === undefined)
        );
      },
      
      getEnergyTrends: (timeRange) => {
        const tasks = get().tasks;
        const now = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case 'day':
            startDate.setDate(now.getDate() - 7); // 显示过去7天
            break;
          case 'week':
            startDate.setDate(now.getDate() - 30); // 显示过去30天
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 12); // 显示过去12个月
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear() - 5); // 显示过去5年
            break;
        }
        
        const completedTasks = tasks.filter(task => 
          task.status === 'completed' && 
          task.completedAt && 
          task.completedAt >= startDate &&
          task.energyImpact !== undefined &&
          task.moodImpact !== undefined
        );
        
        // 按日期分组
        const groupedData: Record<string, Task[]> = {};
        completedTasks.forEach(task => {
          const dateKey = task.completedAt!.toDateString();
          if (!groupedData[dateKey]) {
            groupedData[dateKey] = [];
          }
          groupedData[dateKey].push(task);
        });
        
        // 计算每日平均值
        return Object.entries(groupedData).map(([dateStr, tasks]) => ({
          date: new Date(dateStr),
          averageEnergy: tasks.reduce((acc, t) => acc + (t.energyImpact || 0), 0) / tasks.length,
          averageMood: tasks.reduce((acc, t) => acc + (t.moodImpact || 0), 0) / tasks.length,
          taskCount: tasks.length
        })).sort((a, b) => a.date.getTime() - b.date.getTime());
      }
    }),
    {
      name: 'todo-storage',
      version: 1,
    }
  )
); 