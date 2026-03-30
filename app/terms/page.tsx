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
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 not-italic">
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <div className="flex gap-4">
              <span className="font-black text-[#006747] text-xl">1.</span>
              <p>All entrants must have paid in full and agreed to these terms and conditions to be eligible for the event and any subsequent prizes. Unpaid entries will be removed from the leaderboard before the tournament begins.</p>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#006747] text-xl">2.</span>
              <p>The closing date for all entries is Wednesday, April 8th at 21:00. No entries or changes to golfer selections will be accepted after this deadline.</p>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#006747] text-xl">3.</span>
              <p>The prize for first place is three hundred euro. The prize for second place is two hundred euro and the prize for third place is one hundred euro.</p>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#006747] text-xl">4.</span>
              <p>In the case of a tie, the prize fund for that position will be split amongst those eligible. For example, if three people finish first, the first place prize fund will be split equally between them. There would be no change to the second and third place prize funds in this scenario.</p>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#006747] text-xl">5.</span>
              <div>
                <p className="mb-4">If your selected golfers miss the cut and are not partaking in the weekend session, the following scoring applies:</p>
                <ul className="space-y-3 list-disc pl-5 italic text-sm border-l-2 border-[#FFCC00] ml-2">
                  <li>If one of your selected golfers misses the cut, you will be awarded the score of the highest scoring golfer for the weekend session.</li>
                  <li>If two golfers miss the cut, you will be awarded the scores of the two highest golfers partaking in the weekend session.</li>
                  <li>If three of your golfers miss the cut, the scores of the three highest golfers will be awarded.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="font-black text-[#006747] text-xl">6.</span>
              <p>All proceeds of this fundraiser go directly to Ratoath Senior National School. We thank you for your support.</p>
            </div>
          </div>

          {/* School Protection Footer */}
          <div className="mt-12 pt-8 border-t border-gray-100 space-y-4">
            <p className="text-[11px] text-gray-500 uppercase tracking-tight leading-tight">
              <strong>Withdrawals:</strong> If a selected golfer withdraws before the tournament starts, the entrant will be awarded a golfer of similar points by the tournament organisers.
            </p>
            <p className="text-[11px] text-gray-500 uppercase tracking-tight leading-tight">
              <strong>Final Decision:</strong> The decision of the school fundraising committee is final in all matters relating to the competition.
            </p>
            <p className="text-[11px] text-gray-500 uppercase tracking-tight leading-tight">
              <strong>Privacy:</strong> Contact details are used solely for tournament updates and will not be shared with third parties.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link href="/" className="inline-block bg-[#006747] text-white px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#004d35] hover:scale-105 transition-all shadow-md">
              ← Return to Entry Form
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}