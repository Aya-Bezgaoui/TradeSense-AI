import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, User, RefreshCw } from 'lucide-react';

const ChatRoom = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get('/chat/');
            setMessages(res.data);
            setLoading(false);
        } catch (e) {
            console.error("Chat fetch error", e);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Simple polling every 3s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        try {
            await api.post('/chat/', {
                user_name: user?.name || 'Anonymous', // Simplified for MVP
                text: inputText
            });
            setInputText('');
            fetchMessages(); // Refresh immediately
        } catch (e) {
            console.error("Chat send error", e);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    Traders Chat
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" title="Live"></span>
                    <button onClick={fetchMessages} className="text-slate-500 hover:text-white transition-colors" title="Refresh Chat">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && <div className="text-center text-slate-500 text-sm">Connecting to secure server...</div>}

                {!loading && messages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm mt-10">
                        <p>No messages yet.</p>
                        <p className="text-xs">Be the first to say hello!</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.user_name === user?.name;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-xl p-3 ${isMe ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                                {!isMe && <div className="text-[10px] text-slate-400 mb-1 font-bold">{msg.user_name}</div>}
                                <div className="text-sm break-words">{msg.text}</div>
                                <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                    type="submit"
                    className="btn btn-primary p-2 rounded-lg flex items-center justify-center"
                    disabled={!inputText.trim()}
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;
