import { resolveTurn } from "./gameEngine";

export async function handlePvpTurn(playerAction, contract, account) {
  const status = await contract.getStatus(account);
  const opponent = status.opponent;

  const [playerHP, opponentHP] = [status.hp, (await contract.getStatus(opponent)).hp];
  const opponentLastAction = (await contract.getStatus(opponent)).lastAction;

  const result = resolveTurn(playerAction, opponentLastAction, playerHP, opponentHP);
  return result;
}
