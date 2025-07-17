import React from 'react';

export default function StatusDisplay({ status, address }) {
  if (!status) return null;

  return (
    <div className="bg-white bg-opacity-10 p-4 rounded-xl text-sm space-y-1">
      <p><strong>Address:</strong> {address}</p>
      <p><strong>HP:</strong> {status.hp}</p>
      <p><strong>Is Turn:</strong> {status.isTurn ? 'Yes' : 'No'}</p>
      <p><strong>Last Action:</strong> {['None', 'Attack', 'Defend', 'Heal'][status.lastAction]}</p>
    </div>
  );
}
