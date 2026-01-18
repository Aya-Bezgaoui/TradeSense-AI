import { Hash, Users, TrendingUp, Shield, Award } from 'lucide-react';
import ChatRoom from '../components/ChatRoom';

const Chat = () => {
    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Left Sidebar - Channels */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-500" /> Community
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-2 text-xs font-bold text-slate-500 uppercase">Channels</div>
                    <nav className="space-y-1 px-2">
                        {['General', 'Crypto Talk', 'Forex Signals', 'Strategy Sharing'].map((channel, i) => (
                            <button key={channel} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                                <Hash className="w-4 h-4 opacity-70" /> {channel}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-8 px-4 mb-2 text-xs font-bold text-slate-500 uppercase">Voice Rooms</div>
                    <nav className="space-y-1 px-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Analysis
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-950">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center shadow-sm z-10 bg-slate-900/50 backdrop-blur">
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Hash className="w-5 h-5 text-slate-500" /> General
                        </h3>
                        <p className="text-xs text-slate-400">Welcome to the general trading discussion.</p>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-bold relative">
                                {i}
                                {i === 1 && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>}
                            </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400 font-bold">+120</div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-4">
                    {/* We pass a custom className to fit the new layout if needed, or just standard */}
                    <div className="h-full">
                        <ChatRoom />
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Trending/Members */}
            <div className="w-72 bg-slate-900 border-l border-slate-800 hidden lg:flex flex-col p-4">
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Trending Strategies
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <div className="text-sm font-bold text-white">ICT Silver Bullet</div>
                            <div className="text-xs text-slate-400 mt-1">Win Rate: 78% • 1.2k followers</div>
                        </div>
                        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                            <div className="text-sm font-bold text-white">SMC Liquidity Grab</div>
                            <div className="text-xs text-slate-400 mt-1">Win Rate: 65% • 850 followers</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-500" /> Top Contributors
                    </h3>
                    <div className="space-y-3">
                        {['AlexTrader', 'SarahForex', 'MikeQuant'].map(name => (
                            <div key={name} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                                    {name[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{name}</div>
                                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                                        <Award className="w-3 h-3" /> Expert Analyst
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
