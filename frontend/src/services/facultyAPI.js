import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const facultyAPI = axios.create({
    baseURL: `${API_URL}/faculty`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
facultyAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const facultyService = {
    // Upload Excel data
    uploadExcel: async (students, fileName, fileSize = 0) => {
        const response = await facultyAPI.post('/upload-excel', {
            students,
            fileName,
            fileSize
        });
        return response.data;
    },

    // Get analytics data
    getAnalytics: async () => {
        const response = await facultyAPI.get('/analytics');
        return response.data;
    },

    // Get performance trends
    getPerformanceTrends: async () => {
        const response = await facultyAPI.get('/analytics/trends');
        return response.data;
    },

    // Get correlation data
    getCorrelationData: async () => {
        const response = await facultyAPI.get('/analytics/correlation');
        return response.data;
    },

    // Get all uploads
    getUploads: async () => {
        const response = await facultyAPI.get('/uploads');
        return response.data;
    },

    // Get upload details
    getUploadDetails: async (uploadId) => {
        const response = await facultyAPI.get(`/uploads/${uploadId}`);
        return response.data;
    },

    // Get student records with predictions
    getStudentRecords: async () => {
        const response = await facultyAPI.get('/student-records');
        return response.data;
    }
};

export default facultyService;
