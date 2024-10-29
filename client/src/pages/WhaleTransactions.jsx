import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`ml-2 p-1 rounded-md transition-colors ${
        copied
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
        </svg>
      )}
    </button>
  );
};

const WhaleTransactions = () => {
  const [minTxSize, setMinTxSize] = useState(5);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const quicknode_url = import.meta.env.VITE_QUICKNODE_FUNCTION_URL;
  const quicknode_api = import.meta.env.VITE_QUICKNODE_FUNCTION_API_KEY;

  const fetchWhaleTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(quicknode_url, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": quicknode_api,
        },
        body: JSON.stringify({
          network: "ethereum-mainnet",
          dataset: "block",
          user_data: {
            minTxSize: parseFloat(minTxSize),
          },
        }),
      });

      const data = await response.json();
      if (data.execution?.result) {
        setTransactionData(data.execution.result);
      } else {
        throw new Error("Invalid response format");
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch whale transactions. Please try again.");
      setLoading(false);
    }
  };

  const handleAddressClick = (address) => {
    navigate(`/txn/${address}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <h1 className="text-2xl font-bold text-white">
            Ethereum Whale Transaction Tracker
          </h1>
          <p className="mt-2 text-blue-100">
            Monitor large-value Ethereum transactions in real-time
          </p>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Transaction Size (ETH)
              </label>
              <input
                type="number"
                value={minTxSize}
                onChange={(e) => setMinTxSize(e.target.value)}
                placeholder="Enter minimum ETH amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={fetchWhaleTransactions}
              disabled={loading}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } transition-colors w-full sm:w-auto mt-4 sm:mt-6`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Fetch Transactions"
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {loading && !error && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {transactionData && !loading && (
            <div>
              <div className="mb-6 bg-blue-50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Block #{transactionData.block}
                    </h3>
                    <p className="text-gray-600">{transactionData.result}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Network: {transactionData.network}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Hash
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value (ETH)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactionData.transactions_clean.map((tx) => (
                      <tr
                        key={tx.hash}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-blue-600 font-medium">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </span>
                            <CopyButton text={tx.hash} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleAddressClick(tx.from)}
                              className="text-gray-500 hover:text-blue-600 hover:underline"
                            >
                              {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                            </button>
                            <CopyButton text={tx.from} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleAddressClick(tx.to)}
                              className="text-gray-500 hover:text-blue-600 hover:underline"
                            >
                              {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                            </button>
                            <CopyButton text={tx.to} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-900">
                          {parseFloat(tx.value).toFixed(4)} {tx.units}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhaleTransactions;
