import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const BattlePVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [txPending, setTxPending] = useState(false);

  // Initialize provider and contract
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

  // Get battle status
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
      interval = setInterval(fetchStatus, 3000); // refresh every 3s
    }

    return () => clearInterval(interval);
  }, [contract, signer]);

  const performAction = async (action) => {
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

      <div className="grid grid-cols-2 gap-4 text-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Kamu</h3>
          <p className="text-sm break-all">{player}</p>
          <p>HP: {status.player1 === player ? status.hp1 : status.hp2}</p>
          <p>Aksi Terakhir: {status.player1 === player ? status.lastAction1 : status.lastAction2}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Lawan</h3>
          <p className="text-sm break-all">{opponent}</p>
          <p>HP: {status.player1 === player ? status.hp2 : status.hp1}</p>
          <p>Aksi Terakhir: {status.player1 === player ? status.lastAction2 : status.lastAction1}</p>
        </div>
      </div>

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

      {isPlayerTurn && status.winner === ethers.ZeroAddress && (
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            onClick={() => performAction(0)}
            disabled={txPending}
          >
            Serang
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            onClick={() => performAction(1)}
            disabled={txPending}
          >
            Bertahan
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            onClick={() => performAction(2)}
            disabled={txPending}
          >
            Heal
          </button>
        </div>
      )}
    </div>
  );
};

export default BattlePVP;
