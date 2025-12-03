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

// App Navigation
export type AppView = 'dashboard' | 'checkmate' | 'stash';

// API Keys (In a real app, handled by backend or securely)
export interface AppConfig {
  geminiApiKey: string;
}
