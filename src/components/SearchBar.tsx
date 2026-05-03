'use client';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="ios-backdrop-xl border-b border-blue-500/10 bg-[#07111f]/90 px-6 py-5">
      <div className="max-w-3xl">
        <div className="group relative">
          <input
            type="text"
            placeholder="Search tokens, tickers, or addresses..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-3xl border border-cyan-500/15 bg-slate-950/80 pl-12 pr-5 py-4 text-white placeholder-slate-500 transition-all duration-300 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:shadow-[0_0_30px_rgba(34,211,238,0.18)] hover:border-slate-600 hover:bg-slate-950"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
            <span className="text-lg">🔍</span>
          </div>
        </div>
      </div>
    </div>
  );
}