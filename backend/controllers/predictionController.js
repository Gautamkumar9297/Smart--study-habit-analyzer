const Prediction = require('../models/Prediction');
const StudentData = require('../models/StudentData');

// Get latest prediction for logged-in student
exports.getLatestPrediction = async (req, res) => {
    try {
        const userId = req.user.id;

        const latestPrediction = await Prediction.findOne({ userId })
            .sort({ createdAt: -1 })
            .limit(1);

        if (!latestPrediction) {
            return res.json({
                success: true,
                hasPrediction: false,
                message: 'No prediction available yet. Please submit your study habit data to generate a performance analysis.'
            });
        }

        res.json({
            success: true,
            hasPrediction: true,
            prediction: {
                id: latestPrediction._id,
                score: latestPrediction.prediction,
                label: latestPrediction.predictionLabel,
                timestamp: latestPrediction.timestamp,
                createdAt: latestPrediction.createdAt
            }
        });

    } catch (error) {
        console.error('Get latest prediction error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get prediction by ID
exports.getPredictionById = async (req, res) => {
    try {
        const userId = req.user.id;
        const predictionId = req.params.id;

        const prediction = await Prediction.findOne({
            _id: predictionId,
            userId
        });

        if (!prediction) {
            return res.status(404).json({
                success: false,
                error: 'Prediction not found'
            });
        }

        res.json({
            success: true,
            prediction: {
                id: prediction._id,
                score: prediction.prediction,
                label: prediction.predictionLabel,
                studentData: prediction.studentData,
                timestamp: prediction.timestamp,
                createdAt: prediction.createdAt
            }
        });

    } catch (error) {
        console.error('Get prediction by ID error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all predictions for logged-in student
exports.getAllPredictions = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;

        const predictions = await Prediction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            count: predictions.length,
            predictions: predictions.map(p => ({
                id: p._id,
                score: p.prediction,
                label: p.predictionLabel,
                timestamp: p.timestamp,
                createdAt: p.createdAt
            }))
        });

    } catch (error) {
        console.error('Get all predictions error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get prediction statistics
exports.getPredictionStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const predictions = await Prediction.find({ userId })
            .sort({ createdAt: -1 });

        if (predictions.length === 0) {
            return res.json({
                success: true,
                hasData: false,
                message: 'No predictions available yet.'
            });
        }

        // Calculate statistics
        const scores = predictions.map(p => p.prediction);
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);
        const latestScore = scores[0];
        const improvement = predictions.length >= 2 ? scores[0] - scores[1] : 0;

        // Calculate trend
        const recentScores = scores.slice(0, 5);
        const trend = recentScores.length >= 2
            ? recentScores[0] > recentScores[recentScores.length - 1] ? 'improving' : 'declining'
            : 'stable';

        res.json({
            success: true,
            hasData: true,
            stats: {
                totalPredictions: predictions.length,
                averageScore: Math.round(averageScore * 100) / 100,
                highestScore,
                lowestScore,
                latestScore,
                improvement: Math.round(improvement * 100) / 100,
                trend
            },
            recentPredictions: predictions.slice(0, 5).map(p => ({
                id: p._id,
                score: p.prediction,
                label: p.predictionLabel,
                date: p.createdAt
            }))
        });

    } catch (error) {
        console.error('Get prediction stats error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Delete a prediction
exports.deletePrediction = async (req, res) => {
    try {
        const userId = req.user.id;
        const predictionId = req.params.id;

        const prediction = await Prediction.findOneAndDelete({
            _id: predictionId,
            userId
        });

        if (!prediction) {
            return res.status(404).json({
                success: false,
                error: 'Prediction not found'
            });
        }

        res.json({
            success: true,
            message: 'Prediction deleted successfully'
        });

    } catch (error) {
        console.error('Delete prediction error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
