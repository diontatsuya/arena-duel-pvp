// src/components/ui/Navbar.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const Navbar = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-xl font-bold">Arena Duel</div>
      <div className="space-x-4">
        <Link to="/" className="text-white hover:text-gray-300">Home</Link>
        <Link to="/arena-pvp" className="text-white hover:text-gray-300">Arena PvP</Link>
        <Link to="/arena-pve" className="text-white hover:text-gray-300">Arena PvE</Link>
      </div>
      <div>
        {account ? (
          <span className="text-green-400">{account.slice(0, 6)}...{account.slice(-4)}</span>
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
