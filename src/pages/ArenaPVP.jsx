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
  const [isJoining, setIsJoining] = useState(false);

  // Hubungkan wallet dan inisialisasi
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const newAccount = await newSigner.getAddress();

        const newContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          newSigner
        );

        setProvider(newProvider);
        setSigner(newSigner);
        setAccount(newAccount);
        setContract(newContract);
      }
    };

    connectWallet();
  }, []);

  // Ambil data pemain saat contract dan account siap
  useEffect(() => {
    const fetchPlayers = async () => {
      if (contract && account) {
        try {
          const data = await contract.players(account);
          setPlayer(data);

          if (data.opponent !== ethers.constants.AddressZero) {
            const opponentData = await contract.players(data.opponent);
            setOpponent(opponentData);
          } else {
            setOpponent(null);
          }
        } catch (error) {
          console.error("Gagal memuat data pemain:", error);
        }
      }
    };

    fetchPlayers();
  }, [contract, account]);

  // Fungsi untuk gabung PvP
  const handleJoin = async () => {
    if (!contract) return;

    setIsJoining(true);
    try {
      const tx = await contract.joinGame();
      await tx.wait();
      // Refresh data setelah join
      const data = await contract.players(account);
      setPlayer(data);
      if (data.opponent !== ethers.constants.AddressZero) {
        const opponentData = await contract.players(data.opponent);
        setOpponent(opponentData);
      }
    } catch (error) {
      console.error("Gagal join game:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Arena PvP</h2>

      <p className="mb-4">
        Status:{" "}
        {account ? (
          <span className="text-green-400">{account}</span>
        ) : (
          <span className="text-red-400">Belum terhubung</span>
        )}
      </p>

      {!player?.opponent || player.opponent === ethers.constants.AddressZero ? (
        <button
          onClick={handleJoin}
          disabled={isJoining}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-4"
        >
          {isJoining ? "Bergabung..." : "Gabung PvP"}
        </button>
      ) : (
        <div className="text-yellow-400 mb-4">Sedang dalam pertarungan!</div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="p-4 border rounded bg-gray-700">
          <h3 className="text-xl font-semibold mb-2">Kamu</h3>
          {player ? (
            <>
              <p>HP: {player.hp.toString()}</p>
              <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][player.lastAction]}</p>
            </>
          ) : (
            <p>Belum bergabung</p>
          )}
        </div>

        <div className="p-4 border rounded bg-gray-700">
          <h3 className="text-xl font-semibold mb-2">Lawan</h3>
          {opponent ? (
            <>
              <p>HP: {opponent.hp.toString()}</p>
              <p>Aksi Terakhir: {["-", "Attack", "Defend", "Heal"][opponent.lastAction]}</p>
            </>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArenaPVP;
