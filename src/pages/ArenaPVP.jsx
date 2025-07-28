import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");

  const [player, setPlayer] = useState({ hp: 0, lastAction: "None" });
  const [opponent, setOpponent] = useState({ hp: 0, lastAction: "None" });
  const [isMyTurn, setIsMyTurn] = useState(false);

  // ✅ Hubungkan wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask tidak ditemukan!");
      return;
    }

    try {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = ethProvider.getSigner();
      const address = await signer.getAddress();

      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setAccount(address);
      setProvider(ethProvider);
      setContract(gameContract);
      setStatus("Terhubung");

      await fetchGameStatus(gameContract, address);
    } catch (error) {
      console.error("Gagal hubungkan wallet:", error);
    }
  };

  // ✅ Ambil status pemain
  const fetchGameStatus = async (gameContract, userAddress) => {
    try {
      const playerData = await gameContract.players(userAddress);
      const opponentAddress = playerData.opponent;

      const opponentData =
        opponentAddress !== ethers.constants.AddressZero
          ? await gameContract.players(opponentAddress)
          : { hp: 0, lastAction: "None" };

      setPlayer({
        hp: playerData.hp.toNumber(),
        lastAction: Object.keys(Action)[playerData.lastAction],
      });

      setOpponent({
        hp: opponentData.hp.toNumber(),
        lastAction: Object.keys(Action)[opponentData.lastAction],
      });

      setIsMyTurn(playerData.isTurn);
    } catch (err) {
      console.error("Gagal ambil status:", err);
    }
  };

  // ✅ Aksi PvP
  const handleAction = async (actionType) => {
    if (!contract || !isMyTurn) return;

    try {
      const tx = await contract.takeAction(actionType);
      await tx.wait();
      await fetchGameStatus(contract, account);
    } catch (error) {
      console.error("Gagal aksi:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  const Action = {
    None: 0,
    Attack: 1,
    Defend: 2,
    Heal: 3,
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold mb-2">Arena PvP</h2>
      <p className="mb-4">Status: {status}</p>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Kamu</h3>
        <p>HP: {player.hp}</p>
        <p>Aksi Terakhir: {player.lastAction}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Lawan</h3>
        <p>HP: {opponent.hp}</p>
        <p>Aksi Terakhir: {opponent.lastAction}</p>
      </div>

      {isMyTurn ? (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction(Action.Attack)}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Serang
          </button>
          <button
            onClick={() => handleAction(Action.Defend)}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Bertahan
          </button>
          <button
            onClick={() => handleAction(Action.Heal)}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Heal
          </button>
        </div>
      ) : (
        <p>Menunggu giliran lawan...</p>
      )}
    </div>
  );
};

export default ArenaPVP;
