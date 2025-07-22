import { useEffect, useState } from "react";
import { ethers } from "ethers";
import HealthBar from "../components/ui/HealthBar";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isTurn, setIsTurn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Menunggu lawan bergabung...");

  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Metamask tidak ditemukan!");
    const providerInstance = new ethers.BrowserProvider(window.ethereum);
    const signerInstance = await providerInstance.getSigner();
    const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signerInstance);

    setProvider(providerInstance);
    setSigner(signerInstance);
    setContract(contractInstance);
  };

  const fetchGameStatus = async () => {
    if (!contract || !signer) return;
    const address = await signer.getAddress();
    const data = await contract.players(address);

    if (data.opponent === ethers.ZeroAddress) {
      setStatusMessage("Menunggu lawan bergabung...");
    } else {
      setStatusMessage("Pertarungan dimulai!");
      setOpponent(data.opponent);
      setIsTurn(data.isTurn);
      setPlayerHP(Number(data.hp));

      const opponentData = await contract.players(data.opponent);
      setOpponentHP(Number(opponentData.hp));
    }
  };

  const handleAction = async (actionCode) => {
    if (!contract || !signer) return;

    try {
      const tx = await contract.takeAction(actionCode);
      await tx.wait();
      fetchGameStatus(); // refresh status setelah aksi
    } catch (err) {
      console.error("Gagal melakukan aksi:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchGameStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, [contract, signer]);

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <h1 className="text-3xl font-bold text-yellow-400">Arena PVP</h1>
      <p className="text-gray-300">{statusMessage}</p>

      <div className="flex flex-col items-center space-y-4">
        <div className="w-64">
          <HealthBar label="Kamu" current={playerHP} />
        </div>
        <div className="w-64">
          <HealthBar label="Lawan" current={opponentHP} />
        </div>
      </div>

      {statusMessage === "Pertarungan dimulai!" && isTurn && (
        <div className="flex space-x-4 mt-6">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => handleAction(1)} // Attack
          >
            Attack
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => handleAction(2)} // Defend
          >
            Defend
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => handleAction(3)} // Heal
          >
            Heal
          </button>
        </div>
      )}

      {statusMessage === "Pertarungan dimulai!" && !isTurn && (
        <p className="text-yellow-300 mt-4">Menunggu giliran lawan...</p>
      )}
    </div>
  );
};

export default ArenaPVP;
