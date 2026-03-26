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
      <div className="grid grid-cols-1 md:grid-cols-2 h-[300px] md:h-[400px] w-full shadow-lg overflow-hidden">
        <div className="bg-[url('/amen-corner.jpg')] bg-cover bg-center border-r-4 border-[#006747]"></div>
        <div className="bg-[url('/rory-jacket.jpg')] bg-cover bg-center"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INFO BOXES */}
        <div className="md:col-span-4 space-y-6 flex flex-col">
          
          {/* BOX 1: HOW TO ENTER */}
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

          {/* BOX 2: AUGUSTA STYLE "THE PURSE" */}
          <div className="bg-white p-10 rounded-3xl shadow-xl border-4 border-[#006747] text-center">
            <h2 className="text-3xl font-black text-[#006747] uppercase italic tracking-widest mb-2">
              The Purse
            </h2>
            
            {/* Elegant Triple-Line Divider */}
            <div className="flex justify-center items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-[#006747]/30"></div>
              <div className="h-2 w-2 rotate-45 bg-[#FFCC00]"></div>
              <div className="h-[1px] w-12 bg-[#006747]/30"></div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-2">
                <span className="text-gray-600 font-bold italic">🥇 First Place</span>
                <span className="text-3xl font-black text-[#006747]">€300</span>
              </div>
              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-2">
                <span className="text-gray-600 font-bold italic">🥈 Second Place</span>
                <span className="text-3xl font-black text-[#006747]">€200</span>
              </div>
              <div className="flex justify-between items-end border-b border-dashed border-gray-200 pb-2">
                <span className="text-gray-600 font-bold italic">🥉 Third Place</span>
                <span className="text-3xl font-black text-[#006747]">€100</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-loose">
                Proceeds in aid of <br/> 
                <span className="text-[#006747]">Ratoath Senior National School</span>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE ENTRY FORM */}
        <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
          {!showStripe ? (
            <form onSubmit={handleSubmit} className="space-y-8">
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
                      <button key={g.name} type="button" onClick={() => toggleGolfer(g)} className={`flex justify-between p-4 border-2 rounded-xl font-black italic transition-all ${isSelected ? 'bg-[#006747] text-white border-[#006747]' : 'border-gray-200 text-gray-800 hover:bg-green-50'}`}>
                        <span>{g.name}</span> 
                        <span>{g.points}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#111827] text-white p-6 rounded-2xl flex justify-between items-center">
                <span className="uppercase font-bold italic text-xs tracking-widest text-gray-400">Total Selection Points</span>
                <span className={`text-5xl font-black ${totalPoints >= 150 ? 'text-green-400' : 'text-[#FFCC00]'}`}>{totalPoints}</span>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 h-5 w-5 rounded border-gray-300 text-[#006747]" />
                <label htmlFor="terms" className="text-sm font-bold text-[#006747] not-italic cursor-pointer">
                  I agree to the <Link href="/terms" target="_blank" className="underline">Terms & Conditions</Link>
                </label>
              </div>

              <button type="submit" className="w-full p-6 bg-[#006747] text-[#FFCC00] rounded-2xl font-black uppercase italic tracking-widest text-xl shadow-xl hover:bg-[#004d35] transition-colors">
                Submit Entry
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-4xl font-black text-[#006747] mb-4 italic uppercase">Entry Saved!</h2>
              <p className="mb-10 font-bold text-gray-500 italic">Complete your €10 payment to secure your spot.</p>
              <a href="https://buy.stripe.com/14A5kD0fD941fEs37f2go00" className="inline-block bg-[#635bff] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg shadow-xl hover:bg-[#534bc3] transition-all">
                Pay €10 via Stripe
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}