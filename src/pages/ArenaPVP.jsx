import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ActionButtons from "../components/ui/ActionButton";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerAddress, setPlayerAddress] = useState("");
  const [opponentAddress, setOpponentAddress] = useState("");
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        const newSigner = newProvider.getSigner();
        setSigner(newSigner);
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);
        setContract(newContract);

        const address = await newSigner.getAddress();
        setPlayerAddress(address);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract && playerAddress) {
      fetchGameState();
    }
  }, [contract, playerAddress]);

  const fetchGameState = async () => {
    try {
      const playerData = await contract.players(playerAddress);

      const opponentAddr = playerData.opponent;
      setOpponentAddress(opponentAddr);
      setPlayerHp(playerData.hp?.toNumber() || 0);
      setIsPlayerTurn(playerData.isTurn);
      setLastAction(playerData.lastAction);

      if (opponentAddr !== ethers.constants.AddressZero) {
        const opponentData = await contract.players(opponentAddr);
        setOpponentHp(opponentData.hp?.toNumber() || 0);
      } else {
        setOpponentHp(0);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch game state:", err);
    }
  };

  const handleAction = async (action) => {
    if (!contract || !signer) return;
    try {
      const tx = await contract.takeAction(action);
      await tx.wait();
      fetchGameState(); // refresh state after action
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-center bg-gray-800 rounded-xl shadow-lg mt-10">
      <h1 className="text-3xl font-bold mb-4">Arena PVP</h1>

      {loading ? (
        <p className="animate-pulse text-yellow-300">Menunggu lawan bergabung...</p>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Kamu</h2>
            <p className="text-sm break-all text-green-300">{playerAddress}</p>
            <p className="text-lg font-bold">{playerHp} / 100</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold">Lawan</h2>
            <p className="text-sm break-all text-red-300">{opponentAddress}</p>
            <p className="text-lg font-bold">{opponentHp} / 100</p>
          </div>

          {opponentAddress === ethers.constants.AddressZero ? (
            <p className="text-yellow-300 animate-pulse">Menunggu lawan bergabung...</p>
          ) : isPlayerTurn ? (
            <>
              <p className="text-green-400 mb-2">Giliran kamu!</p>
              <ActionButtons onAction={handleAction} disabled={false} />
            </>
          ) : (
            <>
              <p className="text-red-400 mb-2">Menunggu giliran lawan...</p>
              <ActionButtons onAction={() => {}} disabled={true} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
