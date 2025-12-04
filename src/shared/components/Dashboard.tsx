import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TodoList, StashItem, UserProfile, Goal, JournalEntry } from '../types';
import { useTheme } from '../ThemeContext';

interface DashboardProps {
  user: UserProfile;
  todoLists: TodoList[];
  stashItems: StashItem[];
  goals: Goal[];
  journalEntries: JournalEntry[];
  productivityTip: string;
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({
  user,
  todoLists,
  stashItems,
  goals,
  journalEntries,
  productivityTip,
}) => {
  const { theme } = useTheme();
  const allTasks = todoLists.flatMap(list => list.tasks);
  const completedTasks = allTasks.filter(t => t.status === 'done').length;
  const pendingTasks = allTasks.length - completedTasks;

  const taskData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];

  const stashTypes = stashItems.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const stashData = Object.keys(stashTypes).map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: stashTypes[type],
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner - Violet Theme */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl shadow-violet-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold">
              Welcome back, {user.displayName?.split(' ')[0] || 'Viber'}
            </h1>
          </div>
          <p className="text-violet-100 text-lg ml-15">💡 {productivityTip}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric Card 1: Task Velocity */}
        <div
          className={`p-6 rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}
        >
          <h3
            className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
          >
            Task Velocity
          </h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-emerald-400">{completedTasks}</span>
            <span className={`mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
              tasks crushed
            </span>
          </div>
          <div
            className={`h-2 w-full rounded-full mt-4 overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`}
          >
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{
                width: `${allTasks.length ? (completedTasks / allTasks.length) * 100 : 0}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Metric Card 2: Stash Volume */}
        <div
          className={`p-6 rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}
        >
          <h3
            className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
          >
            Stash Volume
          </h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-amber-400">{stashItems.length}</span>
            <span className={`mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
              items secured
            </span>
          </div>
          <div className="flex gap-2 mt-6">
            {Object.entries(stashTypes).map(([type, count]) => (
              <span
                key={type}
                className={`text-xs px-2 py-1 rounded capitalize ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-slate-300'}`}
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>

        {/* Metric Card 3: Focus Time */}
        <div
          className={`p-6 rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}
        >
          <h3
            className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
          >
            Focus Time
          </h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-blue-400">0</span>
            <span className={`mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
              minutes today
            </span>
          </div>
          <div
            className={`h-2 w-full rounded-full mt-4 overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`}
          >
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${Math.min((0 / 120) * 100, 100)}%` }}
            ></div>
          </div>
          <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
            Goal: 120 minutes (5 sessions)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Progress - Gold Theme */}
        <div
          className={`rounded-xl p-6 border relative overflow-hidden ${theme === 'light' ? 'bg-white border-yellow-200' : 'bg-slate-900/50 border-yellow-500/30'}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-500/20'}`}
                >
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    ></path>
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}
                >
                  Active Goals
                </h3>
              </div>
            </div>
            <div className="space-y-4">
              {goals.slice(0, 3).map(goal => {
                const completed = goal.milestones.filter(m => m.completed).length;
                const total = goal.milestones.length;
                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span
                        className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}
                      >
                        {goal.title}
                      </span>
                      <span className={`${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div
                      className={`h-2 w-full rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-100' : 'bg-slate-800'}`}
                    >
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                  No active goals. Set a new goal to track progress!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Journal Recent - Purple Theme */}
        <div
          className={`rounded-xl p-6 border relative overflow-hidden ${theme === 'light' ? 'bg-white border-purple-200' : 'bg-slate-900/50 border-purple-500/30'}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-500/20'}`}
                >
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}
                >
                  Recent Reflections
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              {journalEntries.slice(0, 3).map(entry => {
                const moodEmoji =
                  {
                    great: '😊',
                    good: '😃',
                    okay: '😐',
                    down: '😔',
                    stressed: '😰',
                  }[entry.mood] || '😐';

                return (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-lg border flex items-start gap-3 ${theme === 'light' ? 'bg-purple-50/50 border-purple-200/50' : 'bg-purple-500/5 border-purple-500/20'}`}
                  >
                    <span className="text-xl">{moodEmoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className={`text-xs font-medium ${theme === 'light' ? 'text-purple-700' : 'text-purple-300'}`}
                        >
                          {new Date(entry.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p
                        className={`text-sm truncate ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
                      >
                        {entry.content}
                      </p>
                    </div>
                  </div>
                );
              })}
              {journalEntries.length === 0 && (
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                  No entries yet. Start your journal today!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checkmate Integration Preview - Emerald Theme */}
        <div
          className={`rounded-xl p-6 border relative overflow-hidden ${theme === 'light' ? 'bg-white border-emerald-200' : 'bg-slate-900/50 border-emerald-500/30'}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'light' ? 'bg-emerald-100' : 'bg-emerald-500/20'}`}
                >
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}
                >
                  Checkmate Activity
                </h3>
              </div>
            </div>
            <div className="space-y-3">
              {allTasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${theme === 'light' ? 'bg-emerald-50/50 border-emerald-200/50' : 'bg-emerald-500/5 border-emerald-500/20'}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${task.status === 'done' ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-slate-400'}`}
                  ></div>
                  <span
                    className={`text-sm flex-1 ${task.status === 'done' ? (theme === 'light' ? 'line-through text-gray-500' : 'line-through text-slate-500') : theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}
                  >
                    {task.title}
                  </span>
                </div>
              ))}
              {allTasks.length === 0 && (
                <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                  No tasks yet. Create one in Checkmate!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stash Integration Preview - Amber Theme */}
        <div
          className={`rounded-xl p-6 border relative overflow-hidden ${theme === 'light' ? 'bg-white border-amber-200' : 'bg-slate-900/50 border-amber-500/30'}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px] rounded-full"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'light' ? 'bg-amber-100' : 'bg-amber-500/20'}`}
                >
                  <svg
                    className="w-5 h-5 text-amber-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <h3
                  className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}
                >
                  Stash Additions
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stashItems.slice(0, 4).map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg text-xs border ${theme === 'light' ? 'bg-amber-50/50 border-amber-200/50' : 'bg-amber-500/5 border-amber-500/20'}`}
                >
                  <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1 truncate">
                    {item.title}
                  </div>
                  <div
                    className={`truncate text-xs ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}
                  >
                    {item.type}
                  </div>
                </div>
              ))}
              {stashItems.length === 0 && (
                <p
                  className={`text-sm col-span-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}
                >
                  No items yet. Add something to your Stash!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
