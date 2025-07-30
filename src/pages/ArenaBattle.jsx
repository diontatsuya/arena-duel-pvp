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
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [status, setStatus] = useState("Memuat status pertandingan...");
  const [isLoading, setIsLoading] = useState(false);
  const [myAddress, setMyAddress] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);
        const address = await tempSigner.getAddress();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setMyAddress(address);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (contract && myAddress) {
      fetchGameStatus();
      const interval = setInterval(fetchGameStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [contract, myAddress]);

  const fetchGameStatus = async () => {
    try {
      const battleId = await contract.getPlayerBattle(myAddress);
      if (battleId.toString() === "0") {
        setStatus("Kamu belum dalam pertandingan.");
        return;
      }

      const battle = await contract.battles(battleId);

      const isPlayer1 = battle.player1.addr.toLowerCase() === myAddress.toLowerCase();
      const opponentAddr = isPlayer1 ? battle.player2.addr : battle.player1.addr;

      if (opponentAddr === ethers.ZeroAddress) {
        setStatus("Menunggu lawan...");
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
      setStatus("Pertandingan berlangsung!");
    } catch (error) {
      console.error("Gagal memuat status pertandingan:", error);
      setStatus("Gagal memuat status pertandingan.");
    }
  };

  const handleAction = async (action) => {
    if (!contract) return;
    setIsLoading(true);
    try {
      let actionCode;
      if (action === "attack") actionCode = 0;
      else if (action === "defend") actionCode = 1;
      else if (action === "heal") actionCode = 2;

      const tx = await contract.takeAction(actionCode);
      await tx.wait();
      fetchGameStatus();
    } catch (err) {
      console.error("Aksi gagal:", err);
    }
    setIsLoading(false);
  };

  const handleLeave = async () => {
    if (!contract) return;
    setIsLoading(true);
    try {
      const tx = await contract.leaveBattle();
      await tx.wait();
      navigate("/arena-pvp");
    } catch (err) {
      console.error("Gagal keluar dari game:", err);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Arena Battle PvP</h1>
      <p className="text-center text-sm text-gray-400">{status}</p>

      <BattleStatus player={player} opponent={opponent} isMyTurn={isMyTurn} />

      {isMyTurn && (
        <BattleControls onAction={handleAction} isLoading={isLoading} />
      )}

      <div className="text-center mt-6">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          onClick={handleLeave}
          disabled={isLoading}
        >
          Tinggalkan Pertandingan
        </button>
      </div>
    </div>
  );
};

export default ArenaBattle;
