import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import HealthBar from "../components/HealthBar";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [statusText, setStatusText] = useState("Belum terhubung");
  const [isMatched, setIsMatched] = useState(false);

  // Inisialisasi provider, signer, dan kontrak
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        const newSigner = newProvider.getSigner();
        const newContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, newSigner);
        const address = await newSigner.getAddress();

        setProvider(newProvider);
        setSigner(newSigner);
        setContract(newContract);

        const playerData = await newContract.players(address);
        setPlayer(playerData);

        if (playerData.opponent !== ethers.constants.AddressZero) {
          const opponentData = await newContract.players(playerData.opponent);
          setOpponent(opponentData);
          setIsMatched(true);
          setStatusText("Lawan ditemukan!");
        } else {
          setStatusText("Menunggu lawan...");
        }
      } else {
        setStatusText("Wallet tidak ditemukan");
      }
    };

    init();

    // Auto-refresh status setiap 3 detik
    const interval = setInterval(init, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinMatch = async () => {
    if (!contract) return;
    try {
      const tx = await contract.joinMatch();
      setStatusText("Bergabung ke arena...");
      await tx.wait();
      setStatusText("Berhasil bergabung. Menunggu lawan...");
    } catch (err) {
      console.error(err);
      setStatusText("Gagal bergabung");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-center">Arena PvP</h2>

      <div className="text-center mb-4">
        <button
          onClick={handleJoinMatch}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full font-semibold"
        >
          Gabung PvP
        </button>
        <p className="mt-2 text-sm text-yellow-400">{statusText}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center mt-6">
        <div>
          <h3 className="text-xl font-bold mb-1">Kamu</h3>
          <HealthBar hp={player?.hp || 0} />
          <p>{player?.hp || 0} / 100</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-1">Lawan</h3>
          {opponent ? (
            <>
              <HealthBar hp={opponent.hp} />
              <p>{opponent.hp} / 100</p>
            </>
          ) : (
            <p className="text-gray-400">Belum ada</p>
          )}
        </div>
      </div>

      {isMatched && (
        <div className="mt-6 text-center animate-bounce text-green-400 font-bold">
          ⚔️ Pertarungan Dimulai!
        </div>
      )}
    </div>
  );
};

export default ArenaPVP;
