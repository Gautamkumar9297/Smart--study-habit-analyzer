const MentalHealthAssessment = require('../models/MentalHealthAssessment');

// Submit mental health assessment
exports.submitAssessment = async (req, res) => {
    try {
        const userId = req.user.id;
        const studentId = req.user.studentId;
        const { responses } = req.body;

        // Validate responses
        const requiredFields = [
            'stress_frequency',
            'anxiety_frequency',
            'concentration_ability',
            'overwhelm_frequency',
            'wellbeing_satisfaction',
            'sleep_quality',
            'social_connection',
            'motivation_level'
        ];

        const missingFields = requiredFields.filter(field => !responses[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Calculate indicators
        // Mental Health Rating: Average of positive indicators (inverted for negative ones)
        const mental_health_rating = (
            (11 - responses.stress_frequency) +
            (11 - responses.anxiety_frequency) +
            responses.concentration_ability +
            (11 - responses.overwhelm_frequency) +
            responses.wellbeing_satisfaction +
            responses.sleep_quality +
            responses.social_connection +
            responses.motivation_level
        ) / 8;

        // Stress Level: Average of stress-related questions
        const stress_level = (
            responses.stress_frequency +
            responses.overwhelm_frequency +
            (11 - responses.sleep_quality)
        ) / 3;

        // Anxiety Level: Average of anxiety-related questions
        const anxiety_level = (
            responses.anxiety_frequency +
            (11 - responses.concentration_ability) +
            (11 - responses.social_connection)
        ) / 3;

        // Create assessment
        const assessment = new MentalHealthAssessment({
            userId,
            studentId,
            responses,
            mental_health_rating: Math.round(mental_health_rating * 10) / 10,
            stress_level: Math.round(stress_level * 10) / 10,
            anxiety_level: Math.round(anxiety_level * 10) / 10,
            wellbeing_category: ''
        });

        // Calculate wellbeing category
        assessment.wellbeing_category = assessment.calculateWellbeingCategory();

        await assessment.save();

        res.status(201).json({
            success: true,
            message: 'Mental health assessment submitted successfully',
            assessment: {
                id: assessment._id,
                mental_health_rating: assessment.mental_health_rating,
                stress_level: assessment.stress_level,
                anxiety_level: assessment.anxiety_level,
                wellbeing_category: assessment.wellbeing_category
            }
        });

    } catch (error) {
        console.error('Submit assessment error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get latest assessment
exports.getLatestAssessment = async (req, res) => {
    try {
        const userId = req.user.id;

        const assessment = await MentalHealthAssessment.findOne({ userId })
            .sort({ assessmentDate: -1 })
            .limit(1);

        if (!assessment) {
            return res.json({
                success: true,
                hasAssessment: false,
                message: 'No mental health assessment found. Please complete the assessment.'
            });
        }

        res.json({
            success: true,
            hasAssessment: true,
            assessment
        });

    } catch (error) {
        console.error('Get latest assessment error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get assessment history
exports.getAssessmentHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const assessments = await MentalHealthAssessment.find({ userId })
            .sort({ assessmentDate: -1 })
            .limit(10);

        res.json({
            success: true,
            count: assessments.length,
            assessments
        });

    } catch (error) {
        console.error('Get assessment history error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get assessment statistics
exports.getAssessmentStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const assessments = await MentalHealthAssessment.find({ userId })
            .sort({ assessmentDate: 1 });

        if (assessments.length === 0) {
            return res.json({
                success: true,
                hasData: false,
                message: 'No assessment data available'
            });
        }

        // Calculate trends
        const trends = assessments.map(a => ({
            date: a.assessmentDate,
            mental_health_rating: a.mental_health_rating,
            stress_level: a.stress_level,
            anxiety_level: a.anxiety_level
        }));

        // Calculate averages
        const avgMentalHealth = assessments.reduce((sum, a) => sum + a.mental_health_rating, 0) / assessments.length;
        const avgStress = assessments.reduce((sum, a) => sum + a.stress_level, 0) / assessments.length;
        const avgAnxiety = assessments.reduce((sum, a) => sum + a.anxiety_level, 0) / assessments.length;

        // Calculate improvement
        const latest = assessments[assessments.length - 1];
        const previous = assessments.length > 1 ? assessments[assessments.length - 2] : null;

        const improvement = previous ? {
            mental_health: latest.mental_health_rating - previous.mental_health_rating,
            stress: previous.stress_level - latest.stress_level, // Lower is better
            anxiety: previous.anxiety_level - latest.anxiety_level // Lower is better
        } : null;

        res.json({
            success: true,
            hasData: true,
            stats: {
                totalAssessments: assessments.length,
                averages: {
                    mental_health_rating: Math.round(avgMentalHealth * 10) / 10,
                    stress_level: Math.round(avgStress * 10) / 10,
                    anxiety_level: Math.round(avgAnxiety * 10) / 10
                },
                latest: {
                    mental_health_rating: latest.mental_health_rating,
                    stress_level: latest.stress_level,
                    anxiety_level: latest.anxiety_level,
                    wellbeing_category: latest.wellbeing_category,
                    date: latest.assessmentDate
                },
                improvement,
                trends
            }
        });

    } catch (error) {
        console.error('Get assessment stats error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
