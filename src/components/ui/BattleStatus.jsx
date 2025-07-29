const BattleStatus = ({ player, isYourTurn }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">Status Pertandingan</h2>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <h3 className="font-semibold">Kamu</h3>
          <p>HP: {player?.yourHp ?? "?"}</p>
          <p>Aksi Terakhir: {player?.yourLastAction ?? "-"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Lawan</h3>
          <p>HP: {player?.opponentHp ?? "?"}</p>
          <p>Aksi Terakhir: {player?.opponentLastAction ?? "-"}</p>
        </div>
      </div>
      <p className="text-center mt-4 font-semibold text-yellow-400">
        {isYourTurn ? "Giliranmu!" : "Menunggu giliran lawan..."}
      </p>
    </div>
  );
};

export default BattleStatus;
