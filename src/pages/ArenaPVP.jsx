import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const ArenaPVP = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [playerInfo, setPlayerInfo] = useState(null);
  const [opponentInfo, setOpponentInfo] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const connectedAccount = ethers.utils.getAddress(accounts[0]);
        setAccount(connectedAccount);
        setStatus("Terhubung");

        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);

        // Signature ke Somnia (wajib agar bisa interaksi di testnet)
        await newSigner.signMessage("Arena Duel Somnia");
      }
    } catch (error) {
      console.error("Gagal connect wallet:", error);
    }
  };

  const handleJoinArena = async () => {
    if (!contract) return;

    try {
      const tx = await contract.joinArena();
      await tx.wait();
      await fetchPlayerInfo();
    } catch (err) {
      console.error("Gagal join arena:", err);
    }
  };

  const fetchPlayerInfo = async () => {
    if (!contract || !account) return;

    try {
      const info = await contract.players(account);
      setPlayerInfo(info);

      if (info.opponent !== ethers.constants.AddressZero) {
        const opponent = await contract.players(info.opponent);
        setOpponentInfo(opponent);
      } else {
        setOpponentInfo(null);
      }
    } catch (err) {
      console.error("Gagal mengambil info player:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract && account) {
      fetchPlayerInfo();
    }
  }, [contract, account]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>
      <p>Status: {status}</p>
      {account && <p className="mb-4">Akun: {account.slice(0, 6)}...{account.slice(-4)}</p>}
      <button
        onClick={handleJoinArena}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Gabung PvP
      </button>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Kamu</h2>
          {playerInfo ? (
            <div>
              <p>{account}</p>
              <p>{playerInfo.hp} / 100</p>
              <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][playerInfo.lastAction]}</p>
            </div>
          ) : (
            <p>Belum bergabung</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Lawan</h2>
          {opponentInfo ? (
            <div>
              <p>{playerInfo.opponent}</p>
              <p>{opponentInfo.hp} / 100</p>
              <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][opponentInfo.lastAction]}</p>
            </div>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
