export default function MastersLive() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-[#006747] p-8 text-center border-b-4 border-[#FFCC00]">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">
          Official Masters Leaderboard
        </h1>
        <p className="text-[#FFCC00] font-bold mt-2 underline">Live from Augusta National</p>
      </div>

      {/* The Live Leaderboard Container */}
      <div className="max-w-6xl mx-auto p-4 h-[800px]">
        <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 bg-white">
          {/* We use an iframe to pull in a real-time leaderboard */}
          <iframe 
            src="https://www.espn.com/golf/leaderboard" 
            className="w-full h-full border-none"
            title="Masters Live Scores"
          />
        </div>
      </div>

      <div className="text-center p-6 text-gray-500 text-sm italic">
        Scores provided by ESPN Live Feed
      </div>
    </main>
  );
}