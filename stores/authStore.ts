import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '@/lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  slug?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    discord?: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string, slug: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User, token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/auth/login', { email, password });
          const { user, accessToken } = response.data.data;

          // Store token separately for axios interceptor
          localStorage.setItem('token', accessToken);

          set({
            user: {
              id: user.id || user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
              slug: user.slug,
              bio: user.bio,
              socialLinks: user.socialLinks
            },
            accessToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            loading: false,
          });
          throw error;
        }
      },

      register: async (data: any) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/auth/register', data);
          const { user, accessToken } = response.data.data;

          localStorage.setItem('token', accessToken);

          set({
            user: {
              id: user.id || user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
              slug: user.slug,
              bio: user.bio,
              socialLinks: user.socialLinks
            },
            accessToken,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            loading: false,
          });
          throw error;
        }
      },

      adminLogin: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/auth/login', { email, password });
          const { user, accessToken } = response.data.data;

          console.log('[Auth Store] Login response:', {
            user: user,
            hasToken: !!accessToken,
            role: user.role
          });

          if (user.role !== 'admin') {
            throw new Error('Access denied. Admin only.');
          }

          // Store token separately for axios interceptor
          localStorage.setItem('token', accessToken);

          set({
            user: {
              id: user.id || user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
              slug: user.slug
            },
            accessToken,
            isAuthenticated: true,
            loading: false,
          });

          console.log('[Auth Store] Authentication successful');
        } catch (error: any) {
          console.error('[Auth Store] Login error:', error);
          set({
            error: error.response?.data?.message || error.message || 'Admin login failed',
            loading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        console.log('[Auth Store] Logging out...');
        try {
          await axios.post('/auth/logout');
        } catch (error) {
          console.error('[Auth Store] Logout error:', error);
        } finally {
          // Clear all auth data
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });

          console.log('[Auth Store] Logout complete');
        }
      },

      forgotPassword: async (email: string, slug: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post('/auth/forgot-password', { email, slug });
          set({ loading: false });
          return response.data;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to request password reset',
            loading: false
          });
          throw error;
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ loading: true, error: null });
        try {
          await axios.post('/auth/reset-password', { token, newPassword: password });
          set({ loading: false });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to reset password',
            loading: false
          });
          throw error;
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await axios.get('/auth/profile');
          const user = response.data.data;
          set({
            user: {
              id: user.id || user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
              slug: user.slug,
              bio: user.bio,
              socialLinks: user.socialLinks
            },
            isAuthenticated: true
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Don't logout here, let interceptor handle 401s to avoid loops
        }
      },

      setUser: (user: User, token: string) => {
        localStorage.setItem('token', token);
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
