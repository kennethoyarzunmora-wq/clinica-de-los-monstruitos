import type { CSSProperties } from 'react';
import type { Badge } from '../types';

interface RewardBadgeProps {
  badge: Badge;
  locked?: boolean;
}

export function RewardBadge({ badge, locked = false }: RewardBadgeProps) {
  return (
    <div
      className={`badge ${locked ? 'badge--locked' : ''}`}
      style={{ '--badge-color': badge.color } as CSSProperties}
      aria-label={locked ? `${badge.name} bloqueado` : `${badge.name} ganado`}
    >
      <span className="badge__icon" aria-hidden="true">{locked ? '🔒' : badge.icon}</span>
      <strong>{badge.name}</strong>
      <small>{badge.skill}</small>
    </div>
  );
}
