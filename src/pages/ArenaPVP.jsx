import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/ui/HealthBar";
import ActionButtons from "../components/ui/ActionButton";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _address = await _signer.getAddress();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        setAddress(_address);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!contract || !address) return;
      try {
        const playerData = await contract.players(address);
        const opponentAddress = playerData.opponent;

        let opponentData = null;
        if (opponentAddress !== ethers.ZeroAddress) {
          opponentData = await contract.players(opponentAddress);
        }

        setPlayer({ ...playerData, address });
        setOpponent({ ...opponentData, address: opponentAddress });
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();

    const interval = setInterval(fetchPlayers, 2000);
    return () => clearInterval(interval);
  }, [contract, address]);

  const isMatched = player && player.opponent !== ethers.ZeroAddress;
  const isPlayerTurn = player?.isTurn;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Arena PVP</h1>

      {!isMatched ? (
        <p className="text-center text-yellow-400">Menunggu lawan bergabung...</p>
      ) : (
        <>
          <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-4">
            <h2 className="text-lg font-bold mb-2">Kamu</h2>
            <p className="text-sm break-all">{player.address}</p>
            <HealthBar hp={Number(player.hp)} />
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-4">
            <h2 className="text-lg font-bold mb-2">Lawan</h2>
            <p className="text-sm break-all">{opponent?.address}</p>
            <HealthBar hp={Number(opponent?.hp || 0)} />
          </div>

          {isPlayerTurn ? (
            <ActionButtons contract={contract} address={address} />
          ) : (
            <p className="text-center text-blue-300 mt-4">Menunggu giliran lawan...</p>
          )}
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
