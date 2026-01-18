import React, { useEffect, useState } from 'react';
import { Mic, MicOff, PhoneOff, Users, Volume2 } from 'lucide-react';

const VoiceRoom = ({ onClose }) => {
    const [participants, setParticipants] = useState([
        { id: 1, name: 'MarketMaker_X', speaking: true, role: 'Host' },
        { id: 2, name: 'Alice_Trader', speaking: false, role: 'Listener' },
        { id: 3, name: 'Bob_Quant', speaking: false, role: 'Listener' },
        { id: 4, name: 'You', speaking: false, role: 'Listener', isMe: true },
    ]);
    const [muted, setMuted] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setConnected(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Simulate speaking animation
    useEffect(() => {
        const interval = setInterval(() => {
            setParticipants(prev => prev.map(p => ({
                ...p,
                speaking: p.role === 'Host' ? Math.random() > 0.3 : false
            })));
        }, 800);
        return () => clearInterval(interval);
    }, []);

    if (!connected) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-slate-900 text-white gap-4">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-lg animate-pulse">Connecting to High-Quality Audio...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Live Analysis Room
                </h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Users className="w-4 h-4" /> {participants.length} Active Listeners
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto content-start">
                {participants.map(p => (
                    <div key={p.id} className="flex flex-col items-center gap-2">
                        <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${p.speaking ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'border-slate-700 bg-slate-800'}`}>
                            {p.isMe ? <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center">You</div> :
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} alt={p.name} className="w-full h-full rounded-full bg-slate-700" />
                            }
                            {p.role === 'Host' && (
                                <span className="absolute -bottom-2 bg-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">HOST</span>
                            )}
                        </div>
                        <div className="text-sm font-medium text-white">{p.name}</div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-center gap-6">
                <button
                    onClick={() => setMuted(!muted)}
                    className={`p-4 rounded-full transition-colors ${muted ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                >
                    {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <button className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700">
                    <Volume2 className="w-6 h-6" />
                </button>
                <button
                    onClick={onClose}
                    className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default VoiceRoom;
