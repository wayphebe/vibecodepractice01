import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EnergyRecord {
  id: string;
  timestamp: string;
  activity: string;
  energyLevel: number;
  duration: number;
  tags: string[];
  mood: string;
  notes: string;
}

interface EnergyState {
  records: EnergyRecord[];
  addRecord: (record: Omit<EnergyRecord, 'id' | 'timestamp'>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByPeriod: (period: 'day' | 'week' | 'month') => EnergyRecord[];
}

export const useEnergyStore = create<EnergyState>()(
  persist(
    (set, get) => ({
      records: [],
      
      addRecord: (record) => set((state) => ({
        records: [
          ...state.records,
          {
            ...record,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
          },
        ],
      })),

      deleteRecord: (id) => set((state) => ({
        records: state.records.filter((record) => record.id !== id),
      })),

      getRecordsByPeriod: (period) => {
        const records = get().records;
        const now = new Date();
        const startDate = new Date();

        switch (period) {
          case 'day':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        }

        return records.filter((record) => 
          new Date(record.timestamp) >= startDate && 
          new Date(record.timestamp) <= now
        );
      },
    }),
    {
      name: 'energy-store',
    }
  )
); 