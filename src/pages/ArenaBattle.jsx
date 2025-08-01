import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectWallet } from "../utils/connectWallet";
import { SOMNIA_CHAIN_ID } from "../utils/constants";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";

const ArenaBattle = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();

  const [walletAddress, setWalletAddress] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleConnectWallet = async () => {
  try {
    const result = await connectWallet(SOMNIA_CHAIN_ID);
    if (result) {
      setWalletAddress(result.account);
      setSigner(result.signer);
      setProvider(result.provider);
      setError(null);
    } else {
      setError("Wallet tidak ditemukan atau gagal terhubung.");
    }
  } catch (err) {
    console.error("Wallet connect error:", err);
    setError("Gagal koneksi wallet.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  handleConnectWallet();
}, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Arena Battle ID #{battleId}</h1>

      {loading && <p className="text-blue-400">🔄 Menghubungkan wallet...</p>}
      {error && !loading && <p className="text-red-500 mb-4">❌ {error}</p>}

      {!loading && walletAddress ? (
        <>
          <BattleStatus
            battleId={battleId}
            walletAddress={walletAddress}
            signer={signer}
            provider={provider}
          />
          <BattleControls
            battleId={battleId}
            walletAddress={walletAddress}
            signer={signer}
            provider={provider}
          />
        </>
      ) : (
        !loading &&
        !error && (
          <p className="text-yellow-400">🔌 Silakan hubungkan wallet untuk melanjutkan.</p>
        )
      )}

      <button
        onClick={() => navigate("/arena-pvp")}
        className="mt-6 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded"
      >
        🔙 Kembali ke Arena PvP
      </button>
    </div>
  );
};

export default ArenaBattle;
