// User & Auth
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Checkmate (Task Management) Types
export interface TodoList {
  id: string;
  name: string;
  tasks: Task[];
}
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: number;
}

// Stash (Resource Management) Types
export interface StashItem {
  id: string;
  type: 'note' | 'link' | 'code';
  content: string;
  title: string;
  tags: string[];
  aiSummary?: string;
  createdAt: number;
}

// Focus (Deep Work Timer) Types
export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  sessionType: 'work' | 'short-break' | 'long-break';
  duration: number; // in seconds
  completed: boolean;
  startedAt: number;
  completedAt?: number;
}

// Goals (Milestone Tracker) Types
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'health' | 'learning' | 'personal';
  targetDate: number;
  milestones: Milestone[];
  linkedTaskIds: string[];
  createdAt: number;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: number;
}

// Journal (Daily Reflection) Types
export interface JournalEntry {
  id: string;
  date: number; // timestamp for start of day
  content: string;
  mood: 'great' | 'good' | 'okay' | 'down' | 'stressed';
  wins: string[];
  learnings: string[];
  aiSummary?: string;
  createdAt: number;
}

// App Navigation
export type AppView = 'dashboard' | 'checkmate' | 'stash' | 'focus' | 'goals' | 'journal';

// API Keys (In a real app, handled by backend or securely)
export interface AppConfig {
  geminiApiKey: string;
}
