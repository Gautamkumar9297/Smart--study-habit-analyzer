const mongoose = require('mongoose');

const excelUploadSchema = new mongoose.Schema({
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    totalRecords: {
        type: Number,
        required: true
    },
    successfulRecords: {
        type: Number,
        required: true
    },
    failedRecords: {
        type: Number,
        default: 0
    },
    uploadStatus: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
    },
    errorLog: [{
        row: Number,
        error: String,
        data: mongoose.Schema.Types.Mixed
    }],
    uploadedData: [{
        student_id: String,
        age: Number,
        gender: Number,
        study_hours_per_day: Number,
        social_media_hours: Number,
        netflix_hours: Number,
        attendance_percentage: Number,
        sleep_hours: Number,
        mental_health_rating: Number,
        exam_score: Number,
        processed: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

// Index for efficient queries
excelUploadSchema.index({ uploadedBy: 1, createdAt: -1 });
excelUploadSchema.index({ uploadStatus: 1 });

module.exports = mongoose.model('ExcelUpload', excelUploadSchema);