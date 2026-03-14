import React, { useState } from 'react';

const PredictionForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        study_hours_per_day: '',
        social_media_hours: '',
        netflix_hours: '',
        attendance_percentage: '',
        sleep_hours: '',
        diet_quality: '',
        exercise_frequency: '',
        parental_education_level: '',
        internet_quality: '',
        mental_health_rating: '',
        extracurricular_participation: '',
        stress_level: '',
        peer_influence: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleAutofill = () => {
        setFormData({
            age: '20',
            gender: '1',
            study_hours_per_day: '5.5',
            social_media_hours: '2.0',
            netflix_hours: '1.5',
            attendance_percentage: '85.5',
            sleep_hours: '7.0',
            diet_quality: '7',
            exercise_frequency: '3',
            parental_education_level: '3',
            internet_quality: '8',
            mental_health_rating: '7',
            extracurricular_participation: '2',
            stress_level: '5',
            peer_influence: '6'
        });
    };

    const formFields = [
        { name: 'age', label: 'Age', type: 'number', placeholder: 'e.g., 20', min: 1, max: 100 },
        { name: 'gender', label: 'Gender', type: 'select', options: [{ value: 0, label: 'Female' }, { value: 1, label: 'Male' }] },
        { name: 'study_hours_per_day', label: 'Study Hours Per Day', type: 'number', placeholder: 'e.g., 5.5', step: 0.1, min: 0, max: 24 },
        { name: 'social_media_hours', label: 'Social Media Hours', type: 'number', placeholder: 'e.g., 2.0', step: 0.1, min: 0, max: 24 },
        { name: 'netflix_hours', label: 'Netflix Hours', type: 'number', placeholder: 'e.g., 1.5', step: 0.1, min: 0, max: 24 },
        { name: 'attendance_percentage', label: 'Attendance %', type: 'number', placeholder: 'e.g., 85.5', step: 0.1, min: 0, max: 100 },
        { name: 'sleep_hours', label: 'Sleep Hours', type: 'number', placeholder: 'e.g., 7.0', step: 0.1, min: 0, max: 24 },
        { name: 'diet_quality', label: 'Diet Quality (1-10)', type: 'number', placeholder: 'e.g., 7', min: 1, max: 10 },
        { name: 'exercise_frequency', label: 'Exercise (days/week)', type: 'number', placeholder: 'e.g., 3', min: 0, max: 7 },
        { name: 'parental_education_level', label: 'Parental Education (1-5)', type: 'number', placeholder: 'e.g., 3', min: 1, max: 5 },
        { name: 'internet_quality', label: 'Internet Quality (1-10)', type: 'number', placeholder: 'e.g., 8', min: 1, max: 10 },
        { name: 'mental_health_rating', label: 'Mental Health (1-10)', type: 'number', placeholder: 'e.g., 7', min: 1, max: 10 },
        { name: 'extracurricular_participation', label: 'Extracurricular (0-5)', type: 'number', placeholder: 'e.g., 2', min: 0, max: 5 },
        { name: 'stress_level', label: 'Stress Level (1-10)', type: 'number', placeholder: 'e.g., 5', min: 1, max: 10 },
        { name: 'peer_influence', label: 'Peer Influence (1-10)', type: 'number', placeholder: 'e.g., 6', min: 1, max: 10 }
    ];

    return (
        <form onSubmit={handleSubmit} className="card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
                <button
                    type="button"
                    onClick={handleAutofill}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Auto Fill Sample Data</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formFields.map((field) => (
                    <div key={field.name}>
                        <label className="label">{field.label}</label>
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                                className="input-field"
                            >
                                <option value="">Select...</option>
                                {field.options.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required
                                placeholder={field.placeholder}
                                step={field.step}
                                min={field.min}
                                max={field.max}
                                className="input-field"
                            />
                        )}
                    </div>
                ))}
            </div>
            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-8"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Predicting...
                    </span>
                ) : (
                    'Get Prediction'
                )}
            </button>
        </form>
    );
};

export default PredictionForm;
