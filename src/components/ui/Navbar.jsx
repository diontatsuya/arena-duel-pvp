import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

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
      alert("MetaMask tidak ditemukan!");
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address);
          setIsConnected(true);
        }
      }
    };
    checkConnection();
  }, []);

  const truncateAddress = (address) => {
    return address
      ? `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
      : "";
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-xl font-bold">Arena Duel</div>
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>
        <Link to="/pvp" className="text-white hover:underline">
          Arena PvP
        </Link>
        <Link to="/pve" className="text-white hover:underline">
          Arena PvE
        </Link>
        {isConnected ? (
          <div className="text-green-400 font-mono">
            {truncateAddress(walletAddress)}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Hubungkan Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
