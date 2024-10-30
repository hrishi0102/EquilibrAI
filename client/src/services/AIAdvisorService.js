import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const QUICKNODE_ENDPOINT = import.meta.env.VITE_QUICKNODE_ENDPOINT;
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

class AIAdvisorService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  formatPortfolioData(portfolio) {
    const formatted = {};
    for (const [token, data] of Object.entries(portfolio)) {
      if (token === "total") {
        formatted[token] = Number(data);
        continue;
      }
      formatted[token] = {
        balance: String(data.balance),
        value: Number(data.value),
        percentage: Number(data.percentage),
      };
    }
    return formatted;
  }

  async getMarketData() {
    const tokenSymbols = [
      { symbol_id: "KRAKEN_SPOT_MATIC_USD" },
      { symbol_id: "KRAKEN_SPOT_ETH_USD" },
      { symbol_id: "KRAKEN_SPOT_USDC_USD" },
    ];

    try {
      const priceData = {};

      for (const symbol of tokenSymbols) {
        const data = {
          jsonrpc: "2.0",
          id: 1,
          method: "v1/getCurrentQuotes",
          params: [symbol],
        };

        const response = await axios.post(QUICKNODE_ENDPOINT, data, {
          headers: { "Content-Type": "application/json" },
        });

        const tokenSymbol = symbol.symbol_id.split("_")[2];
        priceData[tokenSymbol] = response.data.result;
      }

      return priceData;
    } catch (error) {
      console.error("Market Data Error:", error);
      throw error;
    }
  }

  async getAnalysis(portfolio) {
    try {
      const formattedPortfolio = this.formatPortfolioData(portfolio);
      const marketData = await this.getMarketData();

      const prompt = `
        Analyze this DeFi portfolio with live market data:
        Portfolio: ${JSON.stringify(formattedPortfolio)}
        Current Market Prices: ${JSON.stringify(marketData)}
        
        Provide:
        1. Portfolio Health Score (0-100)
        2. Risk Analysis based on current market conditions
        3. Market Opportunities considering current prices
        4. Rebalancing Recommendations with price justification
        5. Gas-Efficient Strategy for suggested trades
      `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Analysis Error:", error);
      throw error;
    }
  }
}

export const aiAdvisorService = new AIAdvisorService();
