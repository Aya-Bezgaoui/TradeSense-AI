import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const NewsWidget = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await api.get('/market/news');
                setNews(res.data);
            } catch (e) {
                console.error("News fetch error", e);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        // Poll every 5 minutes
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, []);

    const getSentimentIcon = (sentiment) => {
        if (sentiment === 'positive') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
        if (sentiment === 'negative') return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-slate-500" />;
    };

    return (
        <div className="card h-full flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-indigo-500" />
                    Live News Hub
                </h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Real-time
                </span>
            </div>

            {/* Economic Alert Banner */}
            <div className="px-6 py-2 bg-indigo-600/10 border-b border-indigo-500/20 flex items-center justify-between">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Newspaper className="w-3 h-3" /> Economic Alert
                </div>
                <div className="text-[10px] text-indigo-300">CPI Data Release • 14:30 GMT</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {loading ? (
                    <div className="text-center text-slate-500 py-8">Loading news...</div>
                ) : (
                    news.map((item) => (
                        <div key={item.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.category === 'Crypto' ? 'bg-orange-500/10 text-orange-400' :
                                    item.category === 'Stocks' ? 'bg-blue-500/10 text-blue-400' :
                                        'bg-slate-700 text-slate-300'
                                    }`}>
                                    {item.category}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <h4 className="font-bold text-sm text-white mb-2 leading-tight">
                                {item.title}
                            </h4>

                            <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                                {item.summary}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium">
                                    {getSentimentIcon(item.sentiment)}
                                    <span className="capitalize text-slate-400">{item.sentiment}</span>
                                </div>
                                <button
                                    onClick={() => window.open(item.url, '_blank')}
                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                    title="Read full story"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsWidget;
