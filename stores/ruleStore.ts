import { create } from 'zustand';
import axios from '@/lib/axios';

export interface Rule {
  _id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

interface RuleState {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  
  fetchRules: (isActive?: boolean) => Promise<void>;
  createRule: (data: Omit<Rule, '_id'>) => Promise<void>;
  updateRule: (id: string, data: Partial<Rule>) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useRuleStore = create<RuleState>((set, get) => ({
  rules: [],
  loading: false,
  error: null,

  fetchRules: async (isActive?: boolean) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('limit', '100');
      if (isActive !== undefined) {
        params.append('isActive', String(isActive));
      }

      const response = await axios.get(`/rules?${params.toString()}`);
      set({
        rules: response.data.data.rules,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch rules',
        loading: false,
      });
    }
  },

  createRule: async (data) => {
    set({ loading: true, error: null });
    try {
      await axios.post('/rules', data);
      
      // Refetch rules
      await get().fetchRules();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create rule',
        loading: false,
      });
      throw error;
    }
  },

  updateRule: async (id: string, data) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`/rules/${id}`, data);
      
      // Refetch rules
      await get().fetchRules();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update rule',
        loading: false,
      });
      throw error;
    }
  },

  deleteRule: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/rules/${id}`);
      
      // Remove from local state
      set((state) => ({
        rules: state.rules.filter((r) => r._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete rule',
        loading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
