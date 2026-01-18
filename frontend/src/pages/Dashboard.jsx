import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { TradingChart } from '../components/TradingChart';
import OrderPanel from '../components/OrderPanel';
import StatsCard from '../components/StatsCard';
import AISignals from '../components/AISignals';
import NewsWidget from '../components/NewsWidget';
import { RefreshCw, AlertTriangle, BarChart2, TrendingUp, CheckCircle, BrainCircuit, Sparkles, Target, Trophy } from 'lucide-react';

function Dashboard() {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('BTC-USD');
  const [quantity, setQuantity] = useState(1);
  const [timeframe, setTimeframe] = useState('1D');
  const [marketData, setMarketData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [trades, setTrades] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [processing, setProcessing] = useState(false);
  const [lastTrade, setLastTrade] = useState(null);

  // Symbols list
  const symbols = [
    { id: 'BTC-USD', name: 'Bitcoin', desc: "The world's first decentralized cryptocurrency. Known for high volatility." },
    { id: 'ETH-USD', name: 'Ethereum', desc: "Decentralized open-source blockchain system featuring smart contract functionality." },
    { id: 'AAPL', name: 'Apple Inc.', desc: "American multinational technology company. The world's largest company by market cap." },
    { id: 'TSLA', name: 'Tesla Inc.', desc: "Electric vehicle and clean energy company led by Elon Musk." },
    { id: 'IAM', name: 'Maroc Telecom', morocco: true, desc: "The main telecommunication company in Morocco. A blue-chip stock on the BVC." },
    { id: 'ATW', name: 'Attijariwafa Bank', morocco: true, desc: "Leading multinational commercial bank based in Rabat, Morocco." },
    { id: 'BCP', name: 'Banque Populaire', morocco: true, desc: "Major Moroccan bank. A cooperative banking group." },
    { id: 'ADI', name: 'Addoha', morocco: true, desc: "Major real estate developer in Morocco." },
    { id: 'CSR', name: 'Cosumar', morocco: true, desc: "Moroccan company specializing in the extraction, refining and packaging of sugar." },
    { id: 'HOL', name: 'LafargeHolcim', morocco: true, desc: "Leader in the building materials industry in Morocco." },
    { id: 'MNG', name: 'Managem', morocco: true, desc: "Moroccan mining company. Produces gold, silver, cobalt, and copper." },
  ];

  const fetchChallenge = useCallback(async () => {
    try {
      const res = await api.get('/challenges/active');
      if (res.data) {
        setChallenge(res.data);
        // Fetch recent trades too
        const tradeRes = await api.get(`/trades/?challenge_id=${res.data.id}`);
        setTrades(tradeRes.data);
      } else {
        setChallenge(null);
      }
    } catch (e) {
      console.error("Fetch challenge failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMarket = useCallback(async () => {
    if (!symbol) return;
    try {
      // Quote
      const quoteRes = await api.get(`/market/quote?symbol=${symbol}`);
      setMarketData(quoteRes.data);

      // Chart Series
      // Map timeframe to API params (yfinance)
      let interval = '1d';
      let period = '1y';

      if (timeframe === '1H') {
        interval = '1h'; // or 60m
        period = '1mo'; // Get 1 month of hourly data
      } else if (timeframe === '4H') {
        interval = '1h'; // yfinance doesn't easily support 4h free, use 1h
        period = '3mo';  // Get 3 months of hourly data
      } else if (timeframe === '1D') {
        interval = '1d';
        period = '1y';
      }

      console.log(`Fetching chart: ${symbol} ${interval} ${period}`);
      const seriesRes = await api.get(`/market/series?symbol=${symbol}&interval=${interval}&period=${period}`);
      // Transform if needed? The backend already sends time/open/high/low/close
      setChartData(seriesRes.data);

      setLastUpdate(new Date());
    } catch (e) {
      console.error("Market fetch failed", e);
    }
  }, [symbol, timeframe]);

  // Initial Load
  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  // Symbol Change Effect
  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000); // 30s Poll as per requirements
    return () => clearInterval(interval);
  }, [symbol, fetchMarket]);

  // Challenge Status Poll
  useEffect(() => {
    if (!challenge) return;
    const interval = setInterval(fetchChallenge, 15000);
    return () => clearInterval(interval);
  }, [challenge?.id, fetchChallenge]);


  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const handleTrade = async (side) => {
    setProcessing(true);
    try {
      const res = await api.post('/trading/', {
        challenge_id: challenge.id,
        symbol: symbol,
        side: side,
        amount: Number(quantity)
      });

      setChallenge(prev => ({
        ...prev,
        equity: res.data.new_equity,
        status: res.data.evaluation.status
      }));

      setLastTrade({
        pnl: res.data.pnl,
        new_equity: res.data.new_equity
      });

      if (res.data.evaluation.status !== 'active') {
        alert(`Challenge ${res.data.evaluation.status.toUpperCase()}: ${res.data.evaluation.reason}`);
        fetchChallenge();
      }

    } catch (err) {
      alert('Trade failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-bold mb-4">No Active Challenge</h2>
        <p className="text-slate-400 mb-8 max-w-md">You don't have an active trading challenge yet. Purchase one to start trading and get funded.</p>
        <Link to="/pricing" className="btn btn-primary px-8 py-3 text-lg">
          View Plans
        </Link>
      </div>
    );
  }

  // Calculate stats
  const pnl = challenge.equity - challenge.start_balance;
  const pnlPct = (pnl / challenge.start_balance) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Equity"
          value={`$${challenge.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          type={pnl >= 0 ? 'success' : 'danger'}
        />
        <StatsCard
          title="PnL"
          value={`${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`}
          subtext={`${pnlPct.toFixed(2)}%`}
          type={pnl >= 0 ? 'success' : 'danger'}
        />
        <StatsCard
          title="Status"
          value={challenge.status.toUpperCase()}
          type={challenge.status === 'active' ? 'primary' : challenge.status === 'passed' ? 'success' : 'danger'}
        />
        <div className="card p-4 flex flex-col justify-center">
          <div className="text-xs text-slate-400 mb-1">Market Status</div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${new Date() - lastUpdate < 60000 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-sm font-medium text-white">{new Date() - lastUpdate < 60000 ? 'Live' : 'Delayed'}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Last: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Main Chart Section & AI Panel */}
        <div className="lg:col-span-3 space-y-6">
          <div className="card p-6 h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="bg-slate-800 border-none text-xl font-bold rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {symbols.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
                <span className="text-slate-400 text-sm hidden md:inline-block">
                  {symbols.find(s => s.id === symbol)?.desc.substring(0, 60)}...
                </span>
              </div>
            </div>
            <TradingChart
              data={chartData}
              symbol={symbol}
              currentTimeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </div>

          {/* AI Analysis Panel */}
          <div className="card p-6 bg-slate-900 border border-indigo-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><BrainCircuit size={100} className="text-indigo-500" /></div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-indigo-400 w-5 h-5" />
              <h3 className="text-lg font-bold text-white">AI Market Analysis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">Sentiment</div>
                <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  Bullish <TrendingUp className="w-4 h-4" />
                </div>
                <div className="w-full bg-slate-700 h-1.5 mt-2 rounded-full">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">Predicted Range (24h)</div>
                <div className="text-lg font-mono text-white">$102.50 - $108.20</div>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <div className="text-xs text-slate-400 mb-1">Key Levels</div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Res: $109.00</span>
                  <span className="text-emerald-400">Sup: $101.50</span>
                </div>
              </div>
            </div>
          </div>

          {/* News Widget - New Feature */}
          <NewsWidget />
        </div>

        {/* Prop Firm Metrics Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 border-t-4 border-t-white">
            <h3 className="font-bold mb-6 flex items-center gap-2"><Target className="w-4 h-4" /> Challenge Targets</h3>

            {/* Profit Target */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Profit Target (10%)</span>
                <span className="text-emerald-400">${(challenge.start_balance * 0.10).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000"
                  style={{ width: `${Math.max(0, ((challenge.equity - challenge.start_balance) / (challenge.start_balance * 0.10)) * 100)}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-500 mt-1">
                Current: ${(challenge.equity - challenge.start_balance).toFixed(2)}
              </div>
            </div>

            {/* Daily Loss */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Max Daily Loss (5%)</span>
                <span className="text-red-400">${(challenge.daily_start_equity * 0.05).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((challenge.daily_start_equity - challenge.equity) / (challenge.daily_start_equity * 0.05)) * 100)}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-slate-500 mt-1">
                Loss: ${(challenge.daily_start_equity - challenge.equity).toFixed(2)}
              </div>
            </div>

            {/* Total Loss */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Max Total Loss (10%)</span>
                <span className="text-red-400">${(challenge.start_balance * 0.10).toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-red-600 h-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, ((challenge.start_balance - challenge.equity) / (challenge.start_balance * 0.10)) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Trade Panel */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">Quick Execution</h3>

            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Quantity (Units)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleTrade('buy')}
                disabled={processing}
                className="btn bg-emerald-600 hover:bg-emerald-500 text-white w-full py-4 font-bold flex flex-col items-center"
              >
                <span>BUY</span>
                <span className="text-xs font-normal opacity-80">market</span>
              </button>
              <button
                onClick={() => handleTrade('sell')}
                disabled={processing}
                className="btn bg-red-600 hover:bg-red-500 text-white w-full py-4 font-bold flex flex-col items-center"
              >
                <span>SELL</span>
                <span className="text-xs font-normal opacity-80">market</span>
              </button>
            </div>
            {lastTrade && (
              <div className="mt-4 p-3 bg-slate-800 rounded text-center text-sm animate-fade-in">
                <div className={lastTrade.pnl > 0 ? "text-emerald-400" : "text-red-400"}>
                  {lastTrade.pnl > 0 ? "+" : ""}{lastTrade.pnl.toFixed(2)} PnL
                </div>
                <div className="text-xs text-slate-500">
                  New Equity: ${lastTrade.new_equity.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {challenge.status === 'failed' && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl mb-6 flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <span className="font-bold">Challenge Failed.</span> You have breached the loss limits. Reset your challenge to try again.
          </div>
          <Link to="/pricing" className="ml-auto btn btn-secondary text-sm">Reset</Link>
        </div>
      )}

      {challenge.status === 'passed' && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 p-4 rounded-xl mb-6 flex items-center gap-3 text-emerald-400">
          <Trophy className="w-6 h-6" />
          <div>
            <span className="font-bold">Challenge Passed!</span> Congratulations, you are now funded.
          </div>
        </div>
      )}


    </div>
  );
}

export default Dashboard;