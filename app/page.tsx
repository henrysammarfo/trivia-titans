'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Swords, ScrollText } from 'lucide-react';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Mock data removed
const MOCK_DATA: any[] = [];

export default function Home() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch all results
        const { data: results, error } = await supabase
          .from('results')
          .select(`
                    score,
                    players (
                        id,
                        name
                    )
                `);

        if (error) throw error;

        if (!results || results.length === 0) {
          setLeaderboardData([]);
          setLoading(false);
          return;
        }

        // 2. Aggregate stats
        const playerStats = new Map();

        results.forEach((r: any) => {
          const player = Array.isArray(r.players) ? r.players[0] : r.players;
          if (!player) return;

          const playerId = player.id;
          const playerName = player.name;
          const score = r.score;

          if (!playerStats.has(playerId)) {
            playerStats.set(playerId, {
              id: playerId,
              name: playerName,
              total_score: 0,
              games_played: 0,
              average_score: 0
            });
          }

          const stats = playerStats.get(playerId);
          stats.total_score += score;
          stats.games_played += 1;
        });

        // 3. Calculate averages and convert to array
        const finalData = Array.from(playerStats.values()).map(stats => ({
          ...stats,
          average_score: stats.total_score / stats.games_played
        }));

        setLeaderboardData(finalData);
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchData();

    // Refetch when window regains focus (user returns to tab/page)
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshKey]);

  // Calculate top stats for cards
  const topScore = leaderboardData.length > 0 ? Math.max(...leaderboardData.map(p => p.total_score)) : 0;
  const totalTitans = leaderboardData.length;
  const totalGames = leaderboardData.reduce((acc, curr) => acc + curr.games_played, 0);

  return (
    <div className="min-h-screen flex flex-col bg-marble-white">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image - Using the Statue/Titan image */}
          <div className="absolute inset-0">
            <Image
              src="/assets/statue.jpg"
              alt="Titan Hero"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Overlay Gradient - Lighter/Golden to ensure text readability over the statue */}
          <div className="absolute inset-0 bg-gradient-to-b from-marble-white/90 via-marble-white/60 to-marble-white" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10"
          >
            {/* Laurel Wreath Decoration */}
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16 opacity-80">
                <Image src="/assets/laurel.jpg" alt="Laurel" fill className="object-contain mix-blend-multiply" />
              </div>
            </div>

            <h1 className="font-heading text-4xl md:text-8xl font-bold text-aegean-dark mb-6 drop-shadow-sm tracking-tight">
              Rise to <span className="text-gold-dark">Olympus</span>
            </h1>
            <p className="text-lg md:text-2xl text-aegean/80 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
              Compete in Malaga's legendary trivia night. Earn your place among the Titans.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="#leaderboard">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-6 bg-aegean hover:bg-aegean-dark text-white shadow-xl hover:shadow-2xl transition-all">
                  View Leaderboard
                </Button>
              </Link>
              <Link href="#about">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-6 border-aegean/30 text-aegean hover:bg-aegean/5 backdrop-blur-sm">
                  How It Works
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12 -mt-24 relative z-20 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Crown, label: "Top Score", value: topScore, color: "text-gold-dark", gradient: "from-gold/20 to-gold/5", border: "border-gold/30" },
              { icon: Swords, label: "Total Titans", value: totalTitans, color: "text-aegean", gradient: "from-aegean/20 to-aegean/5", border: "border-aegean/30" },
              { icon: ScrollText, label: "Quizzes Taken", value: totalGames, color: "text-terracotta", gradient: "from-terracotta/20 to-terracotta/5", border: "border-terracotta/30" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-white border-2 ${stat.border} shadow-xl p-6 group hover:-translate-y-1 transition-transform duration-300`}>
                  {/* Background Gradient */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl -mr-10 -mt-10`} />

                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 font-heading">{stat.label}</p>
                      <p className={`text-5xl font-heading font-bold ${stat.color} drop-shadow-sm`}>{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-full bg-white shadow-md border ${stat.border}`}>
                      <stat.icon size={32} className={stat.color} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard" className="py-16 container mx-auto px-4 scroll-mt-24">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-heading font-bold text-aegean-dark mb-2">The Pantheon</h2>
              <p className="text-stone-600 text-lg">Top performing players from all seasons.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <LeaderboardTable initialData={leaderboardData} />
          </motion.div>
        </section>

        {/* About / How It Works Section */}
        <section id="about" className="py-16 bg-white/50 border-t border-gold/20 scroll-mt-24">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-heading font-bold text-aegean-dark mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-white/95 shadow-md border-2 border-aegean/10 hover:border-aegean/30 transition-colors">
                <div className="w-14 h-14 bg-aegean text-white rounded-full flex items-center justify-center mx-auto mb-4 font-heading font-bold text-2xl shadow-lg border-4 border-white">1</div>
                <h3 className="font-heading font-bold text-xl mb-3 text-aegean-dark">Play Trivia</h3>
                <p className="text-obsidian/80 font-medium leading-relaxed">Join a team every week and compete for glory in our legendary quiz nights.</p>
              </div>
              <div className="p-6 rounded-xl bg-white/95 shadow-md border-2 border-gold/10 hover:border-gold/30 transition-colors">
                <div className="w-14 h-14 bg-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 font-heading font-bold text-2xl shadow-lg border-4 border-white">2</div>
                <h3 className="font-heading font-bold text-xl mb-3 text-gold-dark">Earn Points</h3>
                <p className="text-obsidian/80 font-medium leading-relaxed">Write your name on the sheet to track your individual score across seasons.</p>
              </div>
              <div className="p-6 rounded-xl bg-white/95 shadow-md border-2 border-terracotta/10 hover:border-terracotta/30 transition-colors">
                <div className="w-14 h-14 bg-terracotta text-white rounded-full flex items-center justify-center mx-auto mb-4 font-heading font-bold text-2xl shadow-lg border-4 border-white">3</div>
                <h3 className="font-heading font-bold text-xl mb-3 text-terracotta-dark">Rise Up</h3>
                <p className="text-obsidian/80 font-medium leading-relaxed">Check the leaderboard to see if you've become a Titan among mortals.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
