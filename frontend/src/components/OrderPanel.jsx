import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';
import api from '../services/api';

const OrderPanel = ({ challengeId, symbol, currentPrice, onTrade }) => {
    const [qty, setQty] = useState(0.1);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleTrade = async (side) => {
        if (!challengeId) return;
        setLoading(true);
        setMsg(null);
        try {
            // Updated to use the new /trading/ endpoint which includes Prop Firm logic
            const res = await api.post('/trading/', {
                challenge_id: challengeId,
                symbol,
                side,
                amount: qty // Map qty to amount
            });

            setMsg({ type: 'success', text: side.toUpperCase() + " Executed!" });

            // Notify parent to refresh
            if (onTrade) onTrade(res.data);

        } catch (error) {
            setMsg({ type: 'error', text: error.response?.data?.error || "Trade failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="text-primary w-5 h-5" />
                Order Execution
            </h3>

            <div className="flex justify-between items-center mb-6 p-3 bg-slate-950 rounded-lg">
                <span className="text-slate-400">Market Price</span>
                <span className="text-xl font-mono text-white">${currentPrice?.toFixed(2)}</span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-xs text-slate-400 mb-1 block">Quantity</label>
                    <input
                        type="number"
                        step="0.01"
                        className="input w-full font-mono"
                        value={qty}
                        onChange={(e) => setQty(parseFloat(e.target.value))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleTrade('buy')}
                        disabled={loading}
                        className="btn bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
                    >
                        <ArrowUp className="w-4 h-4" /> BUY
                    </button>
                    <button
                        onClick={() => handleTrade('sell')}
                        disabled={loading}
                        className="btn bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
                    >
                        SELL <ArrowDown className="w-4 h-4" />
                    </button>
                </div>

                {msg && (
                    <div className={`text-center text-sm p-2 rounded ${msg.type === 'success' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {msg.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderPanel;
