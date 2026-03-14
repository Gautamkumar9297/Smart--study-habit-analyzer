import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const StatisticsChart = ({ statistics }) => {
    if (!statistics) return null;

    const distributionData = {
        labels: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
        datasets: [
            {
                label: 'Number of Students',
                data: [
                    statistics.distribution.excellent,
                    statistics.distribution.good,
                    statistics.distribution.average,
                    statistics.distribution.needsImprovement
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)',
                    'rgb(251, 146, 60)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const doughnutData = {
        labels: ['Excellent', 'Good', 'Average', 'Needs Improvement'],
        datasets: [
            {
                data: [
                    statistics.distribution.excellent,
                    statistics.distribution.good,
                    statistics.distribution.average,
                    statistics.distribution.needsImprovement
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const recentTrendsData = {
        labels: statistics.recentPredictions.map((_, idx) => `#${statistics.recentPredictions.length - idx}`),
        datasets: [
            {
                label: 'Recent Predictions',
                data: statistics.recentPredictions.map(p => p.prediction).reverse(),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Overall Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
                        <p className="text-sm opacity-90">Total Predictions</p>
                        <p className="text-4xl font-bold mt-2">{statistics.total}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
                        <p className="text-sm opacity-90">Average Score</p>
                        <p className="text-4xl font-bold mt-2">{statistics.averagePrediction.toFixed(1)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
                        <p className="text-sm opacity-90">Excellent Rate</p>
                        <p className="text-4xl font-bold mt-2">
                            {statistics.total > 0 ? ((statistics.distribution.excellent / statistics.total) * 100).toFixed(0) : 0}%
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Distribution by Category</h3>
                    <div className="h-80">
                        <Bar data={distributionData} options={options} />
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Distribution</h3>
                    <div className="h-80 flex items-center justify-center">
                        <Doughnut data={doughnutData} options={options} />
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Predictions Trend</h3>
                <div className="h-80">
                    <Line data={recentTrendsData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default StatisticsChart;
