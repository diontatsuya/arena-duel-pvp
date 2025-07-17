import React, { useEffect, useState } from "react";
import { Contract } from "ethers";
import contractABI from "../utils/contractABI.json";
import { contractAddress } from "../utils/contractAddress";

const ArenaPVP = ({ address, contract, setContract }) => {
  const [status, setStatus] = useState("");
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [isTurn, setIsTurn] = useState(false);

  useEffect(() => {
    const setup = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const gameContract = new Contract(contractAddress, contractABI, signer);
      setContract(gameContract);
    };

    if (!contract) {
      setup();
    }

    const fetchStatus = async () => {
      if (!contract) return;
      const data = await contract.getStatus(address);
      setPlayerHP(data[0]);
      setOpponentHP(data[1]);
      setIsTurn(data[2]);
    };

    fetchStatus();
  }, [contract, address, setContract]);

  const handleAction = async (action) => {
    if (!contract || !isTurn) return;
    try {
      const tx = await contract.takeAction(action); // 1: attack, 2: defend, 3: heal
      setStatus("Waiting for transaction...");
      await tx.wait();
      setStatus("Action completed.");
    } catch (err) {
      console.error(err);
      setStatus("Transaction failed.");
    }
  };

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-around">
        <div>
          <h2 className="text-lg font-bold">You</h2>
          <p>HP: {playerHP}</p>
        </div>
        <div>
          <h2 className="text-lg font-bold">Opponent</h2>
          <p>HP: {opponentHP}</p>
        </div>
      </div>
      <div>
        {isTurn ? (
          <div className="space-x-2">
            <button
              onClick={() => handleAction(1)}
              className="bg-red-500 text-white px-4 py-2 rounded-full"
            >
              Attack
            </button>
            <button
              onClick={() => handleAction(2)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-full"
            >
              Defend
            </button>
            <button
              onClick={() => handleAction(3)}
              className="bg-green-500 text-white px-4 py-2 rounded-full"
            >
              Heal
            </button>
          </div>
        ) : (
          <p>Waiting for opponent's turn...</p>
        )}
      </div>
      <p>{status}</p>
    </div>
  );
};

export default ArenaPVP;
