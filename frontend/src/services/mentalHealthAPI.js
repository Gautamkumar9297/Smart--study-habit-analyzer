import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const mentalHealthAPI = axios.create({
    baseURL: `${API_URL}/mental-health`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
mentalHealthAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const mentalHealthService = {
    // Submit mental health assessment
    submitAssessment: async (responses) => {
        const response = await mentalHealthAPI.post('/submit', { responses });
        return response.data;
    },

    // Get latest assessment
    getLatest: async () => {
        const response = await mentalHealthAPI.get('/latest');
        return response.data;
    },

    // Get assessment history
    getHistory: async () => {
        const response = await mentalHealthAPI.get('/history');
        return response.data;
    },

    // Get assessment statistics
    getStats: async () => {
        const response = await mentalHealthAPI.get('/stats');
        return response.data;
    }
};

export default mentalHealthService;
