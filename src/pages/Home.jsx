import { useState } from "react";
import WalletStatus from "../components/ui/WalletStatus";

const Home = () => {
  const [connectedWallet, setConnectedWallet] = useState(null);

  const handleConnected = (address) => {
    setConnectedWallet(address);
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Arena Duel!</h1>
      <p className="mb-6">Connect your wallet to start the battle.</p>
      <WalletStatus onConnected={handleConnected} />
    </div>
  );
};

export default Home;
