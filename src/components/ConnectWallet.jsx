import { useState } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const ConnectWallet = ({ setWalletConnected }) => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Simpan state lokal
      setIsConnected(true);
      setWalletConnected(true);

      // Redirect ke arena
      navigate("/arena");
    } else {
      alert("MetaMask not detected!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isConnected ? (
        <p className="text-green-500 font-bold">Wallet Connected</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
