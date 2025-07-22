import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import ActionButtons from "../components/ui/ActionButton";
import HealthBar from "../components/ui/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState({});
  const [opponent, setOpponent] = useState({});
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Menunggu lawan bergabung...");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Install MetaMask");
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      const tempSigner = await tempProvider.getSigner();
      const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

      setProvider(tempProvider);
      setSigner(tempSigner);
      setContract(tempContract);

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const playerAddress = await tempSigner.getAddress();
      const data = await tempContract.players(playerAddress);
      const opponentAddress = data.opponent;

      if (opponentAddress !== ethers.constants.AddressZero) {
        const opponentData = await tempContract.players(opponentAddress);
        setOpponent({
          address: opponentAddress,
          hp: opponentData.hp.toNumber(),
          lastAction: opponentData.lastAction,
        });
        setStatus("Pertarungan dimulai!");
      }

      setPlayer({
        address: playerAddress,
        hp: data.hp.toNumber(),
        lastAction: data.lastAction,
      });

      setIsPlayerTurn(data.isTurn);
    };

    init();
  }, []);

  const fetchStatus = async () => {
    const playerAddress = await signer.getAddress();
    const data = await contract.players(playerAddress);
    const opponentData = await contract.players(data.opponent);

    setPlayer({
      address: playerAddress,
      hp: data.hp.toNumber(),
      lastAction: data.lastAction,
    });

    setOpponent({
      address: data.opponent,
      hp: opponentData.hp.toNumber(),
      lastAction: opponentData.lastAction,
    });

    setIsPlayerTurn(data.isTurn);
  };

  const handleAction = async (action) => {
    try {
      setLoading(true);
      const tx = await contract.takeTurn(action);
      await tx.wait();

      setStatus(`Kamu memilih ${action.toUpperCase()}!`);
      await fetchStatus();
    } catch (error) {
      console.error("Gagal mengirim aksi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-4">Arena PVP</h1>
      <p className="mb-4">{status}</p>

      <div className="flex justify-around w-full max-w-3xl">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Kamu</h2>
          <HealthBar currentHP={player.hp || 0} maxHP={100} />
          <p className="mt-2">{player.hp || 0} / 100</p>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold">Lawan</h2>
          <HealthBar currentHP={opponent.hp || 0} maxHP={100} />
          <p className="mt-2">{opponent.hp || 0} / 100</p>
        </div>
      </div>

      <ActionButtons
        isPlayerTurn={isPlayerTurn}
        onActionSelected={handleAction}
        isLoading={loading}
      />
    </div>
  );
};

export default ArenaPVP;
