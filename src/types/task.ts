export type TaskCategory = 'work' | 'study' | 'life' | 'health' | 'social';

export type TaskPriority = 'high' | 'medium' | 'low';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  completionPercentage?: number; // 0-100
  dueDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  quickReflection?: string;
  energyImpact?: number; // -5 to +5
  moodImpact?: number; // -5 to +5
  focusLevel?: number; // 1 to 5
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageEnergyImpact: number;
  averageMoodImpact: number;
  averageFocusLevel: number;
  tasksByCategory: Record<TaskCategory, number>;
  tasksByPriority: Record<TaskPriority, number>;
}

export interface TaskFormData {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  estimatedDuration: number;
  dueDate?: Date;
}

export interface TaskCompletionData {
  completionPercentage: number;
  actualDuration: number;
  quickReflection?: string;
}

export interface TaskReflectionData {
  energyImpact: number;
  moodImpact: number;
  focusLevel: number;
  detailedReflection?: string;
} 