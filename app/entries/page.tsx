"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EntriesPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      // Fetches all entries from your 'entries' table in Supabase
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('has_paid', true) // Only show people who have paid
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEntries(data);
      }
      setLoading(false);
    }
    fetchEntries();
  }, []);

  return (
    <main className="min-h-screen bg-[#FDF9F6] pb-20">
      {/* Header Styled for Augusta Theme */}
      <div className="bg-[#006747] p-10 text-center border-b-8 border-[#FFCC00] shadow-xl">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white">
          Confirmed <span className="text-[#FFCC00]">Entries</span>
        </h1>
        <p className="text-white/80 font-bold mt-2 tracking-widest uppercase text-sm">
          Official Entry List • Masters Sweepstake
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100 text-[#006747] font-black italic uppercase text-sm">
                <th className="p-6">Entry Name</th>
                <th className="p-6">Selections</th>
                <th className="p-6 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center font-bold italic text-gray-400">
                    Loading entries from database...
                  </td>
                </tr>
              ) : entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="p-6 font-black italic text-[#006747] uppercase">
                      {entry.user_name}
                    </td>
                    <td className="p-6 text-gray-600 font-bold text-sm">
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
                  <td colSpan={3} className="p-20 text-center font-bold italic text-gray-400">
                    No entries found. Make sure entries are marked "Paid" in your admin panel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center flex justify-center gap-8">
          <a href="/" className="text-[#006747] font-black italic uppercase hover:underline text-sm">
            ← Back to Entry Form
          </a>
          <a href="/masters-leaderboard" className="text-[#006747] font-black italic uppercase hover:underline text-sm">
            View Live Scores →
          </a>
        </div>
      </div>
    </main>
  );
}