import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import GameStatus from "../components/ui/GameStatus";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask tidak ditemukan");
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const selectedAccount = accounts[0];
      setAccount(selectedAccount);
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      const tempSigner = await tempProvider.getSigner();
      const tempContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        tempSigner
      );
      setProvider(tempProvider);
      setSigner(tempSigner);
      setContract(tempContract);
      setStatus("Terhubung");
    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
    }
  };

  const joinMatch = async () => {
    if (!contract || !account) return;
    try {
      setIsLoading(true);
      const tx = await contract.joinMatch();
      await tx.wait();
      setStatus("Bergabung ke pertandingan...");
      await fetchStatus();
    } catch (error) {
      console.error("Gagal bergabung ke pertandingan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatus = async () => {
    if (!contract || !account) return;
    try {
      const playerData = await contract.players(account);
      setPlayer(playerData);
      if (
        playerData.opponent !== ethers.ZeroAddress &&
        playerData.opponent !== account
      ) {
        const opponentData = await contract.players(playerData.opponent);
        setOpponent(opponentData);
        setStatus("Bertanding");
      } else {
        setStatus("Menunggu lawan...");
      }
    } catch (error) {
      console.error("Gagal mengambil status:", error);
    }
  };

  useEffect(() => {
    if (account && contract) {
      fetchStatus();
    }
  }, [account, contract]);

  return (
    <div className="flex flex-col items-center mt-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p className="mb-6">Status: {status}</p>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
        >
          Hubungkan Wallet
        </button>
      ) : status === "Belum terhubung" ||
        status === "Menunggu lawan..." ||
        status === "Bergabung ke pertandingan..." ? (
        <button
          onClick={joinMatch}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg disabled:opacity-50"
          disabled={isLoading || status === "Bertanding"}
        >
          Gabung PvP
        </button>
      ) : null}

      {status === "Bertanding" && (
        <GameStatus player={player} opponent={opponent} />
      )}
    </div>
  );
};

export default ArenaPVP;
