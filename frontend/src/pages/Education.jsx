import React from 'react';
import { BookOpen, Video, Award, Star, PlayCircle } from 'lucide-react';

const Education = () => {
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
When you first start looking in to it, financial trading can be confusing. You're likely to hear a lot of jargon surrounding it, some fairly recognisable such as interest rate, broker, commodity or dividend, and some you may never have heard before, such as a long strangle, EBITDA or ichimoku cloud.

However, beneath all the terminology, there's one core principle that underpins financial trading: predicting whether something will go up in price, or down. Get it right and there's opportunity for great rewards. But get it wrong and you could lose a lot of money.

### What is financial trading?
Very simply, financial trading is the buying and selling of financial instruments. These instruments can take many forms, but some of the main categories are:
- **Shares**: small units of ownership in a company, such as Apple, Google, HSBC
- **Indices**: the value of a group of companies, represented as a single number, eg the FTSE 100, S&P 500, Nikkei 225
- **Forex**: global currencies, including the pound, dollar, euro
- **Commodities**: physical assets, raw materials and agricultural products, for example gold, oil, corn

Most of the time financial traders don't need the assets at all. They are simply looking to make a profit from movements in the price, for example by buying low, then selling high.

### What are the financial markets?
Just like any other form of market, financial markets are where buyers and sellers come to trade. They are often physical locations where traders meet to exchange a certain type of asset, eg:
- Shares at the **London Stock Exchange (LSE)**
- Commodities at the **Chicago Mercantile Exchange (CME)**

But they can also be electronic systems, such as:
- The **NASDAQ** stock exchange
- The **Forex market** (essentially a network of large banks and currency providers)
                    `
                },
                {
                    title: "Why trade?",
                    duration: "5 min",
                    content: `
### Why trade the financial markets?
People trade for many reasons. Some enjoy the intellectual challenge of analyzing the markets and making decisions. Others are attracted by the potential for financial gain.

**Investing vs Trading**
- **Investing**: Typically involves buying assets to hold them for a long period, hoping they will increase in value over time. Investors often look for income (dividends) and capital growth.
- **Trading**: Usually involves buying and selling assets over shorter timeframes to profit from price fluctuations. Traders can profit from both rising and falling markets (by "short selling").
                    `
                },
                { title: "What are shares?", duration: "9 min", content: "Shares represent units of ownership in a company. When you buy a share, you become a shareholder, meaning you own a small part of that business." },
                { title: "Trading shares", duration: "9 min", content: "Trading shares involves buying and selling company stock to profit from price movements. You can trade real shares or derivatives like CFDs." },
                { title: "What are stock indices?", duration: "7 min", content: "A stock index measures the performance of a group of shares from an exchange. Examples include the S&P 500 (top 500 US companies) and the FTSE 100." },
                { title: "Trading stock indices", duration: "5 min", content: "Indices allow traders to speculate on the overall direction of a market or sector without analyzing individual stocks." },
                { title: "What is forex?", duration: "11 min", content: "Forex (Foreign Exchange) is the global marketplace for exchanging currencies. It is the largest and most liquid financial market in the world." },
                { title: "Trading forex", duration: "14 min", content: "Forex trading involves buying one currency while selling another. Currencies are always traded in pairs, such as EUR/USD or GBP/JPY." },
                { title: "What are commodities?", duration: "11 min", content: "Commodities are basic goods used in commerce, like Gold, Oil, Wheat, and Coffee. They are often traded as futures contracts." },
                { title: "Trading commodities", duration: "6 min", content: "Traders can speculate on the price of commodities driven by supply and demand factors like weather, geopolitics, and economic data." }
            ],
            duration: "approx 80m",
            progress: 0,
            image: "bg-gradient-to-br from-indigo-500 to-purple-600"
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
                        <div className="text-2xl font-bold text-white">10</div>
                        <div className="text-xs text-slate-500">Modules</div>
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
                <button className="btn btn-primary px-8 py-3 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    Reserve Spot
                </button>
            </div>
        </div>
    );
};

export default Education;
