import { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletStatus = ({ walletAddress, onDisconnect }) => {
  const [balance, setBalance] = useState(null);

  const fetchBalance = async (address) => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const network = await provider.getNetwork();
      console.log("🌐 Connected to network:", network);

      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (error) {
      console.error("❌ Gagal mengambil balance STT:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress]);

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md text-white mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">Wallet:</span>
        <span className="text-sm font-mono">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">Balance:</span>
        <span className="text-sm">
          {balance !== null ? `${balance} STT` : "... STT"}
        </span>
      </div>
      <button
        onClick={onDisconnect}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
      >
        Disconnect
      </button>
    </div>
  );
};

export default WalletStatus;
