import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../../utils/constants";
import { contractABI } from "../../utils/contractABI";

const WaitingMatch = ({ playerAddress }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerAddress) return;

    const interval = setInterval(async () => {
      try {
        console.log("🔍 Checking match for:", playerAddress);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        const battle = await contract.getMyBattle();

        const matched =
          battle &&
          battle.player1 !== ethers.constants.AddressZero &&
          battle.player2 !== ethers.constants.AddressZero;

        console.log("✅ Match status:", matched);

        if (matched) {
          clearInterval(interval);
          console.log("🎯 Match found! Redirecting...");
          navigate("/arena-battle");
        }
      } catch (err) {
        console.error("❌ Error checking match:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [playerAddress, navigate]);

  return (
    <div className="text-yellow-300 mt-4">
      Menunggu pemain lain bergabung...
    </div>
  );
};

export default WaitingMatch;
