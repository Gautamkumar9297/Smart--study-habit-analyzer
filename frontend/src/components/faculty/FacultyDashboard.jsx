import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FacultySidebar from './FacultySidebar';
import FacultyOverview from './FacultyOverview';
import ExcelUpload from './ExcelUpload';
import StudentRecords from './StudentRecords';
import FacultyAnalytics from './FacultyAnalytics';

const FacultyDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            <FacultySidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                    <div className="container mx-auto px-6 py-8">
                        <Routes>
                            <Route path="/" element={<FacultyOverview />} />
                            <Route path="/dashboard" element={<FacultyOverview />} />
                            <Route path="/upload" element={<ExcelUpload />} />
                            <Route path="/students" element={<StudentRecords />} />
                            <Route path="/analytics" element={<FacultyAnalytics />} />
                            <Route path="*" element={<Navigate to="/faculty/dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FacultyDashboard;