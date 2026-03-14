const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    studentId: {
        type: String,
        required: true,
        index: true
    },
    studentData: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        age: { type: Number, required: true },
        gender: { type: Number, required: true },
        study_hours_per_day: { type: Number, required: true },
        social_media_hours: { type: Number, required: true },
        netflix_hours: { type: Number, required: true },
        attendance_percentage: { type: Number, required: true },
        sleep_hours: { type: Number, required: true },
        diet_quality: { type: Number, required: true },
        exercise_frequency: { type: Number, required: true },
        parental_education_level: { type: Number, required: true },
        internet_quality: { type: Number, required: true },
        mental_health_rating: { type: Number, required: true },
        extracurricular_participation: { type: Number, required: true },
        stress_level: { type: Number, required: true },
        peer_influence: { type: Number, required: true }
    },
    prediction: {
        type: Number,
        required: true
    },
    predictionLabel: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
predictionSchema.index({ userId: 1, createdAt: -1 });
predictionSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
