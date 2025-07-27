import { useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthBar from "../components/ui/HealthBar";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();
      const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);
      setProvider(newProvider);
      setSigner(newSigner);
      setContract(newContract);
    }
  };

  const fetchStatuses = async () => {
    if (contract && signer) {
      try {
        const playerAddress = await signer.getAddress();
        const playerStatus = await contract.getPlayerStatus(playerAddress);
        setStatus(playerStatus);

        const opponent = playerStatus.opponent;
        if (opponent !== ethers.ZeroAddress) {
          const oppStatus = await contract.getPlayerStatus(opponent);
          setOpponentStatus(oppStatus);
        } else {
          setOpponentStatus(null);
        }
      } catch (error) {
        console.error("Gagal mengambil status:", error);
      }
    }
  };

  const performAction = async (actionId) => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.performAction(actionId);
      await tx.wait();
      await fetchStatuses();
    } catch (error) {
      console.error("Aksi gagal:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && signer) {
      fetchStatuses();
      const interval = setInterval(fetchStatuses, 3000); // real-time refresh setiap 3 detik
      return () => clearInterval(interval);
    }
  }, [contract, signer]);

  const renderStatus = (title, data) => {
    if (!data) return null;
    return (
      <div className="mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <HealthBar hp={Number(data.hp)} maxHp={100} />
        <p>Last Action: {["None", "Attack", "Defend", "Heal"][data.lastAction]}</p>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Arena Duel PvP</h2>
      {renderStatus("Kamu", status)}
      <p className="text-center text-yellow-300 font-semibold mb-4">
        {status?.isTurn ? "Giliran kamu!" : "Menunggu giliran..."}
      </p>
      {renderStatus("Lawan", opponentStatus)}

      {status?.isTurn && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => performAction(1)} disabled={loading} className="bg-red-500 px-4 py-2 rounded">
            Attack
          </button>
          <button onClick={() => performAction(2)} disabled={loading} className="bg-blue-500 px-4 py-2 rounded">
            Defend
          </button>
          <button onClick={() => performAction(3)} disabled={loading} className="bg-green-500 px-4 py-2 rounded">
            Heal
          </button>
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
