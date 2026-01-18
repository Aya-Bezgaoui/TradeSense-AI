import React from 'react';
import { BookOpen, Video, Award, Star, PlayCircle } from 'lucide-react';

const Education = () => {
    const courses = [
        {
            id: 1,
            title: "Introducing the Financial Markets",
            description: "Learn what the financial markets are and how they work. Discover key assets like shares, indices, forex, and commodities.",
            level: "Beginner",
            modules: [
                { title: "What is financial trading?", duration: "2 min" },
                { title: "Why trade?", duration: "5 min" },
                { title: "What are shares?", duration: "9 min" },
                { title: "Trading shares", duration: "9 min" },
                { title: "What are stock indices?", duration: "7 min" },
                { title: "Trading stock indices", duration: "5 min" },
                { title: "What is forex?", duration: "11 min" },
                { title: "Trading forex", duration: "14 min" },
                { title: "What are commodities?", duration: "11 min" },
                { title: "Trading commodities", duration: "6 min" }
            ],
            duration: "approx 80m",
            progress: 0,
            image: "bg-gradient-to-br from-indigo-500 to-purple-600"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
                        <div className="text-xs text-slate-500">Lessons</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-400">80m</div>
                        <div className="text-xs text-slate-500">Content</div>
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
                                    <button className="btn btn-white w-full flex items-center justify-center gap-2">
                                        <PlayCircle className="w-5 h-5" /> Start Course
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
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors group cursor-pointer border border-slate-800 hover:border-indigo-500/50">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-slate-200 group-hover:text-white transition-colors">{module.title}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <Video className="w-3 h-3" />
                                                    <span>Video Lesson</span>
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
