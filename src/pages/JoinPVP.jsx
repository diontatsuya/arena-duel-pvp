import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { useNavigate } from "react-router-dom";

const JoinPVP = () => {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const navigate = useNavigate();

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);
          setStatus("Terhubung: " + accounts[0]);
        } catch (error) {
          console.error("Gagal menghubungkan wallet:", error);
          setStatus("Gagal menghubungkan wallet");
        }
      } else {
        setStatus("Wallet tidak ditemukan");
      }
    };

    connectWallet();
  }, []);

  const handleJoin = async () => {
    if (!window.ethereum || !account) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

    try {
      const tx = await contract.joinGame(); // ← Diganti dari joinArena
      setStatus("Menunggu konfirmasi transaksi...");
      await tx.wait();
      setStatus("Berhasil bergabung ke arena!");

      navigate("/arena-pvp");
    } catch (error) {
      console.error("Gagal bergabung ke arena:", error);
      setStatus("Gagal bergabung ke arena");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Gabung Arena PvP</h1>
      <p className="mb-2">{status}</p>
      <button
        onClick={handleJoin}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
      >
        Gabung PvP
      </button>
    </div>
  );
};

export default JoinPVP;
