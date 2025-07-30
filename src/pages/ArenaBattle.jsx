import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";

const ArenaBattle = () => {
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [myAddress, setMyAddress] = useState(null);

  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [status, setStatus] = useState("🔄 Memuat status pertandingan...");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!window.ethereum) {
        setStatus("❌ MetaMask tidak ditemukan.");
        return;
      }

      try {
        const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        const tempSigner = tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);
        const address = await tempSigner.getAddress();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setMyAddress(address);
      } catch (err) {
        console.error("Gagal inisialisasi:", err);
        setStatus("❌ Gagal menginisialisasi kontrak.");
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (contract && myAddress) {
      updateBattleStatus();
      const interval = setInterval(updateBattleStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [contract, myAddress]);

  const updateBattleStatus = async () => {
    try {
      const battleId = await contract.getPlayerBattle(myAddress);
      if (battleId.toString() === "0") {
        setStatus("⚠️ Kamu belum dalam pertandingan.");
        return;
      }

      const battle = await contract.battles(battleId);

      const isPlayer1 = battle.player1.addr.toLowerCase() === myAddress.toLowerCase();
      const opponentAddr = isPlayer1 ? battle.player2.addr : battle.player1.addr;

      if (opponentAddr === "0x0000000000000000000000000000000000000000") {
        setStatus("⏳ Menunggu lawan bergabung...");
        return;
      }

      setPlayer({
        hp: Number(isPlayer1 ? battle.player1.hp : battle.player2.hp),
        lastAction: isPlayer1 ? battle.player1.lastAction : battle.player2.lastAction,
      });

      setOpponent({
        hp: Number(isPlayer1 ? battle.player2.hp : battle.player1.hp),
        lastAction: isPlayer1 ? battle.player2.lastAction : battle.player1.lastAction,
      });

      const isTurn = battle.currentTurn.toLowerCase() === myAddress.toLowerCase();
      setIsMyTurn(isTurn);
      setStatus("🔥 Pertandingan sedang berlangsung!");
    } catch (err) {
      console.error("Gagal mengambil status pertandingan:", err);
      setStatus("❌ Gagal mengambil status pertandingan.");
    }
  };

  const handleAction = async (action) => {
    if (!contract || isLoading) return;
    setIsLoading(true);
    try {
      const actionCode = {
        attack: 0,
        defend: 1,
        heal: 2,
      }[action];

      if (actionCode === undefined) {
        console.error("Aksi tidak valid:", action);
        return;
      }

      const tx = await contract.takeAction(actionCode);
      await tx.wait();
      await updateBattleStatus();
    } catch (err) {
      console.error("❌ Aksi gagal:", err);
    }
    setIsLoading(false);
  };

  const handleLeave = async () => {
    if (!contract || isLoading) return;
    setIsLoading(true);
    try {
      const tx = await contract.leaveBattle();
      await tx.wait();
      navigate("/arena-pvp");
    } catch (err) {
      console.error("Gagal keluar dari pertandingan:", err);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">⚔️ Arena Battle PvP</h1>
      <p className="text-center text-gray-400 mb-6">{status}</p>

      <BattleStatus player={player} opponent={opponent} isMyTurn={isMyTurn} />

      {isMyTurn && (
        <BattleControls onAction={handleAction} isLoading={isLoading} />
      )}

      <div className="text-center mt-8">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
          onClick={handleLeave}
          disabled={isLoading}
        >
          🚪 Tinggalkan Pertandingan
        </button>
      </div>
    </div>
  );
};

export default ArenaBattle;
