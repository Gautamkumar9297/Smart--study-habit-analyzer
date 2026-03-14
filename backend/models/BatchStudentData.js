const mongoose = require('mongoose');

const batchStudentDataSchema = new mongoose.Schema({
    uploadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultyUpload',
        required: true,
        index: true
    },
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    // Study habit data (15 features)
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
    peer_influence: { type: Number, required: true },

    // ML Prediction results
    prediction: {
        type: Number,
        required: true
    },
    predictionLabel: {
        type: String,
        required: true,
        enum: ['Excellent Study Habit', 'Good Study Habit', 'Average Study Habit', 'Needs Improvement']
    },

    // Metadata
    uploadDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
batchStudentDataSchema.index({ facultyId: 1, uploadDate: -1 });
batchStudentDataSchema.index({ uploadId: 1 });
batchStudentDataSchema.index({ prediction: 1 });

module.exports = mongoose.model('BatchStudentData', batchStudentDataSchema);
