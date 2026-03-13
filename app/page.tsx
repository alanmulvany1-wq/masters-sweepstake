"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { GOLFER_DATA } from './golfers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sortedGolfers = [...GOLFER_DATA].sort((a: any, b: any) => 
  a.points - b.points
);

export default function MastersSweepstake() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [selectedGolfers, setSelectedGolfers] = useState<string[]>([]);
  const [totalpoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

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

  useEffect(() => {
    const total = selectedGolfers.reduce((sum, golferName) => {
      const g = GOLFER_DATA.find((golfer) => golfer.name === golferName);
      return sum + (g?.points || 0); 
    }, 0);
    setTotalPoints(total);
  }, [selectedGolfers]);

  const saveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGolfers.length !== 3) return alert("Please pick exactly 3 golfers.");
    if (totalpoints < 150) return alert("Total points must be 150 or more.");
    if (!name || !email) return alert("Please enter both your name and email.");

    setLoading(true);

    try {
      const { error } = await supabase
        .from('entries') 
        .insert([{ 
            user_name: name,         
            email: email,         
            golfer_choice: selectedGolfers, 
            total_odds: totalpoints, 
            has_paid: false           
        }]);

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
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Header */}
      <div className="relative w-full h-[250px] md:h-[350px] flex overflow-hidden border-b-8 border-[#FFCC00]">
        <div className="relative w-1/2 h-full">
          <img src="/amen-corner.jpg" alt="Amen Corner" className="w-full h-full object-cover" />
        </div>
        <div className="relative w-1/2 h-full">
          <img src="/rory-jacket.jpg" alt="Rory" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Grid Layout for Instructions + Form */}
      <div className="max-w-6xl mx-auto px-4 mt-12 flex flex-col lg:flex-row gap-8 items-start justify-center">
        
        {/* LEFT SIDE: Instructions Table */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-[#006747] text-[#FFCC00] rounded-xl shadow-lg border-2 border-[#FFCC00] overflow-hidden">
          <div className="p-4 border-b border-[#FFCC00]/30 bg-[#005a3e]">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">How to Enter</h2>
          </div>
          <table className="w-full text-sm font-bold border-collapse">
            <tbody>
              <tr className="border-b border-[#FFCC00]/10">
                <td className="p-4 align-top">1.</td>
                <td className="p-4">Enter your name and email.</td>
              </tr>
              <tr className="border-b border-[#FFCC00]/10">
                <td className="p-4 align-top">2.</td>
                <td className="p-4">Select three golfers that add up to at least 150 points.</td>
              </tr>
              <tr>
                <td className="p-4 align-top">3.</td>
                <td className="p-4">Click submit and best of luck!</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* RIGHT SIDE: Main Entry Form */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border-t-[12px] border-[#006747] w-full max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Entry Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border-2 rounded-xl focus:border-[#006747] outline-none text-xl font-bold bg-gray-50"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 rounded-xl focus:border-[#006747] outline-none text-xl font-bold bg-gray-50"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <p className="text-xl font-black text-gray-700 mb-4 uppercase italic">Select Your Trio:</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-h-[450px] overflow-y-auto border-2 p-4 rounded-xl bg-gray-50 shadow-inner">
            {sortedGolfers.map((golfer: any) => (
              <button
                key={golfer.name}
                type="button"
                onClick={() => toggleSelection(golfer.name)}
                className={`p-5 text-left rounded-xl border-2 transition-all ${
                  selectedGolfers.includes(golfer.name)
                    ? "bg-[#006747] text-white border-[#006747] shadow-md scale-[1.02]"
                    : "bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{golfer.name}</span>
                  <span className={`text-xl font-black ${selectedGolfers.includes(golfer.name) ? "text-[#FFCC00]" : "text-[#006747]"}`}>
                    {golfer.points}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Points Display */}
          <div className="bg-gray-900 text-white p-6 rounded-2xl mb-8 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 uppercase text-xs font-bold tracking-widest">Combined Points</span>
              <span className={`text-3xl font-black ${totalpoints >= 150 ? "text-green-400" : "text-yellow-400"}`}>
                {totalpoints}
              </span>
            </div>
            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-700" 
                style={{ width: `${Math.min((totalpoints / 150) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <button
            type="button"
            onClick={saveEntry}
            disabled={loading || totalpoints < 150 || !name || !email || selectedGolfers.length !== 3}
            className={`w-full p-6 rounded-2xl font-black uppercase tracking-widest text-2xl transition-all shadow-lg ${
              totalpoints >= 150 && name && email && selectedGolfers.length === 3 && !loading
                ? "bg-[#006747] text-white hover:bg-[#004d35] transform active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Submit Entry"}
          </button>

          <Link href="/leaderboard" className="block text-center mt-8 text-[#006747] font-bold text-lg hover:underline decoration-2 italic">
            View Live Leaderboard →
          </Link>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border-t-[16px] border-[#006747]">
            <div className="p-10 text-center">
              <h2 className="text-[#006747] text-4xl font-black italic mb-4">Saved!</h2>
              <div className="bg-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-200 mb-8">
                <p className="text-lg text-gray-700 mb-8 leading-relaxed font-bold">
                  Final step: Pay the <span className="text-[#006747]">€10 fee</span> to activate your entry:
                </p>
                <a 
                  href="https://buy.stripe.com/your_link" 
                  target="_blank"
                  className="inline-block bg-[#006747] text-white font-black py-5 px-10 rounded-full hover:bg-[#FFCC00] hover:text-[#006747] transition-all shadow-xl w-full uppercase text-xl tracking-tight"
                >
                  Pay via Stripe
                </a>
              </div>
              <button onClick={() => window.location.reload()} className="text-gray-400 text-sm font-bold uppercase hover:text-gray-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}