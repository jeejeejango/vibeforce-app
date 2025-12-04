# VibeForce - Your Life Operating System

A modular productivity SaaS application built with React, TypeScript, and Firebase.

This app is built with AI Studio and Antigravity.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project ([Create one](https://console.firebase.google.com/))
- Gemini API key ([Get one](https://makersuite.google.com/app/apikey))

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Firebase and Gemini API keys.

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Check TypeScript types |

## 🏗️ Project Structure

```
src/
├── features/          # Feature modules
│   ├── checkmate/    # Task management
│   ├── goals/        # Goal tracking
│   ├── journal/      # Daily journaling
│   ├── stash/        # Resource vault
│   └── focus/        # Focus timer
├── shared/           # Shared code
│   ├── components/   # Reusable components
│   ├── services/     # API services
│   └── types/        # TypeScript types
└── App.tsx          # Main app
```

## 🛠️ Tech Stack

- React 19, TypeScript, React Router
- Firebase (Auth, Firestore)
- Tailwind CSS, Vite
- ESLint, Prettier

## 🔧 Development Guidelines

Before committing:
```bash
npm run format && npm run lint && npm run type-check
```

## 📦 Features

- Goals tracking with milestones
- Task management with AI breakdown
- Daily journaling with mood tracking
- Resource vault for saving links
- Pomodoro focus timer
- Unified productivity dashboard

