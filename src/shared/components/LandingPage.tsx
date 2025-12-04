import React from 'react';
import { useTheme } from '../ThemeContext';

interface LandingPageProps {
  onLogin: () => void;
  isLoading: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, isLoading }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen font-sans selection:bg-violet-500 selection:text-white overflow-x-hidden ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-slate-950 text-slate-50'}`}
    >
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 backdrop-blur-md border-b ${theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-slate-950/80 border-slate-800'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-lg"></div>
            <span className="font-bold text-xl tracking-tight">VibeForce</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              )}
            </button>
            <button
              onClick={onLogin}
              disabled={isLoading}
              className={`text-sm font-medium transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-slate-300 hover:text-white'}`}
            >
              Sign In
            </button>
          </div>
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
          <p
            className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
          >
            Unify your workflow. VibeForce integrates vision setting, strategic task management,
            deep work focus, and daily reflection with an intelligent resource vault, all enhanced
            by generative AI.
          </p>

          <button
            onClick={onLogin}
            disabled={isLoading}
            className={`group relative inline-flex items-center gap-3 px-8 py-4 font-bold rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${theme === 'light' ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-600/20' : 'bg-white text-slate-950 hover:bg-slate-200 shadow-white/10'}`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Initializing...
              </>
            ) : (
              <>
                <span>Get Started</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  ></path>
                </svg>
              </>
            )}
          </button>

          <p className={`mt-6 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
            Free to start • No credit card required
          </p>
        </div>
      </div>

      {/* Apps Showcase */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <h2
          className={`text-center text-3xl font-bold mb-16 ${theme === 'light' ? 'text-gray-800' : 'text-slate-200'}`}
        >
          Integrated Power Apps
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Goals Card */}
          <div
            className={`group relative rounded-3xl p-8 border transition-colors overflow-hidden ${theme === 'light' ? 'bg-white border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50/30' : 'bg-slate-900/50 border-yellow-500/20 hover:bg-slate-900 hover:border-yellow-500/50'}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-yellow-500/20 transition-all"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  ></path>
                </svg>
              </div>

              <h3
                className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
              >
                Goals{' '}
                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded border border-yellow-500/20">
                  Vision
                </span>
              </h3>
              <p
                className={`text-lg mb-8 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
              >
                Turn your dreams into reality. Set ambitious goals, break them down into achievable
                milestones, and track your progress visually.
              </p>

              <ul
                className={`space-y-3 ${theme === 'light' ? 'text-yellow-800' : 'text-yellow-100/80'}`}
              >
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  Milestone Tracking
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  Visual Progress Rings
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  Deadline Management
                </li>
              </ul>
            </div>
          </div>

          {/* Checkmate Card */}
          <div
            className={`group relative rounded-3xl p-8 border transition-colors overflow-hidden ${theme === 'light' ? 'bg-white border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/30' : 'bg-slate-900/50 border-emerald-500/20 hover:bg-slate-900 hover:border-emerald-500/50'}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>

              <h3
                className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
              >
                Checkmate{' '}
                <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/20">
                  Tasks
                </span>
              </h3>
              <p
                className={`text-lg mb-8 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
              >
                Stop getting overwhelmed. Enter a high-level goal and watch Checkmate's AI break it
                down into actionable subtasks instantly. Priority tagging and progress tracking
                included.
              </p>

              <ul
                className={`space-y-3 ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-100/80'}`}
              >
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

          {/* Focus Card */}
          <div
            className={`group relative rounded-3xl p-8 border transition-colors overflow-hidden ${theme === 'light' ? 'bg-white border-blue-200 hover:border-blue-300 hover:bg-blue-50/30' : 'bg-slate-900/50 border-blue-500/20 hover:bg-slate-900 hover:border-blue-500/50'}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>

              <h3
                className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
              >
                Focus{' '}
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/20">
                  Timer
                </span>
              </h3>
              <p
                className={`text-lg mb-8 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
              >
                Master deep work with Pomodoro technique. Time-box your sessions, eliminate
                distractions, and track your focus hours. Integrate seamlessly with your Checkmate
                tasks.
              </p>

              <ul
                className={`space-y-3 ${theme === 'light' ? 'text-blue-800' : 'text-blue-100/80'}`}
              >
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Pomodoro Timer
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Task Integration
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Sessions Tracking
                </li>
              </ul>
            </div>
          </div>

          {/* Stash Card */}
          <div
            className={`group relative rounded-3xl p-8 border transition-colors overflow-hidden ${theme === 'light' ? 'bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50/30' : 'bg-slate-900/50 border-amber-500/20 hover:bg-slate-900 hover:border-amber-500/50'}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>

              <h3
                className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
              >
                Stash{' '}
                <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/20">
                  Resources
                </span>
              </h3>
              <p
                className={`text-lg mb-8 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
              >
                Your intelligent second brain. Throw links, snippets, and rough notes into the
                vault. Stash automatically tags, titles, and summarizes them for instant recall
                later.
              </p>

              <ul
                className={`space-y-3 ${theme === 'light' ? 'text-amber-800' : 'text-amber-100/80'}`}
              >
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

          {/* Journal Card */}
          <div
            className={`group relative rounded-3xl p-8 border transition-colors overflow-hidden ${theme === 'light' ? 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50/30' : 'bg-slate-900/50 border-purple-500/20 hover:bg-slate-900 hover:border-purple-500/50'}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
              </div>

              <h3
                className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
              >
                Journal{' '}
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded border border-purple-500/20">
                  Reflection
                </span>
              </h3>
              <p
                className={`text-lg mb-8 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
              >
                Reflect on your journey. Capture daily thoughts, track your mood, and celebrate
                wins. A clear mind is a productive mind.
              </p>

              <ul
                className={`space-y-3 ${theme === 'light' ? 'text-purple-800' : 'text-purple-100/80'}`}
              >
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Daily Reflections
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Mood Tracking
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  Wins & Learnings
                </li>
              </ul>
            </div>
          </div>

          {/* Coming Soon Card */}
          <div
            className={`group relative rounded-3xl p-8 border border-dashed transition-colors overflow-hidden flex flex-col items-center justify-center text-center ${theme === 'light' ? 'bg-gray-50 border-gray-300 hover:border-gray-400' : 'bg-slate-900/30 border-slate-700 hover:border-slate-600'}`}
          >
            <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className={`w-8 h-8 ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <h3
              className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'}`}
            >
              More Coming Soon
            </h3>
            <p className={`text-sm ${theme === 'light' ? 'text-gray-400' : 'text-slate-500'}`}>
              We are constantly building new tools to supercharge your workflow. Stay tuned!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`border-t py-12 text-center text-sm ${theme === 'light' ? 'border-gray-200 bg-white text-gray-500' : 'border-slate-800 bg-slate-950 text-slate-500'}`}
      >
        <p>© {new Date().getFullYear()} VibeForce Inc. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a
            href="#"
            className={`transition-colors ${theme === 'light' ? 'hover:text-gray-800' : 'hover:text-slate-300'}`}
          >
            Privacy
          </a>
          <a
            href="#"
            className={`transition-colors ${theme === 'light' ? 'hover:text-gray-800' : 'hover:text-slate-300'}`}
          >
            Terms
          </a>
          <a
            href="#"
            className={`transition-colors ${theme === 'light' ? 'hover:text-gray-800' : 'hover:text-slate-300'}`}
          >
            Twitter
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
