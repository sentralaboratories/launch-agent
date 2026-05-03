import TokenCard from './TokenCard';
import { TokenLaunch } from '@/types/token';

interface TokenGridProps {
  tokens: TokenLaunch[];
  onTokenClick: (token: TokenLaunch) => void;
  onWatchlistToggle: (tokenId: string) => void;
  isLoading?: boolean;
  className?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 animate-pulse">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 h-5 w-3/4 rounded bg-gradient-to-r from-gray-700 to-gray-600"></div>
          <div className="h-4 w-1/2 rounded bg-gradient-to-r from-gray-800 to-gray-700"></div>
        </div>
        <div className="h-6 w-20 rounded-full bg-gradient-to-r from-gray-700 to-gray-600"></div>
      </div>
      <div className="mb-4 flex gap-2">
        <div className="h-6 w-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-600"></div>
        <div className="h-6 w-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-600"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-gradient-to-r from-gray-800 to-gray-700" style={{
            animation: `shimmer 2s infinite`,
            animationDelay: `${i * 100}ms`,
          }}></div>
        ))}
      </div>
    </div>
  );
}

export default function TokenGrid({ tokens, onTokenClick, onWatchlistToggle, isLoading = false, className }: TokenGridProps) {
  return (
    <div className={`ios-scroll flex-1 overflow-y-auto p-6 ${className || ''}`}>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .token-card {
          animation: slideUp 0.35s ease-out forwards;
        }
      `}</style>
      <div className="ios-backdrop-xl mb-6 rounded-3xl border border-white/5 bg-[#08121f]/80 px-6 py-5 shadow-[inset_0_0_90px_rgba(13,18,31,0.14)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/70">Launch slate</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Realtime token overview</h2>
          </div>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-cyan-200">{tokens.length} items</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
        ) : tokens.length > 0 ? (
          tokens.map((token, index) => (
            <div
              key={token.id}
              className="token-card transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
              style={{
                animationDelay: `${index * 40}ms`,
              }}
            >
              <TokenCard
                token={token}
                onClick={() => onTokenClick(token)}
                onWatchlistToggle={onWatchlistToggle}
              />
            </div>
          ))
        ) : null}
      </div>
      {!isLoading && tokens.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <p className="text-lg text-slate-400">🔎 No tokens found</p>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}