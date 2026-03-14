const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    createDefaultFaculty
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/create-faculty', createDefaultFaculty); // For initial setup

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;