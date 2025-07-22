import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentStatus, setOpponentStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const tempSigner = await tempProvider.getSigner();
        const tempAccount = await tempSigner.getAddress();
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setAccount(tempAccount);
        setContract(tempContract);
        setIsConnected(true);
      }
    };

    connectWallet();
  }, []);

  const fetchStatus = async () => {
    if (!contract || !account) return;

    const player = await contract.players(account);
    setPlayerStatus(player);

    if (player.opponent !== ethers.ZeroAddress) {
      const opponent = await contract.players(player.opponent);
      setOpponentStatus(opponent);
    } else {
      setOpponentStatus(null);
    }
  };

  const handleJoinMatch = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinMatch();
      await tx.wait();
      fetchStatus();
    } catch (error) {
      console.error("Gagal join match:", error);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchStatus();
    }
  }, [contract, account]);

  const shortenAddress = (addr) =>
    addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "-";

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Arena PvP</h2>
      <p className="mb-2">
        Status:{" "}
        <span className={isConnected ? "text-green-400" : "text-red-400"}>
          {isConnected ? "Terhubung" : "Belum Terhubung"}
        </span>
      </p>
      <p className="mb-4">Akun: {account ? shortenAddress(account) : "-"}</p>

      <button
        onClick={handleJoinMatch}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Gabung PvP
      </button>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Kamu</h3>
          <p>{shortenAddress(account)}</p>
          <p>{playerStatus ? `${playerStatus.hp} / 100` : "-"}</p>
          <p>Aksi Terakhir: {playerStatus ? playerStatus.lastAction : "-"}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Lawan</h3>
          <p>
            {opponentStatus
              ? shortenAddress(playerStatus.opponent)
              : "?"}
          </p>
          <p>{opponentStatus ? `${opponentStatus.hp} / 100` : "-"}</p>
          <p>
            Aksi Terakhir:{" "}
            {opponentStatus ? opponentStatus.lastAction : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
