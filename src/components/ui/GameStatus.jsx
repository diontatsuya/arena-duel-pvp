const GameStatus = ({ status }) => {
  if (!status) {
    return (
      <div className="bg-gray-700 p-4 rounded-lg text-center text-white">
        Memuat status pertandingan...
      </div>
    );
  }

  const {
    myHp = "-",
    myLastAction = "-",
    opponentHp = null,
    opponentLastAction = "-",
  } = status;

  return (
    <div className="bg-gray-700 p-4 rounded-lg space-y-2">
      <div className="text-center text-xl font-semibold text-white">Status Pertandingan</div>
      <div className="flex justify-between">
        <div className="text-left">
          <p className="font-bold">Kamu</p>
          <p>HP: {myHp}</p>
          <p>Aksi Terakhir: {myLastAction}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Lawan</p>
          <p>HP: {opponentHp !== null ? opponentHp : "Belum ada"}</p>
          <p>Aksi Terakhir: {opponentLastAction}</p>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
