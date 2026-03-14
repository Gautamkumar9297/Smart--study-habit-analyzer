const express = require('express');
const router = express.Router();
const {
    getLatestPrediction,
    getPredictionById,
    getAllPredictions,
    getPredictionStats,
    deletePrediction
} = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get latest prediction for logged-in student
router.get('/latest', getLatestPrediction);

// Get prediction statistics
router.get('/stats', getPredictionStats);

// Get all predictions for logged-in student
router.get('/', getAllPredictions);

// Get specific prediction by ID
router.get('/:id', getPredictionById);

// Delete a prediction
router.delete('/:id', deletePrediction);

module.exports = router;
