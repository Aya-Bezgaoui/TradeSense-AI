import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, CheckCircle, ArrowRight, Video } from 'lucide-react';

const WebinarRegistration = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        session: 'market-open-analysis'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Spot Reserved!</h2>
                    <p className="text-slate-400 mb-6">
                        Thanks {formData.name}, you're officially registered for the webinar. We've sent a confirmation link to <span className="text-white">{formData.email}</span>.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn btn-outline w-full">
                        Register for Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Live Interactive Sessions
                    </span>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Master the Markets with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Live Mentorship</span>
                    </h1>

                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                        Join our expert analysts for real-time market breakdowns, strategy deep-dives, and live Q&A sessions. Don't just watch—participate.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                <Video className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Real-Time Analysis</h3>
                                <p className="text-slate-400 text-sm">Watch experts trade live markets and explain their rationale.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                                <User className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Direct Access Q&A</h3>
                                <p className="text-slate-400 text-sm">Ask questions and get personalized feedback on your setup.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full transform rotate-12"></div>
                    <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl relative shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Reserve Your Seat</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Select Session</label>
                                <div className="relative">
                                    <select
                                        name="session"
                                        value={formData.session}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                    >
                                        <option value="market-open-analysis">Daily Market Open - Today 14:00 GMT</option>
                                        <option value="crypto-weekly">Crypto Weekly Outlook - Friday 10:00 GMT</option>
                                        <option value="forex-strategy">Forex Scalping Mastery - Sat 18:00 GMT</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-indigo-500"
                                            placeholder="John Doe"
                                        />
                                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:border-indigo-500"
                                            placeholder="john@example.com"
                                        />
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button type="submit" className="w-full btn btn-primary py-4 text-base font-bold flex items-center justify-center gap-2 group">
                                    Secure Free Spot
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-4">
                                    Limited seats available. Join 4,500+ traders.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebinarRegistration;
