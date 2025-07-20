export function performAction(player, opponent, action) {
  const newPlayer = { ...player };
  const newOpponent = { ...opponent };

  switch (action) {
    case 'attack':
      if (opponent.lastAction === 'defend') {
        newOpponent.hp -= 5;
      } else {
        newOpponent.hp -= 10;
      }
      break;
    case 'defend':
      // Tidak mengurangi HP, hanya mengatur status defend
      break;
    case 'heal':
      newPlayer.hp += 8;
      if (newPlayer.hp > 100) newPlayer.hp = 100;
      break;
    default:
      break;
  }

  newPlayer.lastAction = action;
  return { newPlayer, newOpponent };
}
