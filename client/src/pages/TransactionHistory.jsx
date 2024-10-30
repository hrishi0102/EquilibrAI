import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CopyButton from "../components/CopyButton";

const formatTimestamp = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const TransactionHistory = () => {
  const { address } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [txDetails, setTxDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const noves_api = import.meta.env.VITE_NOVES_TRANSLATE_API_KEY;

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      try {
        const options = {
          method: "GET",
          url: `https://translate.noves.fi/evm/eth/history/${address}`,
          headers: {
            accept: "application/json",
            apiKey: noves_api,
          },
        };

        const response = await axios.request(options);
        setTransactions(response.data.items.slice(0, 15));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch transaction history");
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [address]);

  const handleTxClick = async (hash) => {
    setSelectedTx(hash);
    setIsModalOpen(true);
    setModalLoading(true);
    setTxDetails(null);

    try {
      const options = {
        method: "GET",
        url: `https://translate.noves.fi/evm/eth/describeTx/${hash}`,
        headers: {
          accept: "application/json",
          apiKey: noves_api,
        },
      };

      const response = await axios.request(options);
      setTxDetails(response.data);
    } catch (err) {
      console.error("Error fetching transaction details:", err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Transaction History
              </h1>
              <p className="mt-2 text-blue-100">Address: {address}</p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Back to Whale Transactions
            </Link>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Hash
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Block Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx.transactionHash} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleTxClick(tx.transactionHash)}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            {tx.transactionHash.slice(0, 10)}...
                            {tx.transactionHash.slice(-8)}
                          </button>
                          <CopyButton text={tx.transactionHash} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {tx.blockNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {formatTimestamp(tx.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Transaction Hash:</p>
              <p className="text-sm font-mono break-all mb-4">{selectedTx}</p>

              {modalLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : txDetails ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Type:</p>
                    <p className="font-medium">{txDetails.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description:</p>
                    <p className="font-medium">{txDetails.description}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
