// src/components/ArenaPVP.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ArenaUI from "./ArenaUI";
import contractABI from "../utils/contractABI.json";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isTurn, setIsTurn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inisialisasi ethers
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _account = await _signer.getAddress();
        const _contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          _signer
        );

        const playerData = await _contract.players(_account);
        const opponentData = await _contract.players(playerData.opponent);

        setProvider(_provider);
        setSigner(_signer);
        setAccount(_account);
        setContract(_contract);
        setPlayer(playerData);
        setOpponent(opponentData);
        setIsTurn(playerData.isTurn);
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleAction = async (action) => {
    if (!contract || !isTurn) return;
    try {
      const tx = await contract.playTurn(action);
      await tx.wait();
      const updatedPlayer = await contract.players(account);
      const updatedOpponent = await contract.players(updatedPlayer.opponent);
      setPlayer(updatedPlayer);
      setOpponent(updatedOpponent);
      setIsTurn(updatedPlayer.isTurn);
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  if (loading || !player || !opponent) {
    return <div className="text-center mt-10 text-white">Loading...</div>;
  }

  return (
    <ArenaUI
      isPVP={true}
      isTurn={isTurn}
      playerHP={player.hp.toString()}
      enemyHP={opponent.hp.toString()}
      onAction={handleAction}
      debugData={{ player, opponent }}
    />
  );
};

export default ArenaPVP;
