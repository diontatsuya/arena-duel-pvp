export function handleActionPVE(playerAction, aiAction, playerHP, aiHP) {
  const log = [];

  // Base damage/heal
  const attackDamage = 20;
  const healAmount = 15;
  const defendMultiplier = 0.5;

  let newPlayerHP = playerHP;
  let newAiHP = aiHP;

  // Player attack
  if (playerAction === 'attack') {
    let damage = attackDamage;
    if (aiAction === 'defend') damage *= defendMultiplier;
    newAiHP -= damage;
    log.push(`You attacked the AI and dealt ${damage} damage.`);
  }

  // AI attack
  if (aiAction === 'attack') {
    let damage = attackDamage;
    if (playerAction === 'defend') damage *= defendMultiplier;
    newPlayerHP -= damage;
    log.push(`AI attacked you and dealt ${damage} damage.`);
  }

  // Player heal
  if (playerAction === 'heal') {
    newPlayerHP += healAmount;
    if (newPlayerHP > 100) newPlayerHP = 100;
    log.push(`You healed yourself by ${healAmount} HP.`);
  }

  // AI heal
  if (aiAction === 'heal') {
    newAiHP += healAmount;
    if (newAiHP > 100) newAiHP = 100;
    log.push(`AI healed itself by ${healAmount} HP.`);
  }

  // Clamp values to not go below 0
  newPlayerHP = Math.max(0, newPlayerHP);
  newAiHP = Math.max(0, newAiHP);

  return {
    newPlayerHP,
    newAiHP,
    log
  };
}
