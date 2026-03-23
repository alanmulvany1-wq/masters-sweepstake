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
    
    if (selectedGolfers.length !== 3) {
      alert("Please select exactly 3 golfers.");
      return;
    }

    if (totalPoints < 150) {
      alert(`Invalid Entry! You need at least 150 points. You currently have ${totalPoints}.`);
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the Terms and Conditions.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('entries').insert([{
        user_name: name,
        email: email,
        golfer_choice: selectedGolfers.map(g => g.name),
        total_odds: Math.floor(totalPoints), 
        has_paid: false
      }]);

      if (error) {
        console.error("Supabase Database Error:", error.message);
        alert(`Database Error: ${error.message}`);
      } else {
        setShowStripe(true);
      }
    } catch (err: any) {
      console.error("Submission Crash:", err);
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
        
        {/* LEFT BOX: HOW TO ENTER */}
        <div className="md:col-span-4 bg-[#006747] text-white p-8 rounded-3xl shadow-xl border-b-8 border-[#FFCC00] h-fit">
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
              <span>Agree to Terms and click submit to proceed to payment.</span>
            </li>
          </ol>
        </div>

        {/* RIGHT BOX: THE ENTRY FORM */}
        <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
          {!showStripe ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-400 ml-2">Entry Name</label>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="p-4 border-2 rounded-xl italic font-bold bg-gray-50 focus:border-[#006747] outline-none transition-all text-[#006747]" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-black text-gray-400 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="p-4 border-2 rounded-xl italic font-bold bg-gray-50 focus:border-[#006747] outline-none transition-all text-[#006747]" 
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black uppercase italic text-[#006747] flex justify-between mb-4">
                  Select Your Trio:
                  <span className="text-sm not-italic text-gray-400 font-bold">{selectedGolfers.length} / 3</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 border-t pt-4 border-gray-100">
                  {GOLFER_DATA.map((g: any) => {
                    const isSelected = selectedGolfers.find(s => s.name === g.name);
                    return (
                      <button 
                        key={g.name} 
                        type="button" 
                        onClick={() => toggleGolfer(g)}
                        className={`flex justify-between p-4 border-2 rounded-xl font-black italic transition-all ${
                          isSelected 
                            ? 'bg-[#006747] text-white border-[#006747] shadow-md scale-[0.98]' 
                            : 'border-gray-200 text-gray-800 hover:bg-green-50/50'
                        }`}
                      >
                        <span>{g.name}</span> 
                        <span className={isSelected ? 'text-[#FFCC00]' : 'text-[#006747]'}>{g.points}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#111827] text-white p-6 rounded-2xl flex justify-between items-center relative overflow-hidden shadow-inner">
                <div className="z-10">
                  <span className="uppercase font-bold italic text-xs tracking-widest text-gray-400">Total Selection Points</span>
                  {pointsRemaining > 0 && (
                    <p className="text-[10px] font-bold text-[#FFCC00] animate-pulse">Need {pointsRemaining} more points</p>
                  )}
                </div>
                <span className={`text-5xl font-black z-10 transition-colors ${totalPoints >= 150 ? 'text-green-400' : 'text-[#FFCC00]'}`}>
                  {totalPoints}
                </span>
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-green-900/40 transition-all duration-700" 
                  style={{ width: `${Math.min((totalPoints / 150) * 100, 100)}%` }}
                ></div>
              </div>

              {/* TERMS CHECKBOX */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-[#006747] focus:ring-[#006747] cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm font-bold text-[#006747] not-italic cursor-pointer select-none">
                  I agree to the <Link href="/terms" target="_blank" className="underline hover:text-[#FFCC00]">Terms & Conditions</Link>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={totalPoints < 150 || isSubmitting || selectedGolfers.length !== 3 || !agreedToTerms}
                className={`w-full p-6 rounded-2xl font-black uppercase italic tracking-widest text-xl transition-all shadow-xl ${
                  (totalPoints >= 150 && selectedGolfers.length === 3 && agreedToTerms)
                    ? 'bg-[#006747] text-[#FFCC00] hover:bg-[#004d35] cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? "Processing..." : "Submit Entry"}
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-4xl font-black text-[#006747] mb-4 italic uppercase text-balance leading-tight">Entry Saved!</h2>
              <p className="mb-10 font-bold text-gray-500 italic">Success! Now complete your €10 payment to secure your spot.</p>
              <a 
                href="https://buy.stripe.com/14A5kD0fD941fEs37f2go00" 
                className="inline-block bg-[#635bff] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-lg shadow-xl hover:bg-[#534bc3] transition-all"
              >
                Pay via Stripe
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}