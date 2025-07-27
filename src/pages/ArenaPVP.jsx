import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../utils/constants";
import { contractABI } from "../utils/contractABI";
import GameStatus from "../components/ui/GameStatus";

const ArenaPVP = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setContract(contract);
    } else {
      alert("Metamask tidak ditemukan");
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Arena PvP</h1>
      {address ? (
        <GameStatus
          contract={contract}
          address={address}
        />
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Hubungkan Wallet
        </button>
      )}
    </div>
  );
};

export default ArenaPVP;
