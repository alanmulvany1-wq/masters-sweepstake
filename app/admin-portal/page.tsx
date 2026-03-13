"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminPortal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const SECRET_PASSWORD = "Masters2026"; 

  const fetchAll = async () => {
    const { data } = await supabase.from('entries').select('*').order('created_at', { ascending: false });
    if (data) setEntries(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === SECRET_PASSWORD) {
      setIsAuthorized(true);
      fetchAll();
    } else {
      alert("Incorrect Password");
    }
  };

  const togglePaid = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from('entries').update({ has_paid: !currentStatus }).eq('id', id);
    if (!error) fetchAll();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirm Delete?")) return;
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (!error) fetchAll();
  };

  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#006747] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-[#006747] text-2xl font-black text-center uppercase mb-6 italic">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="w-full p-4 border-2 rounded-xl text-center font-bold" placeholder="Password"/>
            <button type="submit" className="w-full bg-[#006747] text-white p-4 rounded-xl font-black uppercase">Access</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-black text-[#006747] mb-6 uppercase italic">Fundraiser Control Panel</h1>
        
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500 font-bold border-b-2">
              <th className="p-4">Entry Name</th>
              <th className="p-4 text-center">Points (Min 150)</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-800">{entry.user_name}</td>
                
                {/* Verification Column for the 150 point rule */}
                <td className="p-4 text-center font-black">
                  <span className={entry.total_odds >= 150 ? "text-green-600" : "text-red-600"}>
                    {entry.total_odds}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <span className={`px-4 py-1 rounded-full text-xs font-black tracking-widest ${entry.has_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {entry.has_paid ? 'PAID' : 'PENDING'}
                  </span>
                </td>
                
                <td className="p-4 text-center space-x-2">
                  <button 
                    onClick={() => togglePaid(entry.id, entry.has_paid)} 
                    className={`text-xs px-4 py-2 rounded font-bold uppercase transition-all ${entry.has_paid ? 'bg-gray-200 text-gray-700' : 'bg-[#006747] text-white shadow-md'}`}
                  >
                    {entry.has_paid ? 'Mark Unpaid' : 'Confirm Payment'}
                  </button>
                  <button 
                    onClick={() => handleDelete(entry.id)} 
                    className="text-xs bg-red-600 text-white px-4 py-2 rounded font-bold uppercase hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}