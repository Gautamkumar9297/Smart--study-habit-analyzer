const mongoose = require('mongoose');

const facultyUploadSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
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
    processedRecords: {
        type: Number,
        default: 0
    },
    failedRecords: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    processingTime: {
        type: Number // in milliseconds
    },
    errorLog: [{
        row: Number,
        error: String
    }]
}, {
    timestamps: true
});

// Index for efficient queries
facultyUploadSchema.index({ facultyId: 1, uploadDate: -1 });

module.exports = mongoose.model('FacultyUpload', facultyUploadSchema);
