
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://amziubiehhbosndtgylf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFteml1YmllaGhib3NuZHRneWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTY0MjEsImV4cCI6MjA4MDAzMjQyMX0.AsZKobL88wddp6oR7YmecW_PrS_AH5Qlg2X79a1Vpyk';

const supabase = createClient(supabaseUrl, supabaseKey);

const PLAYERS = [
    { name: 'Hercules' },
    { name: 'Athena' },
    { name: 'Zeus' },
    { name: 'Apollo' },
    { name: 'Artemis' },
    { name: 'Ares' },
    { name: 'Hermes' },
    { name: 'Poseidon' }
];

async function seed() {
    console.log('Seeding data...');

    // 1. Insert Players
    const { data: players, error: playerError } = await supabase
        .from('players')
        .upsert(PLAYERS, { onConflict: 'name' })
        .select();

    if (playerError) {
        console.error('Error inserting players:', playerError);
        return;
    }

    console.log(`Inserted ${players.length} players.`);

    // 2. Insert Results
    const results = players.map(player => ({
        player_id: player.id,
        quiz_date: new Date().toISOString().split('T')[0],
        score: Math.floor(Math.random() * 10) + 30 // Random score 30-40
    }));

    const { error: resultError } = await supabase
        .from('results')
        .insert(results);

    if (resultError) {
        console.error('Error inserting results:', resultError);
        return;
    }

    console.log('Inserted initial results.');
}

seed();
