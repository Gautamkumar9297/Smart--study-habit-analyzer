const axios = require('axios');
const Chat = require('../models/Chat');

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAm17-bxHBB4zrr0-9cMips__OSa4P-68o';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Get Gemini AI reply
async function getGeminiReply(prompt) {
    try {
        const response = await axios.post(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            console.error("❌ Gemini API Error:", response.data);
            return "Sorry, I couldn't process your question right now.";
        }
    } catch (err) {
        console.error("❌ Network Error:", err.response?.data || err.message);
        return "Network error while contacting Gemini.";
    }
}

// Handle chat message and get bot response
exports.handleChatMessage = async (userMessage, userName = 'Student') => {
    try {
        // Save user message to database
        const userChat = new Chat({
            user: userName,
            message: userMessage,
            role: 'user'
        });
        await userChat.save();

        // Create context-aware prompt for study habits
        const prompt = `You are a helpful and friendly study habit advisor for students. 
Your role is to provide practical advice on:
- Study techniques and time management
- Dealing with stress and maintaining mental health
- Balancing academics with social life
- Improving focus and productivity
- Healthy lifestyle habits for students

Student's question: ${userMessage}

Provide a helpful, concise response (2-3 paragraphs maximum).`;

        // Get AI response from Gemini
        const botMessage = await getGeminiReply(prompt);

        // Save bot response to database
        const botChat = new Chat({
            user: 'Bot',
            message: botMessage,
            role: 'bot'
        });
        await botChat.save();

        return botChat;

    } catch (error) {
        console.error('Chat handling error:', error);

        // Fallback response
        const fallbackMessage = "I'm here to help with your study habits! Could you please rephrase your question?";
        const botChat = new Chat({
            user: 'Bot',
            message: fallbackMessage,
            role: 'bot'
        });
        await botChat.save();

        return botChat;
    }
};
