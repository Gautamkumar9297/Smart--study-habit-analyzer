import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import StudyDataEntry from './StudyDataEntry';
import Analytics from './Analytics';
import PredictionResult from './PredictionResult';
import MentalHealthAssessment from './MentalHealthAssessment';
import ChatBox from './ChatBox';
import { studentService } from '../../services/studentAPI';
import { Loader } from 'lucide-react';

const StudentDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [hasData, setHasData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkStudentData();
    }, []);

    const checkStudentData = async () => {
        try {
            const response = await studentService.checkData();
            setHasData(response.hasData);
            setLoading(false);

            // If no data, redirect to data entry
            if (!response.hasData) {
                navigate('/student/data-entry');
            }
        } catch (error) {
            console.error('Error checking student data:', error);
            setLoading(false);
        }
    };

    const handleDataSubmitted = () => {
        setHasData(true);
        navigate('/student/dashboard');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-6 py-8">
                        <Routes>
                            <Route path="/" element={<Dashboard hasData={hasData} />} />
                            <Route path="/dashboard" element={<Dashboard hasData={hasData} />} />
                            <Route
                                path="/data-entry"
                                element={<StudyDataEntry onDataSubmitted={handleDataSubmitted} />}
                            />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/prediction" element={<PredictionResult />} />
                            <Route path="/mental-health" element={<MentalHealthAssessment />} />
                            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>

            {/* Floating ChatBox */}
            <ChatBox />
        </div>
    );
};

export default StudentDashboard;