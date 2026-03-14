require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const predictionRoutes = require('./routes/predictionRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const studentDataRoutes = require('./routes/studentDataRoutes');
const mentalHealthRoutes = require('./routes/mentalHealthRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const errorHandler = require('./middleware/errorHandler');
const { handleChatMessage } = require('./controllers/chatController');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api', chatRoutes);
app.use('/api/student', studentDataRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/faculty', facultyRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Backend server is running',
        mongodb: 'connected',
        timestamp: new Date().toISOString()
    });
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    socket.on('chatMessage', async (data) => {
        console.log('📩 Message received:', data);

        // Get bot response from Gemini API
        const botResponse = await handleChatMessage(data.message, data.user);

        // Send bot response back to client
        socket.emit('botResponse', botResponse);
    });

    socket.on('endChat', () => {
        console.log('🛑 Chat ended by user');
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

// Error handler
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Socket.IO server ready for connections`);
});
