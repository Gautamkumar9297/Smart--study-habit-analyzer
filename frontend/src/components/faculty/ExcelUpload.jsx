import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { facultyService } from '../../services/facultyAPI';
import {
    Upload,
    FileSpreadsheet,
    CheckCircle,
    AlertCircle,
    Download,
    Eye,
    Trash2
} from 'lucide-react';

const ExcelUpload = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const expectedColumns = [
        'student_id', 'student_name', 'age', 'gender', 'study_hours_per_day',
        'social_media_hours', 'netflix_hours', 'attendance_percentage', 'sleep_hours',
        'mental_health_rating', 'stress_level', 'peer_influence'
    ];

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setUploadedFile(file);
            setError('');
            setSuccess(false);
            parseExcelFile(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            'text/csv': ['.csv']
        },
        multiple: false
    });

    const parseExcelFile = (file) => {
        setLoading(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Validate columns
                if (jsonData.length > 0) {
                    const fileColumns = Object.keys(jsonData[0]);
                    const missingColumns = expectedColumns.filter(col => !fileColumns.includes(col));

                    if (missingColumns.length > 0) {
                        setError(`Missing required columns: ${missingColumns.join(', ')}`);
                        setLoading(false);
                        return;
                    }
                }

                // Process and normalize data
                const processedData = jsonData.map(row => {
                    // Convert gender text to number if needed
                    let genderValue = row.gender;
                    if (typeof genderValue === 'string') {
                        const genderLower = genderValue.toLowerCase();
                        if (genderLower === 'male' || genderLower === 'm') {
                            genderValue = 1;
                        } else if (genderLower === 'female' || genderLower === 'f') {
                            genderValue = 0;
                        } else {
                            genderValue = parseInt(genderValue) || 0;
                        }
                    }

                    return {
                        ...row,
                        gender: genderValue,
                        // Ensure numeric values
                        age: parseFloat(row.age) || 0,
                        study_hours_per_day: parseFloat(row.study_hours_per_day) || 0,
                        social_media_hours: parseFloat(row.social_media_hours) || 0,
                        netflix_hours: parseFloat(row.netflix_hours) || 0,
                        attendance_percentage: parseFloat(row.attendance_percentage) || 0,
                        sleep_hours: parseFloat(row.sleep_hours) || 0,
                        mental_health_rating: parseFloat(row.mental_health_rating) || 5,
                        stress_level: parseFloat(row.stress_level) || 5,
                        peer_influence: parseFloat(row.peer_influence) || 5
                    };
                });

                setParsedData(processedData);
                setPreviewMode(true);
                setLoading(false);
            } catch (err) {
                console.error('Parse error:', err);
                setError('Error parsing file. Please ensure it\'s a valid Excel/CSV file.');
                setLoading(false);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const handleUpload = async () => {
        // Debug logging
        console.log('🔵 ===== UPLOAD BUTTON CLICKED =====');
        console.log('📊 Parsed Data Length:', parsedData?.length);
        console.log('📁 File Name:', uploadedFile?.name);
        console.log('🔑 Token Exists:', !!localStorage.getItem('token'));
        console.log('📋 Sample Data:', parsedData[0]);

        // Validation
        if (!parsedData || parsedData.length === 0) {
            console.error('❌ No data to upload');
            setError('No data to upload');
            return;
        }

        if (!localStorage.getItem('token')) {
            console.error('❌ No token found');
            setError('Please login again');
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('🚀 Calling facultyService.uploadExcel...');
            console.log('📤 Uploading', parsedData.length, 'students');

            // Upload data to backend with file size
            const result = await facultyService.uploadExcel(
                parsedData,
                uploadedFile.name,
                uploadedFile.size
            );

            console.log('✅ Upload result received:', result);

            if (result.success) {
                console.log('✅ Upload successful!');
                console.log('   Processed:', result.processed);
                console.log('   Failed:', result.failed);

                setSuccess(true);
                setPreviewMode(false);

                // Show success message with details
                if (result.failed > 0) {
                    console.warn('⚠️ Some records failed:', result.errors);
                }

                setTimeout(() => {
                    setSuccess(false);
                    setUploadedFile(null);
                    setParsedData([]);
                }, 3000);
            } else {
                console.error('❌ Upload failed:', result.error);
                setError(result.error || 'Upload failed');
            }
        } catch (err) {
            console.error('❌ Upload error caught:', err);
            console.error('   Message:', err.message);
            console.error('   Response:', err.response?.data);
            console.error('   Status:', err.response?.status);

            const errorMessage = err.response?.data?.error || err.message || 'Failed to upload data. Please try again.';
            setError(errorMessage);
            alert('Upload Error: ' + errorMessage); // Show alert for visibility
        } finally {
            console.log('🏁 Upload process finished');
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const templateData = [
            {
                student_id: 'STU001',
                student_name: 'John Doe',
                age: 20,
                gender: 1,
                study_hours_per_day: 5.5,
                social_media_hours: 2.0,
                netflix_hours: 1.5,
                attendance_percentage: 85.5,
                sleep_hours: 7.0,
                mental_health_rating: 7,
                stress_level: 5,
                peer_influence: 6,
                diet_quality: 7,
                exercise_frequency: 4,
                parental_education_level: 3,
                internet_quality: 8,
                extracurricular_participation: 5
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Student Data');
        XLSX.writeFile(wb, 'student_data_template.xlsx');
    };

    const clearData = () => {
        setUploadedFile(null);
        setParsedData([]);
        setPreviewMode(false);
        setError('');
        setSuccess(false);
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h2>
                    <p className="text-gray-600 mb-4">
                        Student data has been uploaded and processed successfully.
                    </p>
                    <button
                        onClick={() => window.location.href = '/faculty/analytics'}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        View Analytics
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
                    <h1 className="text-3xl font-bold text-gray-900">Excel Data Upload</h1>
                    <p className="text-gray-600 mt-1">Upload student data in bulk using Excel or CSV files</p>
                </div>
                <button
                    onClick={downloadTemplate}
                    className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    <span>Download Template</span>
                </button>
            </div>

            {!previewMode ? (
                /* Upload Section */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Student Data</h2>

                        {/* Dropzone */}
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                                ? 'border-blue-400 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            <input {...getInputProps()} />
                            <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            {isDragActive ? (
                                <p className="text-blue-600 font-medium">Drop the file here...</p>
                            ) : (
                                <div>
                                    <p className="text-gray-600 font-medium mb-2">
                                        Drag & drop your Excel file here, or click to browse
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Supports .xlsx, .xls, and .csv files
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* File Info */}
                        {uploadedFile && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {(uploadedFile.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearData}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="mt-4 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                                <span className="text-gray-600">Processing file...</span>
                            </div>
                        )}
                    </div>

                    {/* Required Columns Info */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Required Columns</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            {expectedColumns.map((column) => (
                                <span
                                    key={column}
                                    className="text-xs bg-white px-2 py-1 rounded border text-gray-700"
                                >
                                    {column}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Preview Section */
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Data Preview</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {parsedData.length} records found. Review before uploading.
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setPreviewMode(false)}
                                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Back to Upload</span>
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            <span>Upload Data</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {expectedColumns.map((column) => (
                                        <th
                                            key={column}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {column.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parsedData.slice(0, 10).map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {expectedColumns.map((column) => (
                                            <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {row[column]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {parsedData.length > 10 && (
                        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
                            Showing first 10 records of {parsedData.length} total records
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ExcelUpload;