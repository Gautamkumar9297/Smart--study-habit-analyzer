const mongoose = require('mongoose');

const mentalHealthAssessmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    // Individual question responses (1-10 scale)
    responses: {
        stress_frequency: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        anxiety_frequency: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        concentration_ability: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        overwhelm_frequency: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        wellbeing_satisfaction: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        sleep_quality: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        social_connection: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },
        motivation_level: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        }
    },
    // Calculated indicators
    mental_health_rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    stress_level: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    anxiety_level: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    // Overall wellbeing category
    wellbeing_category: {
        type: String,
        enum: ['Excellent', 'Good', 'Moderate', 'Poor', 'Critical'],
        required: true
    },
    // Metadata
    assessmentDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
mentalHealthAssessmentSchema.index({ userId: 1, assessmentDate: -1 });
mentalHealthAssessmentSchema.index({ studentId: 1 });

// Method to calculate wellbeing category
mentalHealthAssessmentSchema.methods.calculateWellbeingCategory = function () {
    const score = this.mental_health_rating;
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Moderate';
    if (score >= 3) return 'Poor';
    return 'Critical';
};

module.exports = mongoose.model('MentalHealthAssessment', mentalHealthAssessmentSchema);
