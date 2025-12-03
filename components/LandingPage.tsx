import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
  isLoading: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-lg"></div>
            <span className="font-bold text-xl tracking-tight">VibeForce</span>
          </div>
          <button 
            onClick={onLogin}
            disabled={isLoading}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            ✨ Powered by Gemini AI
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8">
            The Operating System <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400">
              For Your Life
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Unify your workflow. VibeForce integrates strategic task management with an intelligent resource vault, all enhanced by generative AI.
          </p>
          
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-xl text-lg hover:bg-slate-200 transition-all transform hover:scale-105 shadow-xl shadow-white/10 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
               <>
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Initializing...
               </>
            ) : (
                <>
                  <span>Get Started</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </>
            )}
          </button>
          
          <p className="mt-6 text-sm text-slate-500">Free to start • No credit card required</p>
        </div>
      </div>

      {/* Apps Showcase */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <h2 className="text-center text-3xl font-bold mb-16 text-slate-200">Integrated Power Apps</h2>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Checkmate Card */}
          <div className="group relative bg-slate-900/50 border border-emerald-500/20 rounded-3xl p-8 hover:bg-slate-900 transition-colors hover:border-emerald-500/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                Checkmate <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/20">Tasks</span>
              </h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Stop getting overwhelmed. Enter a high-level goal and watch Checkmate's AI break it down into actionable subtasks instantly. Priority tagging and progress tracking included.
              </p>
              
              <ul className="space-y-3 text-emerald-100/80">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  AI Strategic Decomposition
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Priority Matrices
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Velocity Tracking
                </li>
              </ul>
            </div>
          </div>

          {/* Stash Card */}
          <div className="group relative bg-slate-900/50 border border-amber-500/20 rounded-3xl p-8 hover:bg-slate-900 transition-colors hover:border-amber-500/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                Stash <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/20">Resources</span>
              </h3>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Your intelligent second brain. Throw links, snippets, and rough notes into the vault. Stash automatically tags, titles, and summarizes them for instant recall later.
              </p>
              
              <ul className="space-y-3 text-amber-100/80">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Auto-Summarization
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Smart Tagging
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Link & Code Support
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} VibeForce Inc. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Twitter</a>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
