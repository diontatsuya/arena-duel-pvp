import { useState } from "react";
import { connectWallet } from "../utils/connectWallet";

const WalletConnectButton = () => {
  const [account, setAccount] = useState(null);

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      if (result) {
        setAccount(result.account);
      }
    } catch (err) {
      console.error("Gagal menghubungkan wallet:", err);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleConnect}
        className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300"
      >
        {account ? `🦊 ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default WalletConnectButton;
