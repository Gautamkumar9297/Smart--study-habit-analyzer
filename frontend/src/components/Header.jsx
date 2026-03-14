import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/solid';

const Header = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg">
                            <AcademicCapIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Study Habit Predictor
                            </h1>
                            <p className="text-sm text-gray-600">
                                AI-Powered Student Performance Analysis
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Powered by</p>
                            <p className="text-sm font-semibold text-gray-700">Machine Learning</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
