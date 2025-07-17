import React from 'react';

export default function GameLog({ logs }) {
  if (!logs || logs.length === 0) return null;

  return (
    <div className="bg-gray-800 p-4 mt-4 rounded max-h-60 overflow-y-auto">
      <h3 className="text-lg font-bold text-white mb-2">📜 Log Pertarungan</h3>
      <ul className="text-sm space-y-1 text-gray-300">
        {logs.map((log, index) => (
          <li key={index}>- {log}</li>
        ))}
      </ul>
    </div>
  );
}
