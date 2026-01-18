import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trophy, Medal } from 'lucide-react';

function Leaderboard() {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard/monthly-top10');
        setTraders(res.data);
      } catch (e) {
        console.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="py-20 max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-yellow-500/10 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Top Traders</h1>
        <p className="text-slate-400">Best performing traders for this month</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950/50 border-b border-slate-800">
            <tr>
              <th className="p-4 pl-6 text-slate-400 font-medium w-16">Rank</th>
              <th className="p-4 text-slate-400 font-medium">Trader</th>
              <th className="p-4 text-slate-400 font-medium text-right">Profit %</th>
              <th className="p-4 pr-6 text-slate-400 font-medium text-right">Equity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {traders.map((t, i) => (
              <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 pl-6 font-bold text-slate-500">
                  {i === 0 && <Medal className="w-5 h-5 text-yellow-400 inline" />}
                  {i === 1 && <Medal className="w-5 h-5 text-slate-300 inline" />}
                  {i === 2 && <Medal className="w-5 h-5 text-amber-600 inline" />}
                  {i > 2 && `#${i + 1}`}
                </td>
                <td className="p-4 font-medium text-white">{t.trader}</td>
                <td className="p-4 text-right font-bold text-emerald-400">+{t.profit_pct}%</td>
                <td className="p-4 pr-6 text-right text-slate-300">${t.equity.toLocaleString()}</td>
              </tr>
            ))}
            {traders.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">No data available for this month yet.</td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-8 text-center text-slate-500">Loading leaderboard...</div>}
      </div>
    </div>
  );
}

export default Leaderboard;