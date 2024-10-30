// App.jsx
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { config } from "./config/web3";
import Header from "./components/Header";
import PortfolioSummary from "./components/portfolio/PortfolioSummary";
import RebalancePanel from "./components/portfolio/RebalancePanel";
import Analtyics from "./pages/Analytics";
import WhaleTransactions from "./pages/WhaleTransactions";
import Translate from "./pages/Translate";
import TokenDetails from "./pages/TokenDetails";
import NFTDetails from "./pages/NFTDetails";
import TransactionHistory from "./pages/TransactionHistory";
import AIAnalysis from "./pages/AIAnalysis";

const PortfolioPage = () => (
  <div className="space-y-6">
    <PortfolioSummary />
    <RebalancePanel />
  </div>
);

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/portfolio" replace />}
                />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/research" element={<Analtyics />} />
                <Route path="/aianalysis" element={<AIAnalysis />} />
                <Route path="/:symbol" element={<TokenDetails />} />
                <Route path="/nft/:address" element={<NFTDetails />} />
                <Route path="/whaletxns" element={<WhaleTransactions />} />
                <Route path="/txn/:address" element={<TransactionHistory />} />
                <Route path="/translate" element={<Translate />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
