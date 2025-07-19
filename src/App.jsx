// src/App.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ArenaPVP from "./components/ArenaPVP";

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
            setAddress(accounts[0].address);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    autoConnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Arena Duel PVP</h1>

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
        <ArenaPVP userAddress={address} />
      )}
    </div>
  );
};

export default App;
