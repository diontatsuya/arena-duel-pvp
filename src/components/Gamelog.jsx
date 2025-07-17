import React from "react";

const GameLog = ({ log }) => {
  return (
    <div className="p-4 bg-black bg-opacity-40 rounded-xl max-h-40 overflow-y-auto text-sm">
      <h2 className="text-yellow-300 font-semibold mb-2">Game Log</h2>
      {log.length === 0 ? (
        <p className="text-gray-300 italic">No events yet.</p>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-white">
          {log.map((entry, index) => (
            <li key={index} className="text-sm">
              {entry}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameLog;
