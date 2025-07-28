import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import GameStatus from "../components/ui/GameStatus";
import ActionButtons from "../components/ui/ActionButtons";

const ActionEnum = {
  0: "None",
  1: "Attack",
  2: "Defend",
  3: "Heal",
};

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState({
    myHp: 100,
    myLastAction: "None",
    opponentHp: 100,
    opponentLastAction: "None",
  });
  const [isWaiting, setIsWaiting] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);

        // Cek apakah sudah bergabung sebelumnya
        const address = await _signer.getAddress();
        const player = await _contract.players(address);
        if (player.opponent !== ethers.ZeroAddress || Number(player.hp) < 100) {
          setIsJoined(true);
        }
      }
    };

    init();
  }, []);

  const joinMatch = async () => {
    if (!contract || !signer || isLoading) return;
    setIsLoading(true);

    try {
      const address = await signer.getAddress();
      const player = await contract.players(address);

      if (player.opponent !== ethers.ZeroAddress) {
        alert("Kamu sudah dalam game aktif. Selesaikan dulu atau tunggu lawan!");
        setIsJoined(true);
        await fetchStatus();
        setIsLoading(false);
        return;
      }

      const tx = await contract.joinGame();
      await tx.wait();
      setIsJoined(true);
      await fetchStatus();
    } catch (err) {
      console.error("Join match failed:", err);
    }

    setIsLoading(false);
  };

  const fetchStatus = async () => {
    if (!contract || !signer) return;

    const address = await signer.getAddress();
    const player = await contract.players(address);

    let opponent = { hp: 100, lastAction: 0 };
    if (player.opponent !== ethers.ZeroAddress) {
      opponent = await contract.players(player.opponent);
    }

    setStatus({
      myHp: Number(player.hp ?? 100),
      myLastAction: ActionEnum[player.lastAction] || "None",
      opponentHp: Number(opponent.hp ?? 100),
      opponentLastAction: ActionEnum[opponent.lastAction] || "None",
    });

    setIsMyTurn(player.isTurn);
    setIsWaiting(player.opponent === ethers.ZeroAddress);
  };

  const handleAction = async (action) => {
    if (!contract || !isMyTurn) return;
    setIsLoading(true);

    try {
      let tx;
      if (action === "attack") tx = await contract.attack();
      if (action === "defend") tx = await contract.defend();
      if (action === "heal") tx = await contract.heal();

      if (tx) await tx.wait();
      await fetchStatus();
    } catch (err) {
      console.error(`Action ${action} failed:`, err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (contract && signer) {
      fetchStatus();
      const interval = setInterval(() => {
        fetchStatus();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [contract, signer]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Arena PvP</h1>

      {!isJoined ? (
        <button
          onClick={joinMatch}
          disabled={isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? "Gabung..." : "Gabung PvP"}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="text-white text-lg">
            Status: {isWaiting ? "Menunggu lawan..." : isMyTurn ? "Giliranmu!" : "Giliran lawan..."}
          </div>

          <GameStatus status={status} />
          <ActionButtons onAction={handleAction} isDisabled={!isMyTurn || isLoading} />
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
