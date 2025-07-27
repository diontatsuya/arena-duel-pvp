const GameStatus = ({ status }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg space-y-2">
      <div className="text-center text-xl font-semibold text-white">Status Pertandingan</div>
      <div className="flex justify-between">
        <div className="text-left">
          <p className="font-bold">Kamu</p>
          <p>HP: {status.myHp}</p>
          <p>Aksi Terakhir: {status.myLastAction}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Lawan</p>
          <p>HP: {status.opponentHp !== null ? status.opponentHp : "Belum ada"}</p>
          <p>Aksi Terakhir: {status.opponentLastAction ?? "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
