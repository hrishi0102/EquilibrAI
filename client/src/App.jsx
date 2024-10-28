// App.jsx
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { config } from "./config/web3";
import Header from "./components/Header";
import PortfolioSummary from "./components/portfolio/PortfolioSummary";
import RebalancePanel from "./components/portfolio/RebalancePanel";
import Analtyics from "./pages/Analytics";

const Settings = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p>Settings content will go here</p>
  </div>
);

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
                <Route path="/analytics" element={<Analtyics />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
