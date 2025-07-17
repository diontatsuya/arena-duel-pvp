import React, { useEffect, useState } from "react";
import { connectWallet } from "../utils/connectWallet";

const Header = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const handleConnect = async () => {
    const result = await connectWallet();
    if (result) {
      setWalletAddress(result.address);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(""); // manual disconnect
  };

  const truncate = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setWalletAddress(window.ethereum.selectedAddress);
    }
  }, []);

  return (
    <header className="w-full px-4 py-3 bg-gray-900 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Arena Duel</h1>
      {walletAddress ? (
        <div className="flex items-center gap-3">
          <span className="text-sm bg-gray-700 px-3 py-1 rounded">
            {truncate(walletAddress)}
          </span>
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Connect Wallet
        </button>
      )}
    </header>
  );
};

export default Header;
