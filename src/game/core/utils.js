export function getRandomAIAction() {
  const actions = ["attack", "defend", "heal"];
  const randomIndex = Math.floor(Math.random() * actions.length);
  return actions[randomIndex];
}
