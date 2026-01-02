import { create } from 'zustand';
import axiosInstance from '../lib/axios';

interface CartItem {
    _id: string;
    title: string;
    price: number;
    image: string;
    sellerName: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    isLoading: boolean;

    fetchCart: () => Promise<void>;
    addToCart: (item: any) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isOpen: false,
    isLoading: false,

    fetchCart: async () => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get('/users/cart');
            const cartItems = response.data.data.map((item: any) => ({
                _id: item.item._id,
                title: item.item.title,
                price: item.item.price,
                image: item.item.image,
                sellerName: item.item.seller.name,
                quantity: item.quantity
            }));
            set({ items: cartItems });
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async (item) => {
        set({ isLoading: true });
        try {
            await axiosInstance.post('/users/cart', { itemId: item._id, quantity: 1 });
            await get().fetchCart();
            set({ isOpen: true });
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    removeFromCart: async (id) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/users/cart/${id}`);
            await get().fetchCart();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    clearCart: async () => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete('/users/cart');
            set({ items: [] });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    toggleCart: () => {
        set({ isOpen: !get().isOpen });
    },

    openCart: () => {
        set({ isOpen: true });
    },

    closeCart: () => {
        set({ isOpen: false });
    },

    getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
}));
