import React, { useEffect, useState } from 'react';
import { RefreshCw, Zap } from 'lucide-react';

// Mock logic for AI signals
const AISignals = ({ symbol, price }) => {
    const [signal, setSignal] = useState(null);

    useEffect(() => {
        // Generate random signal when symbol changes
        const types = ['BUY', 'SELL', 'NEUTRAL'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const confidence = 65 + Math.floor(Math.random() * 30); // 65-95%

        let reasons = [];
        if (randomType === 'BUY') reasons = ['RSI Oversold', 'MACD Crossover', 'Trend Support'];
        if (randomType === 'SELL') reasons = ['RSI Overbought', 'Resistance Hit', 'Volume Drop'];
        if (randomType === 'NEUTRAL') reasons = ['Choppy Market', 'Low Volume', 'Wait for breakout'];

        setSignal({
            type: randomType,
            confidence: confidence,
            reasons: reasons,
            stopLoss: price ? (randomType === 'BUY' ? price * 0.98 : price * 1.02).toFixed(2) : '---',
            takeProfit: price ? (randomType === 'BUY' ? price * 1.05 : price * 0.95).toFixed(2) : '---'
        });
    }, [symbol, price]); // Recalculate on symbol change

    if (!signal) return null;

    return (
        <div className="card h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap className="text-accent w-5 h-5" />
                    AI Insight
                </h3>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Live
                </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-4 bg-slate-950 rounded-xl mb-4">
                <div className={`text-2xl font-black mb-1 ${signal.type === 'BUY' ? 'text-emerald-400' :
                    signal.type === 'SELL' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                    {signal.type}
                </div>
                <div className="text-xs text-slate-400">Confidence: {signal.confidence}%</div>
            </div>

            {/* Hazard Detection Alert */}
            <div className="mb-4 bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg animate-pulse">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase mb-1">
                    <Zap className="w-3 h-3" /> Hazard Detection
                </div>
                <div className="text-xs text-orange-200">
                    High volatility expected in {Math.floor(Math.random() * 10) + 5} mins. Tighten stops.
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">AI Trade Plan</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-red-500/10 p-2 rounded border border-red-500/30">
                            <div className="text-red-400 font-bold">Stop Loss</div>
                            <div className="text-white text-lg">${signal.stopLoss}</div>
                        </div>
                        <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/30">
                            <div className="text-emerald-400 font-bold">Take Profit</div>
                            <div className="text-white text-lg">${signal.takeProfit}</div>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Key Drivers (Smart Sort)</p>
                    {signal.reasons.map((r, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-slate-300 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            {r}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AISignals;
