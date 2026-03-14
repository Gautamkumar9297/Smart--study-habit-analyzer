const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d',
    });
};

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, studentId, counselorName } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            });
        }

        // Check if student ID already exists (for students)
        if (studentId) {
            const existingStudent = await User.findOne({ studentId });
            if (existingStudent) {
                return res.status(400).json({
                    success: false,
                    error: 'Student ID already exists'
                });
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: 'student',
            studentId,
            counselorName
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                counselorName: user.counselorName
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check role match
        if (user.role !== role) {
            return res.status(401).json({
                success: false,
                error: `Invalid credentials for ${role} role`
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                department: user.profile?.department
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Get Current User
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentId: user.studentId,
                profile: user.profile
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Create Default Faculty Users
exports.createDefaultFaculty = async (req, res) => {
    try {
        const facultyUsers = [
            {
                name: 'Dr. John Smith',
                email: 'faculty@university.edu',
                password: 'faculty123',
                role: 'faculty',
                profile: { department: 'Computer Science' }
            },
            {
                name: 'Prof. Sarah Johnson',
                email: 'admin@university.edu',
                password: 'admin123',
                role: 'faculty',
                profile: { department: 'Mathematics' }
            },
            {
                name: 'Dr. Michael Brown',
                email: 'teacher@university.edu',
                password: 'teacher123',
                role: 'faculty',
                profile: { department: 'Physics' }
            }
        ];

        const createdUsers = [];

        for (const facultyData of facultyUsers) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: facultyData.email });
            if (!existingUser) {
                const user = await User.create(facultyData);
                createdUsers.push({
                    name: user.name,
                    email: user.email,
                    role: user.role
                });
            }
        }

        res.json({
            success: true,
            message: `Created ${createdUsers.length} faculty users`,
            users: createdUsers
        });

    } catch (error) {
        console.error('Error creating faculty users:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};