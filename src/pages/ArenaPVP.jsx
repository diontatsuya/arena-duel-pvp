import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newSigner = newProvider.getSigner();
        const address = await newSigner.getAddress();

        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);
        setAccount(address);
        setStatus("Terhubung");

        fetchGameStatus(newContract, address);
      }
    };

    init();
  }, []);

  const fetchGameStatus = async (contract, address) => {
    try {
      const playerData = await contract.players(address);
      if (playerData.opponent !== ethers.constants.AddressZero) {
        const opponentData = await contract.players(playerData.opponent);
        setPlayer(playerData);
        setOpponent(opponentData);
      } else {
        setPlayer(playerData);
        setOpponent(null);
      }
    } catch (error) {
      console.error("Gagal mengambil status:", error);
    }
  };

  const joinMatch = async () => {
    if (!contract || !signer) return;
    try {
      const tx = await contract.joinMatch();
      setActionInProgress(true);
      await tx.wait();
      fetchGameStatus(contract, account);
    } catch (err) {
      console.error("Gagal gabung match:", err);
    } finally {
      setActionInProgress(false);
    }
  };

  const performAction = async (actionType) => {
    if (!contract || !signer || !player?.isTurn) return;
    try {
      let tx;
      if (actionType === "attack") {
        tx = await contract.attack();
      } else if (actionType === "defend") {
        tx = await contract.defend();
      } else if (actionType === "heal") {
        tx = await contract.heal();
      }
      setActionInProgress(true);
      await tx.wait();
      fetchGameStatus(contract, account);
    } catch (err) {
      console.error("Gagal melakukan aksi:", err);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p>Status: {status}</p>

      {account && (
        <>
          <button
            onClick={joinMatch}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            disabled={actionInProgress}
          >
            Gabung PvP
          </button>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="border p-4 rounded">
              <h2 className="font-bold mb-2">Kamu</h2>
              <p>{account}</p>
              <p>HP: {player ? player.hp.toString() : "-"}</p>
              <p>Aksi Terakhir: {player ? player.lastAction : "-"}</p>
              <p>Giliranku? {player?.isTurn ? "✅" : "❌"}</p>
            </div>

            <div className="border p-4 rounded">
              <h2 className="font-bold mb-2">Lawan</h2>
              <p>{opponent ? opponent.opponent : "Belum ada lawan"}</p>
              <p>HP: {opponent ? opponent.hp.toString() : "-"}</p>
              <p>Aksi Terakhir: {opponent ? opponent.lastAction : "-"}</p>
            </div>
          </div>

          <div className="mt-6 space-x-2">
            <button
              onClick={() => performAction("attack")}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              disabled={!player?.isTurn || actionInProgress}
            >
              Attack
            </button>
            <button
              onClick={() => performAction("defend")}
              className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700"
              disabled={!player?.isTurn || actionInProgress}
            >
              Defend
            </button>
            <button
              onClick={() => performAction("heal")}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              disabled={!player?.isTurn || actionInProgress}
            >
              Heal
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ArenaPVP;
