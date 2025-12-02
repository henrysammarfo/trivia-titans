-- TRIVIA TITANS COMPLETE SCHEMA
-- Run this in your Supabase SQL Editor to set up the database

-- 1. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- Unique constraint ensures no duplicate player names
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Policies for Players
CREATE POLICY "Public read access for players"
    ON public.players FOR SELECT USING (true);

CREATE POLICY "Admin insert access for players"
    ON public.players FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 2. RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    quiz_date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 40), -- Score out of 40
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Policies for Results
CREATE POLICY "Public read access for results"
    ON public.results FOR SELECT USING (true);

CREATE POLICY "Admin insert access for results"
    ON public.results FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access for results"
    ON public.results FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin update access for results"
    ON public.results FOR UPDATE USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_results_player_id ON public.results(player_id);
CREATE INDEX IF NOT EXISTS idx_results_quiz_date ON public.results(quiz_date);
CREATE INDEX IF NOT EXISTS idx_results_score ON public.results(score);
