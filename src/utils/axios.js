import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://boldservebackend-production.up.railway.app',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add auth token to requests
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
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

// Helper function for creating services
instance.createService = async (serviceData) => {
    try {
        // Ensure all required fields are present based on the API schema
        const payload = {
            productName: serviceData.productName,
            description: serviceData.description,
            price: Number(serviceData.price),
            category: serviceData.category,
            images: Array.isArray(serviceData.images) ? serviceData.images : [serviceData.imageUrl],
            isAvailable: true,
            duration: 0,
            subCategory: serviceData.subCategory || "Default",
            offers: "0",
            review: "0",
            rating: 0
        };

        const response = await instance.post('/api/services', payload);
        return response.data;
    } catch (error) {
        console.error('Service creation error:', error);
        throw error;
    }
};

export { adminAPI, serviceAPI, paymentAPI };
export default instance; 