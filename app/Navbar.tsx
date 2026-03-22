"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [lastUpdated, setLastUpdated] = useState("");

  // Set the timestamp when the component loads
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastUpdated(formatted);
  }, [pathname]); // Updates timestamp slightly when navigating between pages

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Our Leaderboard', href: '/leaderboard' },
    { name: 'Masters Scores ⛳', href: '/masters-leaderboard' },
  ];

  return (
    <>
      <nav className="bg-white border-b-4 border-[#FFCC00] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo / School Name */}
            <div className="flex-shrink-0 flex items-center">
               <Link href="/" className="flex items-center gap-3 group">
                  <img src="/school-crest.png" alt="Logo" className="h-12 w-auto" />
                  <span className="hidden md:block text-[#006747] font-black italic uppercase text-sm tracking-tighter leading-tight group-hover:text-[#FFCC00] transition-colors">
                    Ratoath Senior <br/> National School
                  </span>
               </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="flex space-x-2 md:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-xs md:text-sm font-black italic uppercase tracking-widest transition-all ${
                      isActive 
                        ? 'text-[#006747] border-b-2 border-[#FFCC00]' 
                        : 'text-[#006747]/70 hover:text-[#006747]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* GLOBAL FOOTER BAR - Shows at the bottom of every page */}
      <footer className="fixed bottom-0 w-full bg-gray-900/90 backdrop-blur-sm text-white py-2 z-40 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
            © 2026 Ratoath Senior National School
          </p>
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#FFCC00] animate-pulse">
            Last Sync: {lastUpdated}
          </p>
        </div>
      </footer>
    </>
  );
}