export const getInitialStatus = () => ({
  hp: 100,
  lastAction: "None",
});

export const calculateTurnResult = (player, opponent, action) => {
  let newPlayer = { ...player };
  let newOpponent = { ...opponent };

  switch (action) {
    case "attack":
      const damage = opponent.lastAction === "defend" ? 5 : 20;
      newOpponent.hp = Math.max(0, newOpponent.hp - damage);
      break;

    case "defend":
      // No direct effect, only reduce damage on opponent’s turn
      break;

    case "heal":
      newPlayer.hp = Math.min(100, newPlayer.hp + 10);
      break;

    default:
      break;
  }

  newPlayer.lastAction = action;
  return { newPlayer, newOpponent };
};
