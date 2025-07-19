import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/HealthBar";

const ArenaPVE = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [monsterHP, setMonsterHP] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("MetaMask not detected");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setProvider(provider);
      setSigner(signer);
      setContract(contract);

      const player = await contract.players(signer.address);
      setPlayerHP(Number(player.hp));
      setIsPlayerTurn(player.isTurn);

      const monster = await contract.monsters(signer.address);
      setMonsterHP(Number(monster.hp));
    };

    init();
  }, []);

  const handleAction = async (action) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.takeAction(action);
      setStatus("⏳ Waiting for transaction...");
      await tx.wait();
      setStatus("✅ Action executed!");
      await refreshStatus();
    } catch (error) {
      console.error(error);
      setStatus("❌ Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    if (!contract || !signer) return;

    const player = await contract.players(await signer.getAddress());
    const monster = await contract.monsters(await signer.getAddress());

    setPlayerHP(Number(player.hp));
    setMonsterHP(Number(monster.hp));
    setIsPlayerTurn(player.isTurn);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4">Arena PvE</h1>

      <div className="mb-4">
        <p className="text-lg font-semibold">Player HP:</p>
        <HealthBar hp={playerHP} />
      </div>

      <div className="mb-4">
        <p className="text-lg font-semibold">Monster HP:</p>
        <HealthBar hp={monsterHP} />
      </div>

      <div className="text-center mb-2">
        {isPlayerTurn ? (
          <p className="text-green-600 font-semibold">🎯 It's your turn!</p>
        ) : (
          <p className="text-red-600">⏳ Waiting for monster...</p>
        )}
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => handleAction(1)}
          disabled={!isPlayerTurn || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Attack
        </button>
        <button
          onClick={() => handleAction(2)}
          disabled={!isPlayerTurn || loading}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Defend
        </button>
        <button
          onClick={() => handleAction(3)}
          disabled={!isPlayerTurn || loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Heal
        </button>
      </div>

      {loading && <p className="text-center text-sm text-gray-500">{status}</p>}
    </div>
  );
};

export default ArenaPVE;
