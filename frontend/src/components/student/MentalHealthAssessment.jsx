import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Smile, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { mentalHealthService } from '../../services/mentalHealthAPI';

const MentalHealthAssessment = () => {
    const navigate = useNavigate();
    const [responses, setResponses] = useState({
        stress_frequency: 5,
        anxiety_frequency: 5,
        concentration_ability: 5,
        overwhelm_frequency: 5,
        wellbeing_satisfaction: 5,
        sleep_quality: 5,
        social_connection: 5,
        motivation_level: 5
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const questions = [
        {
            id: 'stress_frequency',
            question: 'How often do you feel stressed about studies or exams?',
            icon: AlertCircle,
            lowLabel: 'Never',
            highLabel: 'Always',
            reverse: true
        },
        {
            id: 'anxiety_frequency',
            question: 'How often do you feel anxious or worried about academic performance?',
            icon: Brain,
            lowLabel: 'Never',
            highLabel: 'Always',
            reverse: true
        },
        {
            id: 'concentration_ability',
            question: 'How well are you able to concentrate during study sessions?',
            icon: Brain,
            lowLabel: 'Very Poor',
            highLabel: 'Excellent',
            reverse: false
        },
        {
            id: 'overwhelm_frequency',
            question: 'How often do you feel overwhelmed with assignments or workload?',
            icon: AlertCircle,
            lowLabel: 'Never',
            highLabel: 'Always',
            reverse: true
        },
        {
            id: 'wellbeing_satisfaction',
            question: 'How satisfied are you with your mental wellbeing recently?',
            icon: Smile,
            lowLabel: 'Very Unsatisfied',
            highLabel: 'Very Satisfied',
            reverse: false
        },
        {
            id: 'sleep_quality',
            question: 'How would you rate your sleep quality?',
            icon: Heart,
            lowLabel: 'Very Poor',
            highLabel: 'Excellent',
            reverse: false
        },
        {
            id: 'social_connection',
            question: 'How connected do you feel with friends and family?',
            icon: Heart,
            lowLabel: 'Very Disconnected',
            highLabel: 'Very Connected',
            reverse: false
        },
        {
            id: 'motivation_level',
            question: 'How motivated do you feel about your studies?',
            icon: Smile,
            lowLabel: 'Not Motivated',
            highLabel: 'Very Motivated',
            reverse: false
        }
    ];

    const handleSliderChange = (questionId, value) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: parseInt(value)
        }));
    };

    const getScoreColor = (value, reverse) => {
        const effectiveValue = reverse ? 11 - value : value;
        if (effectiveValue >= 8) return 'text-green-600';
        if (effectiveValue >= 6) return 'text-blue-600';
        if (effectiveValue >= 4) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (value, reverse) => {
        const effectiveValue = reverse ? 11 - value : value;
        if (effectiveValue >= 9) return 'Excellent';
        if (effectiveValue >= 7) return 'Good';
        if (effectiveValue >= 5) return 'Moderate';
        if (effectiveValue >= 3) return 'Poor';
        return 'Critical';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await mentalHealthService.submitAssessment(responses);
            setSuccess(true);

            setTimeout(() => {
                navigate('/student/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit assessment');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Completed!</h2>
                    <p className="text-gray-600 mb-2">Your mental health assessment has been saved.</p>
                    <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center mb-4">
                    <Brain className="w-8 h-8 text-purple-600 mr-3" />
                    <h1 className="text-3xl font-bold text-gray-900">Mental Health Assessment</h1>
                </div>
                <p className="text-gray-700 mb-2">
                    This assessment helps us understand your mental wellbeing and provide better academic predictions.
                </p>
                <p className="text-sm text-gray-600">
                    Please answer honestly. All responses are confidential and used only to improve your experience.
                </p>
            </div>

            {/* Assessment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q, index) => {
                    const Icon = q.icon;
                    const value = responses[q.id];

                    return (
                        <div key={q.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-start mb-4">
                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                    <Icon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {index + 1}. {q.question}
                                    </h3>
                                    <div className="flex items-center justify-between mt-4 mb-2">
                                        <span className="text-sm text-gray-500">{q.lowLabel}</span>
                                        <span className={`text-lg font-bold ${getScoreColor(value, q.reverse)}`}>
                                            {value} - {getScoreLabel(value, q.reverse)}
                                        </span>
                                        <span className="text-sm text-gray-500">{q.highLabel}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={value}
                                        onChange={(e) => handleSliderChange(q.id, e.target.value)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <span key={num}>{num}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Submit Assessment
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">About This Assessment</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• This assessment is based on validated psychological screening tools</li>
                    <li>• Your responses help improve academic performance predictions</li>
                    <li>• Results are integrated with your study habit analysis</li>
                    <li>• You can retake this assessment anytime to track changes</li>
                </ul>
            </div>
        </div>
    );
};

export default MentalHealthAssessment;
