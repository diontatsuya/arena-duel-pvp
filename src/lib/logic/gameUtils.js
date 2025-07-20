export function checkGameOver(player, opponent) {
  if (player.hp <= 0) return 'opponent';
  if (opponent.hp <= 0) return 'player';
  return null;
}

export function calculateDamage(base, isDefending) {
  return isDefending ? base / 2 : base;
}
