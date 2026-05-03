'use client';

export type SidebarCategory =
  | 'All'
  | 'Important'
  | 'Tech Launches'
  | 'Launched'
  | 'Not Live'
  | 'Bundle Risk'
  | 'Watchlist';

interface SidebarProps {
  selectedCategory: SidebarCategory;
  onCategoryChange: (category: SidebarCategory) => void;
  className?: string;
}

export const categories: SidebarCategory[] = [
  'All',
  'Important',
  'Tech Launches',
  'Launched',
  'Not Live',
  'Bundle Risk',
  'Watchlist',
];

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  className = '',
}: SidebarProps) {
  return (
    <aside className={`ios-scroll w-72 overflow-y-auto border-r border-blue-500/10 bg-[#07111f] p-6 text-slate-200 ${className}`}>
      <div className="mb-8 space-y-2">
        <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          OPS PANEL
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Launch Filters</h2>
        <p className="text-sm text-slate-400">Curated categories for live launch intelligence.</p>
      </div>

      <nav className="space-y-3 flex-1">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`w-full rounded-3xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'border-cyan-400/40 bg-cyan-500/10 text-white'
                : 'border-transparent text-slate-300 hover:border-cyan-500/20 hover:bg-white/5 hover:text-white'
            }`}
            style={{
              animationDelay: `${index * 30}ms`,
            }}
          >
            <span className="relative z-10">{category}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}