import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        const data = await contract.players(address);

        if (data.opponent !== ethers.ZeroAddress) {
          const opponentData = await contract.players(data.opponent);
          setOpponent({
            address: data.opponent,
            hp: opponentData.hp,
            lastAction: opponentData.lastAction,
          });
        }

        setPlayer({ address, hp: data.hp });
        setIsMyTurn(data.isTurn);
        setLastAction(data.lastAction);
        setProvider(prov);
        setSigner(signer);
        setContract(contract);
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const handleAction = async (action) => {
    if (!contract) return;
    try {
      const tx = await contract.performAction(action);
      await tx.wait();
      window.location.reload(); // Untuk menyegarkan status setelah aksi
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading arena...</div>;

  if (!opponent) {
    return <div className="text-center mt-10">Menunggu lawan bergabung...</div>;
  }

  return (
    <div className="text-center mt-10">
      <h2 className="text-3xl font-bold mb-6">🔥 Arena PVP 🔥</h2>

      <div className="flex justify-center gap-12 items-center mb-6">
        <div>
          <h3 className="font-semibold">💥 Kamu</h3>
          <HealthBar hp={player.hp} />
        </div>
        <div>
          <h3 className="font-semibold">🧠 Lawan</h3>
          <HealthBar hp={opponent.hp} />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg">
          {isMyTurn ? "🎯 Giliran kamu!" : "⏳ Tunggu giliran lawan..."}
        </p>
        {opponent.lastAction !== 0 && (
          <p className="text-sm text-gray-400 mt-1">
            Lawan melakukan: {["None", "Attack", "Defend", "Heal"][opponent.lastAction]}
          </p>
        )}
      </div>

      {isMyTurn && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
            onClick={() => handleAction(1)}
          >
            Attack
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            onClick={() => handleAction(2)}
          >
            Defend
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
            onClick={() => handleAction(3)}
          >
            Heal
          </button>
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
