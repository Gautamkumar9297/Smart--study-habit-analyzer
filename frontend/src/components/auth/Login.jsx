import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, Users, BookOpen, Info } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password, formData.role);

        if (result.success) {
            navigate(formData.role === 'student' ? '/student' : '/faculty');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const fillDemoCredentials = (email, password) => {
        setFormData({
            email,
            password,
            role: 'faculty'
        });
        setShowHelp(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-md w-full space-y-8 p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Smart Study Habit Analyzer</p>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Your Role
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${formData.role === 'student'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <BookOpen className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Student</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'faculty' })}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${formData.role === 'faculty'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Users className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm font-medium">Faculty</span>
                            </button>
                        </div>
                    </div>

                    {/* Faculty Demo Credentials */}
                    {formData.role === 'faculty' && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                                    <span className="text-sm text-blue-700">Demo Faculty Accounts</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowHelp(!showHelp)}
                                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                                >
                                    {showHelp ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {showHelp && (
                                <div className="mt-3 space-y-2">
                                    <div className="bg-white p-2 rounded border text-xs">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900">Dr. John Smith</p>
                                                <p className="text-gray-600">faculty@university.edu</p>
                                                <p className="text-gray-500">Password: faculty123</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fillDemoCredentials('faculty@university.edu', 'faculty123')}
                                                className="text-blue-600 hover:text-blue-700 text-xs underline"
                                            >
                                                Use
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-white p-2 rounded border text-xs">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900">Prof. Sarah Johnson</p>
                                                <p className="text-gray-600">admin@university.edu</p>
                                                <p className="text-gray-500">Password: admin123</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => fillDemoCredentials('admin@university.edu', 'admin123')}
                                                className="text-blue-600 hover:text-blue-700 text-xs underline"
                                            >
                                                Use
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={formData.role === 'faculty' ? 'faculty@university.edu' : 'Enter your email'}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={formData.role === 'faculty' ? 'faculty123' : 'Enter your password'}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                Register as Student
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;