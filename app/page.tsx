"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { GOLFER_DATA } from './data/golfers'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EntryPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGolfers, setSelectedGolfers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const totalPoints = selectedGolfers.reduce((sum, g) => sum + (g.points || 0), 0);
  const pointsRemaining = Math.max(0, 150 - totalPoints);

  const toggleGolfer = (g: any) => {
    if (selectedGolfers.find(sel => sel.name === g.name)) {
      setSelectedGolfers(selectedGolfers.filter(sel => sel.name !== g.name));
    } else if (selectedGolfers.length < 3) {
      setSelectedGolfers([...selectedGolfers, g]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGolfers.length !== 3 || totalPoints < 150 || !agreedToTerms) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('entries').insert([{
        user_name: name,
        email: email,
        golfer_choice: selectedGolfers.map(g => g.name),
        total_odds: Math.floor(totalPoints), 
        has_paid: false
      }]);
      if (error) throw error;
      setShowStripe(true);
    } catch (err: any) {
      alert("System Error: Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-20 font-serif italic">
      {/* HEADER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[300px] md:h-[400px] w-full shadow-lg overflow-hidden">
        <div className="bg-[url('/amen-corner.jpg')] bg-cover bg-center border-r-4 border-[#006747]"></div>
        <div className="bg-[url('/rory-jacket.jpg')] bg-cover bg-center"></div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INFO BOXES */}
        <div className="md:col-span-4 space-y-6 flex flex-col">
          
          {/* HOW TO ENTER BOX - Now styled as a standard block to prevent overlapping */}
          <div className="bg-[#006747] text-white p-8 rounded-3xl shadow-xl border-b-8 border-[#FFCC00]">
            <h2 className="text-2xl font-black italic uppercase mb-6 border-b border-green-700/50 pb-2 text-[#FFCC00]">
              How to Enter
            </h2>
            <ol className="space-y-6 font-bold italic text-sm">
              <li className="flex gap-4">
                <span className="text-[#FFCC00]">1.</span> 
                <span>Enter your full name and a valid email address.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#FFCC00]">2.</span> 
                <span>Select three golfers. Combined points must be at least 150.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#FFCC00]">3.</span> 
                <span>Pay €10 via Stripe to secure your spot.</span>
              </li>
            </ol>
          </div>

          {/* PRIZES BOX - This is the separate box you requested */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-[#006747] relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FFCC00] text-[#006747] px-4 py-1 font-black text-xs uppercase rounded-bl-xl">
              Win Big
            </div>
            <h2 className="text-2xl font-black italic uppercase mb-6 text-[#006747] border-b border-gray-100 pb-2">
              Prizes
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border-l-4 border-[#FFCC00]">
                <span className="font-bold text-gray-600">🥇 1st Place</span>
                <span className="text-2xl font-black text-[#006747]">€300</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border-l-4 border-gray-300">
                <span className="font-bold text-gray-600">🥈 2nd Place</span>
                <span className="text-2xl font-black text-[#006747]">€200</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border-l-4 border-orange-300">
                <span className="font-bold text-gray-600">🥉 3rd Place</span>
                <span className="text-2xl font-black text-[#006747]">€100</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE ENTRY FORM */}
        <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
          {!showStripe ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form inputs and golfer selection as per your live site */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className="p-4 border-2 rounded-xl italic font-bold bg-gray-50 focus:border-[#006747] outline-none text-[#006747]" />
                <input type="email" placeholder="email@example.com" required value={email} onChange={e => setEmail(e.target.value)} className="p-4 border-2 rounded-xl italic font-bold bg-gray-50 focus:border-[#006747] outline-none text-[#006747]" />
              </div>

              <div>
                <h3 className="text-xl font-black uppercase italic text-[#006747] mb-4">Select Your Trio:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2">
                  {GOLFER_DATA.map((g: any) => {
                    const isSelected = selectedGolfers.find(s => s.name === g.name);
                    return (
                      <button key={g.name} type="button" onClick={() => toggleGolfer(g)} className={`flex justify-between p-4 border-2 rounded-xl font-black italic transition-all ${isSelected ? 'bg-[#006747] text-white border-[#006747]' : 'border-gray-200 text-gray-800'}`}>
                        <span>{g.name}</span> 
                        <span>{g.points}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#111827] text-white p-6 rounded-2xl flex justify-between items-center">
                <span className="uppercase font-bold italic text-xs tracking-widest text-gray-400">Total Points</span>
                <span className={`text-5xl font-black ${totalPoints >= 150 ? 'text-green-400' : 'text-[#FFCC00]'}`}>{totalPoints}</span>
              </div>

              <button type="submit" className="w-full p-6 bg-[#006747] text-[#FFCC00] rounded-2xl font-black uppercase italic tracking-widest text-xl shadow-xl">
                Submit Entry
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-4xl font-black text-[#006747] mb-4 italic uppercase">Entry Saved!</h2>
              <a href="https://buy.stripe.com/14A5kD0fD941fEs37f2go00" className="inline-block bg-[#635bff] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg shadow-xl">
                Pay €10 via Stripe
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}