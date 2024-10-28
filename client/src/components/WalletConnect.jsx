import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
        <button onClick={() => disconnect()} className="btn btn-outline">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="btn btn-primary"
        >
          Connect Wallet
        </button>
      ))}
    </div>
  );
};

export default WalletConnect;
