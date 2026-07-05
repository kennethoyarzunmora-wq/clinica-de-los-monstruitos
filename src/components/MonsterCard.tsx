import { MonsterAvatar } from './MonsterAvatar';
import type { Monster } from '../types';

interface MonsterCardProps {
  monster: Monster;
  completed: boolean;
  onSelect: (monster: Monster) => void;
}

export function MonsterCard({ monster, completed, onSelect }: MonsterCardProps) {
  return (
    <button
      className={`monster-card ${completed ? 'monster-card--done' : ''}`}
      onClick={() => onSelect(monster)}
      aria-label={`Atender a ${monster.name}. ${monster.problem}`}
    >
      <MonsterAvatar monster={monster} mood={completed ? 'happy' : monster.emotion} />
      <span className="monster-card__status">{completed ? 'Recuperado' : 'Necesita ayuda'}</span>
      <strong>{monster.name}</strong>
      <span>{monster.problem}</span>
      <small>{monster.skill}</small>
    </button>
  );
}
