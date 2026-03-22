"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * NAME CLEANER: Standardizes names to ensure Supabase and API match.
 * Example: "Shane Lowry " -> "shane lowry"
 */
const cleanName = (name: string) => name.toLowerCase().trim().replace(/\s+/g, ' ');

export default function EntriesLeaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>("");

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        // 1. Fetch Live Pro Scores from Golf API
        const golfRes = await fetch('https://golf-leaderboard-data.p.rapidapi.com/leaderboard/624', {
          headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_GOLF_API_KEY as string,
            'x-rapidapi-host': 'golf-leaderboard-data.p.rapidapi.com'
          }
        });
        const golfData = await golfRes.json();
        
        const proScores: Record<string, { score: number; mc: boolean }> = {};
        const activeScores: number[] = [];

        if (golfData?.results?.leaderboard) {
          golfData.results.leaderboard.forEach((p: any) => {
            const fullName = cleanName(`${p.first_name} ${p.last_name}`);
            const score = p.total_to_par || 0;
            const isMC = p.cut === 1; // 1 means player missed the cut
            
            proScores[fullName] = { score, mc: isMC };
            
            // Collect scores of players still in the tournament for the Safety Net
            if (!isMC) activeScores.push(score);
          });
        }

        // SAFETY NET: Penalty = the worst score currently active on the course
        const safetyNetPenalty = activeScores.length > 0 ? Math.max(...activeScores) : 10;

        // 2. Fetch PAID entries from Supabase
        const { data: userEntries, error } = await supabase
          .from('entries')
          .select('*')
          .eq('has_paid', true);

        if (error) throw error;

        if (userEntries) {
          // 3. SCORING ALGORITHM: Sum live scores + apply MC penalties
          const calculatedEntries = userEntries.map(entry => {
            let missedCutCount = 0;
            const liveTotal = entry.golfer_choice.reduce((sum: number, name: string) => {
              const cleanedReqName = cleanName(name);
              const player = proScores[cleanedReqName];

              if (player) {
                if (player.mc) {
                  missedCutCount++;
                  return sum + safetyNetPenalty; // Apply Safety Net Penalty
                }
                return sum + player.score;
              }
              return sum + 0; // Default if player not found in API
            }, 0);

            return { ...entry, liveTotal, missedCutCount };
          });

          // Sort by lowest score (best)
          setEntries(calculatedEntries.sort((a, b) => a.liveTotal - b.liveTotal));
          setLastSync(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error("Leaderboard Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboardData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF9F6]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006747] mx-auto"></div>
        <p className="mt-4 font-black italic text-[#006747] uppercase tracking-tighter">Syncing Live Scores...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDF9F6] pb-24 font-serif italic">
      {/* Header */}
      <div className="bg-[#006747] p-8 text-center border-b-4 border-[#FFCC00] shadow-lg">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
          Our <span className="text-[#FFCC00]">Leaderboard</span>
        </h1>
        <p className="text-white font-bold mt-2 tracking-widest uppercase opacity-90">
          Ratoath Senior National School Fundraiser
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100 text-[#006747] font-black italic uppercase text-sm">
                <th className="p-6">Pos</th>
                <th className="p-6">Entry Name</th>
                <th className="p-6">Picks</th>
                <th className="p-6 text-right">To Par</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className="border-b hover:bg-green-50/50 transition-colors group">
                  <td className="p-6 font-bold text-gray-400">#{index + 1}</td>
                  <td className="p-6">
                    <span className="font-black italic text-[#006747] uppercase text-lg leading-tight block">
                      {entry.user_name}
                    </span>
                    {entry.missedCutCount > 0 && (
                      <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter inline-block mt-1">
                        ⚠️ {entry.missedCutCount} Missed Cut (Penalty Applied)
                      </span>
                    )}
                  </td>
                  <td className="p-6 font-bold text-gray-500 text-xs md:text-sm italic">
                    {entry.golfer_choice.join(' • ')}
                  </td>
                  <td className={`p-6 text-right font-black text-3xl ${entry.liveTotal < 0 ? 'text-red-600' : 'text-[#006747]'}`}>
                    {entry.liveTotal > 0 ? `+${entry.liveTotal}` : entry.liveTotal === 0 ? 'E' : entry.liveTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-[10px] text-gray-400 uppercase font-bold tracking-widest">
          Last Algorithm Sync: {lastSync}
        </p>
      </div>
    </main>
  );
}