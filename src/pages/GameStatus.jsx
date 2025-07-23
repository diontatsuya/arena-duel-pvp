import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const GameStatus = () => {
  const [account, setAccount] = useState("");
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (!window.ethereum) return alert("Install MetaMask!");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const player = await contract.players(address);

        if (player.opponent === ethers.ZeroAddress) {
          setLoading(false);
          return;
        }

        const opponent = await contract.players(player.opponent);
        setPlayerStatus(player);
        setOpponentStatus(opponent);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const goToBattle = () => navigate("/battle");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Status Game PvP</h1>
      {loading ? (
        <p>Memuat status game...</p>
      ) : playerStatus ? (
        <div className="space-y-4">
          <p><strong>Alamat Wallet:</strong> {account}</p>
          <div>
            <h2 className="text-xl font-semibold">Status Kamu</h2>
            <p>HP: {playerStatus.hp.toString()}</p>
            <p>Giliran Kamu: {playerStatus.isTurn ? "Ya" : "Tidak"}</p>
            <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][playerStatus.lastAction]}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Status Lawan</h2>
            <p>Alamat: {playerStatus.opponent}</p>
            <p>HP: {opponentStatus.hp.toString()}</p>
            <p>Giliran: {opponentStatus.isTurn ? "Ya" : "Tidak"}</p>
            <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][opponentStatus.lastAction]}</p>
          </div>
          <button
            onClick={goToBattle}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Lanjut ke Pertarungan
          </button>
        </div>
      ) : (
        <p>Kamu tidak sedang dalam pertarungan.</p>
      )}
    </div>
  );
};

export default GameStatus;
