import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchResult } from '../hooks/useSearch';

interface SearchProps {
    isOpen: boolean;
    onClose: () => void;
    results: SearchResult[];
    query: string;
    onQueryChange: (query: string) => void;
    filter: string;
    onFilterChange: (filter: string) => void;
    theme: string;
}

export const Search: React.FC<SearchProps> = ({
    isOpen,
    onClose,
    results,
    query,
    onQueryChange,
    filter,
    onFilterChange,
    theme,
}) => {
    const navigate = useNavigate();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset selected index when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [results]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && results[selectedIndex]) {
                e.preventDefault();
                handleResultClick(results[selectedIndex]);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const handleResultClick = (result: SearchResult) => {
        navigate(result.path);
        onClose();
        onQueryChange('');
    };

    if (!isOpen) return null;

    const typeIcons = {
        goal: '🎯',
        task: '✓',
        journal: '📔',
        stash: '📦',
    };

    const groupedResults = results.reduce(
        (acc, result) => {
            if (!acc[result.type]) acc[result.type] = [];
            acc[result.type].push(result);
            return acc;
        },
        {} as Record<string, SearchResult[]>
    );

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
            onClick={onClose}
        >
            <div
                className={`max-w-2xl w-full rounded-xl shadow-2xl ${theme === 'light' ? 'bg-white' : 'bg-slate-800'
                    }`}
                onClick={e => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="p-4 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={e => onQueryChange(e.target.value)}
                            placeholder="Search across all features..."
                            className={`flex-1 outline-none text-lg ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-800 text-white'
                                }`}
                        />
                        <kbd className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
                            ESC
                        </kbd>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mt-3">
                        {['all', 'goals', 'tasks', 'journal', 'stash'].map(f => (
                            <button
                                key={f}
                                onClick={() => onFilterChange(f)}
                                className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${filter === f
                                    ? 'bg-violet-600 text-white'
                                    : theme === 'light'
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto p-2">
                    {query.trim() === '' ? (
                        <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                            <svg
                                className="w-12 h-12 mx-auto mb-3 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <p>Start typing to search...</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                            <p>No results found for "{query}"</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(groupedResults).map(([type, items]) => (
                                <div key={type}>
                                    <h3
                                        className={`text-xs font-semibold uppercase mb-2 px-2 ${theme === 'light' ? 'text-gray-500' : 'text-slate-400'
                                            }`}
                                    >
                                        {type}s ({items.length})
                                    </h3>
                                    {items.map((result, idx) => {
                                        const globalIndex = results.indexOf(result);
                                        return (
                                            <button
                                                key={result.id}
                                                onClick={() => handleResultClick(result)}
                                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedIndex === globalIndex
                                                        ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-500/30'
                                                        : theme === 'light'
                                                            ? 'hover:bg-gray-50'
                                                            : 'hover:bg-slate-700'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-xl">{typeIcons[result.type]}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className={`font-medium ${selectedIndex === globalIndex
                                                                    ? theme === 'light'
                                                                        ? 'text-violet-900'
                                                                        : 'text-violet-100'
                                                                    : theme === 'light'
                                                                        ? 'text-gray-900'
                                                                        : 'text-white'
                                                                }`}
                                                        >
                                                            {result.title}
                                                        </div>
                                                        <div
                                                            className={`text-sm mt-1 truncate ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'
                                                                }`}
                                                        >
                                                            {result.preview}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    className={`p-3 border-t text-xs flex items-center justify-between ${theme === 'light'
                        ? 'bg-gray-50 border-gray-200 text-gray-600'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700">↑</kbd>
                            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700">↓</kbd>
                            Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700">↵</kbd>
                            Select
                        </span>
                    </div>
                    <span>{results.length} results</span>
                </div>
            </div>
        </div>
    );
};
