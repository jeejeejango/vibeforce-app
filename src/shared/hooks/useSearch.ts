import { useMemo } from 'react';
import { Goal, TodoList, JournalEntry, StashItem } from '../types';

export interface SearchResult {
  id: string;
  type: 'goal' | 'task' | 'journal' | 'stash';
  title: string;
  description?: string;
  preview: string;
  path: string;
  matchScore: number;
}

export interface SearchData {
  goals: Goal[];
  todoLists: TodoList[];
  journalEntries: JournalEntry[];
  stashItems: StashItem[];
}

export const useSearch = (data: SearchData, query: string, filter: string = 'all') => {
  return useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Goals
    if (filter === 'all' || filter === 'goals') {
      data.goals.forEach(goal => {
        const titleMatch = goal.title.toLowerCase().includes(lowerQuery);
        const descMatch = goal.description?.toLowerCase().includes(lowerQuery);

        if (titleMatch || descMatch) {
          results.push({
            id: goal.id,
            type: 'goal',
            title: goal.title,
            description: goal.description,
            preview: goal.description || `${goal.milestones.length} milestones`,
            path: '/goals',
            matchScore: titleMatch ? 10 : 5,
          });
        }
      });
    }

    // Search Tasks
    if (filter === 'all' || filter === 'tasks') {
      data.todoLists.forEach(list => {
        list.tasks.forEach(task => {
          const titleMatch = task.title.toLowerCase().includes(lowerQuery);
          const descMatch = task.description?.toLowerCase().includes(lowerQuery);

          if (titleMatch || descMatch) {
            results.push({
              id: task.id,
              type: 'task',
              title: task.title,
              description: task.description,
              preview: `${list.name} • ${task.status === 'done' ? 'Completed' : 'Active'}`,
              path: '/checkmate',
              matchScore: titleMatch ? 10 : 5,
            });
          }
        });
      });
    }

    // Search Journal
    if (filter === 'all' || filter === 'journal') {
      data.journalEntries.forEach(entry => {
        const contentMatch = entry.content.toLowerCase().includes(lowerQuery);
        const winsMatch = entry.wins?.some(win => win.toLowerCase().includes(lowerQuery));

        if (contentMatch || winsMatch) {
          const preview = entry.content.substring(0, 100) + '...';
          results.push({
            id: entry.id,
            type: 'journal',
            title: new Date(entry.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            preview,
            path: '/journal',
            matchScore: contentMatch ? 8 : 5,
          });
        }
      });
    }

    // Search Stash
    if (filter === 'all' || filter === 'stash') {
      data.stashItems.forEach(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery);
        const contentMatch = item.content.toLowerCase().includes(lowerQuery);
        const summaryMatch = item.aiSummary?.toLowerCase().includes(lowerQuery);

        if (titleMatch || contentMatch || summaryMatch) {
          results.push({
            id: item.id,
            type: 'stash',
            title: item.title,
            description: item.type,
            preview: item.aiSummary || item.content.substring(0, 100),
            path: '/stash',
            matchScore: titleMatch ? 10 : contentMatch ? 7 : 5,
          });
        }
      });
    }

    // Sort by match score (highest first)
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }, [data, query, filter]);
};
