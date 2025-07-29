import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import WaitingMatch from "../components/pvp/WaitingMatch";
import { joinMatch, getBattleStatus } from "../gameLogic/pvpLogic";

const ArenaPVP = () => {
  const [wallet, setWallet] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("MetaMask tidak tersedia");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
    } catch (err) {
      setError("Gagal menghubungkan wallet");
    }
  };

  // Join PvP Match
  const handleJoinMatch = async () => {
    if (!wallet) return alert("Hubungkan wallet dulu");
    setIsWaiting(true);
    await joinMatch(wallet);
  };

  // Cek status battle
  const checkBattleStatus = async () => {
    if (!wallet) return;
    const status = await getBattleStatus(wallet);
    if (status?.opponent && status?.opponent !== ethers.constants.AddressZero) {
      navigate("/arena-battle");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkBattleStatus();
    }, 4000);
    return () => clearInterval(interval);
  }, [wallet]);

  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>

      {wallet ? (
        <>
          {isWaiting ? (
            <WaitingMatch />
          ) : (
            <button
              onClick={handleJoinMatch}
              className="bg-purple-600 px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              Gabung PvP
            </button>
          )}
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Hubungkan Wallet
        </button>
      )}

      {error && <p className="mt-4 text-red-400">{error}</p>}
    </div>
  );
};

export default ArenaPVP;
