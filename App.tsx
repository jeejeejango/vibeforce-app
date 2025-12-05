import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { UserProfile, TodoList, StashItem, Goal, JournalEntry } from './src/shared/types';
import { signInWithGoogle, logOut, onAuthStateChange } from './src/shared/services/auth';
import { getSmartProductivityTip } from './src/shared/services/geminiService';
import { getStashItems } from './src/features/stash/services/stashService';
import { getTodoLists } from './src/features/checkmate/services/checkmateService';
import { getGoals } from './src/features/goals/services/goalsService';
import { getJournalEntries } from './src/features/journal/services/journalService';
import { useTheme } from './src/shared/ThemeContext';
import { AppLayout } from './src/shared/components/AppLayout';
import { ErrorBoundary } from './src/shared/components/ErrorBoundary';
import LandingPage from './src/shared/components/LandingPage';

// Lazy load feature components for better performance
const Dashboard = React.lazy(() => import('./src/shared/components/Dashboard'));
const Checkmate = React.lazy(() => import('./src/features/checkmate/components/Checkmate'));
const Stash = React.lazy(() => import('./src/features/stash/components/Stash'));
const Focus = React.lazy(() => import('./src/features/focus/components/Focus'));
const Goals = React.lazy(() => import('./src/features/goals/components/Goals'));
const Journal = React.lazy(() => import('./src/features/journal/components/Journal'));

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ user: UserProfile | null; children: React.ReactNode }> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [productivityTip, setProductivityTip] = useState("Loading insight...");

  // App State
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [stashItems, setStashItems] = useState<StashItem[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const u = await signInWithGoogle();
      setUser(u);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    setStashItems([]);
    setTodoLists([]);
    setGoals([]);
    setJournalEntries([]);
    navigate('/');
  };

  // Listen for auth state changes (handles page refresh persistence)
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        getSmartProductivityTip("Software engineer working on a SaaS product").then(setProductivityTip);
        const items = await getStashItems(user.uid);
        setStashItems(items);
        const lists = await getTodoLists(user.uid);
        setTodoLists(lists);
        const userGoals = await getGoals(user.uid);
        setGoals(userGoals);
        const userEntries = await getJournalEntries(user.uid);
        setJournalEntries(userEntries);
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

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" replace /> : <LandingPage onLogin={handleLogin} isLoading={isLoading} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user!}
                theme={theme}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                searchData={{ goals, todoLists, journalEntries, stashItems }}
                pageTitle="Dashboard"
              >
                <ErrorBoundary featureName="Dashboard">
                  <Dashboard user={user!} todoLists={todoLists} stashItems={stashItems} goals={goals} journalEntries={journalEntries} productivityTip={productivityTip} />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user!}
                theme={theme}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                searchData={{ goals, todoLists, journalEntries, stashItems }}
                pageTitle="Goals"
              >
                <ErrorBoundary featureName="Goals">
                  <Goals user={user!} goals={goals} setGoals={setGoals} />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkmate"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user!}
                theme={theme}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                searchData={{ goals, todoLists, journalEntries, stashItems }}
                pageTitle="Checkmate"
              >
                <ErrorBoundary featureName="Checkmate">
                  <Checkmate user={user!} todoLists={todoLists} setTodoLists={setTodoLists} />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/focus"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user!}
                theme={theme}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                searchData={{ goals, todoLists, journalEntries, stashItems }}
                pageTitle="Focus"
              >
                <ErrorBoundary featureName="Focus">
                  <Focus user={user!} todoLists={todoLists} />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stash"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user!}
                theme={theme}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                searchData={{ goals, todoLists, journalEntries, stashItems }}
                pageTitle="Stash"
              >
                <ErrorBoundary featureName="Stash">
                  <Stash user={user!} items={stashItems} setItems={setStashItems} />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/journal"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user!}
                theme={theme}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                searchData={{ goals, todoLists, journalEntries, stashItems }}
                pageTitle="Journal"
              >
                <ErrorBoundary featureName="Journal">
                  <Journal user={user!} entries={journalEntries} setEntries={setJournalEntries} />
                </ErrorBoundary>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
