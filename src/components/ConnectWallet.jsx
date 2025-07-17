
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ setSigner, setWalletAddress }) => {
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setWalletAddress(address);
      setIsConnected(true);
    } else {
      alert("MetaMask not detected!");
    }
  };

  return (
    <div className="mb-4">
      {isConnected ? (
        <p className="text-green-500 font-bold">Wallet Connected</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
