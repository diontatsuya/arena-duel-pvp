import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";

const JoinPVP = () => {
  const [isMatched, setIsMatched] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const joinAndCheckMatch = async () => {
      const wallet = await connectWalletAndCheckNetwork();
      if (!wallet) {
        setError("Gagal menghubungkan wallet atau jaringan salah.");
        setChecking(false);
        return;
      }

      const { signer, account } = wallet;
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      try {
        const tx = await contract.joinMatchmaking();
        console.log("Transaksi joinMatchmaking dikirim:", tx.hash);
        await tx.wait();
        console.log("Transaksi dikonfirmasi.");

        interval = setInterval(async () => {
          try {
            const battleId = await contract.getPlayerBattle(account);
            if (battleId.toString() !== "0") {
              const battle = await contract.battles(battleId);
              const player2 = battle.player2.addr;

              if (player2 !== ethers.constants.AddressZero) {
                clearInterval(interval);
                setIsMatched(true);
                setTimeout(() => navigate("/arena-pvp"), 1500);
              }
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
        setError("Gagal join matchmaking. Pastikan cukup saldo STT.");
        setChecking(false);
      }
    };

    joinAndCheckMatch();

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
