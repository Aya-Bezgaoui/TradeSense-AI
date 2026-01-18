import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BarChart2, Shield, Users, Zap, Check, ChevronDown, ChevronUp, Star, TrendingUp, Globe, Smartphone, Mail } from 'lucide-react';

// --- Shared Components ---

const Section = ({ children, className = "" }) => (
    <div className={`relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`}>
        {children}
    </div>
);

const FadeIn = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-800">
            <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-400 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Typewriter Component ---
const TypewriterText = ({ text }) => {
    const words = text.split(" ");
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };
    const child = {
        visible: {
            opacity: 1,
            y: 0,
            color: "#94a3b8", // slate-400 default
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
        hidden: {
            opacity: 0,
            y: 10,
            transition: { type: "spring", damping: 12, stiffness: 100 },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto flex flex-wrap justify-center gap-x-1.5 gap-y-1"
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    key={index}
                    className={word.includes("TradeSense") || word.includes("ecosystem") ? "text-emerald-400 font-semibold" : ""}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

// --- Sections ---

const Hero = () => {
    const marketingPhrase = "Introducing TradeSense AI, a next-generation trading platform designed to guide traders of all levels, beginners or professionals. TradeSense AI combines real-time AI analytics, intelligent trading tools, live news, community interaction and premium MasterClass education in an ecosystem powerful.";

    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex flex-col justify-center">
            {/* Background Bull - Absolute Positioned */}
            <div className="absolute top-0 right-0 h-full w-full md:w-[60%] z-0 pointer-events-none select-none">
                {/* Desktop: Fade from right to left */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent z-10 md:via-slate-950/20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>

                <motion.img
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2 }}
                    src="/hero_bull_3d.png"
                    className="w-full h-full object-cover md:object-contain object-right-bottom opacity-80 md:opacity-100"
                    style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }}
                />
            </div>

            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            <Section className="relative z-20 text-center md:text-left">
                <div className="max-w-4xl">
                    {/* Hook */}
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-xs font-medium text-emerald-400 mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Now Accepting New Traders
                        </div>
                    </FadeIn>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.1] drop-shadow-2xl">
                        Master the Markets. <br />
                        <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                            Institutional Grade.
                        </span>
                    </h1>

                    {/* Interactive Marketing Text */}
                    <div className="mb-10 min-h-[120px] md:max-w-2xl text-shadow-sm">
                        <TypewriterText text={marketingPhrase} />
                    </div>

                    <FadeIn delay={0.4} className="flex flex-col sm:flex-row items-center md:items-start gap-4 mb-20">
                        <Link to="/auth/register" className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-slate-900 bg-emerald-500 rounded-full hover:bg-emerald-400 transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]">
                            Get Funded Now <ArrowRight className="ml-2 w-6 h-6" />
                        </Link>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-slate-900/80 border border-slate-700/50 rounded-full hover:bg-slate-800 transition-all backdrop-blur-md"
                        >
                            Explore Features
                        </button>
                    </FadeIn>
                </div>

                {/* Grid Visual - moved to bottom decorative */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none"></div>
            </Section>
        </section>
    );
};


const SocialProof = () => (
    <section className="py-10 border-y border-slate-900 bg-slate-950/50">
        <Section className="text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">Powering the next generation of firms</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 text-xl font-bold text-white"><Globe className="w-6 h-6 text-emerald-500" /> GlobalMarkets</div>
                <div className="flex items-center gap-2 text-xl font-bold text-white"><Zap className="w-6 h-6 text-emerald-500" /> TechTrade</div>
                <div className="flex items-center gap-2 text-xl font-bold text-white"><TrendingUp className="w-6 h-6 text-emerald-500" /> AlphaFlow</div>
                <div className="flex items-center gap-2 text-xl font-bold text-white"><Shield className="w-6 h-6 text-emerald-500" /> SecureFund</div>
            </div>
        </Section>
    </section>
);

const Features = () => (
    <section id="features" className="py-24 bg-slate-950">
        <Section>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Choose TradeSense?</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Engineered for performance, designed for traders.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FadeIn className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                    <BarChart2 className="w-10 h-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white mb-4">Real-Time AI Analytics</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Our proprietary AI algorithms analyze millions of data points per second to identify high-probability trade setups before they happen.
                    </p>
                </FadeIn>
                <FadeIn className="col-span-1 p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                    <Shield className="w-10 h-10 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-4">Pro Risk Controls</h3>
                    <p className="text-slate-400">Automated drawdown protection to keep your capital safe.</p>
                </FadeIn>
                <FadeIn className="col-span-1 p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                    <Globe className="w-10 h-10 text-purple-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-4">Global Access</h3>
                    <p className="text-slate-400">Trade from anywhere with our cloud-based ultra-low latency infrastructure.</p>
                </FadeIn>
                <FadeIn className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
                    <Smartphone className="w-10 h-10 text-orange-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white mb-4">Integrated Ecosystem</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Live news, community chat, economic calendar, and trade execution - all in one powerful dashboard.
                    </p>
                </FadeIn>
            </div>
        </Section>
    </section>
);

const HowItWorks = () => (
    <section className="py-24 bg-slate-900/30">
        <Section>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Your Path to Funding</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-800 -z-10"></div>

                {[
                    { step: "01", title: "Sign Up", desc: "Choose your account size and start the evaluation." },
                    { step: "02", title: "Trade", desc: "Show your skills on a demo account. Hit the profit target." },
                    { step: "03", title: "Get Funded", desc: "Start earning real payouts with up to $200k capital." }
                ].map((s, i) => (
                    <FadeIn key={i} delay={i * 0.2} className="text-center bg-slate-950 p-6 rounded-2xl border border-slate-900 md:border-none md:bg-transparent">
                        <div className="w-24 h-24 mx-auto bg-slate-900 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-6 border-4 border-slate-950 md:border-slate-800 shadow-xl relative z-10">
                            {s.step}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                        <p className="text-slate-400">{s.desc}</p>
                    </FadeIn>
                ))}
            </div>
        </Section>
    </section>
);

const Pricing = () => (
    <section className="py-24 bg-slate-950">
        <Section>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
                <p className="text-slate-400">One-time fee. No recurring charges.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Starter */}
                <FadeIn delay={0.1} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-400 mb-2">Starter</h3>
                    <div className="text-4xl font-bold text-white mb-6">200 MAD</div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-emerald-500" /> $10,000 Account</li>
                        <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-emerald-500" /> Basic Analytics</li>
                    </ul>
                    <Link to="/auth/register" className="w-full py-3 text-center border border-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors">Choose Plan</Link>
                </FadeIn>

                {/* Pro */}
                <FadeIn delay={0.2} className="p-8 rounded-3xl bg-slate-800 border border-emerald-500 flex flex-col relative shadow-2xl shadow-emerald-900/20 transform scale-105 z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-slate-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Most Popular</div>
                    <h3 className="text-lg font-bold text-emerald-400 mb-2">Pro Trader</h3>
                    <div className="text-4xl font-bold text-white mb-6">500 MAD</div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-white"><Check className="w-5 h-5 text-emerald-400" /> $50,000 Account</li>
                        <li className="flex gap-3 text-white"><Check className="w-5 h-5 text-emerald-400" /> Advanced AI Tools</li>
                        <li className="flex gap-3 text-white"><Check className="w-5 h-5 text-emerald-400" /> 1-on-1 Mentorship</li>
                    </ul>
                    <Link to="/auth/register" className="w-full py-3 text-center bg-emerald-500 text-slate-900 font-bold rounded-xl hover:bg-emerald-400 transition-colors">Get Funded</Link>
                </FadeIn>

                {/* Elite */}
                <FadeIn delay={0.3} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-400 mb-2">Elite</h3>
                    <div className="text-4xl font-bold text-white mb-6">1,000 MAD</div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-emerald-500" /> $100,000 Account</li>
                        <li className="flex gap-3 text-slate-300"><Check className="w-5 h-5 text-emerald-500" /> VIP Support</li>
                    </ul>
                    <Link to="/auth/register" className="w-full py-3 text-center border border-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors">Choose Plan</Link>
                </FadeIn>
            </div>
        </Section>
    </section>
);

const Testimonials = () => (
    <section className="py-24 bg-slate-900/30">
        <Section>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Traders Trust Us</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800">
                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-300 mb-6 italic">"The execution speed is unmatched. I passed my challenge in 3 days thanks to the conditions."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                                <div>
                                    <div className="font-bold text-white">Top Trader {i}</div>
                                    <div className="text-sm text-slate-500">Funded $50k</div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </Section>
    </section>
);

const FAQ = () => (
    <section className="py-24 bg-slate-950">
        <Section className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
                <FAQItem question="What is the profit split?" answer="We offer up to 90% profit split for our best traders. The default starts at 80%." />
                <FAQItem question="Are there any hidden fees?" answer="No. The price you pay for the challenge is the only fee. No monthly subscriptions." />
                <FAQItem question="Can I trade news?" answer="Yes, news trading is allowed on all accounts." />
            </div>
        </Section>
    </section>
);

const CTA = () => (
    <section className="py-32 relative overflow-hidden bg-emerald-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <Section className="text-center relative z-10">
            <FadeIn>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to change your life?</h2>
                <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of traders who have already secured their funding with TradeSense.</p>
                <Link to="/auth/register" className="inline-block px-12 py-5 bg-white text-emerald-900 font-bold text-xl rounded-full transition-all hover:scale-105 shadow-2xl">
                    Start Your Challenge
                </Link>
            </FadeIn>
        </Section>
    </section>
);

// --- Footer with Newsletter ---
const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubscribe = async () => {
        if (!email) return;
        setStatus('loading');
        try {
            // Using the new endpoint with proxy
            await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            setStatus('success');
            setEmail('');
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    return (
        <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900">
            <Section>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">T</div>
                            <span className="text-xl font-bold text-white">TradeSense</span>
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-8">
                            The world's leading prop trading firm. We provide the capital, you provide the skill.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"><Globe className="w-5 h-5" /></div>
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5" /></div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Platform</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                            <li><Link to="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                            <li><Link to="/leaderboard" className="hover:text-emerald-400 transition-colors">Leaderboard</Link></li>
                            <li><Link to="/auth/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-6">Newsletter</h4>
                        <p className="text-slate-400 text-sm mb-4">Get the latest trading insights.</p>
                        {status === 'success' ? (
                            <div className="text-emerald-500 font-bold flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" /> Subscribed!
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white w-full focus:outline-none focus:border-emerald-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                                />
                                <button
                                    onClick={handleSubscribe}
                                    disabled={status === 'loading'}
                                    className="bg-emerald-500 text-white rounded-lg px-4 py-2 font-bold hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    {status === 'loading' ? '...' : '→'}
                                </button>
                            </div>
                        )}
                        {status === 'error' && <p className="text-red-500 text-xs mt-2">Failed to subscribe.</p>}
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>&copy; 2024 TradeSense AI. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-white">Terms</Link>
                        <Link to="#" className="hover:text-white">Privacy</Link>
                        <Link to="#" className="hover:text-white">Cookies</Link>
                    </div>
                </div>
            </Section>
        </footer>
    );
};


const Landing = () => {
    return (
        <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-emerald-500/30 font-sans">
            <Hero />
            <SocialProof />
            <Features />
            <HowItWorks />
            <Pricing />
            <Testimonials />
            <FAQ />
            <CTA />
        </div>
    );
};

export default Landing;
