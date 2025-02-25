import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://boldservebackend-production.up.railway.app'
    : 'http://localhost:8003';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Admin API endpoints
const adminAPI = {
    login: async (credentials) => {
        try {
            if (credentials.email === 'Admin' && credentials.password === 'Admin123') {
                return {
                    success: true,
                    message: 'Login successful'
                };
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            throw error;
        }
    }
};

// Service API endpoints
const serviceAPI = {
    getAllProducts: async () => {
        try {
            const response = await axiosInstance.get('/api/services');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            const response = await axiosInstance.delete(`/api/services/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }
};

// Payment/Order API endpoints
const paymentAPI = {
    getAllPayments: async () => {
        try {
            const response = await axiosInstance.get(`/api/orders`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all payments:', error);
            throw error;
        }
    },

    getSuccessfulPayments: async () => {
        try {
            const response = await axiosInstance.get(`/api/orders?status=accepted`);
            return response.data;
        } catch (error) {
            console.error('Error fetching successful payments:', error);
            throw error;
        }
    },

    getFailedPayments: async () => {
        try {
            const response = await axiosInstance.get(`/api/orders?status=cancelled`);
            return response.data;
        } catch (error) {
            console.error('Error fetching failed payments:', error);
            throw error;
        }
    }
};

// Simple request logger
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.baseURL + config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Simple response logger
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export { adminAPI, serviceAPI, paymentAPI };
export default axiosInstance; 