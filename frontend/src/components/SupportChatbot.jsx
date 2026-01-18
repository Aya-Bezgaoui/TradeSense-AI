import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SupportChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm the TradeSense Support Bot. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // User message
        const userMsg = { id: Date.now(), text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Bot logic
        const lowerInput = input.toLowerCase();
        let botResponse = "I'm sorry, I didn't verify that. Could you ask about 'rules', 'pricing', or 'account'?";

        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            botResponse = "Hello, Trader! Ready to conquer the markets?";
        } else if (lowerInput.includes('rule') || lowerInput.includes('loss') || lowerInput.includes('target')) {
            botResponse = "Key Rules: Daily Loss Limit is 5%, Max Total Loss is 10%, and Profit Target is 10%. Hard breaches will fail the challenge.";
        } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('plan')) {
            botResponse = "We offer Starter ($99), Pro ($199), and Elite ($499) plans. Each comes with different capital allocations.";
        } else if (lowerInput.includes('reset')) {
            botResponse = "If you failed a challenge, you can reset it by purchasing a new plan from the Pricing page.";
        } else if (lowerInput.includes('help')) {
            botResponse = "I can help with: Rules, Pricing, Account issues, and Platform features. What do you need?";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
        }, 600);
    };

    return (
        <>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all z-50 animate-bounce-slow"
                >
                    <MessageSquare className="w-8 h-8 text-white" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-bold text-white">Support Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.isBot
                                        ? 'bg-slate-800 text-slate-200 rounded-tl-none'
                                        : 'bg-indigo-600 text-white rounded-tr-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your question..."
                                className="w-full bg-slate-800 border-none rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default SupportChatbot;
