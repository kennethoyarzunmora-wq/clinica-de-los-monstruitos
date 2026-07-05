import type { CSSProperties } from 'react';
import type { Emotion, Monster } from '../types';

interface MonsterAvatarProps {
  monster: Monster;
  mood?: Emotion | 'happy';
  large?: boolean;
}

function mouthForMood(mood: MonsterAvatarProps['mood']) {
  if (mood === 'happy' || mood === 'feliz') return 'monster__mouth monster__mouth--happy';
  if (mood === 'triste') return 'monster__mouth monster__mouth--sad';
  if (mood === 'asustado') return 'monster__mouth monster__mouth--surprised';
  if (mood === 'enojado') return 'monster__mouth monster__mouth--small';
  return 'monster__mouth monster__mouth--soft';
}

export function MonsterAvatar({ monster, mood, large = false }: MonsterAvatarProps) {
  const currentMood = mood ?? monster.emotion;

  return (
    <div
      className={`monster monster--${monster.shape} ${large ? 'monster--large' : ''}`}
      style={{
        '--monster-color': monster.bodyColor,
        '--monster-accent': monster.accentColor,
      } as CSSProperties}
      aria-label={`Monstruito ${monster.name}`}
      role="img"
    >
      <span className="monster__antenna monster__antenna--left" />
      <span className="monster__antenna monster__antenna--right" />
      <span className="monster__eye monster__eye--left" />
      <span className="monster__eye monster__eye--right" />
      <span className={mouthForMood(currentMood)} />
      <span className="monster__cheek monster__cheek--left" />
      <span className="monster__cheek monster__cheek--right" />
    </div>
  );
}
