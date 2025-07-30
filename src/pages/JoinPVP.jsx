import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const JoinPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setContract(gameContract);

        try {
          const battleId = await gameContract.playerToBattleId(address);
          if (battleId > 0) {
            console.log("Sudah dalam battle, redirect ke arena.");
            navigate(`/arena-battle/${battleId}`);
          }
        } catch (err) {
          console.error("Gagal cek battleId:", err);
        }
      }
    };

    init();
  }, [navigate]);

  const handleJoin = async () => {
    if (!contract || !walletAddress) return;
    setIsJoining(true);

    try {
      const battleId = await contract.playerToBattleId(walletAddress);
      if (battleId > 0) {
        console.log("Sudah dalam battle, redirect ke arena.");
        navigate(`/arena-battle/${battleId}`);
        return;
      }

      const tx = await contract.joinMatchmaking();
      await tx.wait();
      console.log("Berhasil join matchmaking:", tx.hash);

      const newBattleId = await contract.playerToBattleId(walletAddress);
      navigate(`/arena-battle/${newBattleId}`);
    } catch (err) {
      console.error("Gagal join matchmaking:", err);
      if (err?.reason?.includes("Already in a battle")) {
        const fallbackId = await contract.playerToBattleId(walletAddress);
        alert("Kamu sudah dalam battle, langsung masuk ke arena.");
        navigate(`/arena-battle/${fallbackId}`);
      } else {
        alert(err?.reason || "Gagal join matchmaking");
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl mb-4">Gabung PvP</h1>
      <button
        className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:opacity-50"
        onClick={handleJoin}
        disabled={isJoining}
      >
        {isJoining ? "Menghubungkan..." : "Gabung PvP"}
      </button>
    </div>
  );
};

export default JoinPVP;
