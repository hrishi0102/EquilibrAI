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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Transaction Translator
            </h2>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter transaction hash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading || !txHash}
                  className={`min-w-[100px] px-4 py-2 rounded-md text-white font-medium
                    ${
                      loading || !txHash
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    "Translate"
                  )}
                </button>
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {/* Translation Result */}
            {translation && (
              <div className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    Translation Result
                  </h3>
                  <pre className="whitespace-pre-wrap overflow-x-auto bg-white p-4 rounded-md border border-gray-200 text-sm text-gray-800">
                    {JSON.stringify(translation, null, 2)}
                  </pre>
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
