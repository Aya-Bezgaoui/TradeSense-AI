import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, User, RefreshCw } from 'lucide-react';

const ChatRoom = ({ channel }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            if (channel === 'General' || !channel) {
                // Real backend for General
                const res = await api.get('/chat/');
                setMessages(res.data);
            } else {
                // Mock data for other channels (MVP)
                // Simulate delay
                await new Promise(r => setTimeout(r, 500));

                // Deterministic mock based on channel name
                const mocks = [
                    { id: 1, user_name: 'CryptoKing', text: `Anyone watching BTC in ${channel}?`, timestamp: new Date(Date.now() - 1000000).toISOString() },
                    { id: 2, user_name: 'SarahForex', text: 'Structure looks bullish on 4H.', timestamp: new Date(Date.now() - 500000).toISOString() },
                    { id: 3, user_name: 'MikeQuant', text: 'Waiting for the NY open to enter.', timestamp: new Date(Date.now() - 100000).toISOString() },
                ];
                setMessages(mocks);
            }
        } catch (e) {
            console.error("Chat fetch error", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        // Polling only for General (Real backend)
        let interval;
        if (channel === 'General') {
            interval = setInterval(fetchMessages, 3000);
        }
        return () => {
            if (interval) clearInterval(interval);
        }
    }, [channel]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        try {
            if (channel === 'General' || !channel) {
                await api.post('/chat/', {
                    user_name: user?.name || 'Anonymous',
                    text: inputText
                });
                fetchMessages(); // Refresh
            } else {
                // Local mock send
                const newMsg = {
                    id: Date.now(),
                    user_name: user?.name || 'Me',
                    text: inputText,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMsg]);
            }
            setInputText('');
        } catch (e) {
            console.error("Chat send error", e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    {channel || 'General'} Chat
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
                {loading && <div className="text-center text-slate-500 text-sm">Connecting to secure {channel}...</div>}

                {!loading && messages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm mt-10">
                        <p>No messages yet.</p>
                        <p className="text-xs">Be the first to say hello!</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.user_name === user?.name || msg.user_name === 'Me';
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
                    placeholder={`Message #${channel || 'general'}...`}
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
