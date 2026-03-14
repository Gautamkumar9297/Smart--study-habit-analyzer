const axios = require('axios');
const StudentData = require('../models/StudentData');
const Prediction = require('../models/Prediction');

// Check if student has submitted data
exports.checkStudentData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Use lean() for faster queries and select only needed fields
        const studentData = await StudentData.findOne({ userId })
            .sort({ createdAt: -1 })
            .select('_id userId studentId createdAt')
            .lean()
            .limit(1);

        if (!studentData) {
            return res.json({
                success: true,
                hasData: false,
                message: 'Please complete your study habit profile to analyze your academic performance.'
            });
        }

        // Get latest prediction with minimal fields
        const latestPrediction = await Prediction.findOne({
            userId: userId
        })
            .sort({ createdAt: -1 })
            .select('prediction predictionLabel createdAt')
            .lean()
            .limit(1);

        res.json({
            success: true,
            hasData: true,
            studentData: studentData,
            prediction: latestPrediction
        });

    } catch (error) {
        console.error('Check student data error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Submit student study habit data and get prediction
exports.submitStudentData = async (req, res) => {
    try {
        const userId = req.user.id;
        const studentId = req.user.studentId;
        const studyData = req.body;

        // Validate required fields
        const requiredFields = [
            'age', 'gender', 'study_hours_per_day', 'social_media_hours',
            'netflix_hours', 'attendance_percentage', 'sleep_hours',
            'diet_quality', 'exercise_frequency', 'parental_education_level',
            'internet_quality', 'mental_health_rating', 'extracurricular_participation',
            'stress_level', 'peer_influence'
        ];

        const missingFields = requiredFields.filter(field => studyData[field] === undefined);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Save student data to database
        const newStudentData = new StudentData({
            userId,
            studentId,
            ...studyData
        });
        await newStudentData.save();

        // Prepare data for ML prediction
        const predictionInput = {
            age: studyData.age,
            gender: studyData.gender,
            study_hours_per_day: studyData.study_hours_per_day,
            social_media_hours: studyData.social_media_hours,
            netflix_hours: studyData.netflix_hours,
            attendance_percentage: studyData.attendance_percentage,
            sleep_hours: studyData.sleep_hours,
            diet_quality: studyData.diet_quality,
            exercise_frequency: studyData.exercise_frequency,
            parental_education_level: studyData.parental_education_level,
            internet_quality: studyData.internet_quality,
            mental_health_rating: studyData.mental_health_rating,
            extracurricular_participation: studyData.extracurricular_participation,
            stress_level: studyData.stress_level,
            peer_influence: studyData.peer_influence
        };

        // Call Flask ML API for prediction
        const mlResponse = await axios.post(
            `${process.env.FLASK_API_URL}/predict`,
            predictionInput
        );

        const predictionValue = parseFloat(mlResponse.data.prediction);

        // Determine prediction label
        let predictionLabel;
        if (predictionValue >= 80) {
            predictionLabel = 'Excellent Study Habit';
        } else if (predictionValue >= 60) {
            predictionLabel = 'Good Study Habit';
        } else if (predictionValue >= 40) {
            predictionLabel = 'Average Study Habit';
        } else {
            predictionLabel = 'Needs Improvement';
        }

        // Save prediction to database
        const newPrediction = new Prediction({
            userId,
            studentId,
            studentData: {
                userId,
                ...predictionInput
            },
            prediction: predictionValue,
            predictionLabel
        });
        await newPrediction.save();

        // Update StudentData with prediction reference
        newStudentData.predictions = [newPrediction._id];
        await newStudentData.save();

        res.status(201).json({
            success: true,
            message: 'Study habit data submitted successfully',
            studentData: newStudentData,
            prediction: {
                value: predictionValue,
                label: predictionLabel,
                id: newPrediction._id
            }
        });

    } catch (error) {
        console.error('Submit student data error:', error);
        res.status(500).json({
            success: false,
            error: error.response?.data?.error || error.message
        });
    }
};

// Get student's prediction history
exports.getStudentHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const studentDataHistory = await StudentData.find({ userId })
            .sort({ createdAt: -1 })
            .populate('predictions');

        const predictions = await Prediction.find({
            userId: userId
        })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            history: studentDataHistory,
            predictions: predictions
        });

    } catch (error) {
        console.error('Get student history error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get student dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get latest student data
        const latestData = await StudentData.findOne({ userId })
            .sort({ createdAt: -1 });

        if (!latestData) {
            return res.json({
                success: true,
                hasData: false,
                message: 'Welcome! Please complete your study habit profile to get started.'
            });
        }

        // Get latest prediction with lean()
        const latestPrediction = await Prediction.findOne({
            userId: userId
        })
            .sort({ createdAt: -1 })
            .select('prediction predictionLabel createdAt')
            .lean();

        // Get predictions for statistics (limit to last 10 for performance)
        const allPredictions = await Prediction.find({
            userId: userId
        })
            .sort({ createdAt: -1 })
            .select('prediction createdAt')
            .limit(10)
            .lean();

        // Calculate statistics
        const stats = {
            totalSubmissions: allPredictions.length,
            averageScore: allPredictions.length > 0
                ? allPredictions.reduce((sum, p) => sum + p.prediction, 0) / allPredictions.length
                : 0,
            latestScore: latestPrediction?.prediction || 0,
            improvement: allPredictions.length >= 2
                ? allPredictions[0].prediction - allPredictions[1].prediction
                : 0
        };

        res.json({
            success: true,
            hasData: true,
            latestData,
            latestPrediction,
            stats,
            history: allPredictions.slice(0, 5) // Last 5 predictions
        });

    } catch (error) {
        console.error('Get dashboard summary error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get analytics data with trends
exports.getAnalyticsData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all student data submissions
        const allData = await StudentData.find({ userId })
            .sort({ createdAt: 1 });

        if (allData.length === 0) {
            return res.json({
                success: true,
                hasData: false,
                message: 'No analytics data available yet.'
            });
        }

        // Get all predictions
        const predictions = await Prediction.find({
            userId: userId
        })
            .sort({ createdAt: 1 });

        // Calculate trends
        const trends = allData.map((data, index) => ({
            date: data.createdAt,
            studyHours: data.study_hours_per_day,
            sleepHours: data.sleep_hours,
            socialMedia: data.social_media_hours,
            attendance: data.attendance_percentage,
            mentalHealth: data.mental_health_rating,
            stressLevel: data.stress_level,
            score: predictions[index]?.prediction || 0
        }));

        // Calculate averages
        const averages = {
            studyHours: allData.reduce((sum, d) => sum + d.study_hours_per_day, 0) / allData.length,
            sleepHours: allData.reduce((sum, d) => sum + d.sleep_hours, 0) / allData.length,
            socialMedia: allData.reduce((sum, d) => sum + d.social_media_hours, 0) / allData.length,
            attendance: allData.reduce((sum, d) => sum + d.attendance_percentage, 0) / allData.length,
            mentalHealth: allData.reduce((sum, d) => sum + d.mental_health_rating, 0) / allData.length,
            stressLevel: allData.reduce((sum, d) => sum + d.stress_level, 0) / allData.length
        };

        res.json({
            success: true,
            hasData: true,
            trends,
            averages,
            totalSubmissions: allData.length,
            latestData: allData[allData.length - 1],
            predictions
        });

    } catch (error) {
        console.error('Get analytics data error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
