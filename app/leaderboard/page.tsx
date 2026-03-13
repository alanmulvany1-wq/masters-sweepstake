"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Leaderboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      // We ONLY fetch the name and choices. No points/odds are even requested.
      const { data, error } = await supabase
        .from('entries')
        .select('user_name, golfer_choice')
        .eq('has_paid', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEntries(data);
      }
      setLoading(false);
    };
    fetchEntries();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-[12px] border-[#006747]">
          
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h1 className="text-3xl font-black text-[#006747] uppercase italic tracking-tighter">
              Fundraiser Entries
            </h1>
            <Link href="/" className="text-sm font-bold text-[#006747] hover:underline uppercase">
              ← Back to Entry
            </Link>
          </div>

          <div className="overflow-x-auto">
            {/* Standardizing to a 2-COLUMN table only */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#006747] text-[#FFCC00] uppercase text-sm tracking-widest italic">
                  <th className="p-6 font-black w-1/3">Name</th>
                  <th className="p-6 font-black w-2/3">Golfers Selected</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="p-10 text-center text-gray-400 font-bold">Loading...</td>
                  </tr>
                ) : entries.map((entry, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-green-50/50 italic">
                    <td className="p-6 text-xl font-bold text-gray-800">
                      {entry.user_name}
                    </td>
                    <td className="p-6 text-lg text-gray-600">
                      {Array.isArray(entry.golfer_choice) 
                        ? entry.golfer_choice.join(', ') 
                        : entry.golfer_choice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}