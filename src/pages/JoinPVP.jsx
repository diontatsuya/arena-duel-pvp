import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../context/WalletContext";
import { CONTRACT_ADDRESS } from "../utils/constants";

const JoinPVP = () => {
  const { walletAddress, signer } = useContext(WalletContext);
  const [battleStatus, setBattleStatus] = useState("checking");
  const [battleId, setBattleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const navigate = useNavigate();

  const checkBattleStatus = async () => {
    if (!signer || !walletAddress) return;

    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const currentBattleId = await contract.getPlayerBattle(walletAddress);

      console.log("currentBattleId:", currentBattleId);

      if (currentBattleId === 0n) {
        setBattleStatus("idle");
        setBattleId(null);
        return;
      }

      setBattleId(currentBattleId.toString());

      const battle = await contract.battles(currentBattleId);
      console.log("battle detail:", battle);

      const player1 = battle.player1.addr;
      const player2 = battle.player2.addr;

      const isInBattle =
        player1.toLowerCase() === walletAddress.toLowerCase() ||
        player2.toLowerCase() === walletAddress.toLowerCase();

      if (player1 !== ethers.ZeroAddress && player2 !== ethers.ZeroAddress && isInBattle) {
        setBattleStatus("inBattle");
      } else {
        setBattleStatus("waiting");
      }
    } catch (err) {
      console.error("Gagal cek battle:", err);
      setBattleStatus("idle");
      setBattleId(null);
    }
  };

  const joinMatchmaking = async () => {
    if (!signer) return alert("Wallet belum terhubung");

    try {
      setLoading(true);
      setTxHash("");

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.joinMatchmaking();
      await tx.wait();

      setTxHash(tx.hash);
      await checkBattleStatus();
    } catch (err) {
      console.error("Gagal join matchmaking:", err);
    } finally {
      setLoading(false);
    }
  };

  const leaveBattle = async () => {
    if (!signer) return alert("Wallet belum terhubung");

    try {
      setLoading(true);
      setTxHash("");

      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.leaveBattle();
      await tx.wait();

      setTxHash(tx.hash);
      await checkBattleStatus();
    } catch (err) {
      console.error("Gagal keluar dari battle:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress && signer) {
      checkBattleStatus();
    }
  }, [walletAddress, signer]);

  useEffect(() => {
    if (battleStatus === "inBattle" && battleId) {
      console.log("Navigasi ke battle:", battleId);
      navigate(`/arena-battle/${battleId}`);
    }
  }, [battleStatus, battleId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Join PVP Match</h1>
      {walletAddress && <p className="mb-2">Connected: {walletAddress}</p>}
      <p className="mb-4">
        Status:{" "}
        {battleStatus === "checking"
          ? "Checking..."
          : battleStatus === "waiting"
          ? "Menunggu lawan..."
          : battleStatus}
      </p>

      {battleStatus === "idle" && (
        <button
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg mb-4 disabled:opacity-50"
          onClick={joinMatchmaking}
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Matchmaking"}
        </button>
      )}

      {battleStatus === "waiting" && (
        <button
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg mb-4 disabled:opacity-50"
          onClick={leaveBattle}
          disabled={loading}
        >
          {loading ? "Leaving..." : "Batalkan Match"}
        </button>
      )}

      {txHash && (
        <p className="text-sm text-green-400">
          ✅ Tx sent:{" "}
          <a
            href={`https://testnet.somniascan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {txHash.slice(0, 10)}...
          </a>
        </p>
      )}
    </div>
  );
};

export default JoinPVP;
