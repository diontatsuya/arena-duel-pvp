import { useContext, useEffect, useState } from "react";
import { WalletConnect } from "../components/ui/WalletStatus";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const Home = () => {
  const { provider, signer, account } = useContext(WalletContext) ?? {};
  const [playerStatus, setPlayerStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!signer || !account) return;

      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const status = await contract.getPlayerStatus(account);
        setPlayerStatus(status);
      } catch (err) {
        console.error("Gagal mengambil status pemain:", err);
      }
    };

    fetchStatus();
  }, [signer, account]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Arena Duel PvP</h1>
      <p className="text-lg mb-2">Selamat datang di medan pertempuran!</p>

      {account ? (
        playerStatus ? (
          <p className="text-green-400">Status HP kamu: {playerStatus.hp.toString()}</p>
        ) : (
          <p className="text-yellow-400">Mengambil status pemain...</p>
        )
      ) : (
        <p className="text-red-400">Silakan hubungkan wallet kamu terlebih dahulu.</p>
      )}
    </div>
  );
};

export default Home;
