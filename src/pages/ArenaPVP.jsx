import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import ActionButtons from "../components/ui/ActionButtons";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [playerData, setPlayerData] = useState({ hp: 100, lastAction: 0 });
  const [opponentData, setOpponentData] = useState({ hp: 100, lastAction: 0 });
  const [isMyTurn, setIsMyTurn] = useState(false);

  const actionToText = (actionCode) => {
    switch (actionCode) {
      case 1: return "Attack";
      case 2: return "Defend";
      case 3: return "Heal";
      default: return "None";
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const prov = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(prov);

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = prov.getSigner();
        setSigner(signer);

        const address = await signer.getAddress();
        setUserAddress(address);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setContract(contract);
        setStatus("Terhubung");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract && userAddress) {
      const fetchStatus = async () => {
        const player = await contract.players(userAddress);
        const opponent = await contract.players(player.opponent);

        setPlayerData({
          hp: player.hp.toNumber(),
          lastAction: player.lastAction,
        });

        setOpponentData({
          hp: opponent.hp.toNumber(),
          lastAction: opponent.lastAction,
        });

        setIsMyTurn(player.isTurn);
        setStatus(player.opponent === ethers.constants.AddressZero
          ? "Menunggu lawan..."
          : player.isTurn
          ? "Giliranmu!"
          : "Menunggu giliran lawan...");
      };

      fetchStatus();

      const interval = setInterval(fetchStatus, 4000);
      return () => clearInterval(interval);
    }
  }, [contract, userAddress]);

  const handleAction = async (action) => {
    if (!contract || !isMyTurn) return;

    let actionCode = 0;
    if (action === "attack") actionCode = 1;
    else if (action === "defend") actionCode = 2;
    else if (action === "heal") actionCode = 3;

    try {
      const tx = await contract.performAction(actionCode);
      await tx.wait();
    } catch (err) {
      console.error("Gagal melakukan aksi:", err);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p className="mb-4">Status: {status}</p>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left bg-gray-800 p-4 rounded-xl">
        <div>
          <h2 className="text-xl font-semibold">Kamu</h2>
          <p>HP: {playerData.hp}</p>
          <p>Aksi Terakhir: {actionToText(playerData.lastAction)}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Lawan</h2>
          <p>HP: {opponentData.hp}</p>
          <p>Aksi Terakhir: {actionToText(opponentData.lastAction)}</p>
        </div>
      </div>

      <ActionButtons onAction={handleAction} isDisabled={!isMyTurn} />
    </div>
  );
};

export default ArenaPVP;
