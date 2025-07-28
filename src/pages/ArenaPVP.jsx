import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ActionButtons from "../components/ui/ActionButtons";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const ACTIONS = {
  attack: 0,
  defend: 1,
  heal: 2,
};

const ArenaPVP = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hubungkan wallet dan setup provider, signer, contract
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    }
  };

  const joinMatch = async () => {
    try {
      setIsLoading(true);
      const tx = await contract.join();
      await tx.wait();
      await fetchGameData();
    } catch (error) {
      console.error("Error join:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGameData = async () => {
    if (!contract || !account) return;

    try {
      const player = await contract.getPlayerData(account);
      const opponent = await contract.getOpponentData(account);

      setPlayerData(player);
      setOpponentData(opponent);

      setIsWaiting(player.opponent === ethers.ZeroAddress);
      setIsMyTurn(player.isTurn);
    } catch (err) {
      console.error("Error fetching game data:", err);
    }
  };

  const handleAction = async (action) => {
    if (!contract || !account || !isMyTurn) return;

    try {
      setIsLoading(true);
      const tx = await contract.takeAction(ACTIONS[action]);
      await tx.wait();
      await fetchGameData();
    } catch (error) {
      console.error("Action error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && account) {
      fetchGameData();

      const interval = setInterval(fetchGameData, 5000); // refresh status
      return () => clearInterval(interval);
    }
  }, [contract, account]);

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold mb-4">Arena PvP</h1>
      {account ? (
        <>
          <p className="mb-2">Status: {isWaiting ? "Menunggu lawan..." : "Bertarung"}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Kamu</h2>
              <p>HP: {playerData?.hp.toString() ?? "-"}</p>
              <p>Aksi Terakhir: {ACTIONS_REVERSE[playerData?.lastAction?.toString()] ?? "-"}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Lawan</h2>
              <p>HP: {opponentData?.hp.toString() ?? "-"}</p>
              <p>Aksi Terakhir: {ACTIONS_REVERSE[opponentData?.lastAction?.toString()] ?? "-"}</p>
            </div>
          </div>

          {isWaiting ? (
            <button
              onClick={joinMatch}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Menunggu..." : "Gabung PvP"}
            </button>
          ) : (
            <div>
              <p className="mb-2">{isMyTurn ? "Giliranmu!" : "Menunggu giliran lawan..."}</p>
              <ActionButtons onAction={handleAction} isDisabled={!isMyTurn || isLoading} />
            </div>
          )}
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Hubungkan Wallet
        </button>
      )}
    </div>
  );
};

// Untuk mengubah angka ke nama aksi
const ACTIONS_REVERSE = {
  "0": "Serang",
  "1": "Bertahan",
  "2": "Heal",
};

export default ArenaPVP;
