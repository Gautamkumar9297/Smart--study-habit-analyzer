import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const studentAPI = axios.create({
    baseURL: `${API_URL}/student`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
studentAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const studentService = {
    // Check if student has submitted data
    checkData: async () => {
        const response = await studentAPI.get('/check');
        return response.data;
    },

    // Submit student study habit data
    submitData: async (data) => {
        const response = await studentAPI.post('/submit', data);
        return response.data;
    },

    // Get student history
    getHistory: async () => {
        const response = await studentAPI.get('/history');
        return response.data;
    },

    // Get dashboard summary
    getDashboardSummary: async () => {
        const response = await studentAPI.get('/dashboard-summary');
        return response.data;
    },

    // Get analytics data
    getAnalytics: async () => {
        const response = await studentAPI.get('/analytics');
        return response.data;
    }
};

export default studentService;
