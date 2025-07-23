import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const JoinPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        await _provider.send("eth_requestAccounts", []);
        const _signer = _provider.getSigner();
        const _account = await _signer.getAddress();
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, _signer);

        setProvider(_provider);
        setSigner(_signer);
        setContract(_contract);
        setAccount(_account);
      }
    };
    init();
  }, []);

  const handleJoinPVP = async () => {
    if (!contract || !signer) return;

    try {
      setStatus("Mengirim transaksi...");

      const tx = await contract.matchPlayer(); // ganti dengan fungsi kontrakmu jika berbeda
      await tx.wait();

      setStatus("Berhasil masuk antrian. Menunggu lawan...");
      checkOpponentStatus();
    } catch (err) {
      console.error(err);
      setStatus("Gagal mengirim transaksi.");
    }
  };

  const checkOpponentStatus = async () => {
    try {
      const playerData = await contract.players(account);
      if (playerData.opponent !== ethers.constants.AddressZero) {
        setStatus("Lawan ditemukan! Masuk ke arena...");
        setTimeout(() => {
          navigate("/arena-pvp");
        }, 1500);
      } else {
        // Cek lagi setelah 5 detik
        setTimeout(checkOpponentStatus, 5000);
      }
    } catch (err) {
      console.error(err);
      setStatus("Gagal memeriksa status lawan.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Gabung Arena PvP</h1>
      <button
        onClick={handleJoinPVP}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold"
      >
        Gabung PvP
      </button>
      {status && <p className="mt-4 text-sm text-gray-300">{status}</p>}
    </div>
  );
};

export default JoinPVP;
