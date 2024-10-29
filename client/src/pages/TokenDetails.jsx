import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const TokenDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = import.meta.env.VITE_BLOCKSCOUT_TOKEN_URL;

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const data = {
          q: symbol,
        };

        const response = await axios.post(url, data, config);

        // Get the first item from the response
        setTokenInfo(response.data.items[0]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTokenInfo();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p>Error: {error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/analytics")}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center gap-2"
          >
            ← Back to List
          </button>
        </div>

        {tokenInfo && (
          <>
            {/* Token Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={tokenInfo.icon_url || "/api/placeholder/64/64"}
                  alt={tokenInfo.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {tokenInfo.name}
                  </h1>
                  <p className="text-gray-500">{tokenInfo.symbol}</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Market Cap
                </h3>
                <p className="text-xl font-semibold text-gray-900">
                  $
                  {parseFloat(
                    tokenInfo.circulating_market_cap
                  ).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Exchange Rate
                </h3>
                <p className="text-xl font-semibold text-gray-900">
                  ${parseFloat(tokenInfo.exchange_rate).toFixed(6)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Total Supply
                </h3>
                <p className="text-xl font-semibold text-gray-900">
                  {parseFloat(tokenInfo.total_supply).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Token Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Token Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Contract Address
                  </h3>
                  <p className="text-sm text-gray-900 break-all">
                    {tokenInfo.address}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Token Type
                  </h3>
                  <p className="text-sm text-gray-900">
                    {tokenInfo.token_type}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Contract Verification
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tokenInfo.is_smart_contract_verified
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-sm text-gray-900">
                      {tokenInfo.is_smart_contract_verified
                        ? "Verified"
                        : "Not Verified"}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Certification
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tokenInfo.certified ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></span>
                    <span className="text-sm text-gray-900">
                      {tokenInfo.certified ? "Certified" : "Not Certified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenDetails;
