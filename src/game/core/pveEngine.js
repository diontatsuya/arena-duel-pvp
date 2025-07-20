import { performAttack } from "../actions/attack";
import { performDefend } from "../actions/defend";
import { performHeal } from "../actions/heal";
import { getRandomAIAction } from "./utils";

export async function runPVEGameTurn(playerAction, gameState, setGameState) {
  const { player, ai } = gameState;

  // Proses aksi pemain
  if (playerAction === "attack") {
    performAttack(player, ai);
  } else if (playerAction === "defend") {
    performDefend(player);
  } else if (playerAction === "heal") {
    performHeal(player);
  }

  // Periksa apakah AI kalah
  if (ai.hp <= 0) {
    setGameState(prev => ({
      ...prev,
      message: "You win! The monster has been defeated.",
      isGameOver: true,
    }));
    return;
  }

  // Giliran AI (AI memilih aksi random)
  const aiAction = getRandomAIAction();

  if (aiAction === "attack") {
    performAttack(ai, player);
  } else if (aiAction === "defend") {
    performDefend(ai);
  } else if (aiAction === "heal") {
    performHeal(ai);
  }

  // Periksa apakah player kalah
  if (player.hp <= 0) {
    setGameState(prev => ({
      ...prev,
      message: "You lose! The monster defeated you.",
      isGameOver: true,
    }));
    return;
  }

  // Update state akhir ronde
  setGameState(prev => ({
    ...prev,
    message: `You chose ${playerAction}, AI chose ${aiAction}.`,
    player: { ...player },
    ai: { ...ai },
  }));
}
