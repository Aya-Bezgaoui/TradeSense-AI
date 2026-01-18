import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, MessageCircle, Users, GraduationCap } from 'lucide-react';
import clsx from 'clsx';
import SupportChatbot from '../components/SupportChatbot';
import Footer from './Footer';

function Layout({ children }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-900/50">
                                    T
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">TradeSense</span>
                            </Link>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium", isActive('/') ? 'text-primary' : 'text-slate-300')}>
                                    Home
                                </Link>
                                <Link to="/pricing" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium", isActive('/pricing') ? 'text-primary' : 'text-slate-300')}>
                                    Pricing
                                </Link>
                                <Link to="/leaderboard" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium", isActive('/leaderboard') ? 'text-primary' : 'text-slate-300')}>
                                    Leaderboard
                                </Link>
                                {user && (
                                    <>
                                        <Link to="/dashboard" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium", isActive('/dashboard') ? 'text-primary' : 'text-slate-300')}>
                                            Dashboard
                                        </Link>
                                        <Link to="/chat" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium flex items-center gap-1", isActive('/chat') ? 'text-primary' : 'text-slate-300')}>
                                            <Users className="w-4 h-4" />
                                            Community
                                        </Link>
                                        <Link to="/education" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium flex items-center gap-1", isActive('/education') ? 'text-primary' : 'text-slate-300')}>
                                            <GraduationCap className="w-4 h-4" />
                                            Academy
                                        </Link>
                                    </>
                                )}
                                <Link to="/contact" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium", isActive('/contact') ? 'text-primary' : 'text-slate-300')}>
                                    Contact
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" className={clsx("hover:text-primary transition-colors px-3 py-2 rounded-md font-medium", isActive('/admin') ? 'text-primary' : 'text-slate-300')}>
                                        Admin
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-400">Hi, {user.name}</span>
                                    <button onClick={logout} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors" title="Logout">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link to="/auth/login" className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/auth/register" className="btn btn-primary text-sm shadow-none">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col">
                {children}
            </main>

            <Footer />

            <SupportChatbot />
        </div>
    );
}

export default Layout;
