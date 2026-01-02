import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('[Axios] Request to:', config.url, '- Token:', token.substring(0, 20) + '...');
        } else {
            console.log('[Axios] Request to:', config.url, '- No token');
        }

        return config;
    },
    (error) => {
        console.error('[Axios] Request error:', error);
        return Promise.reject(error);
    }
);

// Handle response errors
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('[Axios] Response from:', response.config.url, '- Status:', response.status);
        return response;
    },
    async (error) => {
        console.error('[Axios] Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
        });

        if (error.response?.status === 401 && !error.config._retry) {
            console.log('[Axios] 401 Unauthorized - clearing auth data');

            // Clear all auth data
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('auth-storage');

            // Redirect to login if not already there and not on a public page that might trigger 401 silently
            // For now, simple redirect to main signin
            if (!window.location.pathname.includes('/signin') && !window.location.pathname.includes('/dashboard/login')) {
                console.log('[Axios] Redirecting to signin page');
                window.location.href = '/signin';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
