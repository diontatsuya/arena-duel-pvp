const GameArena = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Choose Your Arena</h1>
      <div className="flex space-x-4">
        <a href="/arena-pvp" className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600">PVP Mode</a>
        <a href="/arena-pve" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">PVE Mode</a>
      </div>
    </div>
  );
};

export default GameArena;
