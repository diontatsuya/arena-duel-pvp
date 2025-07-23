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
  const [isMatched, setIsMatched] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Belum terhubung");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);
        const _signer = await _provider.getSigner();
        setSigner(_signer);
        const address = await _signer.getAddress();
        setAccount(address);

        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);
        setContract(_contract);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (contract && account) {
      getPlayerStatus();
    }
  }, [contract, account]);

  const getPlayerStatus = async () => {
    const playerData = await contract.players(account);
    setPlayer(playerData);

    if (playerData.opponent !== ethers.ZeroAddress) {
      setIsMatched(true);
      setOpponent(playerData.opponent);
      setIsMyTurn(playerData.isTurn);
      setStatusMessage("Sudah tergabung dan menemukan lawan");
    } else {
      setStatusMessage("Belum bergabung");
    }
  };

  const handleJoinMatch = async () => {
    if (!contract || !signer) return;
    try {
      const tx = await contract.joinMatch();
      setStatusMessage("Menunggu konfirmasi...");
      await tx.wait();
      setStatusMessage("Gabung PvP berhasil. Menunggu lawan...");
      await getPlayerStatus();
    } catch (err) {
      console.error("Join match failed:", err);
      setStatusMessage("Gagal gabung PvP");
    }
  };

  const handleAction = async (actionIndex) => {
    if (!contract || !isMyTurn) return;
    try {
      const tx = await contract.performAction(actionIndex);
      setStatusMessage("Mengirim aksi...");
      await tx.wait();
      await getPlayerStatus();
    } catch (err) {
      console.error("Aksi gagal:", err);
      setStatusMessage("Aksi gagal");
    }
  };

  const renderAksiButtons = () => {
    if (!isMatched || !isMyTurn) return null;
    return (
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handleAction(1)}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Attack
        </button>
        <button
          onClick={() => handleAction(2)}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
        >
          Defend
        </button>
        <button
          onClick={() => handleAction(3)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
        >
          Heal
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Arena PvP</h1>

      <p className="mb-4">Status: <span className="font-semibold">{statusMessage}</span></p>

      {!isMatched && (
        <button
          onClick={handleJoinMatch}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4"
        >
          Gabung PvP
        </button>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6 text-left">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Kamu</h2>
          <p><span className="font-semibold">Alamat:</span> {account}</p>
          <p><span className="font-semibold">Aksi Terakhir:</span> {player?.lastAction ?? "-"}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Lawan</h2>
          <p><span className="font-semibold">Alamat:</span> {opponent || "-"}</p>
          {isMatched && <p><span className="font-semibold">Giliran:</span> {isMyTurn ? "Giliran kamu" : "Giliran lawan"}</p>}
        </div>
      </div>

      {renderAksiButtons()}
    </div>
  );
};

export default ArenaPVP;
