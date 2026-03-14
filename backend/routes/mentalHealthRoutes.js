const express = require('express');
const router = express.Router();
const {
    submitAssessment,
    getLatestAssessment,
    getAssessmentHistory,
    getAssessmentStats
} = require('../controllers/mentalHealthController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Submit mental health assessment
router.post('/submit', submitAssessment);

// Get latest assessment
router.get('/latest', getLatestAssessment);

// Get assessment history
router.get('/history', getAssessmentHistory);

// Get assessment statistics
router.get('/stats', getAssessmentStats);

module.exports = router;
