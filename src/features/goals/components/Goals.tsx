import React, { useState } from 'react';
import { UserProfile, Goal, Milestone } from '../../../shared/types';
import { addGoal, updateGoal, deleteGoal } from '../services/goalsService';
import { useTheme } from '../../../shared/ThemeContext';

interface GoalsProps {
    user: UserProfile;
    goals: Goal[];
    setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const CATEGORY_COLORS = {
    career: 'blue',
    health: 'green',
    learning: 'purple',
    personal: 'pink',
};

const Goals: React.FC<GoalsProps> = ({ user, goals, setGoals }) => {
    const { theme } = useTheme();
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        category: 'personal' as Goal['category'],
        targetDate: '',
    });
    const [newMilestone, setNewMilestone] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedGoal, setEditedGoal] = useState<{
        title: string;
        description: string;
        category: Goal['category'];
        targetDate: string;
    }>({ title: '', description: '', category: 'personal', targetDate: '' });

    const getProgress = (goal: Goal) => {
        if (goal.milestones.length === 0) return 0;
        const completed = goal.milestones.filter(m => m.completed).length;
        return Math.round((completed / goal.milestones.length) * 100);
    };

    const handleCreateGoal = async () => {
        if (!newGoal.title || !newGoal.targetDate) return;

        const goalData: Omit<Goal, 'id'> = {
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            targetDate: new Date(newGoal.targetDate).getTime(),
            milestones: [],
            linkedTaskIds: [],
            createdAt: Date.now(),
        };

        const createdGoal = await addGoal(user.uid, goalData);
        setGoals([...goals, createdGoal]);
        setNewGoal({ title: '', description: '', category: 'personal', targetDate: '' });
        setShowCreateModal(false);
    };

    const handleAddMilestone = async (goalId: string) => {
        if (!newMilestone.trim()) return;

        const goalToUpdate = goals.find(g => g.id === goalId);
        if (!goalToUpdate) return;

        const newMilestones = [
            ...goalToUpdate.milestones,
            {
                id: Date.now().toString(),
                title: newMilestone,
                completed: false,
            }
        ];

        await updateGoal(user.uid, goalId, { milestones: newMilestones });

        const updatedGoals = goals.map(g =>
            g.id === goalId ? { ...g, milestones: newMilestones } : g
        );

        setGoals(updatedGoals);
        const updatedGoal = updatedGoals.find(g => g.id === goalId);
        if (updatedGoal) setSelectedGoal(updatedGoal);
        setNewMilestone('');
    };

    const toggleMilestone = async (goalId: string, milestoneId: string) => {
        const goalToUpdate = goals.find(g => g.id === goalId);
        if (!goalToUpdate) return;

        const newMilestones = goalToUpdate.milestones.map(m =>
            m.id === milestoneId
                ? { ...m, completed: !m.completed, completedAt: !m.completed ? Date.now() : undefined }
                : m
        );

        await updateGoal(user.uid, goalId, { milestones: newMilestones });

        const updatedGoals = goals.map(g =>
            g.id === goalId ? { ...g, milestones: newMilestones } : g
        );

        setGoals(updatedGoals);
        const updatedGoal = updatedGoals.find(g => g.id === goalId);
        if (updatedGoal) setSelectedGoal(updatedGoal);
    };

    const deleteMilestone = async (goalId: string, milestoneId: string) => {
        const goalToUpdate = goals.find(g => g.id === goalId);
        if (!goalToUpdate) return;

        const newMilestones = goalToUpdate.milestones.filter(m => m.id !== milestoneId);

        await updateGoal(user.uid, goalId, { milestones: newMilestones });

        const updatedGoals = goals.map(g =>
            g.id === goalId ? { ...g, milestones: newMilestones } : g
        );

        setGoals(updatedGoals);
        const updatedGoal = updatedGoals.find(g => g.id === goalId);
        if (updatedGoal) setSelectedGoal(updatedGoal);
    };

    const handleDeleteGoal = async (goalId: string) => {
        await deleteGoal(user.uid, goalId);
        setGoals(goals.filter(g => g.id !== goalId));
        setSelectedGoal(null);
    };

    const handleEditGoal = () => {
        if (!selectedGoal) return;

        setEditedGoal({
            title: selectedGoal.title,
            description: selectedGoal.description,
            category: selectedGoal.category,
            targetDate: new Date(selectedGoal.targetDate).toISOString().split('T')[0],
        });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedGoal || !editedGoal.title || !editedGoal.targetDate) return;

        const updates = {
            title: editedGoal.title,
            description: editedGoal.description,
            category: editedGoal.category,
            targetDate: new Date(editedGoal.targetDate).getTime(),
        };

        await updateGoal(user.uid, selectedGoal.id, updates);

        const updatedGoals = goals.map(g =>
            g.id === selectedGoal.id ? { ...g, ...updates } : g
        );

        setGoals(updatedGoals);
        const updatedGoal = updatedGoals.find(g => g.id === selectedGoal.id);
        if (updatedGoal) setSelectedGoal(updatedGoal);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className={`text-4xl font-bold flex items-center gap-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        <span className="text-yellow-400">🎯</span> Goals
                    </h1>
                    <p className={`mt-2 text-lg ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                        Track Your Vision • Achieve Milestones
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-yellow-900/30"
                >
                    + New Goal
                </button>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const progress = getProgress(goal);
                    const daysLeft = Math.ceil((goal.targetDate - Date.now()) / (1000 * 60 * 60 * 24));

                    return (
                        <div
                            key={goal.id}
                            onClick={() => setSelectedGoal(goal)}
                            className={`group relative rounded-xl p-6 border cursor-pointer transition-all overflow-hidden ${theme === 'light'
                                ? 'bg-white border-yellow-200 hover:border-yellow-300 hover:shadow-lg'
                                : 'bg-slate-800 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-900/20'
                                }`}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative z-10">
                                {/* Category Badge */}
                                <span className={`inline-block px-3 py-1 text-xs rounded-full mb-3 ${theme === 'light'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                    {goal.category}
                                </span>

                                {/* Title */}
                                <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {goal.title}
                                </h3>

                                {/* Description */}
                                {goal.description && (
                                    <p className={`text-sm mb-4 line-clamp-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                        {goal.description}
                                    </p>
                                )}

                                {/* Progress Ring */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative w-16 h-16">
                                        <svg className="transform -rotate-90 w-16 h-16">
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                stroke={theme === 'light' ? '#e5e7eb' : '#334155'}
                                                strokeWidth="4"
                                                fill="none"
                                            />
                                            <circle
                                                cx="32"
                                                cy="32"
                                                r="28"
                                                stroke="#eab308"
                                                strokeWidth="4"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 28}`}
                                                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={`text-sm font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                                {progress}%
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                            {goal.milestones.filter(m => m.completed).length} / {goal.milestones.length} milestones
                                        </div>
                                        <div className={`text-xs mt-1 ${daysLeft > 0 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {goals.length === 0 && (
                    <div className={`col-span-full text-center py-20 border-2 border-dashed rounded-xl ${theme === 'light' ? 'border-gray-300' : 'border-slate-700'
                        }`}>
                        <span className="text-6xl mb-4 block">🎯</span>
                        <p className={`text-lg mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                            No goals yet. Set your first milestone!
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
                        >
                            Create Your First Goal
                        </button>
                    </div>
                )}
            </div>

            {/* Goal Detail Modal */}
            {selectedGoal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`max-w-2xl w-full rounded-2xl p-8 max-h-[90vh] overflow-y-auto ${theme === 'light' ? 'bg-white' : 'bg-slate-800'
                        }`}>
                        <div className="flex justify-between items-start mb-6">
                            {isEditing ? (
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        value={editedGoal.title}
                                        onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
                                        className={`w-full text-2xl font-bold border-b-2 border-yellow-500 bg-transparent focus:outline-none ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
                                        placeholder="Goal title"
                                    />
                                    <textarea
                                        value={editedGoal.description}
                                        onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
                                        className={`w-full border rounded-lg px-3 py-2 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-900 border-slate-700 text-white'}`}
                                        rows={2}
                                        placeholder="Description"
                                    />
                                    <div className="flex gap-3">
                                        <select
                                            value={editedGoal.category}
                                            onChange={(e) => setEditedGoal({ ...editedGoal, category: e.target.value as Goal['category'] })}
                                            className={`flex-1 border rounded-lg px-3 py-2 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-900 border-slate-700 text-white'}`}
                                        >
                                            <option value="personal">Personal</option>
                                            <option value="career">Career</option>
                                            <option value="health">Health</option>
                                            <option value="learning">Learning</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={editedGoal.targetDate}
                                            onChange={(e) => setEditedGoal({ ...editedGoal, targetDate: e.target.value })}
                                            className={`flex-1 border rounded-lg px-3 py-2 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-900 border-slate-700 text-white'}`}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        {selectedGoal.title}
                                    </h2>
                                    <p className={`mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
                                        {selectedGoal.description}
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                            {selectedGoal.category}
                                        </span>
                                        <span className={`inline-block px-3 py-1 text-xs rounded-full ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-slate-700 text-slate-300'}`}>
                                            Target: {new Date(selectedGoal.targetDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2 ml-4">
                                {!isEditing && (
                                    <button
                                        onClick={handleEditGoal}
                                        className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-slate-700 text-slate-400'}`}
                                        title="Edit goal"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this goal?')) {
                                            handleDeleteGoal(selectedGoal.id);
                                        }
                                    }}
                                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                                    title="Delete goal"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setSelectedGoal(null)}
                                    className={`p-2 rounded-lg ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-slate-700'}`}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Milestones */}
                        <div className="mb-6">
                            <h3 className={`text-lg font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                Milestones ({selectedGoal.milestones.filter(m => m.completed).length}/{selectedGoal.milestones.length})
                            </h3>

                            <div className="space-y-2 mb-4">
                                {selectedGoal.milestones.map(milestone => (
                                    <div
                                        key={milestone.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${theme === 'light'
                                            ? 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'
                                            : 'bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30'
                                            }`}
                                    >
                                        <div
                                            onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                                            className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${milestone.completed
                                                ? 'bg-yellow-500 border-yellow-500'
                                                : theme === 'light' ? 'border-gray-300' : 'border-slate-600'
                                                }`}
                                        >
                                            {milestone.completed && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            )}
                                        </div>
                                        <span
                                            onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                                            className={`flex-1 cursor-pointer ${milestone.completed
                                                ? theme === 'light' ? 'line-through text-gray-500' : 'line-through text-slate-500'
                                                : theme === 'light' ? 'text-gray-900' : 'text-white'
                                                }`}
                                        >
                                            {milestone.title}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteMilestone(selectedGoal.id, milestone.id);
                                            }}
                                            className={`p-1 rounded hover:bg-red-500/20 text-red-500 transition-colors ${theme === 'light' ? 'hover:bg-red-100' : ''}`}
                                            title="Delete milestone"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Milestone */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMilestone}
                                    onChange={(e) => setNewMilestone(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddMilestone(selectedGoal.id)}
                                    placeholder="Add a new milestone..."
                                    className={`flex-1 border rounded-lg px-4 py-2 ${theme === 'light'
                                        ? 'bg-white border-gray-300 text-gray-900'
                                        : 'bg-slate-900 border-slate-700 text-white'
                                        }`}
                                />
                                <button
                                    onClick={() => handleAddMilestone(selectedGoal.id)}
                                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Goal Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`max-w-lg w-full rounded-2xl p-8 ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`}>
                        <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            Create New Goal
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                                    Goal Title *
                                </label>
                                <input
                                    type="text"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    className={`w-full border rounded-lg px-4 py-2 ${theme === 'light'
                                        ? 'bg-white border-gray-300 text-gray-900'
                                        : 'bg-slate-900 border-slate-700 text-white'
                                        }`}
                                    placeholder="e.g., Learn React"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                                    Description
                                </label>
                                <textarea
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                    className={`w-full border rounded-lg px-4 py-2 ${theme === 'light'
                                        ? 'bg-white border-gray-300 text-gray-900'
                                        : 'bg-slate-900 border-slate-700 text-white'
                                        }`}
                                    rows={3}
                                    placeholder="What do you want to achieve?"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                                    Category
                                </label>
                                <select
                                    value={newGoal.category}
                                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                                    className={`w-full border rounded-lg px-4 py-2 ${theme === 'light'
                                        ? 'bg-white border-gray-300 text-gray-900'
                                        : 'bg-slate-900 border-slate-700 text-white'
                                        }`}
                                >
                                    <option value="personal">Personal</option>
                                    <option value="career">Career</option>
                                    <option value="health">Health</option>
                                    <option value="learning">Learning</option>
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-slate-300'}`}>
                                    Target Date *
                                </label>
                                <input
                                    type="date"
                                    value={newGoal.targetDate}
                                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                                    className={`w-full border rounded-lg px-4 py-2 ${theme === 'light'
                                        ? 'bg-white border-gray-300 text-gray-900'
                                        : 'bg-slate-900 border-slate-700 text-white'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${theme === 'light'
                                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateGoal}
                                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
                            >
                                Create Goal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
