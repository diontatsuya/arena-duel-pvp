import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer); // ✅ FIXED HERE

    setProvider(provider);
    setSigner(signer);
    setAccount(address);
    setContract(contract);
    setStatus("Terhubung");
  };

  const joinMatch = async () => {
    if (!contract) return;
    const tx = await contract.joinMatch();
    await tx.wait();
    fetchPlayers();
  };

  const fetchPlayers = async () => {
    if (!contract || !account) return;
    const data = await contract.players(account);
    setPlayer(data);

    if (data.opponent !== ethers.ZeroAddress) {
      const opponentData = await contract.players(data.opponent);
      setOpponent(opponentData);
    } else {
      setOpponent(null);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchPlayers();
    }
  }, [contract, account]);

  return (
    <div className="p-4 max-w-3xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Arena PvP</h2>
      <p>Status: {status}</p>
      {account ? (
        <div>
          <p className="mb-2">Akun: {account}</p>
          <button
            onClick={joinMatch}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
          >
            Gabung PvP
          </button>

          {player && (
            <div className="mt-4">
              <h3 className="font-bold mb-1">Kamu</h3>
              <p>HP: {player.hp.toString()}</p>
              <p>Aksi terakhir: {Object.keys(player.lastAction)[0]}</p>
            </div>
          )}

          {opponent && (
            <div className="mt-4">
              <h3 className="font-bold mb-1">Lawan</h3>
              <p>HP: {opponent.hp.toString()}</p>
              <p>Aksi terakhir: {Object.keys(opponent.lastAction)[0]}</p>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Hubungkan Wallet
        </button>
      )}
    </div>
  );
};

export default ArenaPVP;
