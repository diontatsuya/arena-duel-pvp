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
  const [battleId, setBattleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const checkBattle = async () => {
    if (!walletAddress || !signer) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      const id = await contract.playerToBattleId(walletAddress);
      const battle = await contract.battles(id);

      if (
        id.toString() !== "0" &&
        battle.player1 !== ethers.constants.AddressZero &&
        battle.winner === ethers.constants.AddressZero
      ) {
        setBattleId(id.toString());
      } else {
        setBattleId(null); // tidak aktif battle
      }
    } catch (err) {
      console.error("Gagal cek battle:", err);
      setBattleId(null);
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

      const id = await contract.playerToBattleId(walletAddress);
      navigate(`/arena-battle/${id}`);
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
      setBattleId(null); // reset status
    } catch (err) {
      console.error("Gagal keluar dari battle:", err);
      setError("Gagal keluar dari battle.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (walletAddress && signer) {
      checkBattle();
    }
  }, [walletAddress, signer]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Gabung Arena PvP</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {walletAddress ? (
        battleId ? (
          <div className="flex flex-col gap-4 items-center">
            <p className="text-green-400">Kamu sudah dalam battle #{battleId}</p>
            <button
              onClick={() => navigate(`/arena-battle/${battleId}`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              ➡️ Lanjutkan Battle
            </button>
            <button
              onClick={leaveBattle}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              ❌ Keluar dari Battle
            </button>
          </div>
        ) : (
          <button
            onClick={joinMatchmaking}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
          >
            {loading ? "⏳ Bergabung..." : "⚔️ Join PvP"}
          </button>
        )
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          🔌 Hubungkan Wallet
        </button>
      )}
    </div>
  );
};

export default JoinPVP;
