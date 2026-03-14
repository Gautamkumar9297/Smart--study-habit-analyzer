const express = require('express');
const Chat = require('../models/Chat');
const router = express.Router();

// Get all chats
router.get('/chats', async (req, res) => {
    try {
        const chats = await Chat.find().sort({ timestamp: 1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ message: "Error fetching chats", error: err });
    }
});

// Save a chat message
router.post('/chats', async (req, res) => {
    try {
        const { user, message, role } = req.body;
        const newChat = new Chat({ user, message, role });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (err) {
        res.status(500).json({ message: "Error saving chat", error: err });
    }
});

// Clear all chats
router.delete('/chats', async (req, res) => {
    try {
        await Chat.deleteMany({});
        res.json({ message: "All chats cleared" });
    } catch (err) {
        res.status(500).json({ message: "Error clearing chats", error: err });
    }
});

module.exports = router;
