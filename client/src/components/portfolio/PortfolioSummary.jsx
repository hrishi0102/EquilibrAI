import React from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther, formatUnits } from "viem";
import { SUPPORTED_TOKENS } from "../../config/web3";
import { useTokenPrices } from "../../hooks/useTokenPrices";

const PortfolioSummary = () => {
  const { address } = useAccount();
  const { prices, loading: pricesLoading } = useTokenPrices();

  const { data: maticBalance } = useBalance({
    address,
  });

  const { data: usdcBalance } = useBalance({
    address,
    token: SUPPORTED_TOKENS.USDC.address,
  });

  const { data: wethBalance } = useBalance({
    address,
    token: SUPPORTED_TOKENS.WETH.address,
  });

  if (!address) {
    return (
      <div className="card">
        <p className="text-center text-gray-500">
          Please connect your wallet to view your portfolio
        </p>
      </div>
    );
  }

  if (pricesLoading) {
    return (
      <div className="card">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  const calculateTotalValue = () => {
    let total = 0;

    if (maticBalance && prices.MATIC) {
      total += Number(formatEther(maticBalance.value)) * prices.MATIC.price;
    }

    if (usdcBalance && prices.USDC) {
      total += Number(formatUnits(usdcBalance.value, 6)) * prices.USDC.price;
    }

    if (wethBalance && prices.WETH) {
      total += Number(formatEther(wethBalance.value)) * prices.WETH.price;
    }

    return total;
  };

  const totalValue = calculateTotalValue();

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Portfolio Summary</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-2xl font-bold">
              $
              {totalValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Number of Assets</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>

        <div className="space-y-2">
          {maticBalance && (
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center gap-2">
                <img src="/matic-logo.png" alt="MATIC" className="w-6 h-6" />
                <span>MATIC</span>
              </div>
              <div className="text-right">
                <p>{formatEther(maticBalance.value)} MATIC</p>
                <p className="text-sm text-gray-500">
                  $
                  {(
                    Number(formatEther(maticBalance.value)) *
                    (prices.MATIC?.price || 0)
                  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          {usdcBalance && (
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center gap-2">
                <img src="/usdc-logo.png" alt="USDC" className="w-6 h-6" />
                <span>USDC</span>
              </div>
              <div className="text-right">
                <p>{formatUnits(usdcBalance.value, 6)} USDC</p>
                <p className="text-sm text-gray-500">
                  $
                  {(
                    Number(formatUnits(usdcBalance.value, 6)) *
                    (prices.USDC?.price || 0)
                  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          {wethBalance && (
            <div className="flex justify-between items-center p-2">
              <div className="flex items-center gap-2">
                <img src="/eth-logo.png" alt="WETH" className="w-6 h-6" />
                <span>WETH</span>
              </div>
              <div className="text-right">
                <p>{formatEther(wethBalance.value)} WETH</p>
                <p className="text-sm text-gray-500">
                  $
                  {(
                    Number(formatEther(wethBalance.value)) *
                    (prices.WETH?.price || 0)
                  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
