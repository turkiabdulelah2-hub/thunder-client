import { create } from 'zustand';
import axios from '@/lib/axios';

interface Item {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    seller: {
        _id: string;
        name: string;
        avatar?: string;
        slug?: string;
    };
    contactInfo?: string;
    createdAt: string;
}

interface StoreState {
    items: Item[];
    userItems: Item[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;

    fetchItems: (page?: number, limit?: number, filters?: { search?: string; minPrice?: string; maxPrice?: string }) => Promise<void>;
    fetchUserItems: (userId: string) => Promise<void>;
    createItem: (data: FormData) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
}

export const useStoreStore = create<StoreState>((set, get) => ({
    items: [],
    userItems: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,

    fetchItems: async (page = 1, limit = 12, filters?: { search?: string; minPrice?: string; maxPrice?: string }) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (filters?.search) params.append('search', filters.search);
            if (filters?.minPrice) params.append('minPrice', filters.minPrice);
            if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice);

            const response = await axios.get(`/items?${params.toString()}`);
            const { items, totalPages, currentPage } = response.data.data;
            set({ items, totalPages, currentPage, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch items',
                loading: false,
            });
        }
    },

    fetchUserItems: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`/items/user/${userId}`);
            set({ userItems: response.data.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch user items',
                loading: false,
            });
        }
    },

    createItem: async (data: FormData) => {
        set({ loading: true, error: null });
        try {
            await axios.post('/items', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Refresh items
            await get().fetchItems();
            set({ loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create item',
                loading: false,
            });
            throw error;
        }
    },

    deleteItem: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`/items/${id}`);
            // Remove from local state
            set((state) => ({
                items: state.items.filter((item) => item._id !== id),
                userItems: state.userItems.filter((item) => item._id !== id),
                loading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete item',
                loading: false,
            });
            throw error;
        }
    },
}));
