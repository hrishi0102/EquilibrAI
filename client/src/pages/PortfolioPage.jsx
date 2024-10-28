import React from "react";
import PortfolioSummary from "../components/portfolio/PortfolioSummary";
import RebalancePanel from "../components/portfolio/RebalancePanel";

const PortfolioPage = () => {
  return (
    <div className="space-y-6">
      <PortfolioSummary />
      <RebalancePanel />
    </div>
  );
};

export default PortfolioPage;
