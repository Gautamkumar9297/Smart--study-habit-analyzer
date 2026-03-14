import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Upload,
    Users,
    BarChart3,
    LogOut,
    GraduationCap,
    X,
    Menu
} from 'lucide-react';

const FacultySidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/faculty/dashboard', icon: LayoutDashboard },
        { name: 'Upload Excel', href: '/faculty/upload', icon: Upload },
        { name: 'Student Records', href: '/faculty/students', icon: Users },
        { name: 'Analytics', href: '/faculty/analytics', icon: BarChart3 },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
                </div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>

                {/* Sidebar header */}
                <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="flex items-center space-x-3">
                        <GraduationCap className="w-8 h-8 text-white" />
                        <span className="text-white font-bold text-lg">Faculty Portal</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-white hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* User info */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {user?.name?.charAt(0) || 'F'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive(item.href)
                                            ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-indigo-700' : 'text-gray-400 group-hover:text-gray-500'
                                        }`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout button */}
                <div className="absolute bottom-0 w-full p-3">
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="bg-white p-2 rounded-lg shadow-lg text-gray-600 hover:text-gray-900"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </>
    );
};

export default FacultySidebar;