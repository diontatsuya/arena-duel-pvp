import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";

const JoinPVP = () => {
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState("Menghubungkan wallet...");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          setStatus("Metamask tidak ditemukan.");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        // 🔁 Cek apakah player sudah berada dalam game
        const player = await contract.players(address);
        if (player.opponent !== ethers.ZeroAddress) {
          setStatus("Kamu sudah berada dalam game. Mengarahkan ke arena...");
          setTimeout(() => {
            navigate("/battle", { state: { player: address } });
          }, 1500);
          return;
        }

        // 🟢 Lanjutkan joinGame jika belum terdaftar
        setStatus("Mengirim permintaan matchmaking...");
        const tx = await contract.joinGame();
        await tx.wait();

        setStatus("Menunggu lawan...");

        const interval = setInterval(async () => {
          const updatedPlayer = await contract.players(address);
          if (updatedPlayer.opponent !== ethers.ZeroAddress) {
            clearInterval(interval);
            setStatus("Lawan ditemukan! Menuju arena...");
            setTimeout(() => {
              navigate("/battle", { state: { player: address } });
            }, 1500);
          }
        }, 3000);
      } catch (err) {
        console.error("Join game error:", err);
        if (err.message?.includes("execution reverted")) {
          setStatus("Gagal matchmaking: Kamu mungkin sudah berada dalam game.");
        } else {
          setStatus("Terjadi kesalahan saat matchmaking.");
        }
      }
    };

    init();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Bergabung ke Arena PvP</h1>
      <p className="mb-2">Alamat Wallet: {account}</p>
      <p className="text-yellow-400">{status}</p>
    </div>
  );
};

export default JoinPVP;
