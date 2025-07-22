import { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletStatus = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(address);
      } catch (error) {
        console.error("User denied wallet connection");
      }
    } else {
      alert("MetaMask tidak terdeteksi!");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance(null);
  };

  const fetchBalance = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4)); // hanya 4 angka desimal
    } catch (error) {
      console.error("Gagal mengambil balance:", error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress]);

  const shortenAddress = (addr) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  return (
    <div className="p-4 bg-gray-800 rounded-xl shadow-md flex items-center justify-between">
      {walletAddress ? (
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm">Wallet: <span className="font-mono">{shortenAddress(walletAddress)}</span></p>
            <p className="text-sm">Balance: <span className="font-bold">{balance ?? "..."}</span> STT</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletStatus;
