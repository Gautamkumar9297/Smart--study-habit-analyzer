import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const predictionAPI = axios.create({
    baseURL: `${API_URL}/predictions`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
predictionAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const predictionService = {
    // Get latest prediction
    getLatest: async () => {
        const response = await predictionAPI.get('/latest');
        return response.data;
    },

    // Get prediction by ID
    getById: async (id) => {
        const response = await predictionAPI.get(`/${id}`);
        return response.data;
    },

    // Get all predictions
    getAll: async (limit = 10) => {
        const response = await predictionAPI.get(`/?limit=${limit}`);
        return response.data;
    },

    // Get prediction statistics
    getStats: async () => {
        const response = await predictionAPI.get('/stats');
        return response.data;
    },

    // Delete prediction
    delete: async (id) => {
        const response = await predictionAPI.delete(`/${id}`);
        return response.data;
    }
};

export default predictionService;
