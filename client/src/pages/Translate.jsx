import React, { useState } from "react";
import axios from "axios";

const TransactionTranslator = () => {
  const [txHash, setTxHash] = useState("");
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const api_key = import.meta.env.VITE_NOVES_TRANSLATE_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTranslation(null);

    try {
      const options = {
        method: "GET",
        url: `https://translate.noves.fi/evm/eth/describeTx/${txHash}`,
        headers: {
          accept: "application/json",
          apiKey: api_key,
        },
      };

      const response = await axios.request(options);
      setTranslation(response.data);
    } catch (err) {
      setError(err.message || "Failed to translate transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white">
              Transaction Translator
            </h2>
            <p className="text-blue-100 mt-2">
              Enter a transaction hash to get a human-readable description
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="0x1234..."
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    placeholder-gray-400 font-mono text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !txHash}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-colors
                    ${
                      loading || !txHash
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>Translating...</span>
                    </div>
                  ) : (
                    "Translate"
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {translation && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transaction Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Type</div>
                    <div className="text-lg font-medium text-gray-900 capitalize">
                      {translation.type}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <div className="text-sm text-blue-600 mb-1">
                      Description
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      {translation.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTranslator;
