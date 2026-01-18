import React from 'react';
import { BookOpen, Video, Award, Star, PlayCircle } from 'lucide-react';

const Education = () => {
    const courses = [
        {
            id: 1,
            title: "Trading Fundamentals Masterclass",
            level: "Beginner",
            modules: 12,
            duration: "4h 30m",
            progress: 0,
            image: "bg-gradient-to-br from-indigo-500 to-purple-600"
        },
        {
            id: 2,
            title: "Advanced Technical Analysis",
            level: "Intermediate",
            modules: 8,
            duration: "3h 15m",
            progress: 35,
            image: "bg-gradient-to-br from-emerald-500 to-teal-600"
        },
        {
            id: 3,
            title: "Risk Management & Psychology",
            level: "Advanced",
            modules: 5,
            duration: "2h 45m",
            progress: 0,
            image: "bg-gradient-to-br from-orange-500 to-red-600"
        },
        {
            id: 4,
            title: "Forex Strategy Deep Dive",
            level: "Expert",
            modules: 15,
            duration: "6h 00m",
            progress: 0,
            image: "bg-gradient-to-br from-blue-500 to-cyan-600"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-8 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between">
                <div className="z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">TradeSense Academy</h1>
                    <p className="text-slate-400 max-w-xl">
                        Master the markets with our comprehensive learning modules. From beginner basics to expert strategies.
                    </p>
                </div>
                <div className="mt-6 md:mt-0 flex gap-4 z-10">
                    <div className="text-center p-4 bg-slate-800 rounded-xl">
                        <div className="text-2xl font-bold text-white">42</div>
                        <div className="text-xs text-slate-500">Video Lessons</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800 rounded-xl">
                        <div className="text-2xl font-bold text-emerald-400">12h</div>
                        <div className="text-xs text-slate-500">Content</div>
                    </div>
                </div>
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                Available Courses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="card group overflow-hidden hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                        <div className={`h-32 ${course.image} p-6 flex items-end relative`}>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                            <div className="relative z-10 w-full flex justify-between items-end">
                                <span className="bg-black/30 backdrop-blur px-2 py-1 rounded text-xs text-white font-medium border border-white/10">
                                    {course.level}
                                </span>
                                {course.progress > 0 && (
                                    <span className="bg-emerald-500/90 px-2 py-1 rounded text-xs text-white font-bold">
                                        {course.progress}%
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                {course.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                                <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {course.modules} Modules</span>
                                <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> {course.duration}</span>
                            </div>

                            <button className="btn btn-outline w-full justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all">
                                {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                            </button>
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
