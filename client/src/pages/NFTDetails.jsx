import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NFTDetails = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const [nftInfo, setNftInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = import.meta.env.VITE_BLOCKSCOUT_NFT_URL;

  useEffect(() => {
    const fetchNFTInfo = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const data = {
          address_hash: address,
        };

        const response = await axios.post(url, data, config);

        setNftInfo(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNFTInfo();
  }, [address]);

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
            onClick={() => navigate("/analytics")}
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
      <div className="max-w-3xl mx-auto">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 flex items-center gap-2"
          >
            ← Back to List
          </button>
        </div>

        {nftInfo && (
          <>
            {/* NFT Header Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center gap-6">
                <img
                  src={nftInfo.icon_url || "/api/placeholder/100/100"}
                  alt={nftInfo.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {nftInfo.name}
                  </h1>
                  <p className="text-lg text-gray-500 mt-1">{nftInfo.symbol}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {nftInfo.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Total Holders
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {parseInt(nftInfo.holders).toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Contract Address
                </h3>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {nftInfo.address}
                </p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Collection Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Total Supply
                    </h3>
                    <p className="text-gray-900">
                      {nftInfo.total_supply
                        ? parseInt(nftInfo.total_supply).toLocaleString()
                        : "Unlimited"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      24h Volume
                    </h3>
                    <p className="text-gray-900">
                      {nftInfo.volume_24h
                        ? `$${parseFloat(nftInfo.volume_24h).toLocaleString()}`
                        : "No recent volume"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Market Cap
                    </h3>
                    <p className="text-gray-900">
                      {nftInfo.circulating_market_cap
                        ? `$${parseFloat(
                            nftInfo.circulating_market_cap
                          ).toLocaleString()}`
                        : "Not available"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Exchange Rate
                    </h3>
                    <p className="text-gray-900">
                      {nftInfo.exchange_rate
                        ? `$${parseFloat(
                            nftInfo.exchange_rate
                          ).toLocaleString()}`
                        : "Not available"}
                    </p>
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

export default NFTDetails;
