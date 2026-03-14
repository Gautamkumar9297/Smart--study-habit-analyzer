import React, { useState, useEffect } from 'react';
import {
    Users,
    TrendingUp,
    AlertTriangle,
    Award,
    BookOpen,
    Clock,
    Target,
    BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { facultyService } from '../../services/facultyAPI';

const FacultyOverview = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        averageScore: 0,
        atRiskStudents: 0,
        topPerformers: 0,
        averageStudyHours: 0,
        attendanceRate: 0
    });

    const [riskDistribution, setRiskDistribution] = useState([]);

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        try {
            const response = await facultyService.getAnalytics();
            if (response.success && response.data.hasData) {
                const data = response.data;
                setStats({
                    totalStudents: data.totalStudents,
                    averageScore: parseFloat(data.avgPerformance),
                    atRiskStudents: data.distribution.needsImprovement,
                    topPerformers: data.distribution.excellent + data.distribution.good,
                    averageStudyHours: parseFloat(data.avgStudyHours),
                    attendanceRate: parseFloat(data.successRate)
                });

                // Set risk distribution for pie chart
                setRiskDistribution([
                    { name: 'Excellent', value: data.distribution.excellent, color: '#10B981' },
                    { name: 'Good', value: data.distribution.good, color: '#3B82F6' },
                    { name: 'Average', value: data.distribution.average, color: '#F59E0B' },
                    { name: 'At Risk', value: data.distribution.needsImprovement, color: '#EF4444' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching overview data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Static data for charts that don't have API endpoints yet
    const classPerformance = [];
    const performanceTrend = [];
    const recentAlerts = [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading overview...</p>
                </div>
            </div>
        );
    }

    if (stats.totalStudents === 0) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center max-w-md">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Student Data</h2>
                    <p className="text-gray-600 mb-4">
                        Upload student data through Excel to view the faculty overview dashboard.
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

    const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
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
                    <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
                    <p className="text-gray-600 mt-1">Monitor student performance and class analytics</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        Export Report
                    </button>
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors">
                        View All Students
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={Users}
                    color="bg-blue-500"
                    trend="+4 new this month"
                />
                <StatCard
                    title="Average Score"
                    value={`${stats.averageScore}%`}
                    icon={Target}
                    color="bg-green-500"
                    trend="+2.3% from last month"
                />
                <StatCard
                    title="At Risk Students"
                    value={stats.atRiskStudents}
                    icon={AlertTriangle}
                    color="bg-red-500"
                    subtitle="Score < 60%"
                />
                <StatCard
                    title="Top Performers"
                    value={stats.topPerformers}
                    icon={Award}
                    color="bg-yellow-500"
                    subtitle="Score ≥ 80%"
                />
                <StatCard
                    title="Avg Study Hours"
                    value={`${stats.averageStudyHours}h`}
                    icon={Clock}
                    color="bg-purple-500"
                    trend="+0.3h from last week"
                />
                <StatCard
                    title="Attendance Rate"
                    value={`${stats.attendanceRate}%`}
                    icon={BookOpen}
                    color="bg-indigo-500"
                    trend="+1.2% improvement"
                />
            </div>

            {/* Charts Section */}
            {classPerformance.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Class Performance */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Overview</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={classPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="class" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="avgScore" fill="#3B82F6" name="Average Score" />
                                <Bar dataKey="atRisk" fill="#EF4444" name="At Risk Students" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Performance Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performanceTrend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="avgScore"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    name="Average Score"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Risk Distribution and Recent Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution */}
                {riskDistribution.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Performance Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {riskDistribution.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Alerts */}
                {recentAlerts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
                        <div className="space-y-4">
                            {recentAlerts.map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${alert.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                                            }`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{alert.student}</p>
                                            <p className="text-xs text-gray-600">{alert.issue}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500">{alert.class}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            View All Alerts
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-indigo-200">
                        <h4 className="font-medium text-gray-900 mb-2">📊 Generate Report</h4>
                        <p className="text-sm text-gray-600">Create comprehensive class performance report</p>
                    </button>
                    <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-indigo-200">
                        <h4 className="font-medium text-gray-900 mb-2">📧 Send Alerts</h4>
                        <p className="text-sm text-gray-600">Notify at-risk students and parents</p>
                    </button>
                    <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-indigo-200">
                        <h4 className="font-medium text-gray-900 mb-2">📈 View Trends</h4>
                        <p className="text-sm text-gray-600">Analyze long-term performance patterns</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacultyOverview;