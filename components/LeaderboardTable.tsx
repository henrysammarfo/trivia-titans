'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Trophy, Medal, ChevronDown, ChevronUp, LineChart, Crown, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PlayerProgressGraph } from './PlayerProgressGraph';

interface PlayerStats {
    id: string;
    name: string;
    total_score: number;
    games_played: number;
    average_score: number;
}

interface LeaderboardTableProps {
    initialData: PlayerStats[];
}

export function LeaderboardTable({ initialData }: LeaderboardTableProps) {
    const [search, setSearch] = useState('');
    const [minGames, setMinGames] = useState(0);
    const [sortBy, setSortBy] = useState<'average' | 'total'>('average');

    const filteredData = useMemo(() => {
        return initialData
            .filter(player =>
                player.name.toLowerCase().includes(search.toLowerCase()) &&
                player.games_played >= minGames
            )
            .sort((a, b) => {
                if (sortBy === 'average') {
                    return b.average_score - a.average_score;
                }
                return b.total_score - a.total_score;
            });
    }, [initialData, search, minGames, sortBy]);

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="h-6 w-6 text-gold fill-gold/20" />;
        if (index === 1) return <Medal className="h-6 w-6 text-stone-400 fill-stone-100" />;
        if (index === 2) return <Medal className="h-6 w-6 text-amber-700 fill-amber-100" />;
        return <span className="font-heading font-bold text-stone-500 w-6 text-center">{index + 1}</span>;
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

    const toggleExpand = (playerId: string) => {
        setExpandedPlayerId(expandedPlayerId === playerId ? null : playerId);
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4 bg-white/80 p-6 rounded-xl border border-gold/30 shadow-sm backdrop-blur-md">
                {/* Search Bar - Full Width */}
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4 group-focus-within:text-aegean transition-colors" />
                    <Input
                        placeholder="Search for a Titan..."
                        className="pl-10 bg-white border-stone-200 focus:border-aegean focus:ring-aegean/20 transition-all shadow-inner"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                    {/* Min Games Filter */}
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-stone-200 shadow-sm">
                        <Filter className="h-4 w-4 text-aegean flex-shrink-0" />
                        <span className="text-sm font-medium text-stone-600 whitespace-nowrap">Min Games:</span>
                        <Input
                            type="number"
                            min="0"
                            className="w-16 h-9 bg-stone-50 border-stone-200 text-center"
                            value={minGames}
                            onChange={(e) => { setMinGames(Number(e.target.value)); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Sort Toggle */}
                    <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200 w-full sm:w-auto">
                        <button
                            onClick={() => setSortBy('average')}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-md transition-all font-heading tracking-wide flex items-center justify-center gap-2",
                                sortBy === 'average' ? "bg-white text-aegean shadow-sm border border-stone-100" : "text-stone-500 hover:text-stone-700"
                            )}
                        >
                            <ArrowUpDown size={14} />
                            Sort: Avg Score
                        </button>
                        <button
                            onClick={() => setSortBy('total')}
                            className={cn(
                                "flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-md transition-all font-heading tracking-wide flex items-center justify-center gap-2",
                                sortBy === 'total' ? "bg-white text-aegean shadow-sm border border-stone-100" : "text-stone-500 hover:text-stone-700"
                            )}
                        >
                            <ArrowUpDown size={14} />
                            Sort: Total Pts
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gold/20 overflow-hidden bg-white/80 backdrop-blur-md shadow-xl overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader className="bg-aegean/5">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px] text-center font-heading font-bold text-aegean-dark">Rank</TableHead>
                            <TableHead className="font-heading font-bold text-aegean-dark">Titan Name</TableHead>
                            <TableHead className="text-right font-heading font-bold text-aegean-dark">Games</TableHead>
                            <TableHead className="text-right font-heading font-bold text-aegean-dark">Total Pts</TableHead>
                            <TableHead className="text-right font-heading font-bold text-aegean-dark">Avg Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (


                            // ... (inside TableBody map)
                            paginatedData.map((player, index) => (
                                <React.Fragment key={player.id}>
                                    <motion.tr
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-gold/5 transition-colors group border-b border-stone-100 last:border-0 cursor-pointer"
                                        onClick={() => toggleExpand(player.id)}
                                    >
                                        <TableCell className="font-medium text-center py-4">
                                            <div className="flex justify-center items-center">
                                                {getRankIcon((currentPage - 1) * itemsPerPage + index)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium text-lg text-obsidian group-hover:text-aegean transition-colors py-4 px-6">
                                            {player.name}
                                        </TableCell>
                                        <TableCell className="text-right text-stone-600 font-mono py-4">{player.games_played}</TableCell>
                                        <TableCell className="text-right text-stone-600 font-mono py-4">{player.total_score}</TableCell>
                                        <TableCell className="text-right font-bold text-aegean font-mono text-lg flex items-center justify-end gap-4 py-4">
                                            {Math.round(player.average_score)}
                                            {expandedPlayerId === player.id ? <ChevronUp size={16} className="text-stone-400" /> : <LineChart size={16} className="text-stone-300 group-hover:text-gold transition-colors" />}
                                        </TableCell>
                                    </motion.tr>
                                    {expandedPlayerId === player.id && (
                                        <TableRow className="bg-stone-50/50 hover:bg-stone-50/50">
                                            <TableCell colSpan={5} className="p-4">
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <PlayerProgressGraph playerId={player.id} playerName={player.name} />
                                                </motion.div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-stone-500 italic">
                                    No Titans found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="border-aegean/20 text-aegean hover:bg-aegean/5"
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 font-medium text-stone-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="border-aegean/20 text-aegean hover:bg-aegean/5"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
