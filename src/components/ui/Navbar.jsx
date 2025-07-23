// src/components/ui/Navbar.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [signature, setSignature] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Minta tanda tangan
        const sig = await signer.signMessage("Login to Arena Duel");
        setSignature(sig);
        setWalletAddress(address);
        console.log("Signed in:", address, sig);
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">Arena Duel</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/join-pvp" className="hover:underline">
          Gabung PvP
        </Link>
        <Link to="/pvp" className="hover:underline">
          Arena PvP
        </Link>
        <Link to="/pve" className="hover:underline">
          Arena PvE
        </Link>
        {walletAddress ? (
          <span className="text-green-400">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            Hubungkan Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
