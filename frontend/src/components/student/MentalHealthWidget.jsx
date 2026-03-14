import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, AlertCircle, Heart, ArrowRight, Loader } from 'lucide-react';
import { mentalHealthService } from '../../services/mentalHealthAPI';

const MentalHealthWidget = () => {
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAssessment, setHasAssessment] = useState(false);

    useEffect(() => {
        loadAssessment();
    }, []);

    const loadAssessment = async () => {
        try {
            const response = await mentalHealthService.getLatest();
            setHasAssessment(response.hasAssessment);
            if (response.hasAssessment) {
                setAssessment(response.assessment);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading assessment:', error);
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'bg-green-500';
        if (score >= 6) return 'bg-blue-500';
        if (score >= 4) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreTextColor = (score) => {
        if (score >= 8) return 'text-green-600';
        if (score >= 6) return 'text-blue-600';
        if (score >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-center py-8">
                    <Loader className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            </div>
        );
    }

    if (!hasAssessment) {
        return (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="flex items-center mb-4">
                    <Brain className="w-6 h-6 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Mental Health Assessment</h3>
                </div>
                <p className="text-gray-700 mb-4">
                    Your mental health assessment has not been completed yet. Complete the assessment to improve prediction accuracy.
                </p>
                <button
                    onClick={() => navigate('/student/mental-health')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center"
                >
                    Start Mental Health Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Brain className="w-6 h-6 text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Mental Wellbeing</h3>
                </div>
                <button
                    onClick={() => navigate('/student/mental-health')}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    Retake Assessment
                </button>
            </div>

            {/* Main Indicators */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Mental Health Rating */}
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="#E5E7EB"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke={assessment.mental_health_rating >= 8 ? '#10B981' : assessment.mental_health_rating >= 6 ? '#3B82F6' : assessment.mental_health_rating >= 4 ? '#F59E0B' : '#EF4444'}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${(assessment.mental_health_rating / 10) * 226} 226`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xl font-bold ${getScoreTextColor(assessment.mental_health_rating)}`}>
                                {assessment.mental_health_rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Mental Health</p>
                </div>

                {/* Stress Level */}
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="#E5E7EB"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke={assessment.stress_level <= 3 ? '#10B981' : assessment.stress_level <= 5 ? '#3B82F6' : assessment.stress_level <= 7 ? '#F59E0B' : '#EF4444'}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${(assessment.stress_level / 10) * 226} 226`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xl font-bold ${assessment.stress_level <= 3 ? 'text-green-600' : assessment.stress_level <= 5 ? 'text-blue-600' : assessment.stress_level <= 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {assessment.stress_level.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Stress Level</p>
                </div>

                {/* Anxiety Level */}
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-2">
                        <svg className="w-20 h-20 transform -rotate-90">
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke="#E5E7EB"
                                strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                stroke={assessment.anxiety_level <= 3 ? '#10B981' : assessment.anxiety_level <= 5 ? '#3B82F6' : assessment.anxiety_level <= 7 ? '#F59E0B' : '#EF4444'}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${(assessment.anxiety_level / 10) * 226} 226`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xl font-bold ${assessment.anxiety_level <= 3 ? 'text-green-600' : assessment.anxiety_level <= 5 ? 'text-blue-600' : assessment.anxiety_level <= 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {assessment.anxiety_level.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Anxiety Level</p>
                </div>
            </div>

            {/* Wellbeing Category */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Overall Wellbeing:</span>
                    <span className={`font-semibold ${getScoreTextColor(assessment.mental_health_rating)}`}>
                        {assessment.wellbeing_category}
                    </span>
                </div>
            </div>

            {/* Last Assessment Date */}
            <p className="text-xs text-gray-500 text-center">
                Last assessed: {new Date(assessment.assessmentDate).toLocaleDateString()}
            </p>
        </div>
    );
};

export default MentalHealthWidget;
