import { create } from 'zustand';
import axios from '@/lib/axios';

export interface SystemSettings {
  _id: string;
  currentStreamLink: string;
  siteName: string;
  maintenanceMode: boolean;
  welcomeMessage: string;
  createdAt: string;
  updatedAt: string;
}

interface SystemSettingsState {
  settings: SystemSettings | null;
  loading: boolean;
  error: string | null;
  
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<SystemSettings>) => Promise<void>;
  clearError: () => void;
}

export const useSystemSettingsStore = create<SystemSettingsState>((set, get) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/settings');
      set({
        settings: response.data.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch settings',
        loading: false,
      });
    }
  },

  updateSettings: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put('/settings', data);
      set({
        settings: response.data.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update settings',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
