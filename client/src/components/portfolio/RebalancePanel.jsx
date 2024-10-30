import React, { useState } from "react";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import { formatEther, formatUnits, parseUnits } from "viem";
import { SUPPORTED_TOKENS } from "../../config/web3";
import { useTokenPrices } from "../../hooks/useTokenPrices";
import { odosService } from "../../services/odosService";
import AllocationSlider from "./AllocationSlider";
import ConfirmationModal from "../shared/ConfirmationModal";
import AIAdvisor from "../AIAdvisor";
import Toast from "../shared/Toast";
import Web3 from "web3";

const ODOS_ROUTER = "0x4E3288c9ca110bCC82bf38F09A7b425c095d92Bf";
const MIN_TRADE_AMOUNT = 1; // $5 minimum

const RebalancePanel = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContract } = useWriteContract();
  const { prices, loading: pricesLoading } = useTokenPrices();

  const [targetAllocations, setTargetAllocations] = useState({
    MATIC: 50,
    USDC: 30,
    WETH: 20,
  });

  const [isRebalancing, setIsRebalancing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTrades, setPendingTrades] = useState([]);
  const [toast, setToast] = useState(null);

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const calculateCurrentAllocations = () => {
    if (!maticBalance) return { MATIC: 0, USDC: 0, WETH: 0, total: 0 };

    const maticValue =
      Number(formatEther(maticBalance.value)) * (prices.MATIC?.price || 0);
    const usdcValue = usdcBalance
      ? Number(formatUnits(usdcBalance.value, 6)) * (prices.USDC?.price || 0)
      : 0;
    const wethValue = wethBalance
      ? Number(formatEther(wethBalance.value)) * (prices.WETH?.price || 0)
      : 0;

    const total = maticValue + usdcValue + wethValue;

    if (total === 0) return { MATIC: 0, USDC: 0, WETH: 0, total: 0 };

    return {
      MATIC: (maticValue / total) * 100,
      USDC: (usdcValue / total) * 100,
      WETH: (wethValue / total) * 100,
      total,
    };
  };

  const currentAllocations = calculateCurrentAllocations();

  const handleAllocationChange = (token, value) => {
    const remaining = 100 - value;
    const otherTokens = Object.keys(targetAllocations).filter(
      (t) => t !== token
    );
    const currentTotal = otherTokens.reduce(
      (acc, t) => acc + targetAllocations[t],
      0
    );

    const newAllocations = { ...targetAllocations, [token]: value };

    if (currentTotal > 0) {
      otherTokens.forEach((t) => {
        newAllocations[t] = Math.round(
          (targetAllocations[t] / currentTotal) * remaining
        );
      });
    }

    setTargetAllocations(newAllocations);
  };

  const calculateRebalanceNeeded = () => {
    if (currentAllocations.total === 0) return false;

    return Object.keys(targetAllocations).some((token) => {
      const diff = Math.abs(
        targetAllocations[token] - currentAllocations[token]
      );
      return diff > 1; // 1% threshold
    });
  };

  const handleRebalance = () => {
    const trades = [];
    Object.keys(targetAllocations).forEach((token) => {
      const targetValue =
        (targetAllocations[token] / 100) * currentAllocations.total;
      const currentValue =
        (currentAllocations[token] / 100) * currentAllocations.total;
      const diff = targetValue - currentValue;

      if (Math.abs(diff) > MIN_TRADE_AMOUNT) {
        trades.push({
          token,
          amount: diff,
          currentAllocation: currentAllocations[token],
          targetAllocation: targetAllocations[token],
        });
      }
    });

    setPendingTrades(trades);
    setIsModalOpen(true);
  };

  const executeRebalance = async () => {
    if (!address) {
      showToast("Please connect your wallet", "error");
      return;
    }

    setIsRebalancing(true);
    try {
      const sellTrades = pendingTrades.filter((t) => t.amount < 0);
      const buyTrades = pendingTrades.filter((t) => t.amount > 0);

      // Format input tokens
      const inputTokens = sellTrades.map((trade) => {
        const token = SUPPORTED_TOKENS[trade.token];
        const amount = Math.abs(trade.amount);
        return {
          tokenAddress: token.address,
          amount: parseUnits(
            amount.toFixed(token.decimals),
            token.decimals
          ).toString(),
        };
      });

      // Calculate proportions for output tokens
      const totalBuyAmount = buyTrades.reduce(
        (sum, trade) => sum + Math.abs(trade.amount),
        0
      );
      const outputTokens = buyTrades.map((trade) => ({
        tokenAddress: SUPPORTED_TOKENS[trade.token].address,
        proportion: Math.abs(trade.amount) / totalBuyAmount,
      }));

      // Get quote
      const quoteResponse = await odosService.getQuote({
        chainId: 137,
        inputTokens,
        outputTokens,
        userAddr: address,
      });

      // Get transaction details
      const assemblyResponse = await odosService.assembleTransaction({
        pathId: quoteResponse.pathId,
        userAddr: address,
      });

      const { transaction } = assemblyResponse;

      // Initialize Web3
      const web3 = new Web3(window.ethereum);

      // Send transaction
      const txData = {
        from: address,
        to: transaction.to,
        data: transaction.data,
        gasLimit: web3.utils.toHex(500000), // Set a fixed gas limit
      };

      // If sending MATIC, include value
      if (transaction.value && transaction.value !== "0") {
        txData.value = web3.utils.toHex(transaction.value);
      }

      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Send transaction - this will trigger MetaMask
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [txData],
      });

      showToast("Transaction submitted!", "success");
      console.log("Transaction hash:", txHash);
    } catch (error) {
      console.error("Rebalancing error:", error);
      showToast("Failed to execute rebalance", "error");
    } finally {
      setIsRebalancing(false);
    }
  };

  if (!address || pricesLoading) {
    return null;
  }

  return (
    <>
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Rebalancing</h2>
        <div className="space-y-6">
          <div className="grid gap-6">
            {Object.keys(targetAllocations).map((token) => (
              <AllocationSlider
                key={token}
                token={token}
                allocation={targetAllocations[token]}
                onChange={(value) => handleAllocationChange(token, value)}
                maxAllocation={100}
              />
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">
              Current vs Target Allocations
            </h3>
            <div className="space-y-2">
              {Object.keys(targetAllocations).map((token) => (
                <div key={token} className="flex justify-between text-sm">
                  <span>{token}</span>
                  <span>
                    {currentAllocations[token]?.toFixed(1) || "0"}% →{" "}
                    {targetAllocations[token]}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleRebalance}
            disabled={!calculateRebalanceNeeded() || isRebalancing}
            className={`btn btn-primary w-full ${
              !calculateRebalanceNeeded() || isRebalancing
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isRebalancing ? "Processing..." : "Rebalance Portfolio"}
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsRebalancing(false);
        }}
        onConfirm={executeRebalance}
        trades={pendingTrades}
        isLoading={isRebalancing}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default RebalancePanel;
