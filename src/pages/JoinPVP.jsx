import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const JoinPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setContract(gameContract);

        try {
          const battleId = await gameContract.playerToBattle(address);
          if (battleId > 0) {
            console.log("Sudah dalam battle, langsung masuk.");
            navigate("/arena-battle");
          }
        } catch (err) {
          console.error("Gagal cek battleId:", err);
        }
      }
    };

    init();
  }, [navigate]);

  const handleJoin = async () => {
    if (!contract || !walletAddress) return;
    setIsJoining(true);
    try {
      const tx = await contract.joinMatchmaking();
      await tx.wait();
      console.log("Berhasil join matchmaking:", tx.hash);
      navigate("/arena-battle");
    } catch (err) {
      console.error("Gagal join matchmaking:", err);
      alert(err?.reason || "Gagal join matchmaking");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl mb-4">Gabung PvP</h1>
      <button
        className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 disabled:opacity-50"
        onClick={handleJoin}
        disabled={isJoining}
      >
        {isJoining ? "Menghubungkan..." : "Gabung PvP"}
      </button>
    </div>
  );
};

export default JoinPVP;
