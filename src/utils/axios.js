import axios from 'axios';

// Define base URLs for different environments
const PRODUCTION_API = 'https://boldservebackend-production.up.railway.app';
const LOCAL_API = 'http://localhost:8003';

// Determine which API to use based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_API : LOCAL_API;

// Create axios instance with environment-based configuration
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000  // Increased timeout for file uploads
});

// Helper function to check server availability
const checkServerAvailability = async () => {
    try {
        await axios.get(`${API_BASE_URL}/api/users`, { 
            timeout: 2000,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        return true;
    } catch (error) {
        console.error(`Server availability check failed for ${API_BASE_URL}:`, error.message);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            return true;
        }
        return false;
    }
};

// Add a function to get the stored token
const getStoredToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;
    
    // Log token for debugging
    console.log('Retrieved token:', token);
    return token;
};

// Add request interceptor to handle token
axiosInstance.interceptors.request.use(
    (config) => {
        // Don't add auth header for user routes
        if (!config.url.includes('/api/users')) {
            const token = localStorage.getItem('adminToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        console.log('Request being sent:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
            return Promise.reject(new Error('Request timeout - please try again'));
        }

        if (!error.response) {
            console.error('Network error:', error);
            return Promise.reject(new Error('Network error - please check your connection'));
        }

        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Add a new function to check authentication status
const checkAuthStatus = () => {
    const token = getStoredToken();
    return !!token;
};

// Admin related API calls
export const adminAPI = {
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/api/admin/login', credentials);
            if (response.data.success && response.data.token) {
                // Store the token
                localStorage.setItem('adminToken', response.data.token);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    logout: () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
    },
    verifyToken: async () => {
        try {
            const response = await axiosInstance.get('/api/admin/verify');
            return response.data;
        } catch (error) {
            console.error('Token verification error:', error);
            throw error;
        }
    },
    getUsers: async () => {
        try {
            const response = await axiosInstance.get('/api/users');
            return response.data;
        } catch (error) {
            console.error('Get users error:', error);
            throw error;
        }
    }
};

// User related API calls - removed token requirement
const userAPI = {
    getAllUsers: async () => {
        try {
            // Remove the Authorization header
            const response = await axios.get(`${API_BASE_URL}/api/users`);
            
            console.log('API Response:', response);
            
            if (response.data) {
                return {
                    success: true,
                    data: response.data.data || response.data
                };
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
};

// Simplified Dashboard API without authentication
const dashboardAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to add token to dashboard requests
dashboardAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        console.log('Making request to:', config.url); // Add this for debugging
        return config;
    },
    (error) => Promise.reject(error)
);

// Add payment-related API functions
const paymentAPI = {
    getAllPayments: async () => {
        try {
            const response = await axiosInstance.get('/orders');
            return response;
        } catch (error) {
            console.error('getAllPayments error:', error);
            throw error;
        }
    },
    getSuccessfulPayments: async () => {
        try {
            const response = await axiosInstance.get('/orders?status=successful');
            return response;
        } catch (error) {
            console.error('getSuccessfulPayments error:', error);
            throw error;
        }
    },
    getCancelledPayments: async () => {
        try {
            const response = await axiosInstance.get('/orders?status=cancelled');
            return response;
        } catch (error) {
            console.error('getCancelledPayments error:', error);
            throw error;
        }
    },
    getPaymentsByStatus: (status) => axiosInstance.get(`/orders?status=${status}`)
};

// Service/product related API calls
const serviceAPI = {
    createService: async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Important for file uploads
                }
            };

            // Add required fields that were missing
            if (!formData.has('name')) {
                formData.append('name', formData.get('productName')); // Map productName to name
            }
            if (!formData.has('duration')) {
                formData.append('duration', '0'); // Default duration if not provided
            }

            // Log the data being sent
            console.log('Sending service data:', Object.fromEntries(formData));

            const response = await axiosInstance.post('/api/services', formData, config);
            return response.data;
        } catch (error) {
            console.error('Service API Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    getAllServices: async () => {
        try {
            const response = await axiosInstance.get('/api/services');
            return response.data;
        } catch (error) {
            console.error('Error fetching services:', error);
            throw error;
        }
    },

    // Get all products
    getAllProducts: async () => {
        try {
            console.log('Fetching all products...');
            const response = await axiosInstance.get('/api/services/admin/products');
            
            if (!response.data) {
                throw new Error('No data received from server');
            }
            
            console.log('Products fetched successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error('Failed to fetch products: ' + error.message);
        }
    },

    // Delete a product
    deleteProduct: async (productId) => {
        try {
            console.log('Deleting product:', productId);
            const response = await axiosInstance.delete(`/api/services/admin/products/${productId}`);
            
            if (!response.data) {
                throw new Error('No response received from server');
            }
            
            console.log('Product deleted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', {
                productId,
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error('Failed to delete product: ' + error.message);
        }
    },

    // Get products by category
    getProductsByCategory: async (category, subCategory = null) => {
        try {
            const queryParams = subCategory 
                ? `?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}`
                : `?category=${encodeURIComponent(category)}`;
            
            const response = await axiosInstance.get(`/api/services/category${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await axiosInstance.get('/api/services/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }
};

// Export the base URL for use in other parts of the application
const getBaseUrl = () => API_BASE_URL;

// Export all your existing APIs
export {
    checkServerAvailability,
    checkAuthStatus,
    getBaseUrl,
    userAPI,
    paymentAPI,
    serviceAPI
};
export default axiosInstance; 