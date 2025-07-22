import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerAddress, setPlayerAddress] = useState(null);
  const [opponentAddress, setOpponentAddress] = useState(null);
  const [playerHP, setPlayerHP] = useState(0);
  const [opponentHP, setOpponentHP] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTurn, setIsTurn] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [opponentAction, setOpponentAction] = useState(null);
  const [animatingAction, setAnimatingAction] = useState(null);

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
        setPlayerAddress(address);
        setIsConnected(true);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!contract || !playerAddress) return;

      const player = await contract.players(playerAddress);
      setOpponentAddress(player.opponent);
      setPlayerHP(player.hp);
      setIsTurn(player.isTurn);
      setLastAction(player.lastAction);

      if (player.opponent !== ethers.ZeroAddress) {
        const opponent = await contract.players(player.opponent);
        setOpponentHP(opponent.hp);
        setOpponentAction(opponent.lastAction);
      }

      setIsWaiting(player.opponent === ethers.ZeroAddress);
    };

    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [contract, playerAddress]);

  const handleJoinPVP = async () => {
    if (!contract || !signer) return;

    try {
      const tx = await contract.joinPVP({ value: ethers.parseEther("0.001") }); // fee kecil untuk join
      await tx.wait();
    } catch (err) {
      console.error("Failed to join:", err);
    }
  };

  const performAction = async (action) => {
    if (!contract || !isTurn) return;

    try {
      const tx = await contract.takeAction(action);
      setAnimatingAction(action);
      await tx.wait();
      setAnimatingAction(null);
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const renderHP = (hp) => `${hp} / 100`;

  return (
    <div className="text-center p-4 space-y-6">
      <h1 className="text-3xl font-bold">Arena PVP</h1>

      {!isConnected ? (
        <p className="text-red-400">Belum terhubung</p>
      ) : (
        <>
          {isWaiting && (
            <div className="text-yellow-400 text-xl">Menunggu lawan bergabung...</div>
          )}

          {!opponentAddress || opponentAddress === ethers.ZeroAddress ? (
            <button
              onClick={handleJoinPVP}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Gabung PvP
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
              <div>
                <h2 className="font-semibold">Kamu</h2>
                <p className="text-xs break-all">{playerAddress}</p>
                <p className="text-lg text-green-400">{renderHP(playerHP)}</p>
                {lastAction && (
                  <p className="text-sm text-gray-300">Aksi Terakhir: {ActionName(lastAction)}</p>
                )}
                {isTurn && <p className="text-blue-400 mt-1">Giliran kamu!</p>}
              </div>

              <div>
                <h2 className="font-semibold">Lawan</h2>
                <p className="text-xs break-all">{opponentAddress}</p>
                <p className="text-lg text-red-400">{renderHP(opponentHP)}</p>
                {opponentAction && (
                  <p className="text-sm text-gray-300">Aksi Terakhir: {ActionName(opponentAction)}</p>
                )}
              </div>
            </div>
          )}

          {isTurn && (
            <div className="mt-6 space-x-2">
              <button
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                onClick={() => performAction(1)}
              >
                Serang
              </button>
              <button
                className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
                onClick={() => performAction(2)}
              >
                Bertahan
              </button>
              <button
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                onClick={() => performAction(3)}
              >
                Heal
              </button>
            </div>
          )}

          {animatingAction && (
            <div className="mt-4 text-purple-300 animate-pulse">
              Melakukan aksi: {ActionName(animatingAction)}...
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ActionName = (id) => {
  switch (Number(id)) {
    case 1:
      return "Serang";
    case 2:
      return "Bertahan";
    case 3:
      return "Heal";
    default:
      return "-";
  }
};

export default ArenaPVP;
