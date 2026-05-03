import { TokenLaunch } from '@/types/token';

interface DetailPanelProps {
  token: TokenLaunch | null;
  onClose: () => void;
  onWatchlistToggle?: (tokenId: string) => void;
  className?: string;
}

export default function DetailPanel({ token, onClose, onWatchlistToggle, className }: DetailPanelProps) {
  if (!token) {
    return (
      <div className={`transform transition-transform duration-300 ease-in-out ${className || ''}`} style={{
        transform: 'translateX(100%)',
        width: '28rem',
        overflow: 'hidden',
      }}>
        <div className="h-full w-96" />
      </div>
    );
  }

  const getStatusColor = (status: TokenLaunch['status']) => {
    switch (status) {
      case 'Launched': return 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/20';
      case 'Not Live': return 'bg-amber-600/15 text-amber-300 border border-amber-500/20';
      case 'Needs Review': return 'bg-rose-600/15 text-rose-300 border border-rose-500/20';
      default: return 'bg-slate-700/20 text-slate-300 border border-slate-600/40';
    }
  };

  const getProjectTypeColor = (projectType: TokenLaunch['projectType']) => {
    switch (projectType) {
      case 'Tech': return 'bg-blue-600/15 text-blue-300 border border-blue-500/20';
      case 'AI': return 'bg-violet-600/15 text-violet-300 border border-violet-500/20';
      case 'Infra': return 'bg-cyan-600/15 text-cyan-300 border border-cyan-500/20';
      case 'Meme': return 'bg-pink-600/15 text-pink-300 border border-pink-500/20';
      default: return 'bg-slate-700/20 text-slate-300 border border-slate-600/40';
    }
  };

  const getBundleScoreColor = (score: number) => {
    if (score >= 70) return 'text-rose-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className={`fixed inset-0 z-40 md:relative md:inset-auto md:right-0 md:top-auto md:bottom-auto md:w-96 md:h-full transform transition-all duration-500 ease-out ${className || ''}`} style={{
      transform: token ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
      opacity: token ? 1 : 0,
      pointerEvents: token ? 'auto' : 'none',
    }}>
      {token && <div className="absolute inset-0 bg-black/50 md:hidden z-10" onClick={onClose} />}
      <div className="ios-backdrop-xl ios-scroll relative z-20 h-full w-full overflow-y-auto border-l border-cyan-500/10 bg-[#07111f]/95 p-6 shadow-[0_0_80px_rgba(7,18,33,0.45)] md:w-96 md:border-l">
        <div className="w-full rounded-[32px] border border-cyan-500/15 bg-[#081520]/90 p-6 shadow-[0_20px_60px_-28px_rgba(34,211,238,0.4)] transition-all duration-300 hover:border-cyan-400/30">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-sky-300 bg-clip-text">Token Details</h2>
              <p className="text-sm text-slate-500">Deeper signal analysis and metadata.</p>
            </div>
            <div className="flex items-center gap-3">
              {onWatchlistToggle && (
                <button
                  onClick={() => onWatchlistToggle(token.id)}
                  className={`rounded-full p-1 transition-all duration-300 hover:scale-110 ${
                    token.isWatchlist
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/70 hover:text-slate-300'
                  }`}
                  title={token.isWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  <span className="text-sm">👁️</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 text-xl font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-3xl font-bold text-white">{token.name}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-400">${token.ticker}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 animation-delay-100">
              <span
                className={`animated-badge rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${getStatusColor(token.status)}`}
              >
                {token.status}
              </span>

              <span
                className={`animated-badge rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-300 ${getProjectTypeColor(token.projectType)}`}
              >
                {token.projectType}
              </span>

              {token.isImportant && (
                <span className="animated-badge rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300 transition-all duration-300 hover:border-orange-400/30 hover:bg-orange-500/15">
                  ⭐ Important
                </span>
              )}

              {token.isWatchlist && (
                <span className="animated-badge rounded-full border border-slate-600/30 bg-slate-800/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-300 transition-all duration-300 hover:border-slate-400/40 hover:bg-slate-800/70">
                  👁️ Watched
                </span>
              )}
            </div>

            <div className="space-y-4 text-sm animate-in fade-in slide-in-from-bottom-4 duration-500 animation-delay-200">
              <div className="rounded-3xl border border-slate-700/50 bg-white/5 p-4 transition-colors duration-300 hover:bg-white/10">
                <div className="flex justify-between gap-4 text-slate-400">
                  <span>Contract Address</span>
                  <span className="font-mono text-xs text-slate-200 break-all">{token.contractAddress}</span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-700/50 bg-white/5 p-4 transition-colors duration-300 hover:bg-white/10">
                <div className="flex justify-between gap-4 text-slate-400">
                  <span>Source Account</span>
                  <span className="text-slate-200">{token.sourceAccount}</span>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-700/50 bg-white/5 p-4 transition-colors duration-300 hover:bg-white/10">
                  <span className="block text-slate-400">Bundle Score</span>
                  <span className={`mt-2 block text-lg font-semibold ${getBundleScoreColor(token.bundleScore)}`}>{token.bundleScore}/100</span>
                </div>
                <div className="rounded-3xl border border-slate-700/50 bg-white/5 p-4 transition-colors duration-300 hover:bg-white/10">
                  <span className="block text-slate-400">Timestamp</span>
                  <span className="mt-2 block text-sm text-slate-200">{token.timestamp.toLocaleString()}</span>
                </div>
              </div>

              {token.description && (
                <div className="rounded-3xl border border-slate-700/50 bg-white/5 p-4 transition-colors duration-300 hover:bg-white/10">
                  <span className="block text-slate-400 font-semibold mb-2">Description</span>
                  <p className="text-slate-200 leading-relaxed">{token.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

