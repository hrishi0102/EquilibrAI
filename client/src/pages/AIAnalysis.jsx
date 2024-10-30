import React, { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther, formatUnits } from "viem";
import { Link } from "react-router-dom";
import { SUPPORTED_TOKENS } from "../config/web3";
import { useTokenPrices } from "../hooks/useTokenPrices";
import AIAdvisor from "../components/AIAdvisor";

const AIAnalysis = () => {
  const { address } = useAccount();
  const { prices, loading: pricesLoading } = useTokenPrices();

  const { data: maticBalance } = useBalance({
    address,
    watch: true,
  });

  const { data: usdcBalance } = useBalance({
    address,
    token: SUPPORTED_TOKENS.USDC.address,
    watch: true,
  });

  const { data: wethBalance } = useBalance({
    address,
    token: SUPPORTED_TOKENS.WETH.address,
    watch: true,
  });

  const calculatePortfolioValues = () => {
    if (!maticBalance) return { total: 0 };

    const maticValue =
      Number(formatEther(maticBalance.value)) * (prices.MATIC?.price || 0);
    const usdcValue = usdcBalance
      ? Number(formatUnits(usdcBalance.value, 6)) * (prices.USDC?.price || 0)
      : 0;
    const wethValue = wethBalance
      ? Number(formatEther(wethBalance.value)) * (prices.WETH?.price || 0)
      : 0;

    const total = maticValue + usdcValue + wethValue;

    if (total === 0) {
      return {
        MATIC: { balance: maticBalance.value, value: 0, percentage: 0 },
        USDC: { balance: usdcBalance?.value || 0, value: 0, percentage: 0 },
        WETH: { balance: wethBalance?.value || 0, value: 0, percentage: 0 },
        total: 0,
      };
    }

    return {
      MATIC: {
        balance: maticBalance.value,
        value: maticValue,
        percentage: (maticValue / total) * 100,
      },
      USDC: {
        balance: usdcBalance?.value || 0,
        value: usdcValue,
        percentage: (usdcValue / total) * 100,
      },
      WETH: {
        balance: wethBalance?.value || 0,
        value: wethValue,
        percentage: (wethValue / total) * 100,
      },
      total,
    };
  };

  const portfolioData = calculatePortfolioValues();

  if (!address) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            AI Portfolio Advisor
          </h2>
          <p className="mt-4 text-gray-600">
            Please connect your wallet to view the AI analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            AI Portfolio Advisor
          </h1>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Back to Portfolio
          </Link>
        </div>

        {/* Portfolio Overview Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Current Portfolio Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(portfolioData).map(([token, data]) => {
              if (token === "total") return null;
              return (
                <div key={token} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{token}</span>
                    <span className="text-gray-500">
                      {data.percentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Value: ${data.value.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Portfolio Value:</span>
              <span className="text-lg font-bold">
                ${portfolioData.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* AI Advisor Component */}
        <AIAdvisor address={address} currentAllocations={portfolioData} />
      </div>
    </div>
  );
};

export default AIAnalysis;
