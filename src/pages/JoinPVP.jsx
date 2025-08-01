// src/pages/JoinPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { connectWallet } from "../utils/connectWallet";

const JoinPVP = () => {
  const [wallet, setWallet] = useState(null);
  const [battleStatus, setBattleStatus] = useState(null); // null, "inBattle", "idle"
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const walletAddress = await connectWallet(setWallet);
      if (walletAddress) {
        await checkBattleStatus(walletAddress);
      }
    };
    init();
  }, []);

  const checkBattleStatus = async (walletAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, await provider.getSigner());
      const battle = await contract.getBattle(walletAddress);
      if (battle && battle.player1 !== ethers.ZeroAddress && battle.player2 !== ethers.ZeroAddress) {
        setBattleStatus("inBattle");
      } else {
        setBattleStatus("idle");
      }
    } catch (err) {
      console.error("Error checking battle status:", err);
    }
  };

  const joinBattle = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.joinBattle();
      await tx.wait();
      setBattleStatus("inBattle");
      alert("Berhasil masuk ke battle!");
    } catch (err) {
      console.error("Gagal join battle:", err);
      alert("Gagal join battle!");
    }
    setLoading(false);
  };

  const leaveBattle = async () => {
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.leaveBattle();
      await tx.wait();
      setBattleStatus("idle");
      alert("Berhasil keluar dari battle.");
    } catch (err) {
      console.error("Gagal keluar dari battle:", err);
      alert("Gagal keluar dari battle.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
      <h1 className="text-3xl font-bold">Join PvP</h1>
      <p>Wallet: {wallet || "Belum terhubung"}</p>

      {battleStatus === "inBattle" ? (
        <>
          <p className="text-yellow-500">Kamu sudah berada dalam battle.</p>
          <button
            onClick={leaveBattle}
            className="px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600"
            disabled={loading}
          >
            {loading ? "Leaving..." : "Leave Battle"}
          </button>
        </>
      ) : (
        <button
          onClick={joinBattle}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Battle"}
        </button>
      )}
    </div>
  );
};

export default JoinPVP;
