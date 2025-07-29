import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const JoinPVP = () => {
  const [isMatched, setIsMatched] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const checkMatchStatus = async () => {
      if (!window.ethereum) {
        setError("Wallet tidak ditemukan.");
        setChecking(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        // Gabung matchmaking
        const tx = await contract.joinGame();
        await tx.wait(); // tunggu konfirmasi

        // Cek status setiap 3 detik
        interval = setInterval(async () => {
          try {
            const player = await contract.players(userAddress);
            if (player.opponent !== ethers.ZeroAddress) {
              clearInterval(interval);
              setIsMatched(true);
              setTimeout(() => navigate("/arena-pvp"), 1500);
            }
          } catch (err) {
            console.error("Error memeriksa status:", err);
            clearInterval(interval);
            setError("Gagal memeriksa status matchmaking.");
            setChecking(false);
          }
        }, 3000);
      } catch (err) {
        console.error("Gagal join game:", err);
        setError("Gagal join game.");
        setChecking(false);
      }
    };

    checkMatchStatus();

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold mb-4">Menunggu Lawan PvP...</h1>
      <p className="text-lg">
        {isMatched
          ? "Lawan ditemukan! Mengalihkan ke Arena PvP..."
          : checking
          ? "Mencari lawan, harap tunggu sebentar."
          : error
          ? error
          : "Gagal memeriksa status matchmaking."}
      </p>
    </div>
  );
};

export default JoinPVP;
