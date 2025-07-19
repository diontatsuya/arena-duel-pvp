import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);

        // Minta signature setelah connect
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const message = "Sign to enter Arena Duel!";
        await signer.signMessage(message);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("Please install MetaMask to connect your wallet.");
    }
  };

  const truncate = (addr) => addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 shadow-md">
      <div className="text-xl font-bold text-white">
        <Link to="/">Arena Duel</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link to="/pvp" className="hover:underline">
          PVP
        </Link>
        <Link to="/pve" className="hover:underline">
          PVE
        </Link>
        {walletAddress ? (
          <span className="bg-green-700 px-3 py-1 rounded-md text-sm">
            Connected: {truncate(walletAddress)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
