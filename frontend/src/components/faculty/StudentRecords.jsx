import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    User
} from 'lucide-react';
import { facultyService } from '../../services/facultyAPI';

const StudentRecords = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch real student data from backend
    useEffect(() => {
        fetchStudentRecords();
    }, []);

    const fetchStudentRecords = async () => {
        try {
            setLoading(true);
            const response = await facultyService.getStudentRecords();

            if (response.success && response.data.length > 0) {
                // Transform backend data to match component format
                const transformedStudents = response.data.map(student => ({
                    id: student.studentId,
                    name: student.studentName,
                    email: `${student.studentId.toLowerCase()}@student.edu`,
                    studyHours: student.study_hours_per_day,
                    sleepHours: student.sleep_hours,
                    socialMedia: student.social_media_hours,
                    predictedScore: Math.round(student.prediction),
                    status: getStatusFromScore(student.prediction),
                    attendance: student.attendance_percentage,
                    mentalHealth: student.mental_health_rating,
                    predictionLabel: student.predictionLabel,
                    lastUpdated: new Date(student.uploadDate).toLocaleDateString()
                }));

                setStudents(transformedStudents);
                setFilteredStudents(transformedStudents);
            } else {
                setStudents([]);
                setFilteredStudents([]);
            }
        } catch (err) {
            console.error('Error fetching student records:', err);
            setError('Failed to load student records');
        } finally {
            setLoading(false);
        }
    };

    const getStatusFromScore = (score) => {
        if (score >= 85) return 'high_performer';
        if (score >= 70) return 'moderate';
        if (score >= 60) return 'average';
        return 'at_risk';
    };

    // Filter and search logic
    useEffect(() => {
        let filtered = students;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(student => student.status === filterStatus);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'score':
                    return b.predictedScore - a.predictedScore;
                case 'studyHours':
                    return b.studyHours - a.studyHours;
                case 'attendance':
                    return b.attendance - a.attendance;
                default:
                    return 0;
            }
        });

        setFilteredStudents(filtered);
    }, [students, searchTerm, filterStatus, sortBy]);

    const getStatusBadge = (status, score) => {
        const configs = {
            high_performer: { color: 'bg-green-100 text-green-800', label: 'Excellent', icon: CheckCircle },
            moderate: { color: 'bg-blue-100 text-blue-800', label: 'Good', icon: TrendingUp },
            average: { color: 'bg-yellow-100 text-yellow-800', label: 'Average', icon: TrendingUp },
            at_risk: { color: 'bg-red-100 text-red-800', label: 'Needs Improvement', icon: AlertTriangle }
        };

        const config = configs[status] || configs.moderate;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const exportData = () => {
        const csvContent = [
            ['Student ID', 'Name', 'Study Hours', 'Sleep Hours', 'Social Media', 'Predicted Score', 'Status', 'Attendance'].join(','),
            ...filteredStudents.map(student => [
                student.id,
                student.name,
                student.studyHours,
                student.sleepHours,
                student.socialMedia,
                student.predictedScore,
                student.status,
                student.attendance
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_records.csv';
        a.click();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading student records...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold mb-2">Error Loading Records</p>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchStudentRecords}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center max-w-md">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Student Records</h2>
                    <p className="text-gray-600 mb-4">
                        Upload student data through Excel to view student records with ML predictions.
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
                    <h1 className="text-3xl font-bold text-gray-900">Student Records</h1>
                    <p className="text-gray-600 mt-1">View uploaded students with ML performance predictions</p>
                </div>
                <button
                    onClick={exportData}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                        >
                            <option value="all">All Students</option>
                            <option value="high_performer">Excellent (≥85)</option>
                            <option value="moderate">Good (70-84)</option>
                            <option value="average">Average (60-69)</option>
                            <option value="at_risk">Needs Improvement (&lt;60)</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="score">Sort by Score</option>
                        <option value="studyHours">Sort by Study Hours</option>
                        <option value="attendance">Sort by Attendance</option>
                    </select>

                    {/* Results Count */}
                    <div className="flex items-center text-sm text-gray-600">
                        Showing {filteredStudents.length} of {students.length} students
                    </div>
                </div>
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Study Hours
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sleep Hours
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Social Media
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ML Predicted Score
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Performance Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500">{student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{student.studyHours}h</div>
                                        <div className="text-xs text-gray-500">per day</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{student.sleepHours}h</div>
                                        <div className="text-xs text-gray-500">per night</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{student.socialMedia}h</div>
                                        <div className="text-xs text-gray-500">per day</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="text-sm font-medium text-gray-900">{student.predictedScore}%</div>
                                            <div className={`ml-2 w-16 bg-gray-200 rounded-full h-2`}>
                                                <div
                                                    className={`h-2 rounded-full ${student.predictedScore >= 85 ? 'bg-green-500' :
                                                        student.predictedScore >= 70 ? 'bg-blue-500' :
                                                            student.predictedScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${Math.min(student.predictedScore, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(student.status, student.predictedScore)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Excellent (≥85)</p>
                            <p className="text-2xl font-bold text-green-600">
                                {students.filter(s => s.status === 'high_performer').length}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Good (70-84)</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {students.filter(s => s.status === 'moderate').length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Average (60-69)</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {students.filter(s => s.status === 'average').length}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Needs Improvement</p>
                            <p className="text-2xl font-bold text-red-600">
                                {students.filter(s => s.status === 'at_risk').length}
                            </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentRecords;
