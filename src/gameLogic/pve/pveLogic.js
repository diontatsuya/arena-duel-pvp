export const getRandomAIAction = () => {
  const actions = ['attack', 'defend', 'heal'];
  return actions[Math.floor(Math.random() * actions.length)];
};

export const applyAIAction = ({ aiAction, playerHP, aiHP }) => {
  let newPlayerHP = playerHP;
  let newAIHP = aiHP;

  if (aiAction === 'attack') {
    newPlayerHP = Math.max(playerHP - 10, 0);
  } else if (aiAction === 'heal') {
    newAIHP = Math.min(aiHP + 10, 100);
  }

  // defend tidak berpengaruh langsung, jadi diabaikan
  return { newPlayerHP, newAIHP };
};
