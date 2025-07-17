import React from 'react';
import HealthBar from './HealthBar';

export default function PlayerStatus({ title, address, hp, isTurn, lastAction }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md w-full sm:w-1/2 text-center mb-4 sm:mb-0">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm break-words mb-2">{address}</p>
      <HealthBar hp={hp} />
      <p className="mt-2">
        <span className="font-semibold">Last Action:</span>{' '}
        {lastAction ? lastAction : 'None'}
      </p>
      <p className={`mt-1 font-bold ${isTurn ? 'text-green-400' : 'text-gray-400'}`}>
        {isTurn ? 'Your Turn' : 'Waiting...'}
      </p>
    </div>
  );
}
