'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface PlayerProgressGraphProps {
    playerId: string;
    playerName: string;
}

export function PlayerProgressGraph({ playerId, playerName }: PlayerProgressGraphProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const { data: results, error } = await supabase
                    .from('results')
                    .select('score, quiz_date')
                    .eq('player_id', playerId)
                    .order('quiz_date', { ascending: true });

                if (error) throw error;

                if (results) {
                    // Format date for display
                    const formattedData = results.map(r => ({
                        date: new Date(r.quiz_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        score: r.score
                    }));
                    setData(formattedData);
                }
            } catch (error) {
                console.error('Error fetching player history:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [playerId]);

    if (loading) {
        return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-gold" /></div>;
    }

    if (data.length === 0) {
        return <div className="h-48 flex items-center justify-center text-stone-500 italic">No history available.</div>;
    }

    return (
        <div className="w-full h-64 bg-white/50 rounded-lg p-4 border border-gold/10">
            <h4 className="text-sm font-heading font-bold text-aegean mb-4 text-center">
                {playerName}'s Journey
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                        dataKey="date"
                        stroke="#78716c"
                        fontSize={12}
                        tickMargin={10}
                    />
                    <YAxis
                        stroke="#78716c"
                        fontSize={12}
                        domain={[0, 40]}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderColor: '#C5A059', borderRadius: '8px' }}
                        itemStyle={{ color: '#004C6C', fontWeight: 'bold' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#C5A059"
                        strokeWidth={3}
                        dot={{ fill: '#004C6C', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#E07A5F' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
