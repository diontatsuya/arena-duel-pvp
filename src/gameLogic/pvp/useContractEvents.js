import { useEffect } from 'react';

// Contoh hook kecil jika ingin subscribe event lain
export function useContractEvents(contract, eventsMap) {
  useEffect(() => {
    if (!contract) return;
    Object.entries(eventsMap).forEach(([name, handler]) => contract.on(name, handler));
    return () => {
      Object.entries(eventsMap).forEach(([name, handler]) => contract.removeListener(name, handler));
    };
  }, [contract, eventsMap]);
}
