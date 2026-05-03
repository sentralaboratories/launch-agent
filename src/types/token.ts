export interface TokenLaunch {
  id: string;
  name: string;
  ticker: string;
  logo?: string; // URL to token logo
  logoColor?: string; // Hex color code for logo theme (e.g., '#f7931a' for Bitcoin orange)
  contractAddress: string;
  sourceAccount: string;
  status: 'Launched' | 'Not Live' | 'Needs Review' | string;
  projectType: 'Tech' | 'AI' | 'Infra' | 'Meme' | 'Unknown' | string;
  importance: 'High' | 'Medium' | 'Low';
  bundleScore: number; // 0-100
  isImportant: boolean;
  isWatchlist: boolean;
  timestamp: Date;
  description?: string;
}