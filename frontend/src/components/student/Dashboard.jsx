import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Moon,
    Smartphone,
    Calendar,
    Brain,
    Target,
    TrendingUp,
    Award,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { studentService } from '../../services/studentAPI';
import MentalHealthWidget from './MentalHealthWidget';

const Dashboard = ({ hasData }) => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [latestPrediction, setLatestPrediction] = useState(null);
    const [stats, setStats] = useState({
        totalStudyHours: 42,
        sleepHours: 7.2,
        socialMediaUsage: 3.5,
        attendancePercentage: 85,
        mentalHealthScore: 7,
        predictedExamScore: 78
    });

    useEffect(() => {
        if (hasData) {
            loadDashboardData();
        } else {
            setLoading(false);
        }
    }, [hasData]);

    useEffect(() => {
        if (dashboardData) {
            setStats({
                totalStudyHours: dashboardData?.stats?.totalSubmissions * 5 || 42,
                sleepHours: dashboardData?.latestData?.sleep_hours || 7.2,
                socialMediaUsage: dashboardData?.latestData?.social_media_hours || 3.5,
                attendancePercentage: dashboardData?.latestData?.attendance_percentage || 85,
                mentalHealthScore: dashboardData?.latestData?.mental_health_rating || 7,
                predictedExamScore: Math.round(latestPrediction?.prediction || dashboardData?.latestPrediction?.prediction || 78)
            });
        }
    }, [dashboardData, latestPrediction]);

    const loadDashboardData = async () => {
        try {
            const summaryResponse = await studentService.getDashboardSummary();
            setDashboardData(summaryResponse);

            if (summaryResponse.latestPrediction) {
                setLatestPrediction({
                    prediction: summaryResponse.latestPrediction.prediction,
                    label: summaryResponse.latestPrediction.predictionLabel
                });
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            setLoading(false);
        }
    };

    // Show welcome message for new users
    if (!hasData && !loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-2xl w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                    <div className="text-center">
                        <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Welcome to Your Study Dashboard! 🎓
                        </h2>
                        <p className="text-lg text-gray-700 mb-6">
                            To get started with personalized insights and AI-powered recommendations,
                            please complete your study habit profile.
                        </p>
                        <div className="bg-white rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-semibold text-gray-900 mb-3">What you'll get:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Personalized academic performance predictions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>AI-powered study habit recommendations</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Detailed analytics and progress tracking</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Insights on lifestyle factors affecting your performance</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => navigate('/student/data-entry')}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center mx-auto"
                        >
                            Complete Your Profile
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const weeklyData = [
        { day: 'Mon', studyHours: 6, sleepHours: 7, socialMedia: 2 },
        { day: 'Tue', studyHours: 5, sleepHours: 6.5, socialMedia: 3 },
        { day: 'Wed', studyHours: 7, sleepHours: 8, socialMedia: 2.5 },
        { day: 'Thu', studyHours: 4, sleepHours: 6, socialMedia: 4 },
        { day: 'Fri', studyHours: 6, sleepHours: 7.5, socialMedia: 3 },
        { day: 'Sat', studyHours: 3, sleepHours: 9, socialMedia: 5 },
        { day: 'Sun', studyHours: 5, sleepHours: 8.5, socialMedia: 4 }
    ];

    const performanceData = [
        { subject: 'Math', score: 85 },
        { subject: 'Science', score: 78 },
        { subject: 'English', score: 82 },
        { subject: 'History', score: 75 },
        { subject: 'Physics', score: 80 }
    ];

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">{trend}</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back! Here's your study overview.</p>
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg">
                    <div className="text-center">
                        <p className="text-sm opacity-90">Predicted Score</p>
                        <p className="text-2xl font-bold">{stats.predictedExamScore}%</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Study Hours"
                    value={`${stats.totalStudyHours}h`}
                    icon={Clock}
                    color="bg-blue-500"
                    trend="+12% from last week"
                />
                <StatCard
                    title="Average Sleep"
                    value={`${stats.sleepHours}h`}
                    icon={Moon}
                    color="bg-indigo-500"
                    trend="+0.5h from last week"
                />
                <StatCard
                    title="Social Media Usage"
                    value={`${stats.socialMediaUsage}h`}
                    icon={Smartphone}
                    color="bg-purple-500"
                    trend="-0.8h from last week"
                />
                <StatCard
                    title="Attendance"
                    value={`${stats.attendancePercentage}%`}
                    icon={Calendar}
                    color="bg-green-500"
                    trend="+5% from last month"
                />
                <StatCard
                    title="Mental Health"
                    value={`${stats.mentalHealthScore}/10`}
                    icon={Brain}
                    color="bg-pink-500"
                    trend="Stable"
                />
                <StatCard
                    title="Performance"
                    value="Good"
                    icon={Award}
                    color="bg-yellow-500"
                    trend="Improving"
                />
            </div>

            {/* Mental Health Widget */}
            <MentalHealthWidget />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Study Trend */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Study Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="studyHours"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                name="Study Hours"
                            />
                            <Line
                                type="monotone"
                                dataKey="sleepHours"
                                stroke="#10B981"
                                strokeWidth={2}
                                name="Sleep Hours"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Subject Performance */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="score" fill="#6366F1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    AI Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-2">📚 Study Optimization</h4>
                        <p className="text-sm text-gray-600">
                            Increase study hours by 1-2 hours daily to reach your target score of 85%.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-2">😴 Sleep Schedule</h4>
                        <p className="text-sm text-gray-600">
                            Maintain your current sleep pattern. 7+ hours is optimal for learning.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-2">📱 Digital Wellness</h4>
                        <p className="text-sm text-gray-600">
                            Great job reducing social media usage! Keep it under 3 hours daily.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-2">🏃‍♂️ Exercise Routine</h4>
                        <p className="text-sm text-gray-600">
                            Add 30 minutes of exercise 3x per week to boost cognitive performance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;