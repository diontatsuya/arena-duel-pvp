// src/gameLogic/engine/Actions.js
export const ActionType = {
  NONE: "None",
  ATTACK: "Attack",
  DEFEND: "Defend",
  HEAL: "Heal",
};

export const getActionEffect = (action, context) => {
  switch (action) {
    case ActionType.ATTACK:
      return { damage: 10 }; // Sementara statik
    case ActionType.DEFEND:
      return { defenseBoost: 5 };
    case ActionType.HEAL:
      return { heal: 8 };
    default:
      return {};
  }
};
