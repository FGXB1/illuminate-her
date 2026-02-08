"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Star, ArrowRight, BookOpen, ExternalLink, RefreshCw, X } from "lucide-react"

interface EndingPageProps {
    xp: number
    rounds: number
    onReset: () => void
    onContinue: () => void
}

export function EndingPage({ xp, rounds, onReset, onContinue }: EndingPageProps) {
    const [rating, setRating] = useState(0)
    const [showResources, setShowResources] = useState(false)

    const resources = [
        {
            title: "Girls Who Invest",
            description: "A non-profit organization dedicated to increasing the number of women in portfolio management and executive leadership in the asset management industry.",
            url: "https://www.girlswhoinvest.org/",
            type: "Program"
        },
        {
            title: "Investopedia Simulator",
            description: "A free stock market game where you can practice trading with virtual money.",
            url: "https://www.investopedia.com/simulator/",
            type: "Tool"
        },
        {
            title: "Introduction to Finance",
            description: "Learn the basics of finance with this course from Coursera.",
            url: "https://www.coursera.org/learn/finance-for-non-finance-managers", // Generic finance course
            type: "Course"
        }
    ]

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-slate-950 to-slate-950" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

            <div className="relative z-10 w-full max-w-lg mx-auto text-center space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 ring-1 ring-amber-500/50 mb-4">
                        <Trophy className="w-8 h-8 text-amber-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-amber-500 font-display">
                        Industry Mastered!
                    </h1>
                    <p className="text-slate-400 text-lg">
                        You have the skills to lead in Finance!
                    </p>
                </motion.div>

                {/* Stats Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 grid grid-cols-2 gap-4"
                >
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Total XP Earned</p>
                        <p className="text-3xl font-bold text-amber-400">{xp}</p>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Rounds Completed</p>
                        <p className="text-3xl font-bold text-blue-400">{rounds}</p>
                    </div>
                </motion.div>

                {/* Impact Check */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                >
                    <p className="text-sm text-slate-400">How do you feel about this field now?</p>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`p-1 transition-all duration-200 hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-700 hover:text-slate-500'}`}
                            >
                                <Star className={`w-8 h-8 ${rating >= star ? 'fill-amber-400' : ''}`} />
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col gap-3 pt-4"
                >
                    <button
                        onClick={() => setShowResources(true)}
                        className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transform transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
                    >
                        <BookOpen className="w-5 h-5" />
                        Explore Your Future
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={onReset}
                            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset All
                        </button>
                        <button
                            onClick={onContinue}
                            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition-colors"
                        >
                            Play Another Round
                        </button>
                    </div>
                </motion.div>

            </div>

            {/* Resources Modal */}
            <AnimatePresence>
                {showResources && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-800 flex justify-between items-center z-10">
                                <h2 className="text-xl font-bold text-white">Future Opportunities</h2>
                                <button
                                    onClick={() => setShowResources(false)}
                                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {resources.map((resource, idx) => (
                                    <a
                                        key={idx}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-xl transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-amber-500/10 text-amber-500">{resource.type}</span>
                                            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{resource.title}</h3>
                                        <p className="text-sm text-slate-400">{resource.description}</p>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
