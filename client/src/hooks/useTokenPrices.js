import { useState, useEffect } from "react";
import { odosService } from "../services/odosService";
import { SUPPORTED_TOKENS } from "../config/web3";

export const useTokenPrices = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const priceData = {};
        await Promise.all(
          Object.values(SUPPORTED_TOKENS).map(async (token) => {
            const price = await odosService.getTokenPrice(token.address);
            priceData[token.symbol] = price;
          })
        );
        setPrices(priceData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching token prices:", err);
        // Set mock prices for testing on Sepolia
        setPrices({
          ETH: { price: 2000 },
          USDC: { price: 1 },
          WBTC: { price: 40000 },
        });
        setError(err);
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error };
};
