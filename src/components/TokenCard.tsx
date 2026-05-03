import { TokenLaunch } from '@/types/token';

interface TokenCardProps {
  token: TokenLaunch;
  onClick: () => void;
  onWatchlistToggle: (tokenId: string) => void;
}

export default function TokenCard({ token, onClick, onWatchlistToggle }: TokenCardProps) {
  const getStatusColor = (status: TokenLaunch['status']) => {
    switch (status) {
      case 'Launched':
        return 'bg-green-600/20 text-green-400 border border-green-500/30';
      case 'Not Live':
        return 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30';
      case 'Needs Review':
        return 'bg-red-600/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  const getImportanceColor = (importance: TokenLaunch['importance']) => {
    switch (importance) {
      case 'High':
        return 'text-red-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getProjectTypeColor = (projectType: TokenLaunch['projectType']) => {
    switch (projectType) {
      case 'Tech':
        return 'bg-blue-600/20 text-blue-400 border border-blue-500/30';
      case 'AI':
        return 'bg-purple-600/20 text-purple-400 border border-purple-500/30';
      case 'Infra':
        return 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30';
      case 'Meme':
        return 'bg-pink-600/20 text-pink-400 border border-pink-500/30';
      default:
        return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  const getBundleScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProjectTypeTheme = (projectType: TokenLaunch['projectType']) => {
    switch (projectType) {
      case 'Tech':
        return {
          background: 'bg-gradient-to-br from-blue-500/10 via-slate-900/80 to-cyan-500/5',
          border: 'border-blue-500/20',
          shadow: 'shadow-[0_20px_80px_-44px_rgba(59,130,246,0.4)]',
          hoverShadow: 'hover:shadow-[0_24px_90px_-30px_rgba(59,130,246,0.5)]',
          overlay: 'from-blue-500/8 via-transparent to-cyan-500/3',
          logoBorder: 'border-blue-500/30',
          logoGlow: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]'
        };
      case 'AI':
        return {
          background: 'bg-gradient-to-br from-purple-500/10 via-slate-900/80 to-violet-500/5',
          border: 'border-purple-500/20',
          shadow: 'shadow-[0_20px_80px_-44px_rgba(147,51,234,0.4)]',
          hoverShadow: 'hover:shadow-[0_24px_90px_-30px_rgba(147,51,234,0.5)]',
          overlay: 'from-purple-500/8 via-transparent to-violet-500/3',
          logoBorder: 'border-purple-500/30',
          logoGlow: 'shadow-[0_0_10px_rgba(147,51,234,0.3)]'
        };
      case 'Infra':
        return {
          background: 'bg-gradient-to-br from-cyan-500/10 via-slate-900/80 to-teal-500/5',
          border: 'border-cyan-500/20',
          shadow: 'shadow-[0_20px_80px_-44px_rgba(34,211,238,0.4)]',
          hoverShadow: 'hover:shadow-[0_24px_90px_-30px_rgba(34,211,238,0.5)]',
          overlay: 'from-cyan-500/8 via-transparent to-teal-500/3',
          logoBorder: 'border-cyan-500/30',
          logoGlow: 'shadow-[0_0_10px_rgba(34,211,238,0.3)]'
        };
      case 'Meme':
        return {
          background: 'bg-gradient-to-br from-pink-500/10 via-slate-900/80 to-rose-500/5',
          border: 'border-pink-500/20',
          shadow: 'shadow-[0_20px_80px_-44px_rgba(236,72,153,0.4)]',
          hoverShadow: 'hover:shadow-[0_24px_90px_-30px_rgba(236,72,153,0.5)]',
          overlay: 'from-pink-500/8 via-transparent to-rose-500/3',
          logoBorder: 'border-pink-500/30',
          logoGlow: 'shadow-[0_0_10px_rgba(236,72,153,0.3)]'
        };
      default:
        return {
          background: 'bg-[#081420]/90',
          border: 'border-cyan-500/15',
          shadow: 'shadow-[0_20px_80px_-44px_rgba(34,211,238,0.8)]',
          hoverShadow: 'hover:shadow-[0_24px_90px_-30px_rgba(34,211,238,0.3)]',
          overlay: 'from-cyan-500/5 via-transparent to-blue-500/5',
          logoBorder: 'border-cyan-500/20',
          logoGlow: 'shadow-[0_0_10px_rgba(34,211,238,0.2)]'
        };
    }
  };

  const theme = getProjectTypeTheme(token.projectType);

  return (
    <div
      onClick={onClick}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-[22px] ${theme.border} ${theme.background} p-3 text-left ${theme.shadow} transition-all duration-300 hover:border-cyan-400/40 hover:bg-slate-950/95 ${theme.hoverShadow} active:scale-[0.99]`}
    >
      <div className={`absolute inset-0 rounded-[22px] bg-gradient-to-br ${theme.overlay} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-3">
            {token.logo && (
              <div
                className="relative w-8 h-8 rounded-full border-2 transition-all duration-300 group-hover:scale-105"
                style={{
                  borderColor: token.logoColor || '#06b6d4',
                  boxShadow: token.logoColor
                    ? `0 0 10px ${token.logoColor}40`
                    : '0 0 10px rgba(34, 211, 238, 0.2)'
                }}
              >
                <img
                  src={token.logo}
                  alt={`${token.name} logo`}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    // Hide broken images
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-cyan-200">{token.name}</h3>
              <p className="text-sm text-slate-400 transition-colors duration-300 group-hover:text-slate-200">${token.ticker}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onWatchlistToggle(token.id);
              }}
              className={`rounded-full p-1 transition-all duration-300 hover:scale-110 ${
                token.isWatchlist
                  ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                  : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/70 hover:text-slate-300'
              }`}
              title={token.isWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <span className="text-sm">👁️</span>
            </button>

            <span
              className={`animated-badge rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.19em] transition-colors duration-300 ${getStatusColor(
                token.status
              )}`}
            >
              {token.status}
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`animated-badge rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${getProjectTypeColor(
              token.projectType
            )}`}
          >
            {token.projectType}
          </span>

          {token.isImportant && (
            <span className="animated-badge rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-300 transition-all duration-300 group-hover:border-orange-400/40 group-hover:bg-orange-500/15">
              ⭐ Important
            </span>
          )}
        </div>

        <div className="grid gap-2.5 text-sm text-slate-400">
          <div className="flex items-center justify-between gap-2.5 rounded-xl bg-white/3 px-1.5 py-1.5 transition-colors duration-300 group-hover:bg-white/5">
            <span className="text-slate-400">Contract</span>
            <span className="font-mono text-xs text-slate-200">{token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}</span>
          </div>

          <div className="flex items-center justify-between gap-2.5 rounded-xl bg-white/3 px-1.5 py-1.5 transition-colors duration-300 group-hover:bg-white/5">
            <span className="text-slate-400">Source</span>
            <span className="truncate text-slate-200">{token.sourceAccount}</span>
          </div>

          <div className="flex items-center justify-between gap-2.5 rounded-xl bg-white/3 px-1.5 py-1.5 transition-colors duration-300 group-hover:bg-white/5">
            <span className="text-slate-400">Importance</span>
            <span className={getImportanceColor(token.importance)}>{token.importance}</span>
          </div>

          <div className="flex items-center justify-between gap-2.5 rounded-xl bg-white/3 px-1.5 py-1.5 transition-colors duration-300 group-hover:bg-white/5">
            <span className="text-slate-400">Bundle Score</span>
            <span className={`font-semibold ${getBundleScoreColor(token.bundleScore)}`}>{token.bundleScore}/100</span>
          </div>

          <div className="flex items-center justify-between gap-2.5 rounded-xl bg-white/3 px-1.5 py-1.5 transition-colors duration-300 group-hover:bg-white/5">
            <span className="text-slate-400">Time</span>
            <span className="text-xs text-slate-300">{token.timestamp.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
