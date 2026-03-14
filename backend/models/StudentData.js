const mongoose = require('mongoose');

const studentDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    // Personal Information
    age: { type: Number, required: true },
    gender: { type: Number, required: true }, // 0=Female, 1=Male

    // Study Habits
    study_hours_per_day: { type: Number, required: true },
    attendance_percentage: { type: Number, required: true },
    extracurricular_participation: { type: Number, required: true },

    // Lifestyle Factors
    social_media_hours: { type: Number, required: true },
    netflix_hours: { type: Number, required: true },
    sleep_hours: { type: Number, required: true },
    exercise_frequency: { type: Number, required: true },
    diet_quality: { type: Number, required: true },

    // Environmental Factors
    parental_education_level: { type: Number, required: true },
    internet_quality: { type: Number, required: true },

    // Mental Health
    mental_health_rating: { type: Number, required: true },
    stress_level: { type: Number, required: true },
    peer_influence: { type: Number, required: true },

    // Additional Fields
    part_time_job: { type: Boolean, default: false },

    // Predictions reference
    predictions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction'
    }],

    // Metadata
    submissionDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Index for efficient queries
studentDataSchema.index({ userId: 1, submissionDate: -1 });
studentDataSchema.index({ studentId: 1 });

module.exports = mongoose.model('StudentData', studentDataSchema);