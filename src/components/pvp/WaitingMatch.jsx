import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfMatched } from "../../gameLogic/pvp/checkIfMatched";

const WaitingMatch = ({ playerAddress }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerAddress) return;

    const interval = setInterval(async () => {
      console.log("🔍 Checking match for:", playerAddress);

      const matched = await checkIfMatched(playerAddress);
      console.log("✅ Match status:", matched);

      if (matched) {
        clearInterval(interval);
        console.log("🎯 Match found! Redirecting...");
        navigate("/arena-battle");
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [playerAddress, navigate]);

  return (
    <div className="text-yellow-300 mt-4">
      Menunggu pemain lain bergabung...
    </div>
  );
};

export default WaitingMatch;
