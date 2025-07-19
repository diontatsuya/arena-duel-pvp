import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const Home = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected connection", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Arena Duel PvP</h1>
        <div>
          {isConnected ? (
            <div className="text-sm text-green-400">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <p className="text-lg mb-6 text-center">
        Selamat datang di Arena Duel PvP! Pilih mode permainan:
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/arena-pvp"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white"
        >
          PvP Mode
        </Link>
        <Link
          to="/arena-pve"
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white"
        >
          PvE Mode
        </Link>
      </div>
    </div>
  );
};

export default Home;
