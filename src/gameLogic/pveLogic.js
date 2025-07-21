// src/gameLogic/pveLogic.js

export const initialPlayer = {
  hp: 100,
  lastAction: null,
};

export const initialAI = {
  hp: 100,
  lastAction: null,
};

export function getRandomAIAction() {
  const actions = ["attack", "defend", "heal"];
  const randomIndex = Math.floor(Math.random() * actions.length);
  return actions[randomIndex];
}

export function applyAction(player, ai, playerAction, aiAction) {
  let newPlayer = { ...player };
  let newAI = { ...ai };

  // Player action
  if (playerAction === "attack") {
    if (aiAction === "defend") {
      newAI.hp -= 5;
    } else {
      newAI.hp -= 20;
    }
  } else if (playerAction === "heal") {
    newPlayer.hp = Math.min(100, newPlayer.hp + 15);
  }

  // AI action
  if (aiAction === "attack") {
    if (playerAction === "defend") {
      newPlayer.hp -= 5;
    } else {
      newPlayer.hp -= 20;
    }
  } else if (aiAction === "heal") {
    newAI.hp = Math.min(100, newAI.hp + 15);
  }

  newPlayer.lastAction = playerAction;
  newAI.lastAction = aiAction;

  return [newPlayer, newAI];
}
