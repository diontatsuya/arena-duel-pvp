import { useEffect, useState } from "react";
import { ethers } from "ethers";

const WalletStatus = ({ onConnected }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          if (onConnected) onConnected(accounts[0]);
        }
      }
    };
    checkWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          if (onConnected) onConnected(accounts[0]);
        }
      } catch (err) {
        console.error("Wallet connection failed", err);
      }
    } else {
      alert("No Ethereum provider found. Install MetaMask or use Web3 browser.");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {walletAddress ? (
        <span className="bg-green-800 px-3 py-1 rounded">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </span>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletStatus;
