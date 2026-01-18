import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Video, Award, Star, PlayCircle } from 'lucide-react';
import clsx from 'clsx';

const Education = () => {
    const navigate = useNavigate();
    const [selectedModule, setSelectedModule] = React.useState(null);
    const [activeCourse, setActiveCourse] = React.useState(null);

    const courses = [
        {
            id: 1,
            title: "Introducing the Financial Markets",
            description: "Learn what the financial markets are and how they work. Discover key assets like shares, indices, forex, and commodities.",
            level: "Beginner",
            modules: [
                {
                    title: "What is financial trading?",
                    duration: "2 min",
                    content: `
### Introduction
When you first start looking in to it, financial trading can be confusing. You're likely to hear a lot of jargon surrounding it. However, beneath all the terminology, there's one core principle that underpins financial trading: predicting whether something will go up in price, or down.

### What is financial trading?
Very simply, financial trading is the buying and selling of financial instruments. These instruments can take many forms, but some of the main categories are:
- **Shares**: small units of ownership in a company, such as Apple, Google, HSBC
- **Indices**: the value of a group of companies, represented as a single number, eg the FTSE 100, S&P 500
- **Forex**: global currencies, including the pound, dollar, euro
- **Commodities**: physical assets, raw materials and agricultural products, for example gold, oil, corn

### What are the financial markets?
Just like any other form of market, financial markets are where buyers and sellers come to trade. They are often physical locations, like the **London Stock Exchange (LSE)**, or electronic systems like the **NASDAQ**.
                    `
                },
                {
                    title: "Why trade?",
                    duration: "5 min",
                    content: `
### Why trade the financial markets?
People trade for many reasons. Some enjoy the intellectual challenge of analyzing the markets. Others are attracted by the potential for financial gain.

**Investing vs Trading**
- **Investing**: Typically involves buying assets to hold them for a long period, hoping they will increase in value over time.
- **Trading**: Usually involves buying and selling assets over shorter timeframes to profit from price fluctuations. Traders can profit from both rising and falling markets.
                    `
                },
                {
                    title: "What are shares?",
                    duration: "9 min",
                    content: `
### What are shares?
A share is a unit of ownership in a company. If a company is worth £10,000 and has issued 2000 shares, each share is worth £5. As the share price fluctuates, so does the value of the company.

### Why do companies offer shares?
Companies sell shares to raise money. This is known as "going public" or an Initial Public Offering (IPO). The money raised can be used to expand the business or pay off debt.

### Why do share prices move?
Share prices are driven by **supply and demand**.
- **Earnings reports**: If a company reports better profits than expected, its share price usually rises.
- **Market sentiment**: General economic news or investor confidence can affect prices.
                    `
                },
                {
                    title: "Trading shares",
                    duration: "9 min",
                    content: `
### How are shares traded?
Shares are traded on stock exchanges (like the LSE or NYSE). You typically need a stockbroker to act as an intermediary to buy and sell shares for you.

### Broker types
- **Full-service brokers**: Offer advice and research but charge higher fees.
- **Execution-only brokers**: Simply carry out your instructions to buy or sell. This is often cheaper and faster.

### Dividends
Many companies pay a portion of their profits to shareholders, known as a dividend. This provides an income stream for investors on top of any potential growth in the share price.
                    `
                },
                {
                    title: "What are stock indices?",
                    duration: "7 min",
                    content: `
### What is a stock index?
A stock index is a numerical representation of the performance of a group of companies.
- **S&P 500**: Tracks the 500 largest companies in the US.
- **FTSE 100**: Tracks the 100 largest companies on the London Stock Exchange.
- **DAX**: Tracks 30 major German companies.

### Why are they important?
Indices give a quick "snapshot" of how a specific market or the entire economy is performing. If the S&P 500 is up, it generally means the US stock market is doing well.
                    `
                },
                {
                    title: "Trading stock indices",
                    duration: "5 min",
                    content: `
### How are they calculated?
Most major indices are **capitalisation-weighted**. This means larger companies have a bigger influence on the index's price than smaller ones.

### How to trade indices?
You can't buy an index directly like a share. Instead, you trade:
- **Index Funds / ETFs**: Funds that track the index.
- **Derivatives (CFDs/Futures)**: allow you to speculate on the price movement of the index without owning the underlying shares.
                    `
                },
                {
                    title: "What is forex?",
                    duration: "11 min",
                    content: `
### What is Forex?
Forex (Foreign Exchange) is the marketplace for exchanging global currencies. It is the largest financial market in the world, with trillions of dollars traded every day.

### Who trades forex?
- **Central Banks**: Manage national currency value.
- **Banks & Businesses**: For international trade.
- **Speculators**: Traders looking to profit from exchange rate changes.

### Unqiue features
The forex market is decentralized (no central exchange) and operates 24 hours a day, 5 days a week.
                    `
                },
                {
                    title: "Trading forex",
                    duration: "14 min",
                    content: `
### Currency Pairs
Currencies are always traded in pairs.
- **Base currency**: The first currency (e.g., EUR in EUR/USD).
- **Quote currency**: The second currency (e.g., USD in EUR/USD).

### Pips and Lots
- **Pip**: The smallest unit of price movement (usually the 4th decimal place).
- **Lot**: The standardized quantity of currency you trade (Standard lot = 100,000 units).

### Major Pairs
The most traded pairs, usually involving the US Dollar (EUR/USD, GBP/USD, USD/JPY). They typically have the lowest spreads.
                    `
                },
                {
                    title: "What are commodities?",
                    duration: "11 min",
                    content: `
### What are commodities?
Commodities are raw materials or primary agricultural products that can be bought and sold.

### Types of commodities
- **Hard Commodities**: Natural resources that are mined or extracted (Gold, Oil, Copper, Natural Gas).
- **Soft Commodities**: Agricultural products that are grown (Wheat, Coffee, Sugar, Cotton).

### Standardization
Commodities must be standardized (e.g., a barrel of Brent Crude Oil) so they can be traded on exchanges without inspection.
                    `
                },
                {
                    title: "Trading commodities",
                    duration: "6 min",
                    content: `
### Where are they traded?
Major exchanges include the **Chicago Mercantile Exchange (CME)** and the **London Metal Exchange (LME)**.

### What drives prices?
- **Supply and Demand**: The core driver.
- **Geopolitics**: Wars or sanctions can disrupt supply (especially Oil).
- **Weather**: crucial for soft commodities (e.g., a drought affecting wheat harvest).
- **Economic Health**: Industrial metals lie Copper rise when the global economy grows.
                    `
                }
            ],
            duration: "approx 80m",
            progress: 0,
            image: "bg-gradient-to-br from-indigo-500 to-purple-600"
        },
        {
            id: 2,
            title: "Mastering Technical Analysis",
            description: "Go beyond the basics. Learn to read charts, identify trends, and use indicators to time your market entries.",
            level: "Intermediate",
            modules: [
                {
                    title: "Understanding Charts",
                    duration: "10 min",
                    content: `
### Types of Charts
To analyse price action, you need to visualize it.
- **Line Charts**: Simple, shows closing prices only. Good for overall trend.
- **Bar Charts**: Shows Open, High, Low, Close (OHLC). Good for volatility.
- **Candlestick Charts**: The standard for traders. Shows OHLC with color-coded bodies (Green/Red) indicating bullish or bearish movement.

### Timeframes
- **Higher Timeframes (Daily/Weekly)**: Used for long-term trend analysis.
- **Lower Timeframes (15m/1h)**: Used for entry timing and day trading.
                    `
                },
                {
                    title: "Support & Resistance",
                    duration: "12 min",
                    content: `
### What are they?
- **Support**: A price level where buying pressure is strong enough to prevent the price from falling further. Think of it as a "floor".
- **Resistance**: A price level where selling pressure is strong enough to prevent the price from rising further. Think of it as a "ceiling".

### Role Reversal
When a resistance level is broken, it often becomes a new support level, and vice versa. This is a key concept in trend following.
                    `
                },
                {
                    title: "Technical Indicators",
                    duration: "15 min",
                    content: `
### Moving Averages (MA)
Smooth out price data to identify the trend direction.
- **SMA**: Simple Moving Average.
- **EMA**: Exponential Moving Average (reacts faster to recent prices).

### RSI (Relative Strength Index)
A momentum oscillator that measures speed and change of price movements.
- **Overbought**: Above 70.
- **Oversold**: Below 30.

### MACD (Moving Average Convergence Divergence)
A trend-following momentum indicator that shows the relationship between two moving averages of a security's price.
                    `
                },
                {
                    title: "Chart Patterns",
                    duration: "18 min",
                    content: `
### Reversal Patterns
Signal a change in trend direction.
- **Head and Shoulders**: Bearish reversal.
- **Double Bottom**: Bullish reversal.

### Continuation Patterns
Signal the trend is likely to continue.
- **Flags and Pennants**: Short pauses in a strong trend.
- **Triangles**: Ascending, Descending, and Symmetrical triangles.
                    `
                }
            ],
            duration: "approx 55m",
            progress: 0,
            image: "bg-gradient-to-br from-emerald-500 to-teal-600"
        },
        {
            id: 3,
            title: "Advanced Strategy & Psychology",
            description: "The holistic approach. Master your mind, manage your risk, and build a repeatable edge in the markets.",
            level: "High Level",
            modules: [
                {
                    title: "Trading Psychology",
                    duration: "20 min",
                    content: `
### The Trader's Mindset
Successful trading is 20% strategy and 80% psychology.
- **Fear**: Causes you to exit winning trades too early or hesitate to take valid setups.
- **Greed**: Causes you to hold losing trades too long or use excessive leverage.
- **FOMO**: Fear Of Missing Out leading to impulsive entries.

### Discipline
Sticking to your plan when emotions run high is the hallmark of a professional trader.
                    `
                },
                {
                    title: "Risk Management",
                    duration: "25 min",
                    content: `
### The Golden Rule
Never risk more than 1-2% of your account on a single trade.

### R-Multiples
Think in terms of Risk (R). If you risk $100 to make $300, that is a 3R trade.
- A system with a 40% win rate can be profitable if your average winner is 3R and loser is 1R.

### Drawdown Control
Understanding how to handle losing streaks without blowing up your account.
                    `
                },
                {
                    title: "Fundamental Analysis",
                    duration: "30 min",
                    content: `
### Economic Indicators
- **NFP (Non-Farm Payrolls)**: Major US employment data that moves markets.
- **CPI (Consumer Price Index)**: Measure of inflation.
- **Interest Rates**: Central bank decisions (Fed, ECB) drive currency trends.

### Sentiment Analysis
Measuring the overall mood of the market. Are investors "Risk-On" (buying stocks/crypto) or "Risk-Off" (buying gold/bonds)?
                    `
                },
                {
                    title: "Building an Edge",
                    duration: "22 min",
                    content: `
### What is an Edge?
A statistical advantage that ensures profitability over a large sample of trades.

### Backtesting
Testing your strategy on historical data to verify its edge before risking real money.

### Journaling
Recording every trade (Entry, Exit, Rationale, Emotion) to identify patterns in your own behavior and improve.
                    `
                }
            ],
            duration: "approx 97m",
            progress: 0,
            image: "bg-gradient-to-br from-amber-500 to-orange-600"
        },
        {
            id: 4,
            title: "Algorithmic & Crypto Trading Mastery",
            description: "Leverage the power of code and AI. Learn to automate your strategies and navigate the volatility of cryptocurrency markets.",
            level: "Expert",
            modules: [
                {
                    title: "Algo Trading Fundamentals",
                    duration: "35 min",
                    content: `
### What is Algorithmic Trading?
The use of computer programs to execute trades automatically based on predefined criteria (price, timing, volume).
- **Speed**: EXECUTION is measured in milliseconds.
- **Discipline**: Eliminates emotional interference.
- **Consistency**: Trades the plan exactly, every time.

### Python for Finance
Python is the industry standard for Algo Trading due to its rich ecosystem of libraries:
- **Pandas**: For data manipulation and analysis.
- **NumPy**: For high-performance scientific computing.
- **TA-Lib**: For calculating technical indicators programmatically.
                    `
                },
                {
                    title: "Strategy Paradigms",
                    duration: "40 min",
                    content: `
### Trend Following
"The trend is your friend." Algorithms that identify and ride market momentum.
- **Moving Average Crossover**: Buy when Fast MA crosses above Slow MA.
- **Breakout Strategies**: Buy when price exceeds a defined resistance level.

### Mean Reversion
"What goes up must come down." Betting that extreme prices will return to the average.
- **Bollinger Bands**: Sell when price hits both, Buy when it hits bottom.
- **RSI Divergence**: detecting weakness in a trend.

### Market Making
Providing liquidity by placing both Buy and Sell limit orders to capture the spread. Requires low latency access.
                    `
                },
                {
                    title: "Crypto Specifics",
                    duration: "45 min",
                    content: `
### 24/7 Markets
Crypto never sleeps. Algorithms are essential to monitor these markets when you cannot.

### Arbitrage
Exploiting price differences of the same asset across different exchanges.
- **Spatial Arbitrage**: Buy Bitcoin on Exchange A for $90k, Sell on Exchange B for $90.2k.
- **Triangular Arbitrage**: Exchanging Currency A -> B -> C -> A to profit from exchange rate misalignments.

### On-Chain Data
Using blockchain data (whale alerts, transaction volume) as a leading indicator.
                    `
                },
                {
                    title: "Backtesting & AI",
                    duration: "40 min",
                    content: `
### The Importance of Backtesting
Simulating your strategy on historical data to estimate its performance.
- **In-Sample vs Out-of-Sample**: Prevent "overfitting" by testing on unseen data.
- **Walk-Forward Analysis**: Optimizing parameters on a rolling window.

### Machine Learning in Trading
Using AI to predict price direction.
- **Supervised Learning**: Training models on labeled historical data (e.g. "Price went UP").
- **Reinforcement Learning**: An AI "agent" learns to trade by being rewarded for profit and penalized for loss.
                    `
                }
            ],
            duration: "approx 160m",
            progress: 0,
            image: "bg-gradient-to-br from-cyan-500 to-blue-600"
        }
    ];

    const handleStartModule = (course, module) => {
        setActiveCourse(course);
        setSelectedModule(module);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Reading Mode Overlay */}
            {selectedModule && (
                <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-950">
                            <div>
                                <h3 className="text-sm text-indigo-400 font-bold uppercase tracking-wider mb-1">
                                    {activeCourse?.title}
                                </h3>
                                <h2 className="text-2xl font-bold text-white">{selectedModule.title}</h2>
                            </div>
                            <button
                                onClick={() => setSelectedModule(null)}
                                className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed text-lg">
                                {selectedModule.content || "Content coming soon..."}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-700 bg-slate-950 flex justify-between items-center">
                            <button className="btn btn-outline" onClick={() => setSelectedModule(null)}>Close Lesson</button>
                            <button className="btn btn-primary" onClick={() => setSelectedModule(null)}>Mark as Complete</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">TradeSense Academy</h1>
                    <p className="text-slate-400 max-w-xl">
                        Master the markets with our comprehensive learning modules. Start your journey with our flagship course.
                    </p>
                </div>
                <div className="mt-6 md:mt-0 flex gap-4 z-10">
                    <div className="text-center p-4 bg-slate-800 rounded-xl">
                        <div className="text-2xl font-bold text-white">4</div>
                        <div className="text-xs text-slate-500">Courses</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-400">Read</div>
                        <div className="text-xs text-slate-500">Mode</div>
                    </div>
                </div>
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="space-y-8">
                {courses.map(course => (
                    <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            {/* Course Header / Image */}
                            <div className={`lg:col-span-4 ${course.image} p-8 flex flex-col justify-end relative min-h-[300px]`}>
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="relative z-10">
                                    <span className="inline-block px-3 py-1 rounded-full bg-black/30 backdrop-blur text-xs font-bold text-white mb-4 border border-white/10">
                                        {course.level}
                                    </span>
                                    <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
                                    <p className="text-white/80 text-sm mb-6">{course.description}</p>
                                    <button
                                        onClick={() => handleStartModule(course, course.modules[0])}
                                        className="btn btn-white w-full flex items-center justify-center gap-2"
                                    >
                                        <BookOpen className="w-5 h-5" /> Start Reading
                                    </button>
                                </div>
                            </div>

                            {/* Module List */}
                            <div className="lg:col-span-8 p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-500" />
                                    Course Curriculum
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {course.modules.map((module, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleStartModule(course, module)}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group cursor-pointer border border-slate-800 hover:border-indigo-500/50"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-slate-200 group-hover:text-white transition-colors">{module.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <BookOpen className="w-3 h-3" />
                                                    <span>Read Lesson</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                                    <span>{module.duration}</span>
                                                </div>
                                            </div>
                                            <PlayCircle className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-r from-slate-900 to-indigo-900/20 rounded-2xl border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Join the Live Webinars</h3>
                    <p className="text-slate-400">Interact with expert traders in real-time. Next session starts in 2 hours.</p>
                </div>
                <button
                    onClick={() => navigate('/webinar-registration')}
                    className="btn btn-primary px-8 py-3 flex items-center gap-2"
                >
                    <Star className="w-4 h-4 fill-current" />
                    Reserve Spot
                </button>
            </div>
        </div>
    );
};

export default Education;
