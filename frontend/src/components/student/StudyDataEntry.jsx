import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Zap, CheckCircle, Loader } from 'lucide-react';
import { studentService } from '../../services/studentAPI';

const StudyDataEntry = ({ onDataSubmitted }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        student_id: '',
        age: '',
        gender: '',
        study_hours_per_day: '',
        social_media_hours: '',
        netflix_hours: '',
        part_time_job: 'no',
        attendance_percentage: '',
        sleep_hours: '',
        diet_quality: 'average',
        exercise_frequency: '',
        parental_education_level: '',
        internet_quality: 'average',
        mental_health_rating: '',
        extracurricular_participation: 'no',
        stress_level: '',
        peer_influence: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAutofill = () => {
        setFormData({
            student_id: 'STU001',
            age: '20',
            gender: '1',
            study_hours_per_day: '5.5',
            social_media_hours: '2.0',
            netflix_hours: '1.5',
            part_time_job: 'no',
            attendance_percentage: '85.5',
            sleep_hours: '7.0',
            diet_quality: 'good',
            exercise_frequency: '3',
            parental_education_level: '3',
            internet_quality: 'good',
            mental_health_rating: '7',
            extracurricular_participation: 'yes',
            stress_level: '5',
            peer_influence: '6'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert form data to API format
            const apiData = {
                age: parseInt(formData.age),
                gender: parseInt(formData.gender),
                study_hours_per_day: parseFloat(formData.study_hours_per_day),
                social_media_hours: parseFloat(formData.social_media_hours),
                netflix_hours: parseFloat(formData.netflix_hours),
                attendance_percentage: parseFloat(formData.attendance_percentage),
                sleep_hours: parseFloat(formData.sleep_hours),
                diet_quality: formData.diet_quality === 'poor' ? 3 : formData.diet_quality === 'average' ? 5 : 8,
                exercise_frequency: parseInt(formData.exercise_frequency),
                parental_education_level: parseInt(formData.parental_education_level),
                internet_quality: formData.internet_quality === 'poor' ? 3 : formData.internet_quality === 'average' ? 5 : 8,
                mental_health_rating: parseInt(formData.mental_health_rating),
                extracurricular_participation: parseInt(formData.extracurricular_participation === 'yes' ? 2 : 0),
                stress_level: parseInt(formData.stress_level),
                peer_influence: parseInt(formData.peer_influence),
                part_time_job: formData.part_time_job === 'yes'
            };

            const result = await studentService.submitData(apiData);

            setSuccess(true);

            // Call parent callback if provided
            if (onDataSubmitted) {
                onDataSubmitted();
            }

            setTimeout(() => {
                // Navigate to prediction results with the prediction data
                navigate('/student/prediction', {
                    state: {
                        prediction: {
                            prediction: result.prediction.value,
                            label: result.prediction.label,
                            status: 'success'
                        }
                    }
                });
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit data');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Submitted Successfully!</h2>
                    <p className="text-gray-600 mb-2">Your study habits have been analyzed.</p>
                    <p className="text-gray-500 text-sm">Redirecting to your prediction results...</p>
                </div>
            </div>
        );
    }

    const formFields = [
        { name: 'student_id', label: 'Student ID', type: 'text', placeholder: 'e.g., STU001' },
        { name: 'age', label: 'Age', type: 'number', placeholder: 'e.g., 20', min: 16, max: 30 },
        {
            name: 'gender',
            label: 'Gender',
            type: 'select',
            options: [
                { value: '', label: 'Select Gender' },
                { value: '0', label: 'Female' },
                { value: '1', label: 'Male' }
            ]
        },
        { name: 'study_hours_per_day', label: 'Study Hours Per Day', type: 'number', placeholder: 'e.g., 5.5', step: 0.1, min: 0, max: 24 },
        { name: 'social_media_hours', label: 'Social Media Hours', type: 'number', placeholder: 'e.g., 2.0', step: 0.1, min: 0, max: 24 },
        { name: 'netflix_hours', label: 'Netflix/Entertainment Hours', type: 'number', placeholder: 'e.g., 1.5', step: 0.1, min: 0, max: 24 },
        {
            name: 'part_time_job',
            label: 'Part-time Job',
            type: 'select',
            options: [
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' }
            ]
        },
        { name: 'attendance_percentage', label: 'Attendance Percentage', type: 'number', placeholder: 'e.g., 85.5', step: 0.1, min: 0, max: 100 },
        { name: 'sleep_hours', label: 'Sleep Hours', type: 'number', placeholder: 'e.g., 7.0', step: 0.1, min: 0, max: 24 },
        {
            name: 'diet_quality',
            label: 'Diet Quality',
            type: 'select',
            options: [
                { value: 'poor', label: 'Poor' },
                { value: 'average', label: 'Average' },
                { value: 'good', label: 'Good' }
            ]
        },
        { name: 'exercise_frequency', label: 'Exercise Frequency (days/week)', type: 'number', placeholder: 'e.g., 3', min: 0, max: 7 },
        { name: 'parental_education_level', label: 'Parental Education Level (1-5)', type: 'number', placeholder: 'e.g., 3', min: 1, max: 5 },
        {
            name: 'internet_quality',
            label: 'Internet Quality',
            type: 'select',
            options: [
                { value: 'poor', label: 'Poor' },
                { value: 'average', label: 'Average' },
                { value: 'good', label: 'Good' }
            ]
        },
        { name: 'mental_health_rating', label: 'Mental Health Rating (1-10)', type: 'number', placeholder: 'e.g., 7', min: 1, max: 10 },
        {
            name: 'extracurricular_participation',
            label: 'Extracurricular Participation',
            type: 'select',
            options: [
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' }
            ]
        },
        { name: 'stress_level', label: 'Stress Level (1-10)', type: 'number', placeholder: 'e.g., 5', min: 1, max: 10 },
        { name: 'peer_influence', label: 'Peer Influence (1-10)', type: 'number', placeholder: 'e.g., 6', min: 1, max: 10 }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Daily Study Data Entry</h1>
                            <p className="text-gray-600 mt-1">Enter your daily study habits and lifestyle data</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAutofill}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
                        >
                            <Zap className="w-4 h-4" />
                            <span>Auto Fill Sample</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {formFields.map((field) => (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {field.label}
                                </label>
                                {field.type === 'select' ? (
                                    <select
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {field.options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
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
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Submit & Get Prediction</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudyDataEntry;