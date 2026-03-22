"use client";
import React from 'react';
import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-[#FDF9F6] pb-24 font-serif italic">
      <div className="bg-[#006747] p-8 text-center border-b-4 border-[#FFCC00] shadow-lg">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
          Terms & <span className="text-[#FFCC00]">Conditions</span>
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-12 text-[#006747]">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6 not-italic">
          <section>
            <h2 className="text-2xl font-black uppercase mb-2 border-b border-gray-100 pb-1">1. Entry Requirements</h2>
            <p className="text-gray-700 leading-relaxed">
              All entries must be confirmed with a payment of **€10** to be eligible for the leaderboard. 
              Unpaid entries will be removed from the official standings before the tournament begins on Thursday.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-2 border-b border-gray-100 pb-1">2. Scoring (The Safety Net)</h2>
            <p className="text-gray-700 leading-relaxed italic font-medium mb-2">
              The "Ratoath Safety Net" ensures no entry is disqualified early.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your total score is the sum of your 3 chosen golfers. If a golfer **Misses the Cut (MC)**, 
              they are assigned the score of the highest (worst) active player currently on the course 
              for the remainder of the tournament.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black uppercase mb-2 border-b border-gray-100 pb-1">3. Prizes & Ties</h2>
            <p className="text-gray-700 leading-relaxed">
              Prizes will be awarded to the top 3 finishers. In the event of a tie for any 
              of the prize-winning positions, the total prize pot for those positions will be split 
              equally among the tied entries.
            </p>
          </section>

          <div className="pt-8 border-t border-gray-100 text-center">
            <Link href="/" className="inline-block bg-[#006747] text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#004d35] hover:scale-105 transition-all shadow-md">
              ← Return to Entry Form
            </Link>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-widest font-bold">
          Ratoath Senior National School Fundraiser • Masters 2026
        </p>
      </div>
    </main>
  );
}