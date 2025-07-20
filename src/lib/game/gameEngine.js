export const Action = {
  NONE: "none",
  ATTACK: "attack",
  DEFEND: "defend",
  HEAL: "heal",
};

export function resolveTurn(playerAction, opponentAction, playerHP, opponentHP) {
  let result = {
    playerHP,
    opponentHP,
    log: [],
  };

  if (playerAction === Action.ATTACK) {
    if (opponentAction === Action.DEFEND) {
      result.log.push("Opponent blocked your attack!");
      result.opponentHP -= 5;
    } else {
      result.opponentHP -= 10;
      result.log.push("You hit the opponent!");
    }
  } else if (playerAction === Action.HEAL) {
    result.playerHP = Math.min(playerHP + 8, 100);
    result.log.push("You healed yourself!");
  }

  // repeat for opponent’s action
  if (opponentAction === Action.ATTACK) {
    if (playerAction === Action.DEFEND) {
      result.log.push("You blocked the opponent's attack!");
      result.playerHP -= 5;
    } else {
      result.playerHP -= 10;
      result.log.push("Opponent hit you!");
    }
  } else if (opponentAction === Action.HEAL) {
    result.opponentHP = Math.min(opponentHP + 8, 100);
    result.log.push("Opponent healed!");
  }

  return result;
}
