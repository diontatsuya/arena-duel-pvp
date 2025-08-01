import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import contractABI from "../utils/contractABI";
import { useWallet } from "../utils/connectWallet";

const JoinPVP = () => {
  const { walletAddress, signer } = useWallet();
  const [loading, setLoading] = useState(false);
  const [inBattle, setInBattle] = useState(false);
  const [battleId, setBattleId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkBattleStatus = async () => {
    if (!walletAddress || !signer) return;

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const id = await contract.playerToBattleId(walletAddress);
      const battle = await contract.battles(id);

      const isActive =
        id.toString() !== "0" &&
        (battle.player1.addr !== ethers.constants.AddressZero || battle.player2.addr !== ethers.constants.AddressZero) &&
        battle.state === 0;

      if (isActive) {
        setInBattle(true);
        setBattleId(id.toString());
      } else {
        setInBattle(false);
        setBattleId(null);
      }
    } catch (err) {
      console.error("Gagal cek battle:", err);
    }
  };

  const joinMatchmaking = async () => {
    if (!walletAddress || !signer) return;
    setLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      await checkBattleStatus(); // cek ulang
      if (inBattle && battleId) {
        navigate(`/arena-battle/${battleId}`);
        return;
      }

      const tx = await contract.joinMatchmaking();
      await tx.wait();

      const newId = await contract.playerToBattleId(walletAddress);
      navigate(`/arena-battle/${newId}`);
    } catch (err) {
      console.error("Join matchmaking error:", err);
      setError("Gagal join matchmaking.");
    } finally {
      setLoading(false);
    }
  };

  const leaveBattle = async () => {
    if (!walletAddress || !signer || !battleId) return;
    setLoading(true);
    setError(null);

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.leaveBattle();
      await tx.wait();

      setInBattle(false);
      setBattleId(null);
    } catch (err) {
      console.error("Gagal keluar dari battle:", err);
      setError("Gagal keluar dari battle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBattleStatus();
  }, [walletAddress]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PVP Matchmaking</h1>

      {inBattle ? (
        <>
          <p className="mb-2">Kamu sudah berada dalam battle (ID: {battleId})</p>
          <button
            onClick={leaveBattle}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Leaving..." : "Leave Battle"}
          </button>
        </>
      ) : (
        <button
          onClick={joinMatchmaking}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Matchmaking"}
        </button>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default JoinPVP;
