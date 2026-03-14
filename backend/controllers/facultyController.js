const BatchStudentData = require('../models/BatchStudentData');
const FacultyUpload = require('../models/FacultyUpload');
const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

// Helper function to get prediction label
const getPredictionLabel = (score) => {
    if (score >= 85) return 'Excellent Study Habit';
    if (score >= 70) return 'Good Study Habit';
    if (score >= 60) return 'Average Study Habit';
    return 'Needs Improvement';
};

// Helper function to call ML service
const getPrediction = async (studentData) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict`, studentData, {
            timeout: 10000
        });
        return parseFloat(response.data.prediction);
    } catch (error) {
        console.error('ML Service Error:', error.message);
        throw new Error('Failed to get prediction from ML service');
    }
};

// Upload and process Excel data
exports.uploadExcel = async (req, res) => {
    try {
        console.log('📤 Excel upload request received');
        const { students } = req.body;
        const facultyId = req.user.id;

        console.log('Faculty ID:', facultyId);
        console.log('Number of students:', students?.length);

        if (!students || !Array.isArray(students) || students.length === 0) {
            console.error('❌ No student data provided');
            return res.status(400).json({
                success: false,
                error: 'No student data provided'
            });
        }

        // Create upload record
        const upload = await FacultyUpload.create({
            facultyId,
            fileName: req.body.fileName || 'upload.xlsx',
            fileSize: req.body.fileSize || 0, // Add fileSize
            totalRecords: students.length,
            status: 'processing'
        });

        console.log('✅ Upload record created:', upload._id);

        // Process each student record
        const processedStudents = [];
        const errors = [];

        for (let i = 0; i < students.length; i++) {
            try {
                const student = students[i];
                console.log(`Processing student ${i + 1}/${students.length}:`, student.student_id);

                // Convert gender to number if it's a string
                let genderValue = student.gender;
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

                // Prepare data for ML prediction
                const predictionData = {
                    age: parseFloat(student.age) || 20,
                    gender: genderValue,
                    study_hours_per_day: parseFloat(student.study_hours_per_day) || 5,
                    social_media_hours: parseFloat(student.social_media_hours) || 2,
                    netflix_hours: parseFloat(student.netflix_hours) || 1,
                    attendance_percentage: parseFloat(student.attendance_percentage) || 75,
                    sleep_hours: parseFloat(student.sleep_hours) || 7,
                    diet_quality: parseFloat(student.diet_quality) || 5,
                    exercise_frequency: parseFloat(student.exercise_frequency) || 3,
                    parental_education_level: parseFloat(student.parental_education_level) || 3,
                    internet_quality: parseFloat(student.internet_quality) || 5,
                    mental_health_rating: parseFloat(student.mental_health_rating) || 5,
                    extracurricular_participation: parseFloat(student.extracurricular_participation) || 3,
                    stress_level: parseFloat(student.stress_level) || 5,
                    peer_influence: parseFloat(student.peer_influence) || 5
                };

                console.log('Calling ML service for student:', student.student_id);

                // Get prediction from ML service
                const prediction = await getPrediction(predictionData);
                const predictionLabel = getPredictionLabel(prediction);

                console.log(`✅ Prediction received: ${prediction} (${predictionLabel})`);

                // Save to database
                const batchStudent = await BatchStudentData.create({
                    uploadId: upload._id,
                    facultyId,
                    studentName: student.student_name || `Student ${i + 1}`,
                    studentId: student.student_id || `STU${Date.now()}${i}`,
                    ...predictionData,
                    prediction,
                    predictionLabel
                });

                processedStudents.push(batchStudent);
                console.log(`✅ Student ${i + 1} saved to database`);
            } catch (error) {
                console.error(`❌ Error processing student ${i + 1}:`, error.message);
                errors.push({
                    row: i + 1,
                    studentId: students[i].student_id,
                    error: error.message
                });
            }
        }

        // Update upload status
        upload.status = errors.length === students.length ? 'failed' : 'completed';
        upload.processedRecords = processedStudents.length;
        await upload.save();

        console.log(`✅ Upload complete: ${processedStudents.length} processed, ${errors.length} failed`);

        res.json({
            success: true,
            message: `Successfully processed ${processedStudents.length} out of ${students.length} records`,
            uploadId: upload._id,
            processed: processedStudents.length,
            failed: errors.length,
            errors: errors.length > 0 ? errors.slice(0, 5) : undefined // Only return first 5 errors
        });

    } catch (error) {
        console.error('❌ Excel upload error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
    try {
        const facultyId = req.user.id;

        // Get all batch student data for this faculty
        const students = await BatchStudentData.find({ facultyId });

        if (students.length === 0) {
            return res.json({
                success: true,
                data: {
                    totalStudents: 0,
                    avgPerformance: 0,
                    avgStudyHours: 0,
                    successRate: 0,
                    hasData: false
                }
            });
        }

        // Calculate metrics
        const totalStudents = students.length;
        const avgPerformance = students.reduce((sum, s) => sum + s.prediction, 0) / totalStudents;
        const avgStudyHours = students.reduce((sum, s) => sum + s.study_hours_per_day, 0) / totalStudents;
        const successfulStudents = students.filter(s => s.prediction >= 60).length;
        const successRate = (successfulStudents / totalStudents) * 100;

        // Performance distribution
        const excellent = students.filter(s => s.prediction >= 85).length;
        const good = students.filter(s => s.prediction >= 70 && s.prediction < 85).length;
        const average = students.filter(s => s.prediction >= 60 && s.prediction < 70).length;
        const needsImprovement = students.filter(s => s.prediction < 60).length;

        res.json({
            success: true,
            data: {
                totalStudents,
                avgPerformance: avgPerformance.toFixed(1),
                avgStudyHours: avgStudyHours.toFixed(1),
                successRate: successRate.toFixed(1),
                distribution: {
                    excellent,
                    good,
                    average,
                    needsImprovement
                },
                hasData: true
            }
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get performance trends
exports.getPerformanceTrends = async (req, res) => {
    try {
        const facultyId = req.user.id;

        // Get students grouped by month
        const students = await BatchStudentData.find({ facultyId }).sort({ uploadDate: 1 });

        if (students.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Group by month
        const monthlyData = {};
        students.forEach(student => {
            const date = new Date(student.uploadDate);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleString('default', { month: 'short' });

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthName,
                    scores: [],
                    attendance: [],
                    studyHours: []
                };
            }

            monthlyData[monthKey].scores.push(student.prediction);
            monthlyData[monthKey].attendance.push(student.attendance_percentage);
            monthlyData[monthKey].studyHours.push(student.study_hours_per_day);
        });

        // Calculate averages
        const trends = Object.values(monthlyData).map(data => ({
            month: data.month,
            avgScore: (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(1),
            attendance: (data.attendance.reduce((a, b) => a + b, 0) / data.attendance.length).toFixed(1),
            studyHours: (data.studyHours.reduce((a, b) => a + b, 0) / data.studyHours.length).toFixed(1)
        }));

        res.json({
            success: true,
            data: trends
        });

    } catch (error) {
        console.error('Trends error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get correlation data
exports.getCorrelationData = async (req, res) => {
    try {
        const facultyId = req.user.id;

        const students = await BatchStudentData.find({ facultyId });

        if (students.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Create correlation data points
        const correlationData = students.map(student => ({
            studyHours: student.study_hours_per_day,
            examScore: student.prediction,
            attendance: student.attendance_percentage,
            sleepHours: student.sleep_hours,
            mentalHealth: student.mental_health_rating
        }));

        res.json({
            success: true,
            data: correlationData
        });

    } catch (error) {
        console.error('Correlation error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all uploads
exports.getUploads = async (req, res) => {
    try {
        const facultyId = req.user.id;

        const uploads = await FacultyUpload.find({ facultyId })
            .sort({ uploadDate: -1 })
            .limit(20);

        res.json({
            success: true,
            data: uploads
        });

    } catch (error) {
        console.error('Get uploads error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get upload details
exports.getUploadDetails = async (req, res) => {
    try {
        const { uploadId } = req.params;
        const facultyId = req.user.id;

        const upload = await FacultyUpload.findOne({ _id: uploadId, facultyId });

        if (!upload) {
            return res.status(404).json({
                success: false,
                error: 'Upload not found'
            });
        }

        const students = await BatchStudentData.find({ uploadId });

        res.json({
            success: true,
            data: {
                upload,
                students
            }
        });

    } catch (error) {
        console.error('Get upload details error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get all student records with predictions
exports.getStudentRecords = async (req, res) => {
    try {
        const facultyId = req.user.id;

        // Get all batch student data for this faculty
        const students = await BatchStudentData.find({ facultyId })
            .sort({ studentName: 1 })
            .select('-__v');

        res.json({
            success: true,
            data: students
        });

    } catch (error) {
        console.error('Get student records error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
