import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";

const JoinPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [existingBattleId, setExistingBattleId] = useState(null);

  const connectWallet = async () => {
    try {
      const connection = await connectWalletAndCheckNetwork();
      if (connection) {
        setWalletAddress(connection.account);
        setSigner(connection.signer);
      }
    } catch (err) {
      setError("Gagal hubungkan wallet. Pastikan jaringan Somnia.");
    }
  };

  const checkExistingBattle = async (account, signerInstance) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signerInstance);
      const battleId = await contract.playerToBattleId(account);
      const battle = await contract.battles(battleId);

      if (battle.active) {
        setExistingBattleId(battleId);
      } else {
        setExistingBattleId(null);
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
      const tx = await contract.joinMatchmaking();
      await tx.wait();

      const battleId = await contract.playerToBattleId(walletAddress);
      navigate(`/arena-battle/${battleId}`);
    } catch (err) {
      console.error("Join matchmaking error:", err);
      setError("Gagal join matchmaking.");
    } finally {
      setLoading(false);
    }
  };

  const leaveBattle = async () => {
    if (!walletAddress || !signer) return;
    setLoading(true);
    setError(null);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const tx = await contract.leaveBattle();
      await tx.wait();

      setExistingBattleId(null);
    } catch (err) {
      console.error("Leave battle error:", err);
      setError("Gagal keluar dari battle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress && signer) {
      checkExistingBattle(walletAddress, signer);
    }
  }, [walletAddress, signer]);

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Gabung Arena PvP</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {!walletAddress && (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          🔌 Hubungkan Wallet
        </button>
      )}

      {walletAddress && existingBattleId ? (
        <>
          <p className="mb-4 text-yellow-400">
            ⚔️ Kamu sedang dalam battle aktif (ID: {existingBattleId.toString()})
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/arena-battle/${existingBattleId}`)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
            >
              ▶️ Lanjutkan Battle
            </button>
            <button
              onClick={leaveBattle}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
            >
              ❌ Keluar Battle
            </button>
          </div>
        </>
      ) : walletAddress ? (
        <button
          onClick={joinMatchmaking}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          {loading ? "⏳ Bergabung..." : "⚔️ Join PvP"}
        </button>
      ) : null}
    </div>
  );
};

export default JoinPVP;
