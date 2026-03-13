"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b-2 border-[#006747] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          
          {/* 1. LEFT: School Crest */}
          <div className="flex-1 flex justify-start">
            <Link href="/">
              <img 
                src="/school-crest.png" 
                alt="School Crest" 
                className="h-16 w-auto hover:opacity-80 transition-all"
              />
            </Link>
          </div>

          {/* 2. CENTER: Masters 2026 (Augusta Style) */}
          <div className="flex-1 flex flex-col items-center">
            <h1 className="text-[#006747] text-4xl tracking-tight leading-none" 
                style={{ fontFamily: 'Times New Roman, serif', fontWeight: '700', fontStyle: 'italic' }}>
              Masters 2026
            </h1>
            <p className="text-[#006747] text-sm uppercase tracking-[0.3em] font-bold mt-2 text-center" 
               style={{ fontFamily: 'Times New Roman, serif', fontStyle: 'italic' }}>
              Ratoath Senior National School Fundraiser
            </p>
          </div>

          {/* 3. RIGHT: Menu Options */}
          <div className="flex-1 flex justify-end gap-6">
            <Link href="/" className="text-[#006747] font-extrabold text-xs uppercase tracking-widest hover:text-[#FFCC00] transition-colors font-serif italic">
              Home
            </Link>

            {/* Renamed "Entries" to be clearer - This links to your CLEAN table (no points) */}
            <Link href="/leaderboard" className="text-[#006747] font-extrabold text-xs uppercase tracking-widest hover:text-[#FFCC00] transition-colors font-serif italic">
              Entries
            </Link>

            {/* Renamed "Leaderboard" to "Live Scores" - This links to the ESPN iframe */}
            <Link href="/masters-leaderboard" className="text-[#006747] font-extrabold text-xs uppercase tracking-widest hover:text-[#FFCC00] transition-colors font-serif italic">
              Live Scores ⛳️
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}