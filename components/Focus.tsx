import React, { useState, useEffect } from 'react';
import { TodoList, FocusSession, UserProfile } from '../types';
import { useTheme } from '../ThemeContext';

interface FocusProps {
    user: UserProfile;
    todoLists: TodoList[];
}

type SessionType = 'work' | 'short-break' | 'long-break';

const SESSION_DURATIONS = {
    work: 25 * 60, // 25 minutes
    'short-break': 5 * 60, // 5 minutes
    'long-break': 15 * 60, // 15 minutes
};

const Focus: React.FC<FocusProps> = ({ user, todoLists }) => {
    const { theme } = useTheme();
    const [sessionType, setSessionType] = useState<SessionType>('work');
    const [timeLeft, setTimeLeft] = useState(SESSION_DURATIONS[sessionType]);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [completedSessions, setCompletedSessions] = useState(0);

    const allTasks = todoLists.flatMap(list =>
        list.tasks.filter(t => t.status !== 'done')
    );

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleSessionComplete();
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    // Reset timer when session type changes
    useEffect(() => {
        setTimeLeft(SESSION_DURATIONS[sessionType]);
        setIsRunning(false);
    }, [sessionType]);

    const handleSessionComplete = () => {
        setIsRunning(false);
        setCompletedSessions(prev => prev + 1);

        // Play completion sound (optional)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZQRE=');
        audio.play().catch(() => { });

        // Auto-start break or work
        if (sessionType === 'work') {
            setSessionType(completedSessions % 4 === 3 ? 'long-break' : 'short-break');
        } else {
            setSessionType('work');
        }
    };

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(SESSION_DURATIONS[sessionType]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((SESSION_DURATIONS[sessionType] - timeLeft) / SESSION_DURATIONS[sessionType]) * 100;
    const selectedTask = allTasks.find(t => t.id === selectedTaskId);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-4xl font-bold flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    <span className="text-blue-400">⏱</span> Focus
                </h1>
                <p className={`mt-2 text-lg ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                    Deep Work Timer • Pomodoro Technique
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Timer Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Session Type Selector */}
                    <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSessionType('work')}
                                disabled={isRunning}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${sessionType === 'work'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : theme === 'light'
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    } disabled:opacity-50`}
                            >
                                Work (25m)
                            </button>
                            <button
                                onClick={() => setSessionType('short-break')}
                                disabled={isRunning}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${sessionType === 'short-break'
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : theme === 'light'
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    } disabled:opacity-50`}
                            >
                                Short Break (5m)
                            </button>
                            <button
                                onClick={() => setSessionType('long-break')}
                                disabled={isRunning}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${sessionType === 'long-break'
                                        ? 'bg-violet-600 text-white shadow-lg'
                                        : theme === 'light'
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    } disabled:opacity-50`}
                            >
                                Long Break (15m)
                            </button>
                        </div>
                    </div>

                    {/* Circular Timer */}
                    <div className={`rounded-xl p-8 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
                        <div className="flex flex-col items-center">
                            {/* SVG Circle Progress */}
                            <div className="relative w-64 h-64 mb-8">
                                <svg className="transform -rotate-90 w-64 h-64">
                                    <circle
                                        cx="128"
                                        cy="128"
                                        r="120"
                                        stroke={theme === 'light' ? '#e5e7eb' : '#334155'}
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    <circle
                                        cx="128"
                                        cy="128"
                                        r="120"
                                        stroke={sessionType === 'work' ? '#3b82f6' : sessionType === 'short-break' ? '#10b981' : '#8b5cf6'}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 120}`}
                                        strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-6xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        {formatTime(timeLeft)}
                                    </span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleStartPause}
                                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${isRunning
                                            ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl'
                                        }`}
                                >
                                    {isRunning ? 'Pause' : 'Start'}
                                </button>
                                <button
                                    onClick={handleReset}
                                    className={`px-6 py-4 rounded-xl font-medium transition-colors ${theme === 'light'
                                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                            : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                        }`}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Task Selection */}
                    {sessionType === 'work' && (
                        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
                            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                Working On (Optional)
                            </h3>
                            <select
                                value={selectedTaskId}
                                onChange={(e) => setSelectedTaskId(e.target.value)}
                                className={`w-full border rounded-lg p-3 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-900 border-slate-700 text-white'}`}
                                disabled={isRunning}
                            >
                                <option value="">No specific task</option>
                                {allTasks.map(task => (
                                    <option key={task.id} value={task.id}>
                                        {task.title}
                                    </option>
                                ))}
                            </select>
                            {selectedTask && (
                                <div className="mt-3 flex items-center gap-2">
                                    <span className={`inline-block px-2 py-1 text-xs rounded ${selectedTask.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                            selectedTask.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {selectedTask.priority}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    {/* Today's Stats */}
                    <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
                        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                            Today's Progress
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>Sessions</span>
                                    <span className={`text-3xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                                        {completedSessions}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-gray-200' : 'bg-slate-700'}`}>
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-500"
                                        style={{ width: `${Math.min(completedSessions * 12.5, 100)}%` }}
                                    />
                                </div>
                                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-slate-500'}`}>
                                    Goal: 8 sessions
                                </p>
                            </div>

                            <div>
                                <div className="flex justify-between items-end">
                                    <span className={theme === 'light' ? 'text-gray-600' : 'text-slate-400'}>Focus Time</span>
                                    <span className={`text-2xl font-bold ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                                        {Math.floor(completedSessions * 25)}m
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-900/20 border-blue-800/50'}`}>
                        <h3 className="text-sm font-semibold text-blue-600 mb-2">💡 Pro Tip</h3>
                        <p className={`text-sm ${theme === 'light' ? 'text-blue-900' : 'text-blue-200'}`}>
                            Take breaks seriously! Your brain needs rest to maintain peak performance. Stand up, stretch, and hydrate.
                        </p>
                    </div>

                    {/* Pomodoro Guide */}
                    <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-800 border-slate-700'}`}>
                        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                            How It Works
                        </h3>
                        <ol className={`space-y-2 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                            <li className="flex gap-2">
                                <span className="text-blue-500 font-bold">1.</span>
                                <span>Choose a task to work on</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-500 font-bold">2.</span>
                                <span>Work for 25 minutes</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-500 font-bold">3.</span>
                                <span>Take a 5-minute break</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-blue-500 font-bold">4.</span>
                                <span>After 4 sessions, take a 15-minute break</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Focus;
