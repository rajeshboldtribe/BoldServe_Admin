import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://boldservebackend-production.up.railway.app'
        : 'http://localhost:8003',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    timeout: 10000
});

// Add request interceptor for handling errors
instance.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

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
            const response = await instance.get('/api/services');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    deleteProduct: async (productId) => {
        try {
            const response = await instance.delete(`/api/services/${productId}`);
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
            const response = await instance.get('/api/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching all payments:', error);
            throw error;
        }
    },

    getSuccessfulPayments: async () => {
        try {
            const response = await instance.get('/api/orders?status=accepted');
            return response.data;
        } catch (error) {
            console.error('Error fetching successful payments:', error);
            throw error;
        }
    },

    getFailedPayments: async () => {
        try {
            const response = await instance.get('/api/orders?status=cancelled');
            return response.data;
        } catch (error) {
            console.error('Error fetching failed payments:', error);
            throw error;
        }
    }
};

export { adminAPI, serviceAPI, paymentAPI };
export default instance; 