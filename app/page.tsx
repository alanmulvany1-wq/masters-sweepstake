"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { GOLFER_DATA } from './golfers';

// 1. Setup Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// UPDATED: Sorting by Odds
const sortedGolfers = [...GOLFER_DATA].sort((a: any, b: any) => 
  a.odds - b.odds
);

export default function MastersSweepstake() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [selectedGolfers, setSelectedGolfers] = useState<string[]>([]);
  const [totalOdds, setTotalOdds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Selection logic
  const toggleSelection = (golferName: string) => {
    setSelectedGolfers((prev) => {
      if (prev.includes(golferName)) {
        return prev.filter((n) => n !== golferName);
      } else if (prev.length < 3) {
        return [...prev, golferName];
      }
      return prev;
    });
  };

  // Update odds calculation
  useEffect(() => {
    const total = selectedGolfers.reduce((sum, golferName) => {
      const g = GOLFER_DATA.find((golfer) => golfer.name === golferName);
      return sum + (g?.odds || 0);
    }, 0);
    setTotalOdds(total);
  }, [selectedGolfers]);

  // Save Entry to Supabase
  const saveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGolfers.length !== 3) return alert("Please pick exactly 3 golfers.");
    if (totalOdds < 150) return alert("Total odds must be 150/1 or more.");
    if (!name || !email) return alert("Please enter both your name and email.");

    setLoading(true);

    try {
      const { error } = await supabase
        .from('entries') // UPDATED: Lowercase 'entries' to fix RLS error
        .insert([
          { 
            user_name: name,
            email: email,         
            golfer_choice: selectedGolfers, 
            total_odds: totalOdds,   
            has_paid: false           
          }
        ]);

      if (error) throw error;
      setShowPayment(true);
      
    } catch (error: any) {
      console.error("Supabase Error Details:", error);
      alert(`Submission Failed: ${error.message || "Please check your connection."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[450px] flex overflow-hidden border-b-8 border-[#FFCC00]">
        <div className="relative w-1/2 h-full">
          <img src="/amen-corner.jpg" alt="Amen Corner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#006747]/10" />
        </div>
        <div className="relative w-1/2 h-full">
          <img src="/rory-jacket.jpg" alt="Rory McIlroy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>

      <div className="flex flex-col items-center px-4">
        {/* Box overlap removed by using 'mt-8' */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl border-t-[12px] border-[#006747] mt-8 z-10 mb-10">
          <div className="text-center mb-6">
            <h1 className="text-[#006747] text-xl md:text-2xl font-black uppercase tracking-tight">
              {/* Text correction removed per request */}
            </h1>
            <p className="text-gray-500 font-serif italic text-sm"></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Entry Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border-2 rounded-xl focus:border-[#006747] outline-none"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 rounded-xl focus:border-[#006747] outline-none"
                placeholder="name@email.com"
              />
            </div>
          </div>

          <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-tight font-serif italic">Select 3 Golfers (Ordered by Odds):</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-h-64 overflow-y-auto border-2 p-3 rounded-xl bg-gray-50">
            {sortedGolfers.map((golfer: any) => (
              <button
                key={golfer.name}
                type="button"
                onClick={() => toggleSelection(golfer.name)}
                className={`p-3 text-left rounded-lg border-2 transition-all font-semibold ${
                  selectedGolfers.includes(golfer.name)
                    ? "bg-[#006747] text-white border-[#006747] shadow-md"
                    : "bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <div className="flex justify-between">
                  <span>{golfer.name}</span>
                  <span className={selectedGolfers.includes(golfer.name) ? "text-green-200" : "text-[#006747]"}>
                    {golfer.odds}/1
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 bg-gray-900 text-white p-4 rounded-xl mb-6 shadow-inner font-serif italic">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 uppercase text-[10px] font-bold">Total Combined Odds</span>
              <span className={`text-xl font-mono ${totalOdds >= 150 ? "text-green-400" : "text-yellow-400"}`}>
                {totalOdds}/1
              </span>
            </div>
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min((totalOdds / 150) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <button
            type="button"
            onClick={saveEntry}
            disabled={loading || totalOdds < 150 || !name || !email || selectedGolfers.length !== 3}
            className={`w-full p-5 rounded-xl font-black uppercase tracking-widest text-white transition-all transform active:scale-95 font-serif italic ${
              totalOdds >= 150 && name && email && selectedGolfers.length === 3 && !loading
                ? "bg-[#006747] shadow-lg hover:bg-[#004d35]"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
          >
            {loading ? "Transmitting..." : "Submit Entry"}
          </button>

          <Link href="/leaderboard" className="block text-center mt-6 text-[#006747] font-bold hover:text-[#004d35] font-serif italic">
            View All Entries →
          </Link>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border-t-[12px] border-[#006747]">
            <div className="p-8 text-center">
              <h2 className="text-[#006747] text-3xl font-bold italic mb-2">Entry Received!</h2>
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200 mb-6">
                <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                  To complete your entry, please pay the <strong>€10 fee</strong> via Stripe:
                </p>
                <a 
                  href="https://buy.stripe.com/your_stripe_link_here" 
                  target="_blank"
                  className="inline-block bg-[#006747] text-white font-bold py-3 px-8 rounded-full hover:bg-[#FFCC00] hover:text-[#006747] transition-all shadow-md w-full"
                >
                  Pay €10 via Card
                </a>
              </div>
              <button onClick={() => window.location.reload()} className="text-gray-400 text-xs hover:underline uppercase tracking-widest font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}