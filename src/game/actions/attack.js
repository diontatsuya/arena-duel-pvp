export function performAttack(attacker, defender) {
  const damage = Math.floor(Math.random() * 15) + 5; // 5-20 damage
  const actualDamage = defender.isDefending ? Math.floor(damage / 2) : damage;
  defender.hp = Math.max(defender.hp - actualDamage, 0);
  attacker.lastAction = "attack";
  defender.isDefending = false;
}
