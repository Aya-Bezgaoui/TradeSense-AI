import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, CheckCircle } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubscribe = async () => {
        if (!email) return;
        setStatus('loading');
        try {
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setStatus('success');
            setEmail('');
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const Section = ({ children, className = "" }) => (
        <div className={`relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
            {children}
        </div>
    );

    return (
        <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900">
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">T</div>
                            <span className="text-xl font-bold text-white">TradeSense</span>
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-8">
                            The world's leading prop trading firm. We provide the capital, you provide the skill.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"><Globe className="w-5 h-5" /></div>
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5" /></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                            <li><Link to="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                            <li><Link to="/leaderboard" className="hover:text-emerald-400 transition-colors">Leaderboard</Link></li>
                            <li><Link to="/auth/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Newsletter</h4>
                        <p className="text-slate-400 text-sm mb-4">Get the latest trading insights.</p>
                        {status === 'success' ? (
                            <div className="text-emerald-500 font-bold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Subscribed!
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:border-emerald-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                                />
                                <button
                                    onClick={handleSubscribe}
                                    disabled={status === 'loading'}
                                    className="bg-emerald-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    {status === 'loading' ? '...' : '→'}
                                </button>
                            </div>
                        )}
                        {status === 'error' && <p className="text-red-500 text-xs mt-2">Failed to subscribe.</p>}
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>&copy; 2024 TradeSense AI. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white">Terms</Link>
                        <Link to="#" className="hover:text-white">Privacy</Link>
                        <Link to="#" className="hover:text-white">Cookies</Link>
                    </div>
                </div>
            </Section>
        </footer>
    );
};

export default Footer;
