import React from "react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  trades,
  isLoading,
}) => {
  if (!isOpen) return null;

  const formatUSD = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getTradeDescription = (trade) => {
    if (trade.amount > 0) {
      return `Buy ${formatUSD(trade.amount)} of ${trade.token}`;
    } else {
      return `Sell ${formatUSD(Math.abs(trade.amount))} of ${trade.token}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Rebalance</h3>

        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            The following trades will be executed to rebalance your portfolio:
          </p>

          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            {trades.map((trade, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2"
              >
                <span className="text-sm font-medium">{trade.token}</span>
                <div className="text-right">
                  <span
                    className={
                      trade.amount > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {trade.amount > 0 ? "+" : ""}
                    {formatUSD(trade.amount)}
                  </span>
                  <div className="text-xs text-gray-500">
                    {trade.currentAllocation?.toFixed(1)}% →{" "}
                    {trade.targetAllocation}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Note: Final amounts may vary due to:
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Price changes during execution</li>
                <li>Network slippage (max 1%)</li>
                <li>Gas fees in MATIC</li>
              </ul>
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="btn btn-primary flex-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Confirm Rebalance"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
