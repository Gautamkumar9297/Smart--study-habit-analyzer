import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const authAPI = axios.create({
    baseURL: `${API_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
authAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    // Register new student
    register: async (userData) => {
        const response = await authAPI.post('/register', userData);
        return response.data;
    },

    // Login user
    login: async (email, password, role) => {
        const response = await authAPI.post('/login', { email, password, role });
        return response.data;
    },

    // Get current user
    getMe: async () => {
        const response = await authAPI.get('/me');
        return response.data;
    },

    // Create faculty users (for setup)
    createFaculty: async () => {
        const response = await authAPI.post('/create-faculty');
        return response.data;
    }
};

export default authService;