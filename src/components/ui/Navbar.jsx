import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const message = "Sign in to Arena Duel PvP";
        await signer.signMessage(message); // Signature to authenticate
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("MetaMask tidak ditemukan!");
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };
    checkWallet();
  }, []);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-lg font-bold">Arena Duel</div>
      <div className="flex gap-4">
        <Link to="/" className="text-white hover:underline">
          Home
        </Link>
        <Link to="/arena-pvp" className="text-white hover:underline">
          Arena PvP
        </Link>
        <Link to="/arena-pve" className="text-white hover:underline">
          Arena PvE
        </Link>
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {walletAddress
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
