import React from "react";
import { LiveGlobe } from "@/components/ui/live-globe";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45" />
          </div>
          <span className="font-display text-xl font-bold tracking-tighter uppercase">
            Illuminate Her
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/music" className="text-sm text-slate-400 hover:text-white transition">Music</Link>
          <Link href="/automotive" className="text-sm text-slate-400 hover:text-white transition">Automotive</Link>
          <Link href="/finance" className="text-sm text-slate-400 hover:text-white transition">Finance</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 relative flex flex-col items-center justify-center text-center px-6 pt-12">
        <div className="z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6">
            Pioneering the <span className="text-teal-500">Future.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-8 leading-relaxed">
            Discover the stories of women who changed the world through 
            Music, Engineering, and Finance. Interact with the globe to explore their legacy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/music" 
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-teal-500 hover:text-white transition-all duration-300"
            >
              Start the Journey
            </Link>
            <Link 
              href="#explore" 
              className="px-8 py-4 bg-slate-900 border border-white/10 text-white font-bold rounded-full hover:bg-slate-800 transition-all"
            >
              Explore Pioneers
            </Link>
          </div>
        </div>

        {/* Globe Visualization */}
        <div id="explore" className="w-full max-w-5xl mt-12 relative">
          <LiveGlobe />
          {/* Ambient Background Light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 bg-black/20 mt-20">
        <p className="text-slate-500 text-sm mb-4 md:mb-0">
          © 2026 Illuminate Her. Built for the future of representation.
        </p>
        <div className="flex gap-6 text-slate-500 text-sm">
          <Link href="#" className="hover:text-white transition">About</Link>
          <Link href="#" className="hover:text-white transition">Stories</Link>
          <Link href="#" className="hover:text-white transition">Resources</Link>
        </div>
      </footer>
    </main>
  );
}
