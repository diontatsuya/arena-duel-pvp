import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask to connect wallet.");
    }
  };

  const shortenAddress = (address) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="text-2xl font-bold text-purple-400">
        Arena Duel
      </div>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-purple-300 transition">Home</Link>
        <Link to="/pvp" className="hover:text-purple-300 transition">PVP</Link>
        <Link to="/pve" className="hover:text-purple-300 transition">PVE</Link>

        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
        >
          {isConnected ? shortenAddress(walletAddress) : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
