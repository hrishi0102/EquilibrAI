import { createConfig, http } from "wagmi";
import { polygon } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [polygon],
  connectors: [injected()],
  transports: {
    [polygon.id]: http(),
  },
});

// Polygon (MATIC) mainnet token configurations
export const SUPPORTED_TOKENS = {
  MATIC: {
    symbol: "MATIC",
    name: "Matic",
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC address for swaps
    decimals: 18,
    logoURI: "/matic-logo.png",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359", // Polygon USDC
    decimals: 6,
    logoURI: "/usdc-logo.png",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Polygon WETH
    decimals: 18,
    logoURI: "/eth-logo.png",
  },
};

export const CHAIN_ID = 137; // Polygon Mainnet
