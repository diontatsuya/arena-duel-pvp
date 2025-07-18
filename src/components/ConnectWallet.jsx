import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          navigate("/home");
        }
      }
    };
    checkWallet();
  }, [navigate]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      navigate("/home");
    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Arena Duel Turn-Based</h1>
        <button
          onClick={connectWallet}
          className="bg-blue-600 px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;
