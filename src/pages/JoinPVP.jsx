import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const JoinPVP = () => {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("Belum terhubung");
  const [isMatching, setIsMatching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const connectAndJoin = async () => {
      if (!window.ethereum) {
        alert("MetaMask tidak ditemukan!");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        setAccount(accounts[0]);
        setStatus("Menghubungkan...");

        const player = await contract.players(accounts[0]);

        if (player.opponent !== ethers.ZeroAddress) {
          // Sudah punya lawan, langsung ke battle
          navigate("/battle-pvp", { state: { playerAddress: accounts[0] } });
        } else {
          // Daftarkan pemain ke antrean matchmaking
          const tx = await contract.joinQueue();
          await tx.wait();

          setStatus("Menunggu lawan PvP...");
          setIsMatching(true);

          // Polling tiap 3 detik untuk cek apakah sudah ada lawan
          const interval = setInterval(async () => {
            const updatedPlayer = await contract.players(accounts[0]);
            if (updatedPlayer.opponent !== ethers.ZeroAddress) {
              clearInterval(interval);
              navigate("/battle-pvp", { state: { playerAddress: accounts[0] } });
            }
          }, 3000);
        }
      } catch (err) {
        console.error(err);
        setStatus("Terjadi kesalahan saat matchmaking.");
      }
    };

    connectAndJoin();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-4">Bergabung ke Arena PvP</h1>
      <p className="mb-2">Alamat Wallet: {account || "-"}</p>
      <p className="mb-4">Status: {status}</p>
      {isMatching && (
        <div className="animate-pulse text-blue-400">Mencari lawan...</div>
      )}
    </div>
  );
};

export default JoinPVP;
