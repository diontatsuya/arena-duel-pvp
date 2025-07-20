export function getRandomAIAction() {
  const actions = ['attack', 'defend', 'heal'];
  const rand = Math.floor(Math.random() * actions.length);
  return actions[rand];
}
