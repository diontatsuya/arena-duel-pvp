export function calculateDamage(action, opponentAction) {
  if (action === 'Attack') {
    if (opponentAction === 'Defend') return 5;
    return 10;
  }
  return 0;
}
