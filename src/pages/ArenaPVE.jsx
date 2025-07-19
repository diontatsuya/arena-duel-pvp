import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/HealthBar";
import attackIcon from "../assets/images/attack.png";
import defendIcon from "../assets/images/defend.png";
import healIcon from "../assets/images/heal.png";

const ArenaPVE = ({ signer }) => {
  const [contract, setContract] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [playerAction, setPlayerAction] = useState(null);
  const [opponentAction, setOpponentAction] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (signer) {
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(gameContract);
    }
  }, [signer]);

  const handleAction = async (actionType) => {
    if (!contract) return;

    try {
      const tx = await contract.performActionVsAI(actionType);
      setStatus("Processing...");
      await tx.wait();
      setStatus("Action performed!");
      fetchStatus();
    } catch (error) {
      console.error(error);
      setStatus("Action failed.");
    }
  };

  const fetchStatus = async () => {
    if (!contract || !signer) return;
    const address = await signer.getAddress();
    const player = await contract.players(address);
    const ai = await contract.players(player.opponent);
    setPlayerHP(player.hp.toNumber());
    setOpponentHP(ai.hp.toNumber());
    setPlayerAction(player.lastAction);
    setOpponentAction(ai.lastAction);
  };

  useEffect(() => {
    fetchStatus();
  }, [contract]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">Player vs AI</h1>

      <div className="w-full max-w-md">
        <HealthBar name="You" hp={playerHP} lastAction={playerAction} />
        <HealthBar name="AI" hp={opponentHP} lastAction={opponentAction} />
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <button onClick={() => handleAction(1)} title="Attack">
          <img src={attackIcon} alt="Attack" className="w-16 h-16 hover:scale-110 transition" />
        </button>
        <button onClick={() => handleAction(2)} title="Defend">
          <img src={defendIcon} alt="Defend" className="w-16 h-16 hover:scale-110 transition" />
        </button>
        <button onClick={() => handleAction(3)} title="Heal">
          <img src={healIcon} alt="Heal" className="w-16 h-16 hover:scale-110 transition" />
        </button>
      </div>

      <p className="mt-6 text-lg">{status}</p>
    </div>
  );
};

export default ArenaPVE;
