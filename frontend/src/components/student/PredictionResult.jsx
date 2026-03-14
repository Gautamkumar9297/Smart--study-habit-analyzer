import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Target,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Lightbulb,
    BarChart3,
    ArrowRight,
    Loader
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { studentService } from '../../services/studentAPI';

const PredictionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasData, setHasData] = useState(null);

    useEffect(() => {
        loadPrediction();
    }, [location.state]);

    const loadPrediction = async () => {
        try {
            // Get prediction from navigation state first (fastest)
            if (location.state?.prediction) {
                setPrediction(location.state.prediction);
                setHasData(true);
                setLoading(false);
                return;
            }

            // Fetch from backend
            const checkResponse = await studentService.checkData();
            setHasData(checkResponse.hasData);

            if (!checkResponse.hasData) {
                setLoading(false);
                return;
            }

            // Use prediction from check response if available
            if (checkResponse.prediction) {
                setPrediction({
                    prediction: checkResponse.prediction.prediction,
                    label: checkResponse.prediction.predictionLabel,
                    status: 'success'
                });
            } else {
                // Fallback to dashboard summary
                const summaryResponse = await studentService.getDashboardSummary();
                if (summaryResponse.hasData && summaryResponse.latestPrediction) {
                    setPrediction({
                        prediction: summaryResponse.latestPrediction.prediction,
                        label: summaryResponse.latestPrediction.predictionLabel,
                        status: 'success'
                    });
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading prediction:', error);
            setHasData(false);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading prediction results...</p>
                </div>
            </div>
        );
    }

    // Show message for new users without data
    if (!hasData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-2xl w-full bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
                    <div className="text-center">
                        <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            No Prediction Available Yet 🎯
                        </h2>
                        <p className="text-lg text-gray-700 mb-6">
                            Your personalized performance prediction will be generated once you complete your study habit profile.
                        </p>
                        <div className="bg-white rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-semibold text-gray-900 mb-3">What you'll get:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">🎓</span>
                                    <span>Predicted exam score based on your study habits</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">📊</span>
                                    <span>Performance category (Excellent / Good / Average / Needs Improvement)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">💡</span>
                                    <span>Personalized AI-powered recommendations</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">📈</span>
                                    <span>Actionable insights to improve your performance</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">🎯</span>
                                    <span>Study habit optimization suggestions</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => navigate('/student/data-entry')}
                            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center mx-auto"
                        >
                            Start Analysis
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!prediction) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Prediction Available</h2>
                <p className="text-gray-600">Please submit your study data first to get a prediction.</p>
            </div>
        );
    }

    const score = prediction.prediction;
    const getScoreColor = (score) => {
        if (score >= 80) return '#10B981'; // Green
        if (score >= 60) return '#3B82F6'; // Blue
        if (score >= 40) return '#F59E0B'; // Yellow
        return '#EF4444'; // Red
    };

    const getScoreLevel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Average';
        return 'Needs Improvement';
    };

    const getRecommendations = (score) => {
        if (score >= 80) {
            return [
                { icon: '🎯', title: 'Maintain Excellence', desc: 'Keep up your current study routine and habits.' },
                { icon: '📚', title: 'Advanced Learning', desc: 'Consider taking on more challenging subjects or projects.' },
                { icon: '🤝', title: 'Peer Mentoring', desc: 'Help other students with your effective study methods.' },
                { icon: '🏆', title: 'Goal Setting', desc: 'Set higher academic goals and leadership opportunities.' }
            ];
        } else if (score >= 60) {
            return [
                { icon: '⏰', title: 'Increase Study Time', desc: 'Add 1-2 more hours of focused study daily.' },
                { icon: '😴', title: 'Optimize Sleep', desc: 'Maintain 7-8 hours of quality sleep for better retention.' },
                { icon: '📱', title: 'Reduce Distractions', desc: 'Limit social media during study hours.' },
                { icon: '🏃‍♂️', title: 'Stay Active', desc: 'Regular exercise improves cognitive function.' }
            ];
        } else if (score >= 40) {
            return [
                { icon: '📖', title: 'Study Strategy', desc: 'Develop a structured study schedule and stick to it.' },
                { icon: '🎯', title: 'Focus Improvement', desc: 'Use techniques like Pomodoro for better concentration.' },
                { icon: '👥', title: 'Study Groups', desc: 'Join study groups for collaborative learning.' },
                { icon: '🍎', title: 'Healthy Habits', desc: 'Improve diet and exercise for better mental clarity.' }
            ];
        } else {
            return [
                { icon: '🚨', title: 'Immediate Action', desc: 'Significantly increase daily study hours (4-6 hours).' },
                { icon: '📅', title: 'Time Management', desc: 'Create and follow a strict daily schedule.' },
                { icon: '🏥', title: 'Seek Support', desc: 'Consider academic counseling or tutoring services.' },
                { icon: '💪', title: 'Lifestyle Changes', desc: 'Improve sleep, diet, and reduce stress factors.' }
            ];
        }
    };

    const recommendations = getRecommendations(score);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Prediction Results</h1>
                <p className="text-gray-600 mt-2">AI-powered analysis of your study habits and performance</p>
            </div>

            {/* Main Prediction Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Score Visualization */}
                    <div className="text-center">
                        <div className="w-48 h-48 mx-auto mb-6">
                            <CircularProgressbar
                                value={score}
                                text={`${score.toFixed(1)}%`}
                                styles={buildStyles({
                                    textSize: '16px',
                                    pathColor: getScoreColor(score),
                                    textColor: getScoreColor(score),
                                    trailColor: '#E5E7EB',
                                    backgroundColor: '#F3F4F6',
                                })}
                            />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Predicted Exam Score
                        </h2>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium`}
                            style={{ backgroundColor: `${getScoreColor(score)}20`, color: getScoreColor(score) }}>
                            <Target className="w-4 h-4 mr-2" />
                            {getScoreLevel(score)} Performance
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Performance Breakdown</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Study Efficiency</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium">75%</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Lifestyle Balance</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium">82%</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Mental Wellness</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium">70%</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Consistency</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                                    </div>
                                    <span className="text-sm font-medium">68%</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center mb-2">
                                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="font-medium text-gray-900">Key Insights</span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Strong sleep schedule contributing to performance</li>
                                <li>• Room for improvement in study consistency</li>
                                <li>• Good balance between academics and wellness</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center mb-6">
                    <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Personalized Recommendations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((rec, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-3">
                                <span className="text-2xl">{rec.icon}</span>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                                    <p className="text-sm text-gray-600">{rec.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Items */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    Next Steps
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        <span className="text-gray-700">Review and implement the top 2 recommendations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                        <span className="text-gray-700">Track your progress for the next 2 weeks</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                        <span className="text-gray-700">Submit new data to see improvement in predictions</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionResult;