const express = require('express');
const router = express.Router();
const { protect, facultyOnly } = require('../middleware/auth');
const facultyController = require('../controllers/facultyController');

// Excel upload and processing
router.post('/upload-excel', protect, facultyOnly, facultyController.uploadExcel);

// Analytics endpoints
router.get('/analytics', protect, facultyOnly, facultyController.getAnalytics);
router.get('/analytics/trends', protect, facultyOnly, facultyController.getPerformanceTrends);
router.get('/analytics/correlation', protect, facultyOnly, facultyController.getCorrelationData);

// Get all batch uploads
router.get('/uploads', protect, facultyOnly, facultyController.getUploads);

// Get specific upload details
router.get('/uploads/:uploadId', protect, facultyOnly, facultyController.getUploadDetails);

// Get all student records with predictions
router.get('/student-records', protect, facultyOnly, facultyController.getStudentRecords);

module.exports = router;
