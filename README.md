# Launch Agent

A beginner-friendly crypto launch tracking dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Overview

Launch Agent monitors crypto launch-related posts and signals, displaying launch candidates in a modern dashboard interface. The app classifies items as Launched, Not Live, Risky, Tech, or Important.

## Features

- **Dashboard UI**: Clean, dark, modern crypto intelligence dashboard
- **Token Cards**: Display token name, ticker, contract address, source account, status, importance tag, bundle score, and timestamp
- **Filtering**: Filter by category (Important, Tech Launches, Launched, Not Live, Bundle Risk, Watchlist)
- **Search**: Search tokens by name, ticker, contract address, or source account
- **Detail Panel**: Click on tokens to view detailed information
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React** components

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sentralaboratories/launch-agent.git
cd launch-agent
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main dashboard page
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── SearchBar.tsx   # Search input component
│   ├── TokenCard.tsx   # Individual token card
│   ├── TokenGrid.tsx   # Grid layout for tokens
│   └── DetailPanel.tsx # Token detail panel
├── data/               # Mock data
│   └── mockData.ts     # Sample token data
└── types/              # TypeScript type definitions
    └── token.ts        # TokenLaunch interface
```

## Current Stage

This is an MVP with mock data. Future roadmap includes:

1. ✅ Build dashboard UI with mock data
2. ✅ Split into reusable components
3. ✅ Add local filtering/search
4. ✅ Add detail panel
5. 🔄 Connect real APIs for launch verification and analysis
6. 🔄 Add X/Twitter integration
7. 🔄 Add DEX Screener integration
8. 🔄 Add Solscan integration

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- Keep code simple and beginner-friendly
- Use clear, descriptive names
- Prefer small, reusable components
- Avoid unnecessary libraries
- Focus on readability over cleverness

## Contributing

This is a beginner-friendly project. Contributions are welcome! Please keep implementations approachable and well-documented.
