import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { MessageCircle, Send, X } from "lucide-react";

const socket = io("http://localhost:5001");

const ChatBox = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const chatWindowRef = useRef(null);

    useEffect(() => {
        loadChat();

        socket.on("botResponse", (data) => {
            console.log("📩 Bot message received:", data);
            setChat((prev) => [...prev, data]);
        });

        socket.on("connect", () => console.log("✅ Socket connected"));
        socket.on("disconnect", () => console.log("❌ Socket disconnected"));

        return () => {
            socket.off("botResponse");
        };
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [chat]);

    // Load previous chat
    const loadChat = () => {
        axios
            .get("http://localhost:5001/api/chats")
            .then((res) => setChat(res.data))
            .catch((err) => console.error("Chat load error:", err));
    };

    // Send message
    const sendMessage = () => {
        if (!message.trim()) return;

        const newMsg = {
            user: "Student",
            message,
            role: "user",
        };

        socket.emit("chatMessage", newMsg);
        setChat((prev) => [...prev, newMsg]);
        setMessage("");
    };

    // Handle Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // End Chat
    const endChat = () => {
        console.log("🛑 Chat ended");
        setChat([]);
        setMessage("");
        socket.emit("endChat");

        // Clear chat from database
        axios.delete("http://localhost:5001/api/chats")
            .catch((err) => console.error("Error clearing chats:", err));
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col" style={{ height: '600px' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <h3 className="font-semibold">Study Habit Advisor</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatWindowRef}
                        className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3"
                    >
                        {chat.length === 0 && (
                            <div className="text-center text-gray-500 mt-8">
                                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>Start a conversation...</p>
                                <p className="text-sm mt-1">Ask me about study habits!</p>
                            </div>
                        )}
                        {chat.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "bot" ? "justify-start" : "justify-end"}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${msg.role === "bot"
                                            ? "bg-white text-gray-800 shadow-sm"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                        }`}
                                >
                                    <p className="text-sm font-medium mb-1">
                                        {msg.role === "bot" ? "🤖 Bot" : "You"}
                                    </p>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t rounded-b-2xl">
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Ask your study question..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-200"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            onClick={endChat}
                            className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            End Chat & Clear History
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;
