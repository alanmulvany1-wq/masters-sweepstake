"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Leaderboard() {
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('has_paid', true) // Correct: Looking for the new 'has_paid' column
        .order('total_odds', { ascending: false });

      if (!error && data) setEntries(data);
    };
    fetchEntries();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border-t-8 border-[#006747] p-6">
        <h1 className="text-2xl font-black text-[#006747] uppercase mb-6 text-center">Tournament Leaderboard</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-xs uppercase text-gray-400">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Golfers</th>
                <th className="py-3 px-4 text-right">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-800">{entry.user_name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {entry.golfer_choice?.join(", ")}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-[#006747]">
                    {entry.total_odds} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}