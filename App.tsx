import React, { useState, useEffect } from 'react';
import { UserProfile, AppView, TodoList, StashItem } from './types';
import { signInWithGoogle, logOut, onAuthStateChange } from './services/auth';
import { getSmartProductivityTip } from './services/geminiService';
import { getStashItems, getTodoLists } from './services/firestore';
import { useTheme } from './ThemeContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Checkmate from './components/Checkmate';
import Stash from './components/Stash';
import Focus from './components/Focus';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [productivityTip, setProductivityTip] = useState("Loading insight...");

  // App State
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [stashItems, setStashItems] = useState<StashItem[]>([]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const u = await signInWithGoogle();
      setUser(u);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    setCurrentView('dashboard');
    setStashItems([]);
    setTodoLists([]);
  };

  // Listen for auth state changes (handles page refresh persistence)
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        // Fetch a tip when user logs in
        getSmartProductivityTip("Software engineer working on a SaaS product").then(setProductivityTip);
        const items = await getStashItems(user.uid);
        setStashItems(items);
        const lists = await getTodoLists(user.uid);
        setTodoLists(lists);
      }
    });

    return () => unsubscribe();
  }, []);

  // Separate effect for loading state
  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (!user) {
    return <LandingPage onLogin={handleLogin} isLoading={isLoading} />;
  }

  return (
    <div className={`min-h-screen flex font-sans ${theme === 'light' ? 'bg-gray-50 text-gray-900' : 'bg-slate-950 text-slate-100'}`}>
      {/* Sidebar Navigation */}
      <aside className={`w-20 lg:w-64 border-r flex flex-col fixed h-full z-20 transition-all duration-300 ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-800'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-lg flex-shrink-0"></div>
          <span className="font-bold text-xl tracking-tight hidden lg:block">VibeForce</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/50' : theme === 'light' ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span className="hidden lg:block font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('checkmate')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'checkmate' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : theme === 'light' ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="hidden lg:block font-medium">Checkmate</span>
          </button>

          <button
            onClick={() => setCurrentView('stash')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'stash' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/50' : theme === 'light' ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <span className="hidden lg:block font-medium">Stash</span>
          </button>

          <button
            onClick={() => setCurrentView('focus')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'focus' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : theme === 'light' ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="hidden lg:block font-medium">Focus</span>
          </button>
        </nav>

        <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-slate-800'}`}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center gap-2 p-2 mb-4 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            )}
            <span className="hidden lg:block text-sm">{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>

          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user.photoURL || ''} alt="User" className={`w-8 h-8 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`} />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-medium truncate">{user.displayName}</p>
              <p className={`text-xs truncate ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span className="hidden lg:block text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 ml-20 lg:ml-64 relative min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-slate-950'}`}>
        <header className={`sticky top-0 z-10 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center lg:hidden ${theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-slate-950/80 border-slate-800'}`}>
          <span className="font-bold text-lg">VibeForce</span>
          {/* Mobile menu toggle would go here */}
        </header>

        <div className="p-2 lg:p-6">
          {currentView === 'dashboard' && <Dashboard user={user} todoLists={todoLists} stashItems={stashItems} productivityTip={productivityTip} />}
          {currentView === 'checkmate' && <Checkmate user={user} todoLists={todoLists} setTodoLists={setTodoLists} />}
          {currentView === 'stash' && <Stash user={user} items={stashItems} setItems={setStashItems} />}
          {currentView === 'focus' && <Focus user={user} todoLists={todoLists} />}
        </div>
      </main>
    </div>
  );
};

export default App;
