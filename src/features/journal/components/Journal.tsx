import React, { useState, useEffect } from 'react';
import { UserProfile, JournalEntry } from '../../../shared/types';
import { addJournalEntry, updateJournalEntry } from '../services/journalService';
import { useTheme } from '../../../shared/ThemeContext';

interface JournalProps {
    user: UserProfile;
    entries: JournalEntry[];
    setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
}

const MOODS = {
    great: { emoji: '😊', label: 'Great', color: 'green' },
    good: { emoji: '😃', label: 'Good', color: 'blue' },
    okay: { emoji: '😐', label: 'Okay', color: 'yellow' },
    down: { emoji: '😔', label: 'Down', color: 'orange' },
    stressed: { emoji: '😰', label: 'Stressed', color: 'red' },
};

const Journal: React.FC<JournalProps> = ({ user, entries, setEntries }) => {
    const { theme } = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [content, setContent] = useState('');
    const [mood, setMood] = useState<JournalEntry['mood']>('good');
    const [currentWin, setCurrentWin] = useState('');
    const [currentLearning, setCurrentLearning] = useState('');
    const [wins, setWins] = useState<string[]>([]);
    const [learnings, setLearnings] = useState<string[]>([]);

    const todayEntry = entries.find(e =>
        new Date(e.date).toDateString() === selectedDate.toDateString()
    );

    // Load existing entry data when date changes
    useEffect(() => {
        if (todayEntry) {
            setContent(todayEntry.content);
            setMood(todayEntry.mood);
            setWins(todayEntry.wins);
            setLearnings(todayEntry.learnings);
        } else {
            // Reset form for new entry
            setContent('');
            setMood('good');
            setWins([]);
            setLearnings([]);
        }
    }, [selectedDate, todayEntry]);

    const handleSaveEntry = async () => {
        if (!content.trim()) return;

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const entryData: Omit<JournalEntry, 'id'> = {
            date: startOfDay.getTime(),
            content,
            mood,
            wins,
            learnings,
            createdAt: todayEntry?.createdAt || Date.now(),
        };

        if (todayEntry) {
            // Update existing entry
            await updateJournalEntry(user.uid, todayEntry.id, entryData);
            const updatedEntry = { ...entryData, id: todayEntry.id };
            setEntries(entries.map(e => e.id === todayEntry.id ? updatedEntry : e));
        } else {
            // Create new entry
            const newEntry = await addJournalEntry(user.uid, entryData);
            setEntries([newEntry, ...entries]);
        }

        // Reset form (only if it was a new entry, or if we want to clear after update)
        // For now, let's keep the content for editing after update, but clear win/learning inputs
        setCurrentWin('');
        setCurrentLearning('');
    };

    const addWin = () => {
        if (currentWin.trim()) {
            setWins([...wins, currentWin]);
            setCurrentWin('');
        }
    };

    const addLearning = () => {
        if (currentLearning.trim()) {
            setLearnings([...learnings, currentLearning]);
            setCurrentLearning('');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-4xl font-bold flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    <span className="text-purple-400">📔</span> Journal
                </h1>
                <p className={`mt-2 text-lg ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                    Daily Reflection • Capture Learning • Track Growth
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Entry Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Date Selector & Mood */}
                    <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-purple-200' : 'bg-slate-800 border-purple-500/30'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="date"
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                className={`border rounded-lg px-4 py-2 ${theme === 'light'
                                    ? 'bg-white border-gray-300 text-gray-900'
                                    : 'bg-slate-900 border-slate-700 text-white'
                                    }`}
                            />
                            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Mood Selector */}
                        <div>
                            <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                                How are you feeling?
                            </label>
                            <div className="flex gap-2">
                                {Object.entries(MOODS).map(([key, { emoji, label }]) => (
                                    <button
                                        key={key}
                                        onClick={() => setMood(key as JournalEntry['mood'])}
                                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${mood === key
                                            ? 'border-purple-500 bg-purple-500/20 scale-105'
                                            : theme === 'light'
                                                ? 'border-gray-200 hover:border-purple-300'
                                                : 'border-slate-700 hover:border-purple-500/50'
                                            }`}
                                        title={label}
                                    >
                                        <div className="text-2xl">{emoji}</div>
                                        <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>{label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Entry Content */}
                    <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-purple-200' : 'bg-slate-800 border-purple-500/30'}`}>
                        <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                            What's on your mind?
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`w-full border rounded-lg p-4 min-h-[200px] ${theme === 'light'
                                ? 'bg-white border-gray-300 text-gray-900'
                                : 'bg-slate-900 border-slate-700 text-white'
                                }`}
                            placeholder="Write about your day, thoughts, feelings, or anything else..."
                        />
                    </div>

                    {/* Wins & Learnings */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Wins */}
                        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-green-200' : 'bg-slate-800 border-green-500/30'}`}>
                            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                <span>🎉</span> Wins
                            </h3>
                            <div className="space-y-2 mb-3">
                                {wins.map((win, i) => (
                                    <div key={i} className={`text-sm p-2 rounded ${theme === 'light' ? 'bg-green-50 text-green-800' : 'bg-green-500/10 text-green-300'}`}>
                                        {win}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentWin}
                                    onChange={(e) => setCurrentWin(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addWin()}
                                    placeholder="Add a win..."
                                    className={`flex-1 border rounded px-2 py-1 text-sm ${theme === 'light'
                                        ? 'bg-white border-gray-300'
                                        : 'bg-slate-900 border-slate-700 text-white'
                                        }`}
                                />
                                <button onClick={addWin} className="text-green-500 hover:text-green-400">+</button>
                            </div>
                        </div>

                        {/* Learnings */}
                        <div className={`rounded-xl p-6 border ${theme === 'light' ? 'bg-white border-blue-200' : 'bg-slate-800 border-blue-500/30'}`}>
                            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                <span>💡</span> Learnings
                            </h3>
                            <div className="space-y-2 mb-3">
                                {learnings.map((learning, i) => (
                                    <div key={i} className={`text-sm p-2 rounded ${theme === 'light' ? 'bg-blue-50 text-blue-800' : 'bg-blue-500/10 text-blue-300'}`}>
                                        {learning}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentLearning}
                                    onChange={(e) => setCurrentLearning(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addLearning()}
                                    placeholder="Add a learning..."
                                    className={`flex-1 border rounded px-2 py-1 text-sm ${theme === 'light'
                                        ? 'bg-white border-gray-300'
                                        : 'bg-slate-900 border-slate-700 text-white'
                                        }`}
                                />
                                <button onClick={addLearning} className="text-blue-500 hover:text-blue-400">+</button>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSaveEntry}
                        disabled={!content.trim()}
                        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-lg shadow-purple-900/30"
                    >
                        {todayEntry ? 'Update Entry' : 'Save Entry'}
                    </button>
                </div>

                {/* Past Entries Sidebar */}
                <div className="space-y-4">
                    <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        Past Entries
                    </h3>
                    {entries.slice(0, 10).map(entry => (
                        <div
                            key={entry.id}
                            onClick={() => setSelectedDate(new Date(entry.date))}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === 'light'
                                ? 'bg-white border-purple-200 hover:border-purple-300'
                                : 'bg-slate-800 border-purple-500/30 hover:border-purple-500/50'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl">{MOODS[entry.mood].emoji}</span>
                                <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                            <p className={`text-sm line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                {entry.content}
                            </p>
                            {(entry.wins.length > 0 || entry.learnings.length > 0) && (
                                <div className="flex gap-2 mt-2">
                                    {entry.wins.length > 0 && (
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                            {entry.wins.length} wins
                                        </span>
                                    )}
                                    {entry.learnings.length > 0 && (
                                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                            {entry.learnings.length} learnings
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {entries.length === 0 && (
                        <div className={`text-center py-8 border-2 border-dashed rounded-lg ${theme === 'light' ? 'border-gray-300' : 'border-slate-700'}`}>
                            <span className="text-4xl block mb-2">📝</span>
                            <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                No entries yet.<br />Start journaling!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Journal;
