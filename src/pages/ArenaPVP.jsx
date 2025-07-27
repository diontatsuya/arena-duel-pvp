import { useEffect, useState } from "react";
import { ethers } from "ethers";
import GameStatus from "../components/ui/GameStatus";
import ActionButtons from "../components/ui/ActionButtons";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [status, setStatus] = useState({
    myHp: 100,
    myLastAction: "None",
    opponentHp: 100,
    opponentLastAction: "None",
    isMyTurn: false,
  });

  // Hubungkan wallet saat pertama kali
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await newProvider.getSigner();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);
        const newAddress = await newSigner.getAddress();

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        setAddress(newAddress);
      }
    };
    init();
  }, []);

  const joinGame = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinGame();
      await tx.wait();
      fetchGameStatus();
    } catch (err) {
      console.error("Join Game Failed:", err);
    }
  };

  const fetchGameStatus = async () => {
    if (!contract || !address) return;
    try {
      const player = await contract.players(address);
      const opponentAddr = player.opponent;

      let opponent = {
        hp: 100,
        lastAction: "None",
      };

      if (opponentAddr !== ethers.ZeroAddress) {
        const opp = await contract.players(opponentAddr);
        opponent = {
          hp: Number(opp.hp),
          lastAction: Object.keys(Action)[opp.lastAction] || "None",
        };
      }

      setStatus({
        myHp: Number(player.hp),
        myLastAction: Object.keys(Action)[player.lastAction] || "None",
        opponentHp: opponent.hp,
        opponentLastAction: opponent.lastAction,
        isMyTurn: player.isTurn,
      });
    } catch (err) {
      console.error("Fetch Game Status Failed:", err);
    }
  };

  const handleAction = async (action) => {
    if (!contract || !status.isMyTurn) return;

    try {
      let tx;
      if (action === "attack") {
        tx = await contract.attack();
      } else if (action === "defend") {
        tx = await contract.defend();
      } else if (action === "heal") {
        tx = await contract.heal();
      }

      if (tx) {
        await tx.wait();
        fetchGameStatus();
      }
    } catch (err) {
      console.error(`Action ${action} failed:`, err);
    }
  };

  useEffect(() => {
    if (contract && address) {
      fetchGameStatus();

      const interval = setInterval(fetchGameStatus, 5000); // update setiap 5 detik
      return () => clearInterval(interval);
    }
  }, [contract, address]);

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <div className="text-center text-2xl font-bold">Arena PvP</div>
      <p className="text-center">
        Status: {status.opponentHp === 100 ? "Menunggu lawan..." : status.isMyTurn ? "Giliranmu!" : "Menunggu giliran lawan..."}
      </p>
      {!status.opponentHp && (
        <button
          onClick={joinGame}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Gabung PvP
        </button>
      )}
      <GameStatus status={status} />
      <ActionButtons onAction={handleAction} isDisabled={!status.isMyTurn} />
    </div>
  );
};

const Action = {
  None: 0,
  Attack: 1,
  Defend: 2,
  Heal: 3,
};

export default ArenaPVP;
