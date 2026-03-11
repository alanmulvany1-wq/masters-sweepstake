"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminPortal() {
  const [entries, setEntries] = useState<any[]>([]);
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. SET YOUR PASSWORD HERE
  const SECRET_PASSWORD = "Masters2026"; 

  const fetchAll = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });
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
    const { error } = await supabase
      .from('entries')
      .update({ paid: !currentStatus }) 
      .eq('id', id);
    
    if (!error) fetchAll();
  };

  // SHOW LOGIN BOX IF NOT AUTHORIZED
  if (!isAuthorized) {
    return (
      <main className="min-h-screen bg-[#006747] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-[#006747] text-2xl font-black uppercase mb-6">Admin Dashboard Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full p-4 border-2 rounded-xl focus:border-[#006747] outline-none text-center font-bold"
            />
            <button 
              type="submit"
              className="w-full bg-[#006747] text-white p-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#004d35] transition-all"
            >
              Access Entries
            </button>
          </form>
        </div>
      </main>
    );
  }

  // SHOW DATA TABLE IF LOGGED IN
  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-[#006747]">Admin: Manage Payments</h1>
            <button onClick={() => setIsAuthorized(false)} className="text-xs text-gray-400 underline">Logout</button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100">
                <td className="p-4 font-semibold">{entry.name}</td>
                <td className="p-4 text-gray-500 text-sm">{entry.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${entry.paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {entry.paid ? 'PAID' : 'PENDING'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => togglePaid(entry.id, entry.paid)}
                    className="text-xs bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Mark as {entry.paid ? 'Unpaid' : 'Paid'}
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