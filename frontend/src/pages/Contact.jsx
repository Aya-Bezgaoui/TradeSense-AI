import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        agree: false
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agree) {
            alert("Please agree to the processing of personal data.");
            return;
        }

        setStatus('submitting');
        try {
            await api.post('/contact', {
                name: formData.name,
                email: formData.email,
                message: formData.message
            });
            setStatus('success');
            setFormData({ name: '', email: '', message: '', agree: false });
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                {/* Left Side: Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col justify-center"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-emerald-500 font-medium tracking-wide uppercase text-sm">Contacts</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Got something to <br />
                        <span className="text-emerald-500">tell us?</span>
                    </h1>

                    <p className="text-slate-400 text-lg mb-12 max-w-md">
                        Why not send us a message? We're always here to help you start your trading journey.
                    </p>

                    <div className="flex gap-4 mb-12">
                        {[
                            { icon: <Twitter className="w-5 h-5" />, href: "#" },
                            { icon: <Globe className="w-5 h-5" />, href: "#" },
                            { icon: <Linkedin className="w-5 h-5" />, href: "#" },
                            { icon: <Github className="w-5 h-5" />, href: "#" }
                        ].map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all border border-slate-800 hover:border-emerald-500"
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>

                    <div>
                        <h3 className="text-slate-500 font-medium mb-2">Email:</h3>
                        <a href="mailto:contact@tradesense.ai" className="text-xl text-white hover:text-emerald-400 transition-colors font-semibold">
                            contact@tradesense.ai
                        </a>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-slate-900/50 p-8 md:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Contact <span className="text-emerald-500">us</span></h2>
                    </div>

                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center h-80 text-center">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-slate-400">We'll get back to you shortly.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-emerald-500 font-bold hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Type your email here"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Type your name here"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 text-sm font-medium mb-2">Your message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Type your message here"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-slate-600 resize-none"
                                ></textarea>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="agree"
                                    id="agree"
                                    checked={formData.agree}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/20"
                                />
                                <label htmlFor="agree" className="text-slate-400 text-sm leading-relaxed">
                                    I agree to the processing of my personal data for the purpose of responding to my inquiry.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-emerald-500 text-slate-900 font-bold text-lg py-4 rounded-xl hover:bg-emerald-400 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {status === 'submitting' ? 'Sending...' : (
                                    <>Send Message <Send className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
