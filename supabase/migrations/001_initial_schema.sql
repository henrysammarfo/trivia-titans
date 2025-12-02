-- TRIVIA TITANS INITIAL SCHEMA

-- 1. PLAYERS TABLE
CREATE TABLE public.players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- Unique constraint ensures no duplicate player names
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access for players"
    ON public.players FOR SELECT USING (true);

CREATE POLICY "Admin insert access for players"
    ON public.players FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 2. RESULTS TABLE
CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    quiz_date DATE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 40), -- Score out of 40
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access for results"
    ON public.results FOR SELECT USING (true);

CREATE POLICY "Admin insert access for results"
    ON public.results FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_results_player_id ON public.results(player_id);
CREATE INDEX idx_results_quiz_date ON public.results(quiz_date);
CREATE INDEX idx_results_score ON public.results(score);
