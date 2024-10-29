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
                          <span className="text-blue-600 font-medium">
                            {tx.transactionHash.slice(0, 10)}...
                            {tx.transactionHash.slice(-8)}
                          </span>
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
    </div>
  );
};

export default TransactionHistory;
