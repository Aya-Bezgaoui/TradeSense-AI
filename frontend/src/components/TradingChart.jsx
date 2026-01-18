import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

export const TradingChart = ({ symbol, data, marketOpen = true }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef(null);
    const seriesRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#020617' }, // Slate-950
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: '#1e293b' },
                horzLines: { color: '#1e293b' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 480, // Default height
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    useEffect(() => {
        if (seriesRef.current && data.length > 0) {
            // Sort data by time just in case
            const sortedData = [...data].sort((a, b) => a.time - b.time);
            // Ensure unique times? Lightweight charts crashes on duplicate times.
            // basic de-dupe
            const uniqueData = [];
            const seen = new Set();
            for (let d of sortedData) {
                if (!seen.has(d.time)) {
                    uniqueData.push(d);
                    seen.add(d.time);
                }
            }
            seriesRef.current.setData(uniqueData);
        }
    }, [data]);

    return (
        <div className="relative w-full h-[480px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div ref={chartContainerRef} className="w-full h-full" />
            {!marketOpen && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-10">
                    <span className="text-xl font-bold text-slate-400">Market Closed</span>
                </div>
            )}
            <div className="absolute top-4 left-4 z-20 bg-slate-800/80 px-3 py-1 rounded text-xs font-mono text-white">
                {symbol} • 1M
            </div>
        </div>
    );
};
