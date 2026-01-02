import { create } from 'zustand';
import axios from '@/lib/axios';

export interface SocialLinks {
    twitter?: string;
    instagram?: string;
    discord?: string;
    kick?: string;
    twitch?: string;
    youtube?: string;
    tiktok?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatar: string;
    bio: string;
    socialLinks: SocialLinks;
    isActive: boolean;
    slug: string;
}

interface UserState {
    users: User[];
    streamers: User[]; // Users who are streamers
    streamersPagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    loading: boolean;
    error: string | null;

    fetchUsers: (page?: number, limit?: number, role?: string) => Promise<void>;
    fetchStreamers: (page?: number, limit?: number, search?: string) => Promise<void>;
    createUser: (data: Partial<User> & { password?: string }) => Promise<void>;
    updateUser: (id: string, data: Partial<User>) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    streamers: [],
    streamersPagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    },
    loading: false,
    error: null,

    fetchUsers: async (page = 1, limit = 10, role) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            if (role) params.append('role', role);

            const response = await axios.get(`/users?${params.toString()}`);
            set({
                users: response.data.data.users,
                loading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch users',
                loading: false,
            });
        }
    },

    fetchStreamers: async (page = 1, limit = 12, search = '') => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('limit', String(limit));
            if (search) params.append('search', search);

            const response = await axios.get(`/users/streamers?${params.toString()}`);
            set({
                streamers: response.data.data.streamers,
                streamersPagination: response.data.data.pagination,
                loading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch streamers',
                loading: false,
            });
        }
    },

    createUser: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('/users', data);
            const newUser = response.data.data;

            set((state) => ({
                users: [newUser, ...state.users],
                loading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create user',
                loading: false
            });
            throw error;
        }
    },

    updateUser: async (id: string, data: Partial<User>) => {
        set({ loading: true, error: null });
        try {
            await axios.put(`/users/${id}`, data);

            // Refetch to update lists
            // We might want to optimize this to just update local state
            const { users, streamers } = get();

            const updatedUsers = users.map(u => u._id === id ? { ...u, ...data } : u);
            const updatedStreamers = streamers.map(s => s._id === id ? { ...s, ...data } : s);

            set({
                users: updatedUsers as User[],
                streamers: updatedStreamers as User[],
                loading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update user',
                loading: false,
            });
            throw error;
        }
    },

    deleteUser: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/users/${id}`);

            set((state) => ({
                users: state.users.filter((u) => u._id !== id),
                streamers: state.streamers.filter((s) => s._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete user',
                loading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));
