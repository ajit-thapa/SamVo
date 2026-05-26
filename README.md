# SamVo – Mindful Meditation App

A full-stack meditation app based on Monroe Institute techniques. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User Authentication** - Email/password signup with verification flow
- **Meditation Techniques**:
  - Resonant Breathing (4-7-8 pattern)
  - Focus 10 Induction
  - Focus 12 Induction
  - REBAL (Energy Balloon Visualization)
- **Logbook** - Track meditation sessions with focus level, duration, and notes
- **Cloud Database** - Supabase PostgreSQL for persistent data storage
- **Error Handling** - React error boundaries for robustness
- **Loading States** - Optimistic updates and async state management

## Getting Started

### 1. Set Up Supabase

- Create a Supabase project at https://supabase.com
- Get your **Project URL** and **Anon Key** from Settings → API

### 2. Configure Environment

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set Up Database

In your Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meditation sessions table
CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  focus_level INT,
  duration_minutes INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for sessions
CREATE POLICY "Users can view own sessions" ON meditation_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON meditation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON meditation_sessions FOR DELETE USING (auth.uid() = user_id);
```

### 4. Enable Email Verification (Optional but Recommended)

In Supabase dashboard:
- Go to **Authentication** → **Providers** → **Email**
- Enable "Confirm email"
- Configure email templates if desired

### 5. Install & Run

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Usage

1. **Sign up** - Create account with email and password
2. **Verify email** - Click link in confirmation email
3. **Choose a technique** - Browse breathing, focus, or REBAL exercises
4. **Record sessions** - Log your meditation time and experiences in the Logbook
5. **Track progress** - View all sessions with timestamps and notes

## Project Structure

```
src/
├── pages/              # Next.js pages and API routes
│   ├── _app.tsx       # React Query setup
│   ├── _document.tsx  # Document wrapper
│   ├── index.tsx      # Dashboard
│   ├── login.tsx      # Login page
│   ├── signup.tsx     # Signup page
│   ├── verify-email.tsx # Email verification
│   ├── logbook.tsx    # Session logbook
│   └── meditate/      # Meditation pages
├── components/        # Reusable React components
│   ├── Layout.tsx
│   ├── AuthGuard.tsx
│   ├── ErrorBoundary.tsx
│   ├── BreathingTimer.tsx
│   ├── FocusInduction.tsx
│   └── RebalCanvas.tsx
├── lib/              # Utilities
│   ├── supabaseClient.ts
│   └── db.ts
├── types/            # TypeScript types
└── styles/           # Global styles
```

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Error Handling**: React Error Boundaries
- **Deployment**: Vercel-ready

## Deployment

### Vercel

```bash
npm run build
npx vercel --prod
```

Add environment variables in Vercel dashboard.

### Other Platforms

Build the app:
```bash
npm run build
npm run start
```

## Architecture Decisions

- **Pages Router**: Traditional routing for simpler navigation and auth guard implementation
- **React Query**: Server state management for optimistic updates and cache management
- **Error Boundaries**: Component-level error catching for meditation timers and canvas
- **Tailwind CSS**: Utility-first styling for rapid UI development
- **Supabase RLS**: Row-level security ensures users only see their own data
- **Email Verification**: Adds security layer to account creation

## Notes

- Email confirmation is optional but recommended for production
- Canvas visualization (REBAL) is wrapped in ErrorBoundary for safety
- Optimistic updates in logbook provide immediate feedback
- All meditation timers are client-side (no server sync needed)

## License

MIT

## Support

For issues or questions, check the Supabase documentation or create an issue in the repository.
