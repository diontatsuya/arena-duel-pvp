import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/contractAddress";
import attackIcon from "/attack.png";
import defendIcon from "/defend.png";
import healIcon from "/heal.png";

const ArenaPVP = ({ signer, address }) => {
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (signer) {
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      setContract(gameContract);
    }
  }, [signer]);

  const fetchStatus = async () => {
    if (!contract || !address) return;

    const p = await contract.players(address);
    setPlayer(p);

    if (p.opponent !== ethers.constants.AddressZero) {
      const o = await contract.players(p.opponent);
      setOpponent(o);
    } else {
      setOpponent(null);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchStatus();

      const interval = setInterval(fetchStatus, 5000); // poll setiap 5 detik
      return () => clearInterval(interval);
    }
  }, [contract]);

  const handleAction = async (action) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.takeTurn(action);
      setMessage("Waiting for transaction...");
      await tx.wait();
      setMessage("Action complete!");
      fetchStatus();
    } catch (error) {
      console.error(error);
      setMessage("Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  const getActionButtons = () => {
    if (!player || !player.isTurn) {
      return <p className="text-yellow-300">Waiting for your turn or opponent...</p>;
    }

    return (
      <div className="flex justify-center gap-4">
        <button onClick={() => handleAction(1)} disabled={loading}>
          <img src={attackIcon} alt="Attack" className="w-16" />
        </button>
        <button onClick={() => handleAction(2)} disabled={loading}>
          <img src={defendIcon} alt="Defend" className="w-16" />
        </button>
        <button onClick={() => handleAction(3)} disabled={loading}>
          <img src={healIcon} alt="Heal" className="w-16" />
        </button>
      </div>
    );
  };

  return (
    <div className="text-white text-center">
      <h2 className="text-2xl font-bold mb-4">Arena Duel PvP</h2>

      {player ? (
        <div className="mb-4">
          <p className="text-xl font-semibold">Your Status</p>
          <p>HP: {player.hp.toString()}</p>
          {opponent && <p>Opponent HP: {opponent.hp.toString()}</p>}
        </div>
      ) : (
        <p>Waiting for matchmaking...</p>
      )}

      {getActionButtons()}

      {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
    </div>
  );
};

export default ArenaPVP;
