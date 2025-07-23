import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const BattlePVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [account, setAccount] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [message, setMessage] = useState("");

  const ACTION = {
    None: 0,
    Attack: 1,
    Defend: 2,
    Heal: 3,
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);
        const tempAccount = await tempSigner.getAddress();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setAccount(tempAccount);
      }
    };

    init();
  }, []);

  const fetchStatus = async () => {
    if (contract && account) {
      try {
        const player = await contract.players(account);
        const opponent = await contract.players(player.opponent);
        setPlayerStatus(player);
        setOpponentStatus(opponent);
      } catch (error) {
        console.error("Gagal mengambil status:", error);
      }
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // polling tiap 5 detik
    return () => clearInterval(interval);
  }, [contract, account]);

  const handleAction = async (actionType) => {
    if (!contract || !playerStatus?.isTurn) return;
    setActionInProgress(true);
    setMessage("Mengirim aksi...");

    try {
      const tx = await contract.performAction(actionType);
      await tx.wait();
      setMessage("Aksi berhasil!");
    } catch (err) {
      console.error(err);
      setMessage("Aksi gagal!");
    } finally {
      setActionInProgress(false);
      fetchStatus();
    }
  };

  const renderStatus = () => {
    if (!playerStatus || !opponentStatus) return null;

    const playerHP = Number(playerStatus.hp);
    const opponentHP = Number(opponentStatus.hp);
    const isPlayerTurn = playerStatus.isTurn;
    const opponentAddress = playerStatus.opponent;

    if (opponentAddress === "0x0000000000000000000000000000000000000000") {
      return <p className="text-yellow-400 mt-4">Menunggu lawan bergabung...</p>;
    }

    if (playerHP <= 0) {
      return <p className="text-red-500 mt-4">Kamu kalah!</p>;
    }

    if (opponentHP <= 0) {
      return <p className="text-green-500 mt-4">Kamu menang!</p>;
    }

    return (
      <div className="mt-4 space-y-4">
        <p>Giliran: <span className="font-semibold">{isPlayerTurn ? "Kamu" : "Lawan"}</span></p>
        <p className="text-blue-400">HP Kamu: {playerHP}</p>
        <p className="text-red-400">HP Lawan: {opponentHP}</p>

        <div className="space-x-2">
          <button
            onClick={() => handleAction(ACTION.Attack)}
            disabled={!isPlayerTurn || actionInProgress}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded"
          >
            Serang
          </button>
          <button
            onClick={() => handleAction(ACTION.Defend)}
            disabled={!isPlayerTurn || actionInProgress}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded"
          >
            Bertahan
          </button>
          <button
            onClick={() => handleAction(ACTION.Heal)}
            disabled={!isPlayerTurn || actionInProgress}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-4 py-2 rounded"
          >
            Heal
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-white mb-6">Pertarungan PvP</h1>
      {renderStatus()}
      {message && <p className="mt-4 text-yellow-300">{message}</p>}
    </div>
  );
};

export default BattlePVP;
