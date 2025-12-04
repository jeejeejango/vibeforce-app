import React, { useState, useEffect } from 'react';
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
import LandingPage from './src/shared/components/LandingPage';
import Dashboard from './src/shared/components/Dashboard';
import Checkmate from './src/features/checkmate/components/Checkmate';
import Stash from './src/features/stash/components/Stash';
import Focus from './src/features/focus/components/Focus';
import Goals from './src/features/goals/components/Goals';
import Journal from './src/features/journal/components/Journal';

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
            <AppLayout user={user!} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
              <Dashboard user={user!} todoLists={todoLists} stashItems={stashItems} goals={goals} journalEntries={journalEntries} productivityTip={productivityTip} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/goals"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
              <Goals user={user!} goals={goals} setGoals={setGoals} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkmate"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
              <Checkmate user={user!} todoLists={todoLists} setTodoLists={setTodoLists} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/focus"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
              <Focus user={user!} todoLists={todoLists} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stash"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
              <Stash user={user!} items={stashItems} setItems={setStashItems} />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/journal"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} theme={theme} toggleTheme={toggleTheme} handleLogout={handleLogout}>
              <Journal user={user!} entries={journalEntries} setEntries={setJournalEntries} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
