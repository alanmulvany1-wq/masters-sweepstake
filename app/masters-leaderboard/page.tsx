"use client";
import React from 'react';

export default function MastersLeaderboard() {
  return (
    <main className="min-h-screen bg-[#006747] flex flex-col font-serif italic">
      {/* Premium Augusta-style Header */}
      <div className="bg-[#006747] p-8 text-center border-b-4 border-[#FFCC00] shadow-2xl">
        <h1 className="text-[#FFCC00] text-4xl md:text-5xl font-black uppercase tracking-tighter">
          Live <span className="text-white">Tournament</span> Scores
        </h1>
        <p className="text-white font-bold mt-2 tracking-widest uppercase opacity-90 text-sm">
          Real-Time Leaderboard • Masters 2026
        </p>
      </div>

      {/* The Live Leaderboard Container */}
      <div className="flex-grow w-full bg-white relative">
        {/* Switched to Golf Channel for better iframe compatibility */}
        <iframe 
  src="https://www.golfchannel.com/tours/pga-tour/2026/masters-tournament" 
  className="w-full h-full min-h-[85vh] border-none"
  title="Live Golf Leaderboard"
  allowFullScreen />
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-100 p-6 text-center border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a 
            href="/" 
            className="bg-[#006747] text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#004d35] transition-all"
          >
            ← Back to Entry Form
          </a>
          <a 
            href="/leaderboard" 
            className="bg-[#FFCC00] text-[#006747] px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-yellow-500 transition-all"
          >
            View Entries →
          </a>
        </div>
        <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold not-italic">
          Scores provided by Golf Channel • Ratoath Senior National School
        </p>
      </div>
    </main>
  );
}