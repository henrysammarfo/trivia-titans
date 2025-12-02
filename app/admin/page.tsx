'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save, Trash2, LogOut, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ResultEntry {
    id: string;
    name: string;
    score: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [quizDate, setQuizDate] = useState(new Date().toISOString().split('T')[0]);
    const [entries, setEntries] = useState<ResultEntry[]>([
        { id: '1', name: '', score: '' }
    ]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<{ [key: string]: boolean }>({});

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push('/admin/login');
        };
        checkAuth();
    }, [router]);

    // Fetch player names for auto-complete
    useEffect(() => {
        const fetchPlayers = async () => {
            const { data } = await supabase.from('players').select('name');
            if (data) setSuggestions(data.map(p => p.name));
        };
        fetchPlayers();
    }, [])

        ;

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+S or Cmd+S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSubmit();
            }
            // Escape to clear form
            if (e.key === 'Escape') {
                setEntries([{ id: Math.random().toString(), name: '', score: '' }]);
                toast.info('Form cleared');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [entries]); // Include entries in dependency to have latest state

    const [recentResults, setRecentResults] = useState<any[]>([]);

    // Fetch recent results for the selected date
    useEffect(() => {
        const fetchRecent = async () => {
            const { data } = await supabase
                .from('results')
                .select('id, score, created_at, players(name)')
                .eq('quiz_date', quizDate)
                .order('created_at', { ascending: false });

            if (data) setRecentResults(data);
        };
        fetchRecent();
    }, [quizDate, isLoading]); // Refresh when date changes or after submit

    const deleteResult = async (id: string) => {
        if (!confirm('Are you sure you want to delete this result?')) return;

        console.log('Attempting to delete result with ID:', id);

        const { data, error } = await supabase.from('results').delete().eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            toast.error(`Failed to delete: ${error.message}`);
        } else {
            console.log('Delete successful, data:', data);
            setRecentResults(recentResults.filter(r => r.id !== id));
            toast.success('Result deleted successfully!');
        }
    };

    const addRow = () => {
        setEntries([...entries, { id: Math.random().toString(), name: '', score: '' }]);
    };

    const removeRow = (id: string) => {
        if (entries.length > 1) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const updateEntry = (id: string, field: 'name' | 'score', value: string) => {
        const newEntries = entries.map(e => e.id === id ? { ...e, [field]: value } : e);
        setEntries(newEntries);

        // Show suggestions when typing in name field
        if (field === 'name' && value.length > 0) {
            setShowSuggestions({ ...showSuggestions, [id]: true });
        } else if (field === 'name' && value.length === 0) {
            setShowSuggestions({ ...showSuggestions, [id]: false });
        }
    };

    const handleNameKeyDown = (e: React.KeyboardEvent, entryId: string, index: number) => {
        const entry = entries[index];
        const matchingSuggestions = suggestions.filter(s =>
            s.toLowerCase().startsWith(entry.name.toLowerCase())
        );

        if ((e.key === 'Tab' || e.key === 'Enter') && matchingSuggestions.length > 0 && entry.name.length > 0) {
            e.preventDefault();
            updateEntry(entryId, 'name', matchingSuggestions[0]);
            setShowSuggestions({ ...showSuggestions, [entryId]: false });

            // Move to score field on Enter
            if (e.key === 'Enter') {
                const scoreInput = document.querySelector(`input[data-score-index="${index}"]`) as HTMLInputElement;
                scoreInput?.focus();
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions({ ...showSuggestions, [entryId]: false });
        }
    };

    // Auto-add row only when tabbing out of the last score field if it has data
    const handleScoreBlur = (index: number) => {
        if (index === entries.length - 1) {
            const entry = entries[index];
            if (entry.name.trim() !== '' && entry.score.trim() !== '') {
                addRow();
            }
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // 1. Process each entry
            for (const entry of entries) {
                if (!entry.name || !entry.score) continue;

                const score = parseInt(entry.score);
                if (isNaN(score) || score < 0 || score > 40) {
                    toast.error(`Invalid score for ${entry.name}. Must be 0-40.`);
                    setIsLoading(false);
                    return;
                }

                // 2. Find or Create Player
                let playerId;
                const { data: existingPlayer } = await supabase
                    .from('players')
                    .select('id')
                    .eq('name', entry.name)
                    .single();

                if (existingPlayer) {
                    playerId = existingPlayer.id;
                } else {
                    const { data: newPlayer, error: createError } = await supabase
                        .from('players')
                        .insert({ name: entry.name })
                        .select()
                        .single();

                    if (createError) throw createError;
                    playerId = newPlayer.id;
                }

                // 3. Insert Result
                const { error: resultError } = await supabase
                    .from('results')
                    .insert({
                        player_id: playerId,
                        quiz_date: quizDate,
                        score: score
                    });

                if (resultError) throw resultError;
            }

            // Success - show toast
            toast.success(`Saved ${entries.filter(e => e.name && e.score).length} results!`);
            setEntries([{ id: Math.random().toString(), name: '', score: '' }]); // Reset form
        } catch (error: any) {
            console.error('Error saving results:', error);
            toast.error(`Failed to save: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-heading font-bold text-aegean-dark">Admin Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout} className="text-terracotta border-terracotta/30 hover:bg-terracotta/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Entry Form */}
                    <Card className="border-gold/30 shadow-lg bg-white">
                        <CardHeader className="bg-white border-b border-gold/10">
                            <CardTitle className="flex items-center gap-2 text-aegean-dark">
                                <Calendar className="h-5 w-5 text-aegean" />
                                Enter Quiz Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <label className="font-medium text-obsidian whitespace-nowrap">Quiz Date:</label>
                                <Input
                                    type="date"
                                    value={quizDate}
                                    onChange={(e) => setQuizDate(e.target.value)}
                                    className="w-auto bg-white text-obsidian border-stone-300"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-12 gap-4 font-medium text-sm text-stone-500 uppercase tracking-wider px-2">
                                    <div className="col-span-7">Player Name</div>
                                    <div className="col-span-3">Score (/40)</div>
                                    <div className="col-span-2"></div>
                                </div>

                                {entries.map((entry, index) => (
                                    <div key={entry.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="col-span-7 relative">
                                            <Input
                                                placeholder="Enter player name..."
                                                value={entry.name}
                                                onChange={(e) => updateEntry(entry.id, 'name', e.target.value)}
                                                onKeyDown={(e) => handleNameKeyDown(e, entry.id, index)}
                                                onBlur={() => setTimeout(() => setShowSuggestions({ ...showSuggestions, [entry.id]: false }), 200)}
                                                className="bg-white text-obsidian border-stone-300 focus:border-aegean"
                                                autoFocus={index === entries.length - 1 && index > 0}
                                                autoComplete="off"
                                            />
                                            {showSuggestions[entry.id] && entry.name.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-stone-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                                    {suggestions
                                                        .filter(s => s.toLowerCase().startsWith(entry.name.toLowerCase()))
                                                        .slice(0, 5)
                                                        .map((suggestion, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="px-3 py-2 hover:bg-aegean/10 cursor-pointer text-obsidian"
                                                                onClick={() => {
                                                                    updateEntry(entry.id, 'name', suggestion);
                                                                    setShowSuggestions({ ...showSuggestions, [entry.id]: false });
                                                                }}
                                                            >
                                                                {suggestion}
                                                            </div>
                                                        ))
                                                    }
                                                    {suggestions.filter(s => s.toLowerCase().startsWith(entry.name.toLowerCase())).length === 0 && (
                                                        <div className="px-3 py-2 text-stone-400 italic text-sm">No matches</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                data-score-index={index}
                                                type="number"
                                                min="0"
                                                max="40"
                                                placeholder="0"
                                                value={entry.score}
                                                onChange={(e) => updateEntry(entry.id, 'score', e.target.value)}
                                                onBlur={() => handleScoreBlur(index)}
                                                className="bg-white text-center font-mono text-obsidian border-stone-300 focus:border-aegean"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && index === entries.length - 1) {
                                                        addRow();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeRow(entry.id)}
                                                className="text-stone-400 hover:text-terracotta hover:bg-terracotta/10"
                                                disabled={entries.length === 1}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                                <Button variant="outline" onClick={addRow} className="text-aegean border-aegean/30 hover:bg-aegean/5">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Row
                                </Button>

                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="bg-gold hover:bg-gold-dark text-obsidian min-w-[150px]"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Results
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Entries Panel */}
                    <Card className="border-gold/30 shadow-lg h-fit bg-white">
                        <CardHeader className="bg-white border-b border-gold/10">
                            <CardTitle className="flex items-center gap-2 text-aegean-dark">
                                <Calendar className="h-5 w-5 text-aegean" />
                                Recent Entries ({quizDate})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[500px] overflow-y-auto">
                                {recentResults.length === 0 ? (
                                    <div className="p-8 text-center text-stone-500 italic">
                                        No results entered for this date yet.
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead className="bg-white sticky top-0">
                                            <tr className="text-left text-xs font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
                                                <th className="px-4 py-3">Player</th>
                                                <th className="px-4 py-3 text-right">Score</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {recentResults.map((result) => (
                                                <tr key={result.id} className="hover:bg-stone-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-obsidian">
                                                        {result.players?.name || 'Unknown'}
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-mono text-aegean font-bold">
                                                        {result.score}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteResult(result.id)}
                                                            className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
