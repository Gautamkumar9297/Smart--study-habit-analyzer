import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const predictionAPI = {
    getPrediction: async (data) => {
        const response = await api.post('/predict', data);
        return response.data;
    },

    getAllPredictions: async () => {
        const response = await api.get('/predictions');
        return response.data;
    },

    getStatistics: async () => {
        const response = await api.get('/statistics');
        return response.data;
    },

    deletePrediction: async (id) => {
        const response = await api.delete(`/predictions/${id}`);
        return response.data;
    },
};

export default api;
