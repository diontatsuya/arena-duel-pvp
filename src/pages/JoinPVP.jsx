import { useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";

const JoinPVP = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleJoin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      // Setup provider dan signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Buat instance kontrak
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      // Kirim transaksi joinArena
      const tx = await contract.joinArena();
      console.log("Transaksi dikirim:", tx.hash);
      await tx.wait();
      console.log("Transaksi selesai");

      setIsJoined(true);
    } catch (error) {
      console.error("Gagal join:", error);
      setErrorMessage(error?.reason || error?.message || "Gagal join PvP.");
      setIsJoined(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Gabung Arena PvP</h1>

      {isJoined ? (
        <div className="text-green-400 font-semibold">Kamu sudah bergabung di arena!</div>
      ) : (
        <button
          onClick={handleJoin}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Bergabung..." : "Gabung PvP"}
        </button>
      )}

      {errorMessage && (
        <p className="text-red-500 mt-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default JoinPVP;
