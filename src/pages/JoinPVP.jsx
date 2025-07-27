import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const JoinPVP = () => {
  const [isMatched, setIsMatched] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMatchStatus = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      const interval = setInterval(async () => {
        try {
          const player = await contract.players(await signer.getAddress());
          if (player.opponent !== ethers.ZeroAddress) {
            clearInterval(interval);
            setIsMatched(true);
            setTimeout(() => {
              navigate("/arena-pvp");
            }, 1500); // jeda sebelum redirect
          }
        } catch (error) {
          console.error("Error checking match status:", error);
        }
      }, 3000); // cek tiap 3 detik

      return () => clearInterval(interval);
    };

    checkMatchStatus();
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">Menunggu Lawan PvP...</h1>
      <p className="text-lg">
        {isMatched
          ? "Lawan ditemukan! Mengalihkan ke Arena PvP..."
          : checking
          ? "Mencari lawan, harap tunggu sebentar."
          : "Gagal memeriksa status matchmaking."}
      </p>
    </div>
  );
};

export default JoinPVP;
