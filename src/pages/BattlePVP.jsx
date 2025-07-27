import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import HealthBar from "../components/ui/HealthBar";

const BattlePVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionPending, setActionPending] = useState(false);

  const getPlayerData = async (userAddress) => {
    const player = await contract.players(userAddress);
    return {
      opponent: player.opponent,
      hp: parseInt(player.hp),
      isTurn: player.isTurn,
      lastAction: player.lastAction,
    };
  };

  const fetchGameState = async () => {
    const address = await signer.getAddress();
    const data = await getPlayerData(address);
    const opponent = await getPlayerData(data.opponent);
    setPlayerData(data);
    setOpponentData(opponent);
    setLoading(false);
  };

  const handleAction = async (actionType) => {
    if (!contract || actionPending) return;
    setActionPending(true);
    try {
      const tx = await contract.performAction(actionType);
      await tx.wait();
      await fetchGameState();
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setActionPending(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setProvider(prov);
        setSigner(signer);
        setContract(contract);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (signer && contract) {
      fetchGameState();
    }
  }, [signer, contract]);

  if (loading || !playerData || !opponentData) {
    return <div className="text-center mt-10 text-white">Loading battle...</div>;
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Arena Duel PvP</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Kamu</h2>
          <HealthBar hp={playerData.hp} />
          <p>Last Action: {["None", "Attack", "Defend", "Heal"][playerData.lastAction]}</p>
          <p>{playerData.isTurn ? "🎯 Giliranmu!" : "Menunggu giliran..."}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Lawan</h2>
          <HealthBar hp={opponentData.hp} />
          <p>Last Action: {["None", "Attack", "Defend", "Heal"][opponentData.lastAction]}</p>
        </div>
      </div>

      {playerData.isTurn && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleAction(1)}
            disabled={actionPending}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
          >
            Attack
          </button>
          <button
            onClick={() => handleAction(2)}
            disabled={actionPending}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
          >
            Defend
          </button>
          <button
            onClick={() => handleAction(3)}
            disabled={actionPending}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
          >
            Heal
          </button>
        </div>
      )}
    </div>
  );
};

export default BattlePVP;
