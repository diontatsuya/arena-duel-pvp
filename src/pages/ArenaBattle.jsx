import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import BattleStatus from "../components/ui/BattleStatus";
import BattleControls from "../components/ui/BattleControls";

const ArenaBattle = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [txPending, setTxPending] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
      }
    };
    init();
  }, []);

  useEffect(() => {
    let interval;
    const fetchStatus = async () => {
      if (!contract || !signer) return;
      const address = await signer.getAddress();
      const battle = await contract.getBattle(address);
      setStatus(battle);
      setPlayer(battle.player1 === address ? battle.player1 : battle.player2);
      setOpponent(battle.player1 === address ? battle.player2 : battle.player1);
      setIsPlayerTurn(battle.currentTurn === address);
    };

    if (contract && signer) {
      fetchStatus();
      interval = setInterval(fetchStatus, 3000);
    }

    return () => clearInterval(interval);
  }, [contract, signer]);

  const handleAction = async (action) => {
    if (!contract || !signer || txPending) return;
    try {
      setTxPending(true);
      const tx = await contract.performAction(action);
      await tx.wait();
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setTxPending(false);
    }
  };

  if (!status || !player || !opponent) {
    return <div className="text-center p-4">Loading battle data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Arena PvP Battle</h2>

      <BattleStatus status={status} player={player} opponent={opponent} />

      <div className="text-center mb-4">
        {status.winner === ethers.ZeroAddress ? (
          isPlayerTurn ? (
            <p className="text-green-400 font-bold">Giliranmu!</p>
          ) : (
            <p className="text-yellow-400">Menunggu giliran lawan...</p>
          )
        ) : (
          <p className="text-red-400 font-bold">
            Pertandingan selesai! {status.winner === player ? "Kamu menang!" : "Kamu kalah!"}
          </p>
        )}
      </div>

      {status.winner === ethers.ZeroAddress && (
        <BattleControls
          isPlayerTurn={isPlayerTurn}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default ArenaBattle;
