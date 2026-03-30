"use client";
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const cleanName = (name: string) => name.toLowerCase().trim().replace(/\s+/g, ' ');

export default function EntriesLeaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Added Search State
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>("");

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const golfRes = await fetch('https://golf-leaderboard-data.p.rapidapi.com/leaderboard/624', {
          headers: {
            'x-rapidapi-key': process.env.NEXT_PUBLIC_GOLF_API_KEY as string,
            'x-rapidapi-host': 'golf-leaderboard-data.p.rapidapi.com'
          }
        });
        const golfData = await golfRes.json();
        
        const proScores: Record<string, { score: number; mc: boolean; name: string }> = {};
        const activePlayers: { name: string; score: number }[] = [];

        if (golfData?.results?.leaderboard) {
          golfData.results.leaderboard.forEach((p: any) => {
            const displayName = `${p.first_name} ${p.last_name}`;
            const internalName = cleanName(displayName);
            const score = p.total_to_par || 0;
            const isMC = p.cut === 1;
            
            proScores[internalName] = { score, mc: isMC, name: displayName };
            
            if (!isMC) {
              activePlayers.push({ name: displayName, score });
            }
          });
        }

        let safetyNetScore = 10;
        let safetyNetProName = "Field Average";

        if (activePlayers.length > 0) {
          const worstActive = activePlayers.reduce((prev, current) => (prev.score > current.score) ? prev : current);
          safetyNetScore = worstActive.score;
          safetyNetProName = worstActive.name;
        }

        const { data: userEntries, error } = await supabase
          .from('entries')
          .select('*')
          .eq('has_paid', true);

        if (error) throw error;

        if (userEntries) {
          const calculatedEntries = userEntries.map(entry => {
            let missedCutCount = 0;
            
            const displayPicks = entry.golfer_choice.map((name: string) => {
              const player = proScores[cleanName(name)];
              if (player && player.mc) {
                missedCutCount++;
                return { original: name, replacement: safetyNetProName, isMC: true };
              }
              return { original: name, replacement: null, isMC: false };
            });

            const liveTotal = entry.golfer_choice.reduce((sum: number, name: string) => {
              const player = proScores[cleanName(name)];
              if (!player || player.mc) return sum + safetyNetScore;
              return sum + player.score;
            }, 0);

            return { ...entry, liveTotal, missedCutCount, displayPicks };
          });

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

  // Filter Logic for Search Bar
  const filteredEntries = entries.filter((entry) => {
    const nameMatch = entry.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const selectionsMatch = entry.golfer_choice?.some((g: string) => 
      g.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return nameMatch || selectionsMatch;
  });

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
      <div className="bg-[#006747] p-8 text-center border-b-4 border-[#FFCC00] shadow-lg">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
          Our <span className="text-[#FFCC00]">Leaderboard</span>
        </h1>
        <p className="text-white font-bold mt-2 tracking-widest uppercase opacity-90 text-xs md:text-sm">
          Ratoath Senior National School Fundraiser
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* Search Bar UI */}
        <div className="mb-6 relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search entry or golfer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 rounded-2xl border-2 border-[#006747]/10 focus:border-[#006747] outline-none shadow-sm transition-all italic font-bold text-[#006747]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#006747] opacity-40 text-xl">
            🔍
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100 text-[#006747] font-black italic uppercase text-xs">
                <th className="p-4 md:p-6">Pos</th>
                <th className="p-4 md:p-6">Entry Name</th>
                <th className="p-4 md:p-6 hidden md:table-cell">Picks</th>
                <th className="p-4 md:p-6 text-right">To Par</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => (
                  <tr key={entry.id} className="border-b hover:bg-green-50/50 transition-colors group">
                    <td className="p-4 md:p-6 font-bold text-gray-400">#{index + 1}</td>
                    <td className="p-4 md:p-6">
                      <span className="font-black italic text-[#006747] uppercase text-base md:text-lg leading-tight block">
                        {entry.user_name}
                      </span>
                      <div className="md:hidden text-[10px] text-gray-500 mt-1 uppercase">
                         {entry.golfer_choice.join(' • ')}
                      </div>
                      {entry.missedCutCount > 0 && (
                        <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter inline-block mt-1">
                          ⚠️ {entry.missedCutCount} Replaced (MC)
                        </span>
                      )}
                    </td>
                    <td className="p-6 font-bold text-gray-500 text-xs italic hidden md:table-cell">
                      <div className="flex flex-wrap gap-2">
                        {entry.displayPicks.map((pick: any, i: number) => (
                          <span key={i} className="flex items-center">
                            {pick.isMC ? (
                              <span className="text-red-400 line-through decoration-red-500 opacity-60 mr-1">
                                {pick.original}
                              </span>
                            ) : (
                              <span>{pick.original}</span>
                            )}
                            {pick.isMC && (
                              <span className="text-[#006747] font-black not-italic text-[10px] bg-green-100 px-1 rounded">
                                ➔ {pick.replacement}
                              </span>
                            )}
                            {i < entry.displayPicks.length - 1 && <span className="ml-2 text-gray-300">•</span>}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`p-4 md:p-6 text-right font-black text-2xl md:text-3xl ${entry.liveTotal < 0 ? 'text-red-600' : 'text-[#006747]'}`}>
                      {entry.liveTotal > 0 ? `+${entry.liveTotal}` : entry.liveTotal === 0 ? 'E' : entry.liveTotal}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">
                    No results found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
            Last Sync: {lastSync}
          </p>
          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-[10px] uppercase font-bold text-gray-500">
            <span className="text-red-500 mr-2">●</span> Missed Cut rule: Replaced by worst active score.
          </div>
        </div>
      </div>
    </main>
  );
}