// src/App.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";

import ArenaPVP from "./pages/ArenaPVP";
import ArenaPVE from "./pages/ArenaPVE"; // buat file ini jika belum ada
import Home from "./pages/Home"; // buat file ini juga kalau belum ada

const App = () => {
  const [address, setAddress] = useState(null);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      setError("");
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0]);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    autoConnect();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
        <motion.h1
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Arena Duel Turn-Based
        </motion.h1>

        {!address ? (
          <>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Connect Wallet
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </>
        ) : (
          <>
            <nav className="mb-6 space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/pvp" className="hover:underline">Arena PVP</Link>
              <Link to="/pve" className="hover:underline">Arena PVE</Link>
            </nav>

            <Routes>
              <Route path="/" element={<Home userAddress={address} />} />
              <Route path="/pvp" element={<ArenaPVP userAddress={address} />} />
              <Route path="/pve" element={<ArenaPVE userAddress={address} />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
