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

        // Join matchmaking
        const tx = await contract.joinMatchmaking();
        console.log("Mengirim transaksi joinMatchmaking:", tx.hash);
        await tx.wait();
        console.log("Transaksi dikonfirmasi.");

        // Mulai pengecekan status setiap 3 detik
        interval = setInterval(async () => {
          try {
            const status = await contract.getStatus(userAddress);
            const player2 = status[2];
            console.log("Status matchmaking:", status);

            if (player2 !== ethers.ZeroAddress) {
              clearInterval(interval);
              setIsMatched(true);
              setTimeout(() => navigate("/arena-pvp"), 1500);
            }
          } catch (err) {
            console.error("Gagal memeriksa status:", err);
            setError("Gagal memeriksa status matchmaking.");
            clearInterval(interval);
            setChecking(false);
          }
        }, 3000);
      } catch (err) {
        console.error("Gagal join matchmaking:", err);
        setError("Gagal join matchmaking. Pastikan wallet terhubung dan cukup saldo.");
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
          ? "Mencari lawan, harap tunggu sebentar..."
          : error
          ? error
          : "Gagal memeriksa status matchmaking."}
      </p>
    </div>
  );
};

export default JoinPVP;
