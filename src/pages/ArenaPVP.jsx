import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "@/utils/constants";
import { contractABI } from "@/utils/contractABI";
import ActionButtons from "@/components/ui/ActionButtons";
import HealthBar from "@/components/ui/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isTurn, setIsTurn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (contract && signer) {
      fetchStatus();
    }
  }, [contract, signer]);

  const fetchStatus = async () => {
    const address = await signer.getAddress();
    const data = await contract.players(address);
    if (data.opponent !== ethers.ZeroAddress) {
      const opponentData = await contract.players(data.opponent);
      setPlayer({ ...data });
      setOpponent({ ...opponentData });
      setIsTurn(data.isTurn);
    }
  };

  const sendAction = async (actionType) => {
    if (!contract || !signer) return;
    try {
      setLoading(true);
      const tx = await contract.takeTurn(actionType);
      await tx.wait();
      await fetchStatus();
    } catch (error) {
      console.error("Action error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Arena Duel PvP</h1>
      {player && opponent ? (
        <div className="flex flex-col items-center gap-6">
          <HealthBar label="You" hp={Number(player.hp)} />
          <HealthBar label="Opponent" hp={Number(opponent.hp)} />

          <div className="flex gap-4">
            <ActionButtons onClick={() => sendAction(1)} disabled={!isTurn || loading}>
              Attack
            </ActionButtons>
            <ActionButtons onClick={() => sendAction(2)} disabled={!isTurn || loading}>
              Defend
            </ActionButtons>
            <ActionButtons onClick={() => sendAction(3)} disabled={!isTurn || loading}>
              Heal
            </ActionButtons>
          </div>
          {!isTurn && <p className="text-yellow-400">Waiting for opponent's turn...</p>}
        </div>
      ) : (
        <div className="text-center text-gray-300">Looking for opponent...</div>
      )}
    </div>
  );
};

export default ArenaPVP;
