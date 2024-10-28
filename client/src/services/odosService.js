import axios from "axios";

class OdosService {
  constructor() {
    this.api = axios.create({
      baseURL: "https://api.odos.xyz",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getTokenPrice(tokenAddress) {
    try {
      const response = await this.api.get(`/pricing/token/137/${tokenAddress}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching token price:", error);
      throw error;
    }
  }

  async getQuote(params) {
    try {
      const quoteRequest = {
        chainId: 137, // Polygon
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        userAddr: params.userAddr,
        slippageLimitPercent: 0.3,
        referralCode: 0,
        disableRFQs: true,
        compact: true,
        simple: true, // For faster response
      };

      console.log("Quote request:", quoteRequest);
      const response = await this.api.post("/sor/quote/v2", quoteRequest);
      return response.data;
    } catch (error) {
      console.error("Error getting quote:", error);
      throw error;
    }
  }

  async assembleTransaction(params) {
    try {
      const assemblyRequest = {
        pathId: params.pathId,
        userAddr: params.userAddr,
        simulate: true,
      };

      console.log("Assembly request:", assemblyRequest);
      const response = await this.api.post("/sor/assemble", assemblyRequest);
      return response.data;
    } catch (error) {
      console.error("Error assembling transaction:", error);
      throw error;
    }
  }
}

export const odosService = new OdosService();
