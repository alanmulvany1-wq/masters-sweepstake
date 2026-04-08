"use client";
import React from 'react';
import Leaderboard from './leaderboard/page';

export default function EntryPage() {
  // Featured Groups for Thursday, April 9th (Converted to IST/Local Time)
  const featuredTeeTimes = [
    { time: "2:43 PM", players: "Dustin Johnson, Shane Lowry, Jason Day" },
    { time: "3:07 PM", players: "Bryson DeChambeau, Matt Fitzpatrick, Xander Schauffele" },
    { time: "3:31 PM", players: "Rory McIlroy, Cameron Young, Mason Howell (a)" },
    { time: "6:08 PM", players: "Jon Rahm, Chris Gotterup, Ludvig Åberg" },
    { time: "6:20 PM", players: "Jordan Spieth, Justin Rose, Brooks Koepka" },
    { time: "6:44 PM", players: "Scottie Scheffler, Robert MacIntyre, Gary Woodland" },
  ];

  return (
    <main className="min-h-screen bg-white pb-20 font-serif italic">
      {/* Visual Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[250px] md:h-[350px] w-full shadow-lg overflow-hidden">
        <div className="bg-[url('/amen-corner.jpg')] bg-cover bg-center border-r-4 border-[#006747]"></div>
        <div className="bg-[url('/rory-jacket.jpg')] bg-cover bg-center"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PRIZES & TEE TIMES */}
        <div className="md:col-span-4 space-y-6 flex flex-col">
          
          {/* BOX 1: THE PRIZES */}
          <div className="bg-[#006747] text-white p-8 rounded-3xl shadow-xl border-b-8 border-[#FFCC00]">
            <h2 className="text-2xl font-black italic uppercase mb-4 text-[#FFCC00] border-b border-green-700/50 pb-2">
              The Prizes
            </h2>
            <div className="space-y-4 font-bold text-lg">
              <div className="flex justify-between border-b border-green-700/30 pb-1">
                <span>🥇 1st Place</span>
                <span className="text-[#FFCC00]">€300</span>
              </div>
              <div className="flex justify-between border-b border-green-700/30 pb-1">
                <span>🥈 2nd Place</span>
                <span className="text-[#FFCC00]">€200</span>
              </div>
              <div className="flex justify-between border-b border-green-700/30 pb-1">
                <span>🥉 3rd Place</span>
                <span className="text-[#FFCC00]">€100</span>
              </div>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-green-200 text-center">
              Proceeds in aid of Ratoath Senior National School
            </p>
          </div>

          {/* BOX 2: FEATURED TEE TIMES (THURSDAY) */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-[#006747]">
            <h2 className="text-xl font-black text-[#006747] uppercase mb-4 border-b pb-2">
              Thursday Featured Groups
            </h2>
            <div className="space-y-4">
              {featuredTeeTimes.map((group, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0 pb-2">
                  <span className="text-[#006747] font-black block text-sm">{group.time} IST</span>
                  <span className="text-gray-600 text-xs font-bold not-italic">{group.players}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase text-center">
              Scores update live via Augusta National
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: THE LIVE LEADERBOARD */}
        <div className="md:col-span-8 bg-white p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-100 min-h-[600px]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h3 className="text-3xl font-black uppercase italic text-[#006747]">
              Sweepstake Standings
            </h3>
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-800 text-xs font-black uppercase tracking-tighter">Live Scoring</span>
            </div>
          </div>
          
          {/* Your custom Leaderboard component handles the logic */}
          <Leaderboard />
        </div>
      </div>
    </main>
  );
}