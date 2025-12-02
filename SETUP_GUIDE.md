# Trivia Titans - Setup Guide

## 1. Database Setup (Supabase)

We need to set up the database to store players and scores.

1.  **Go to Supabase:** Visit [https://supabase.com/](https://supabase.com/) and click "Start your project".
2.  **Create a New Project:**
    *   Name: `Trivia Titans`
    *   Password: Generate a strong password (save it!).
    *   Region: Choose one close to you (e.g., London or Frankfurt).
    *   Click "Create new project".
3.  **Get API Credentials:**
    *   Once the project is ready (takes ~2 mins), go to **Project Settings** (cog icon at the bottom left).
    *   Click on **API**.
    *   Copy the `Project URL` (e.g., `https://xyz.supabase.co`).
    *   Copy the `anon` / `public` key.
    *   **Action:** Paste these into your `trivia-titans/.env.local` file on your Desktop.

4.  **Create Tables (SQL):**
    *   Click on the **SQL Editor** icon (left sidebar, looks like a terminal `>_`).
    *   Click "New Query".
    *   Copy and paste the code below into the editor:

```sql
-- 1. PLAYERS TABLE
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESULTS TABLE
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    quiz_date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 40),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Security
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so everyone can see the leaderboard)
CREATE POLICY "Public read access for players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Public read access for results" ON public.results FOR SELECT USING (true);

-- Allow authenticated (admin) write access
CREATE POLICY "Admin insert access for players" ON public.players FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin insert access for results" ON public.results FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

    *   Click **Run** (bottom right).

## 2. Asset Setup

I have moved your files to the `public/assets` folder, but I need to know which is which.

1.  **Open the folder:** Go to `Desktop > trivia-titans > public > assets`.
2.  **Identify the Logo:**
    *   Find your logo image.
    *   Rename it to: `logo.png` (or `logo.jpg`).
3.  **Identify the Hero Image:**
    *   Find the large image you want for the top of the homepage.
    *   Rename it to: `hero.jpg` (or `hero.png`).

Once you rename them, the website will automatically pick them up!
