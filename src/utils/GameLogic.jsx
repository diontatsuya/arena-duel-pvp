// src/utils/GameLogic.jsx

export function performAction(playerState, action) {
  const { hp, lastAction } = playerState;

  let newHP = hp;
  let log = "";

  switch (action) {
    case "attack":
      if (lastAction === "defend") {
        log = "Serangan lawan ditahan!";
        newHP -= 5;
      } else {
        log = "Serangan berhasil!";
        newHP -= 20;
      }
      break;
    case "defend":
      log = "Bersiap bertahan.";
      break;
    case "heal":
      if (hp >= 100) {
        log = "HP sudah penuh!";
      } else {
        newHP += 15;
        if (newHP > 100) newHP = 100;
        log = "Memulihkan diri.";
      }
      break;
    default:
      log = "Tidak melakukan aksi.";
  }

  return {
    newHP,
    log,
    newLastAction: action,
  };
}
