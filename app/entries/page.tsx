"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Track search input
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('has_paid', true)
        .order('user_name', { ascending: true });

      if (!error && data) {
        setEntries(data);
      }
      setLoading(false);
    }
    fetchEntries();
  }, []);

  // Filter logic: Check if Name or Selections match the search term
  const filteredEntries = entries.filter((entry) => {
    const nameMatch = entry.user_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const selectionsMatch = Array.isArray(entry.golfer_choice) 
      ? entry.golfer_choice.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      : entry.golfer_choice?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return nameMatch || selectionsMatch;
  });

  return (
    <main className="min-h-screen bg-[#FDF9F6] pb-20 font-serif italic">
      <div className="bg-[#006747] p-10 text-center border-b-8 border-[#FFCC00] shadow-xl">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
          Confirmed <span className="text-[#FFCC00]">Entries</span>
        </h1>
        <p className="text-white font-bold mt-2 tracking-widest uppercase text-xs opacity-90">
          Ratoath Senior National School • Official Entry List
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Search Bar UI */}
        <div className="mb-8 relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search by name or golfer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-12 rounded-2xl border-2 border-[#006747]/20 focus:border-[#006747] outline-none shadow-sm transition-all italic font-bold text-[#006747]"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#006747] opacity-50">
            🔍
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100 text-[#006747] font-black italic uppercase text-xs">
                <th className="p-6">Entry Name</th>
                <th className="p-6">Trio Selection</th>
                <th className="p-6 text-right">Total Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#006747] mx-auto mb-4"></div>
                    <p className="font-bold italic text-gray-400">Syncing Entry List...</p>
                  </td>
                </tr>
              ) : filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-green-50/50 transition-colors">
                    <td className="p-6 font-black italic text-[#006747] uppercase text-lg">
                      {entry.user_name}
                    </td>
                    <td className="p-6 text-gray-600 font-bold text-xs md:text-sm italic">
                      {Array.isArray(entry.golfer_choice) 
                        ? entry.golfer_choice.join(' • ') 
                        : entry.golfer_choice}
                    </td>
                    <td className="p-6 text-right font-black text-2xl text-[#006747]">
                      {entry.total_odds}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center font-bold italic text-gray-400 uppercase">
                    {searchTerm ? `No entries found for "${searchTerm}"` : "No confirmed entries yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-12 text-center flex flex-col md:flex-row justify-center gap-6 md:gap-12">
          <a href="/" className="text-[#006747] font-black italic uppercase hover:text-[#FFCC00] text-sm tracking-widest transition-colors">
            ← Back to Entry Form
          </a>
          <a href="/leaderboard" className="bg-[#006747] text-white px-8 py-3 rounded-full font-black italic uppercase hover:bg-[#004d35] transition-all shadow-lg text-sm tracking-widest">
            View Live Leaderboard →
          </a>
        </div>
      </div>
    </main>
  );
}