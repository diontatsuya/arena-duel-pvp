import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfMatched } from "../../gameLogic/pvpLogic";

const WaitingMatch = ({ playerAddress }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerAddress) return;

    const interval = setInterval(async () => {
      try {
        const matched = await checkIfMatched(playerAddress);
        if (matched) {
          clearInterval(interval);
          navigate("/arena-battle");
        }
      } catch (error) {
        console.error("Gagal mengecek status match:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [playerAddress, navigate]);

  if (!playerAddress) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Harap hubungkan wallet terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <p className="text-xl font-semibold mb-4">Menunggu lawan...</p>
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white" />
    </div>
  );
};

export default WaitingMatch;
