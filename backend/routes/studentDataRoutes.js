const express = require('express');
const router = express.Router();
const {
    checkStudentData,
    submitStudentData,
    getStudentHistory,
    getDashboardSummary,
    getAnalyticsData
} = require('../controllers/studentDataController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Check if student has data
router.get('/check', checkStudentData);

// Submit student study habit data
router.post('/submit', submitStudentData);

// Get student history
router.get('/history', getStudentHistory);

// Get dashboard summary
router.get('/dashboard-summary', getDashboardSummary);

// Get analytics data
router.get('/analytics', getAnalyticsData);

module.exports = router;
