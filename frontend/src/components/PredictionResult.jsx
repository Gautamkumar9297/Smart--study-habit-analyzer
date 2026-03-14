import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const PredictionResult = ({ prediction, label }) => {
    // Ensure prediction is a number
    const predictionValue = typeof prediction === 'number' ? prediction : parseFloat(prediction);

    const getColorClass = (value) => {
        if (value >= 80) return 'from-green-500 to-emerald-600';
        if (value >= 60) return 'from-blue-500 to-indigo-600';
        if (value >= 40) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    const getIcon = (value) => {
        if (value >= 60) {
            return <CheckCircleIcon className="w-16 h-16 text-white" />;
        }
        return <ExclamationCircleIcon className="w-16 h-16 text-white" />;
    };

    return (
        <div className="card animate-fade-in">
            <div className={`bg-gradient-to-r ${getColorClass(predictionValue)} rounded-lg p-8 text-white text-center`}>
                <div className="flex justify-center mb-4">
                    {getIcon(predictionValue)}
                </div>
                <h2 className="text-3xl font-bold mb-2">Prediction Result</h2>
                <div className="text-6xl font-extrabold mb-4">
                    {predictionValue.toFixed(2)}
                </div>
                <p className="text-xl font-semibold">{label}</p>
            </div>

            <div className="mt-6">
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block text-gray-600">
                                Performance Score
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-gray-600">
                                {predictionValue.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                        <div
                            style={{ width: `${Math.min(predictionValue, 100)}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${getColorClass(predictionValue)} transition-all duration-500`}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionResult;
