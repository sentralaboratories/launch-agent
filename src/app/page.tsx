'use client';

import { useState, useMemo } from 'react';
import Sidebar, { SidebarCategory } from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import TokenGrid from '@/components/TokenGrid';
import DetailPanel from '@/components/DetailPanel';
import LandingPage from '@/components/LandingPage';
import { mockTokens } from '@/data/mockData';
import { TokenLaunch } from '@/types/token';

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SidebarCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToken, setSelectedToken] = useState<TokenLaunch | null>(null);
  const [tokens, setTokens] = useState<TokenLaunch[]>(mockTokens);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Important' && token.isImportant) ||
        (selectedCategory === 'Tech Launches' &&
          ['Tech', 'AI', 'Infra'].includes(token.projectType)) ||
        (selectedCategory === 'Launched' && token.status === 'Launched') ||
        (selectedCategory === 'Not Live' && token.status === 'Not Live') ||
        (selectedCategory === 'Bundle Risk' && token.bundleScore >= 70) ||
        (selectedCategory === 'Watchlist' && token.isWatchlist);

      const query = searchTerm.toLowerCase();

      const matchesSearch =
        token.name.toLowerCase().includes(query) ||
        token.ticker.toLowerCase().includes(query) ||
        token.contractAddress.toLowerCase().includes(query) ||
        token.sourceAccount.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, tokens]);

  const handleTokenClick = (token: TokenLaunch) => {
    setSelectedToken(token);
  };

  const handleCloseDetail = () => {
    setSelectedToken(null);
  };

  const handleWatchlistToggle = (tokenId: string) => {
    setTokens(prevTokens =>
      prevTokens.map(token =>
        token.id === tokenId
          ? { ...token, isWatchlist: !token.isWatchlist }
          : token
      )
    );
  };

  // Show landing page if not entered yet
  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="viewport-shell relative bg-[#02050f] text-white">
      <div className="relative z-10 flex h-full flex-col">
        <header className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden self-start rounded-full p-2 text-white hover:bg-white/10 transition-colors"
          >
            ☰
          </button>
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200 shadow-sm shadow-cyan-500/10">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.6)]"></span>
              Live intelligence terminal
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-sky-400 bg-clip-text md:text-4xl">
                Sentra Labs Launch Console
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Real-time token launch visibility, signal monitoring, and portfolio insights in a unified cyber-lab interface.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-blue-500/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.24em] text-blue-200 shadow-sm shadow-blue-500/10">
              Network online
            </div>
            <div className="rounded-2xl border border-cyan-500/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.24em] text-cyan-200 shadow-sm shadow-cyan-500/10">
              Active watchers 42
            </div>
            <div className="rounded-2xl border border-violet-500/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.24em] text-violet-200 shadow-sm shadow-violet-500/10">
              Signal health stable
            </div>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 overflow-hidden">
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-20 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setSidebarOpen(false);
            }}
            className={`${sidebarOpen ? 'fixed inset-y-0 left-0 z-30' : 'hidden'} md:block md:relative md:z-auto md:inset-auto`}
          />

          <main className="flex flex-1 flex-col overflow-hidden">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <div className="flex flex-1 overflow-hidden">
              <TokenGrid
                tokens={filteredTokens}
                onTokenClick={handleTokenClick}
                onWatchlistToggle={handleWatchlistToggle}
                isLoading={false}
                className={selectedToken ? 'hidden md:flex' : 'flex'}
              />
              <DetailPanel
                token={selectedToken}
                onClose={handleCloseDetail}
                onWatchlistToggle={handleWatchlistToggle}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}