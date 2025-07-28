import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import ActionButtons from "../components/ui/ActionButtons";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [playerData, setPlayerData] = useState({
    hp: 100,
    lastAction: "None",
  });
  const [opponentData, setOpponentData] = useState({
    hp: 100,
    lastAction: "None",
  });
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Konversi dari number ke nama aksi
  const getActionName = (actionCode) => {
    switch (actionCode) {
      case 1:
        return "Attack";
      case 2:
        return "Defend";
      case 3:
        return "Heal";
      default:
        return "None";
    }
  };

  const fetchGameData = async (signerAddress) => {
    try {
      const player = await contract.players(signerAddress);
      const opponent = await contract.players(player.opponent);

      setPlayerData({
        hp: Number(player.hp),
        lastAction: getActionName(player.lastAction),
      });

      setOpponentData({
        hp: Number(opponent.hp),
        lastAction: getActionName(opponent.lastAction),
      });

      setIsPlayerTurn(player.isTurn);
      setStatus(player.opponent === ethers.constants.AddressZero ? "Menunggu lawan..." : (player.isTurn ? "Giliranmu!" : "Menunggu giliran lawan..."));
    } catch (error) {
      console.error("Gagal ambil data game:", error);
    }
  };

  const handleAction = async (actionType) => {
    if (!contract || !signer) return;

    const actionMap = {
      attack: 1,
      defend: 2,
      heal: 3,
    };

    const actionCode = actionMap[actionType];

    try {
      setIsLoading(true);
      const tx = await contract.takeTurn(actionCode);
      await tx.wait();
      await fetchGameData(await signer.getAddress());
    } catch (error) {
      console.error("Aksi gagal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        await _provider.send("eth_requestAccounts", []);
        const _signer = await _provider.getSigner();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);

        const address = await _signer.getAddress();
        await fetchGameData(address);

        _contract.on("TurnTaken", async () => {
          await fetchGameData(address);
        });
      }
    };

    init();
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Arena PvP</h2>
      <p className="mb-4">Status: {status}</p>

      <div className="grid grid-cols-2 gap-4 text-left max-w-xl mx-auto mb-4">
        <div>
          <h3 className="font-bold">Kamu</h3>
          <p>HP: {playerData.hp}</p>
          <p>Aksi Terakhir: {playerData.lastAction}</p>
        </div>
        <div>
          <h3 className="font-bold">Lawan</h3>
          <p>HP: {opponentData.hp}</p>
          <p>Aksi Terakhir: {opponentData.lastAction}</p>
        </div>
      </div>

      <ActionButtons onAction={handleAction} isDisabled={!isPlayerTurn || isLoading} />
    </div>
  );
};

export default ArenaPVP;
