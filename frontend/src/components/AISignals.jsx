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
            reasons: reasons
        });
    }, [symbol]); // Recalculate on symbol change (or implement time interval)

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

            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase">Key Drivers:</p>
                {signal.reasons.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {r}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AISignals;
