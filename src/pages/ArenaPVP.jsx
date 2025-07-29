import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

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
        setWalletAddress(address);

        await updateStatus(tempContract, address);
      } else {
        setStatus("MetaMask tidak ditemukan.");
      }
    };

    init();
  }, []);

  const updateStatus = async (contract, address) => {
    const game = await contract.games(address);
    if (game.player2 === ethers.ZeroAddress) {
      setStatus("Menunggu lawan...");
    } else {
      setStatus("Pertandingan dimulai!");
    }

    const [player, opponent] = address.toLowerCase() === game.player1.toLowerCase()
      ? [game.player1, game.player2]
      : [game.player2, game.player1];

    const playerStats = await contract.players(player);
    const opponentStats = await contract.players(opponent);

    setPlayerData({ address: player, ...playerStats });
    setOpponentData({ address: opponent, ...opponentStats });
    setIsMyTurn(game.turn.toLowerCase() === address.toLowerCase());
  };

  const handleAction = async (action) => {
    if (!contract) return;
    const tx = await contract.takeTurn(action);
    await tx.wait();
    await updateStatus(contract, walletAddress);
  };

  const renderPlayer = (title, data) => {
    return (
      <div className="border p-4 rounded-lg w-full sm:w-1/2">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        {data ? (
          <>
            <HealthBar current={data.hp} max={100} />
            <p><strong>HP:</strong> {data.hp ?? "???"}</p>
            <p><strong>Aksi Terakhir:</strong> {data.lastAction}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Arena PvP</h2>
      <p className="mb-4">Status: {status}</p>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {renderPlayer("Kamu", playerData)}
        {renderPlayer("Lawan", opponentData)}
      </div>
      {isMyTurn && (
        <div className="flex gap-2">
          <button
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            onClick={() => handleAction(0)}
          >
            Serang
          </button>
          <button
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleAction(1)}
          >
            Bertahan
          </button>
          <button
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            onClick={() => handleAction(2)}
          >
            Heal
          </button>
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
