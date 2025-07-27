import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

const GameStatus = () => {
  const [playerStatus, setPlayerStatus] = useState(null);
  const [opponentAddress, setOpponentAddress] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (!window.ethereum) throw new Error("Wallet tidak ditemukan");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const player = await contract.getPlayerStatus(address);

        setPlayerStatus(player);

        if (player.opponent !== ethers.ZeroAddress) {
          setOpponentAddress(player.opponent);
          navigate("/battle");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000); // polling setiap 3 detik

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="text-center mt-10">
      <h2 className="text-xl font-semibold mb-2">Status Permainan</h2>
      {error && <p className="text-red-500">{error}</p>}

      {playerStatus ? (
        playerStatus.opponent === ethers.ZeroAddress ? (
          <p className="text-yellow-400">Menunggu lawan bergabung...</p>
        ) : (
          <p className="text-green-400">Lawan ditemukan! Mengalihkan ke battle...</p>
        )
      ) : (
        <p className="text-gray-300">Memeriksa status permainan...</p>
      )}
    </div>
  );
};

export default GameStatus;
