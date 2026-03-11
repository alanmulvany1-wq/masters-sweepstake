"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Make sure it says 'export default function' right here:
export default function ConnectionTest() {
  const [status, setStatus] = useState("Testing...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    async function checkSupabase() {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // This checks if we can talk to your table
        const { data, error } = await supabase.from("GolferScores").select("name").limit(1);

        if (error) {
          setStatus("❌ Connection Failed");
          setDetails(error.message);
        } else {
          setStatus("✅ Connection Successful!");
          setDetails("Found golfer data: " + (data[0]?.name || "Table connected, but no golfers found yet."));
        }
      } catch (err: any) {
        setStatus("⚠️ Script Error");
        setDetails("Check your .env.local file. Error: " + err.message);
      }
    }
    checkSupabase();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl border-2 border-gray-700 max-w-md">
        <h1 className="text-3xl font-black mb-4 uppercase italic">Supabase Probe</h1>
        <div className={`text-xl font-bold p-4 rounded-xl mb-4 ${status.includes('✅') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
          {status}
        </div>
        <p className="text-gray-400 font-mono text-sm break-words">
          {details}
        </p>
        <button onClick={() => window.location.reload()} className="mt-6 text-xs text-gray-500 underline uppercase font-bold">
          Retry Test
        </button>
      </div>
    </div>
  );
}
