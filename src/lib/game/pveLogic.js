import { resolveTurn } from "./gameEngine";
import { getRandomAction } from "./utils";

export async function handlePveTurn(playerAction, playerHP, aiHP) {
  const aiAction = getRandomAction();
  const result = resolveTurn(playerAction, aiAction, playerHP, aiHP);
  return { ...result, aiAction };
}
