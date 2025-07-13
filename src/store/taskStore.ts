import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  Task,
  TaskFormData,
  TaskCompletionData,
  TaskReflectionData,
  TaskStats,
  TaskStatus,
  TaskCategory,
  TaskPriority,
} from '@/types/task';

interface TaskState {
  tasks: Task[];
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  startTask: (id: string) => void;
  completeTask: (id: string, data: TaskCompletionData) => void;
  cancelTask: (id: string) => void;
  addReflection: (id: string, data: TaskReflectionData) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByCategory: (category: TaskCategory) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getTaskStats: (timeRange: 'day' | 'week' | 'month' | 'year') => TaskStats;
  getCompletedTasksForReview: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (data: TaskFormData) => {
        const newTask: Task = {
          id: uuidv4(),
          ...data,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id: string, data: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...data, updatedAt: new Date() }
              : task
          ),
        }));
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      startTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: 'in_progress',
                  startedAt: new Date(),
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },

      completeTask: (id: string, data: TaskCompletionData) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: 'completed',
                  completedAt: new Date(),
                  ...data,
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },

      cancelTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: 'cancelled',
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },

      addReflection: (id: string, data: TaskReflectionData) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...data,
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },

      getTasksByStatus: (status: TaskStatus) => {
        return get().tasks.filter((task) => task.status === status);
      },

      getTasksByCategory: (category: TaskCategory) => {
        return get().tasks.filter((task) => task.category === category);
      },

      getTasksByPriority: (priority: TaskPriority) => {
        return get().tasks.filter((task) => task.priority === priority);
      },

      getTaskStats: (timeRange: 'day' | 'week' | 'month' | 'year') => {
        const tasks = get().tasks;
        const now = new Date();
        const timeRangeStart = new Date();

        switch (timeRange) {
          case 'day':
            timeRangeStart.setDate(now.getDate() - 1);
            break;
          case 'week':
            timeRangeStart.setDate(now.getDate() - 7);
            break;
          case 'month':
            timeRangeStart.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            timeRangeStart.setFullYear(now.getFullYear() - 1);
            break;
        }

        const filteredTasks = tasks.filter(
          (task) => new Date(task.createdAt) >= timeRangeStart
        );

        const completedTasks = filteredTasks.filter(
          (task) => task.status === 'completed'
        );

        const tasksByCategory = filteredTasks.reduce(
          (acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
          },
          {} as Record<TaskCategory, number>
        );

        const tasksByPriority = filteredTasks.reduce(
          (acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
          },
          {} as Record<TaskPriority, number>
        );

        return {
          totalTasks: filteredTasks.length,
          completedTasks: completedTasks.length,
          completionRate:
            filteredTasks.length > 0
              ? completedTasks.length / filteredTasks.length
              : 0,
          averageEnergyImpact:
            completedTasks.reduce(
              (sum, task) => sum + (task.energyImpact || 0),
              0
            ) / (completedTasks.length || 1),
          averageMoodImpact:
            completedTasks.reduce(
              (sum, task) => sum + (task.moodImpact || 0),
              0
            ) / (completedTasks.length || 1),
          averageFocusLevel:
            completedTasks.reduce(
              (sum, task) => sum + (task.focusLevel || 0),
              0
            ) / (completedTasks.length || 1),
          tasksByCategory,
          tasksByPriority,
        };
      },

      getCompletedTasksForReview: () => {
        return get().tasks.filter(
          (task) =>
            task.status === 'completed' &&
            !task.energyImpact &&
            !task.moodImpact &&
            !task.focusLevel
        );
      },
    }),
    {
      name: 'task-store',
    }
  )
); 