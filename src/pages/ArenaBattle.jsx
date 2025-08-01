import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import { contractABI } from "../utils/contractABI";
import { CONTRACT_ADDRESS } from "../utils/constants";
import BattleStatus from "../components/pvp/BattleStatus";
import BattleControls from "../components/pvp/BattleControls";

const ArenaBattle = () => {
  const { id } = useParams();
  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const gameContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setContract(gameContract);
      }
    };
    init();
  }, []);

  if (!walletAddress || !contract) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-4 text-center">
      <h2 className="text-xl mb-4">Arena Pertempuran #{id}</h2>
      <BattleStatus contract={contract} walletAddress={walletAddress} battleId={id} />
      <BattleControls contract={contract} walletAddress={walletAddress} battleId={id} />
    </div>
  );
};

export default ArenaBattle;
