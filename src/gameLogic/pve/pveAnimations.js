// src/gameLogic/pve/pveAnimations.js

export const getPVEAnimationClass = (action, isPlayer) => {
  const side = isPlayer ? "player" : "ai";

  switch (action) {
    case "attack":
      return `${side}-attack`;
    case "defend":
      return `${side}-defend`;
    case "heal":
      return `${side}-heal`;
    default:
      return "";
  }
};
