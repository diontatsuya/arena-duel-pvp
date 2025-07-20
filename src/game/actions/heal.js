export function performHeal(player) {
  const healAmount = Math.floor(Math.random() * 10) + 5; // 5-15 heal
  player.hp = Math.min(player.hp + healAmount, 100);
  player.lastAction = "heal";
  player.isDefending = false;
}
