import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TodoList, StashItem, UserProfile } from '../types';
import { useTheme } from '../ThemeContext';

interface DashboardProps {
  user: UserProfile;
  todoLists: TodoList[];
  stashItems: StashItem[];
  productivityTip: string;
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ user, todoLists, stashItems, productivityTip }) => {
  const { theme } = useTheme();
  const allTasks = todoLists.flatMap(list => list.tasks);
  const completedTasks = allTasks.filter(t => t.status === 'done').length;
  const pendingTasks = allTasks.length - completedTasks;

  const taskData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks },
  ];

  const stashTypes = stashItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stashData = Object.keys(stashTypes).map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: stashTypes[type]
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {user.displayName?.split(' ')[0] || 'Viber'}</h1>
        <p className="text-indigo-100 text-lg opacity-90">{productivityTip}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Metric Card 1: Task Velocity */}
        <div className={`p-6 rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Task Velocity</h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-emerald-400">{completedTasks}</span>
            <span className={`mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>tasks crushed</span>
          </div>
          <div className={`h-2 w-full rounded-full mt-4 overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`}>
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${allTasks.length ? (completedTasks / allTasks.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Metric Card 2: Stash Volume */}
        <div className={`p-6 rounded-xl shadow-lg border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Stash Volume</h3>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-amber-400">{stashItems.length}</span>
            <span className={`mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>items secured</span>
          </div>
          <div className="flex gap-2 mt-6">
            {Object.entries(stashTypes).map(([type, count]) => (
              <span key={type} className={`text-xs px-2 py-1 rounded capitalize ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-slate-300'}`}>
                {type}: {count}
              </span>
            ))}
          </div>
        </div>

        {/* Chart: Activity Split */}
        <div className={`p-6 rounded-xl shadow-lg flex flex-col justify-between border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
          <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Stash Composition</h3>
          <div className="h-32 w-full">
            {stashData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stashData}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme === 'light' ? '#ffffff' : '#1e293b', borderColor: theme === 'light' ? '#e5e7eb' : '#334155', color: theme === 'light' ? '#111827' : '#f8fafc' }}
                    cursor={{ fill: theme === 'light' ? '#f3f4f6' : '#334155', opacity: 0.4 }}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={`h-full flex items-center justify-center text-sm ${theme === 'light' ? 'text-gray-400' : 'text-slate-600'}`}>No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Checkmate Integration Preview */}
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}>Recent Checkmate Activity</h3>
          </div>
          <div className="space-y-3">
            {allTasks.slice(0, 3).map(task => (
              <div key={task.id} className={`flex items-center gap-3 p-3 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-800/50 border-slate-700/50'}`}>
                <div className={`w-3 h-3 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                <span className={`text-sm ${task.status === 'done' ? theme === 'light' ? 'line-through text-gray-400' : 'line-through text-slate-500' : theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}>{task.title}</span>
              </div>
            ))}
            {allTasks.length === 0 && <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>No tasks found.</p>}
          </div>
        </div>

        {/* Stash Integration Preview */}
        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-slate-200'}`}>Recent Stash Additions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stashItems.slice(0, 4).map(item => (
              <div key={item.id} className={`p-3 rounded-lg text-xs border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-slate-800/50 border-slate-700/50'}`}>
                <div className="font-semibold text-amber-500 mb-1 truncate">{item.title}</div>
                <div className={`truncate ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>{item.type}</div>
              </div>
            ))}
            {stashItems.length === 0 && <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>No items found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
