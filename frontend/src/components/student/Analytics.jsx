import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { TrendingUp, Calendar, Clock, Target, AlertCircle, ArrowRight, Loader } from 'lucide-react';
import { studentService } from '../../services/studentAPI';

const Analytics = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('week');
    const [hasData, setHasData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        checkStudentData();
    }, []);

    const checkStudentData = async () => {
        try {
            const response = await studentService.checkData();
            setHasData(response.hasData);

            if (response.hasData) {
                loadAnalyticsData();
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error checking student data:', error);
            setLoading(false);
        }
    };

    const loadAnalyticsData = async () => {
        try {
            const response = await studentService.getAnalytics();
            setAnalyticsData(response);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    // Show message for new users without data
    if (!hasData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="max-w-2xl w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                    <div className="text-center">
                        <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            No Study Data Available Yet 📊
                        </h2>
                        <p className="text-lg text-gray-700 mb-6">
                            Analytics and performance insights will be available once you complete your study habit profile.
                        </p>
                        <div className="bg-white rounded-lg p-6 mb-6 text-left">
                            <h3 className="font-semibold text-gray-900 mb-3">What you'll see here:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">📈</span>
                                    <span>Study hours trends and patterns</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">😴</span>
                                    <span>Sleep vs performance correlation</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">📱</span>
                                    <span>Social media usage impact analysis</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">🧠</span>
                                    <span>Stress and mental health indicators</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-purple-500 mr-2">🎯</span>
                                    <span>Performance predictions and recommendations</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            onClick={() => navigate('/student/data-entry')}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center mx-auto"
                        >
                            Add Study Habit Details
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const weeklyTrends = [
        { date: '2024-01-01', studyHours: 6, sleepHours: 7, socialMedia: 2, score: 78 },
        { date: '2024-01-02', studyHours: 5, sleepHours: 6.5, socialMedia: 3, score: 75 },
        { date: '2024-01-03', studyHours: 7, sleepHours: 8, socialMedia: 2.5, score: 82 },
        { date: '2024-01-04', studyHours: 4, sleepHours: 6, socialMedia: 4, score: 70 },
        { date: '2024-01-05', studyHours: 6, sleepHours: 7.5, socialMedia: 3, score: 79 },
        { date: '2024-01-06', studyHours: 3, sleepHours: 9, socialMedia: 5, score: 65 },
        { date: '2024-01-07', studyHours: 5, sleepHours: 8.5, socialMedia: 4, score: 73 }
    ];

    const monthlyTrends = [
        { month: 'Jan', studyHours: 140, sleepHours: 217, socialMedia: 93, avgScore: 76 },
        { month: 'Feb', studyHours: 156, sleepHours: 224, socialMedia: 84, avgScore: 79 },
        { month: 'Mar', studyHours: 168, sleepHours: 231, socialMedia: 78, avgScore: 82 },
        { month: 'Apr', studyHours: 145, sleepHours: 210, socialMedia: 95, avgScore: 74 }
    ];

    const habitDistribution = [
        { name: 'Study Time', value: 35, color: '#3B82F6' },
        { name: 'Sleep', value: 30, color: '#10B981' },
        { name: 'Social Media', value: 15, color: '#F59E0B' },
        { name: 'Exercise', value: 10, color: '#EF4444' },
        { name: 'Other', value: 10, color: '#8B5CF6' }
    ];

    const performanceRadar = [
        { subject: 'Study Hours', A: 80, fullMark: 100 },
        { subject: 'Sleep Quality', A: 75, fullMark: 100 },
        { subject: 'Attendance', A: 85, fullMark: 100 },
        { subject: 'Mental Health', A: 70, fullMark: 100 },
        { subject: 'Exercise', A: 60, fullMark: 100 },
        { subject: 'Diet Quality', A: 65, fullMark: 100 }
    ];

    const correlationData = [
        { studyHours: 3, examScore: 65 },
        { studyHours: 4, examScore: 70 },
        { studyHours: 5, examScore: 75 },
        { studyHours: 6, examScore: 80 },
        { studyHours: 7, examScore: 85 },
        { studyHours: 8, examScore: 88 },
        { studyHours: 9, examScore: 90 }
    ];

    const currentData = timeRange === 'week' ? weeklyTrends : monthlyTrends;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">Detailed insights into your study patterns and performance</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setTimeRange('week')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'week'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setTimeRange('month')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'month'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Study Hours</p>
                            <p className="text-2xl font-bold text-gray-900">5.4h</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+8% vs last week</span>
                            </div>
                        </div>
                        <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Performance Score</p>
                            <p className="text-2xl font-bold text-gray-900">76%</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">+3% improvement</span>
                            </div>
                        </div>
                        <Target className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Study Streak</p>
                            <p className="text-2xl font-bold text-gray-900">12 days</p>
                            <div className="flex items-center mt-2">
                                <Calendar className="w-4 h-4 text-blue-500 mr-1" />
                                <span className="text-sm text-blue-600">Current streak</span>
                            </div>
                        </div>
                        <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                            <p className="text-2xl font-bold text-gray-900">78%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                        <Target className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Study Trends */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Study & Performance Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={currentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={timeRange === 'week' ? 'date' : 'month'} />
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
                                dataKey={timeRange === 'week' ? 'score' : 'avgScore'}
                                stroke="#10B981"
                                strokeWidth={2}
                                name="Performance Score"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Habit Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Time Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={habitDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {habitDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance Radar */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Radar</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={performanceRadar}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar
                                name="Performance"
                                dataKey="A"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.3}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Study Hours vs Exam Score Correlation */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Hours vs Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={correlationData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="studyHours" label={{ value: 'Study Hours', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Exam Score', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="examScore"
                                stroke="#F59E0B"
                                strokeWidth={3}
                                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">🎯 Optimal Study Time</h4>
                        <p className="text-sm text-gray-600">
                            Your best performance occurs with 6-7 hours of daily study time.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">😴 Sleep Impact</h4>
                        <p className="text-sm text-gray-600">
                            7+ hours of sleep correlates with 15% better performance scores.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">📱 Digital Balance</h4>
                        <p className="text-sm text-gray-600">
                            Limiting social media to under 3 hours improves focus by 20%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;