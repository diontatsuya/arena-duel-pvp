import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const { walletAddress, signer, loading } = useWallet();
  const [hasActiveBattle, setHasActiveBattle] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!walletAddress || !signer) {
      setHasActiveBattle(false);
      setChecking(false);
      return;
    }

    const checkBattle = async () => {
      setChecking(true);
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const battleId = await contract.activeBattleId(walletAddress);
        setHasActiveBattle(battleId.toString() !== "0");
      } catch (error) {
        console.error("Gagal cek battle aktif:", error);
        setHasActiveBattle(false);
      } finally {
        setChecking(false);
      }
    };

    checkBattle();
  }, [walletAddress, signer]);

  const handleJoin = () => navigate("/join-pvp");
  const handleContinue = () => navigate("/arena-battle");

  if (loading || checking) {
    return (
      <div className="text-center mt-10 text-white">
        Memuat status battle dan wallet...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Arena PVP</h1>

      {hasActiveBattle ? (
        <>
          <p className="mb-4">Kamu memiliki battle aktif!</p>
          <button
            onClick={handleContinue}
            className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-6 rounded font-bold"
          >
            Lanjutkan Battle
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">Belum ada battle aktif. Ayo mulai pertarungan!</p>
          <button
            onClick={handleJoin}
            className="bg-green-600 hover:bg-green-700 py-2 px-6 rounded font-bold"
          >
            Join PVP
          </button>
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
