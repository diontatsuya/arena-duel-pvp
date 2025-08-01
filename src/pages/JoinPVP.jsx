import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = "0x03892903e86e6db9bbcc86bdff571ca1360184b7";

const JoinPVP = () => {
  const [wallet, setWallet] = useState("");
  const [battleStatus, setBattleStatus] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const navigate = useNavigate();

  const connectWallet = async () => {
    try {
      const [address] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(address);
    } catch (err) {
      console.error("Gagal konek wallet:", err);
    }
  };

  const checkBattleStatus = async (walletAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const battleId = await contract.getPlayerBattle(walletAddress);
      if (battleId === 0n) {
        setBattleStatus("idle");
        return;
      }

      const battle = await contract.battles(battleId);
      const player1 = battle.player1.addr;
      const player2 = battle.player2.addr;

      if (
        player1 !== ethers.ZeroAddress &&
        player2 !== ethers.ZeroAddress
      ) {
        setBattleStatus("inBattle");
      } else {
        setBattleStatus("idle");
      }
    } catch (err) {
      console.error("Gagal cek battle:", err);
      setBattleStatus("idle");
    }
  };

  const joinMatchmaking = async () => {
    try {
      setLoading(true);
      setTxHash("");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.joinMatchmaking();
      await tx.wait();
      setTxHash(tx.hash);
      await checkBattleStatus(wallet);
    } catch (err) {
      console.error("Gagal join matchmaking:", err);
    } finally {
      setLoading(false);
    }
  };

  const leaveBattle = async () => {
    try {
      setLoading(true);
      setTxHash("");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.leaveBattle();
      await tx.wait();
      setTxHash(tx.hash);
      await checkBattleStatus(wallet);
    } catch (err) {
      console.error("Gagal keluar dari battle:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (wallet) checkBattleStatus(wallet);
  }, [wallet]);

  // ⬇️ Tambahkan ini agar auto redirect jika inBattle
  useEffect(() => {
    if (battleStatus === "inBattle") {
      navigate("/arena-battle");
    }
  }, [battleStatus, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Join PVP Match</h1>
      {wallet && <p className="mb-2">Connected: {wallet}</p>}
      <p className="mb-4">Status: {battleStatus === "checking" ? "Checking..." : battleStatus}</p>

      {battleStatus === "idle" && (
        <button
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg mb-4 disabled:opacity-50"
          onClick={joinMatchmaking}
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Matchmaking"}
        </button>
      )}

      {battleStatus === "inBattle" && (
        <button
          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg mb-4 disabled:opacity-50"
          onClick={leaveBattle}
          disabled={loading}
        >
          {loading ? "Leaving..." : "Leave Battle"}
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
