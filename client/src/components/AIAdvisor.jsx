import React, { useState, useEffect } from "react";
import { aiAdvisorService } from "../services/AIAdvisorService";

const AIAdvisor = ({ address, currentAllocations }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await aiAdvisorService.getAnalysis(
        currentAllocations,
        address
      );
      setInsights(analysis);
    } catch (error) {
      setError("Failed to get portfolio analysis");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address && currentAllocations.total > 0) {
      getInsights();
      const interval = setInterval(getInsights, 3000000);
      return () => clearInterval(interval);
    }
  }, [address, currentAllocations]);

  if (!address) return null;

  return (
    <div className="mt-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              AI Portfolio Advisor
            </h3>
            <button
              onClick={getInsights}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-700"
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
                  Analyzing...
                </>
              ) : (
                "Refresh Analysis"
              )}
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          {error ? (
            <div className="text-red-600 text-sm">{error}</div>
          ) : insights ? (
            <div className="prose prose-sm max-w-none">
              {insights.split("\n\n").map((section, index) => (
                <div key={index} className="mb-4 bg-gray-50 rounded-lg p-4">
                  {section}
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="text-gray-500 text-sm">
              Analyzing your portfolio...
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
