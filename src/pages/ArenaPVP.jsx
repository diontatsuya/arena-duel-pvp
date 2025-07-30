import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import { connectWalletAndCheckNetwork } from "../utils/connectWallet";

const ArenaPVP = () => {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { signer, address } = await connectWalletAndCheckNetwork();
      setWalletAddress(address);
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(contractInstance);

      const battleId = await contractInstance.getBattleId(address);
      if (battleId && battleId.toString() !== "0") {
        alert("Kamu sudah berada dalam battle aktif.");
        navigate("/waiting");
      }
    };

    init();
  }, [navigate]);

  const handleJoinBattle = async () => {
    if (!contract || !walletAddress) return;

    try {
      setIsJoining(true);

      const battleId = await contract.getBattleId(walletAddress);
      if (battleId && battleId.toString() !== "0") {
        alert("Kamu sudah berada dalam battle aktif.");
        navigate("/waiting");
        return;
      }

      const tx = await contract.joinBattle();
      await tx.wait();

      navigate("/waiting");
    } catch (err) {
      console.error("Gagal join battle:", err);
      alert("Terjadi kesalahan saat join battle.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Arena PvP</h1>

      {walletAddress ? (
        <>
          <p className="mb-4">Terhubung sebagai: {walletAddress}</p>
          <button
            onClick={handleJoinBattle}
            disabled={isJoining}
            className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isJoining ? "Bergabung..." : "Gabung PvP"}
          </button>
        </>
      ) : (
        <p className="text-lg">Menghubungkan wallet...</p>
      )}
    </div>
  );
};

export default ArenaPVP;
