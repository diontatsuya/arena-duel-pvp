import { ACTION } from '../utils/constants.js';

export default function ActionButtons({ disabled, onAction }) {
  return (
    <div className="flex gap-3">
      <button disabled={disabled} onClick={() => onAction(ACTION.ATTACK)} className="btn-primary disabled:opacity-50">Attack</button>
      <button disabled={disabled} onClick={() => onAction(ACTION.DEFEND)} className="btn-secondary disabled:opacity-50">Defend</button>
      <button disabled={disabled} onClick={() => onAction(ACTION.HEAL)} className="btn-secondary disabled:opacity-50">Heal</button>
    </div>
  );
}
