import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    ScatterChart,
    Scatter
} from 'recharts';
import { TrendingUp, Users, Target, Clock, AlertCircle } from 'lucide-react';
import { facultyService } from '../../services/facultyAPI';

const FacultyAnalytics = () => {
    const [timeRange, setTimeRange] = useState('semester');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Analytics data
    const [analytics, setAnalytics] = useState(null);
    const [trends, setTrends] = useState([]);
    const [correlationData, setCorrelationData] = useState([]);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError('');

        try {
            const [analyticsRes, trendsRes, correlationRes] = await Promise.all([
                facultyService.getAnalytics(),
                facultyService.getPerformanceTrends(),
                facultyService.getCorrelationData()
            ]);

            if (analyticsRes.success) {
                setAnalytics(analyticsRes.data);
            }

            if (trendsRes.success) {
                setTrends(trendsRes.data);
            }

            if (correlationRes.success) {
                setCorrelationData(correlationRes.data);
            }
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold mb-2">Error Loading Analytics</p>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchAnalyticsData}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!analytics || !analytics.hasData) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center max-w-md">
                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Available</h2>
                    <p className="text-gray-600 mb-4">
                        Upload student data through Excel to view analytics and performance insights.
                    </p>
                    <button
                        onClick={() => window.location.href = '/faculty/excel-upload'}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Upload Student Data
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Faculty Analytics</h1>
                    <p className="text-gray-600 mt-1">Comprehensive analysis of student performance and trends</p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setTimeRange('month')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setTimeRange('semester')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'semester' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Semester
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Overall Average</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.avgPerformance}%</p>
                            <div className="flex items-center mt-2">
                                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">Real-time data</span>
                            </div>
                        </div>
                        <Target className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
                            <p className="text-sm text-gray-500 mt-2">Uploaded records</p>
                        </div>
                        <Users className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg Study Hours</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.avgStudyHours}h</p>
                            <div className="flex items-center mt-2">
                                <Clock className="w-4 h-4 text-purple-500 mr-1" />
                                <span className="text-sm text-gray-600">Per day</span>
                            </div>
                        </div>
                        <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Success Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{analytics.successRate}%</p>
                            <p className="text-sm text-gray-500 mt-2">Students scoring ≥60%</p>
                        </div>
                        <Target className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                            { category: 'Excellent', count: analytics.distribution.excellent, fill: '#10B981' },
                            { category: 'Good', count: analytics.distribution.good, fill: '#3B82F6' },
                            { category: 'Average', count: analytics.distribution.average, fill: '#F59E0B' },
                            { category: 'Needs Improvement', count: analytics.distribution.needsImprovement, fill: '#EF4444' }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" name="Students" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance Trends */}
                {trends.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={2} name="Average Score" />
                                <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Correlation Analysis */}
            {correlationData.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Study Hours vs Performance Correlation</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="studyHours" name="Study Hours" />
                            <YAxis dataKey="examScore" name="Exam Score" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter data={correlationData} fill="#8884d8" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default FacultyAnalytics;