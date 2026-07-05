export type View = 'home' | 'stages' | 'patients' | 'clinic' | 'stage-game' | 'progress';

export type ChallengeType = 'number' | 'emotion' | 'color' | 'sequence' | 'letter';

export type Emotion = 'feliz' | 'triste' | 'enojado' | 'asustado' | 'confundido';

export interface Choice {
  id: string;
  label: string;
  icon: string;
  color?: string;
  ariaLabel?: string;
}

export interface Challenge {
  id: string;
  monsterId: string;
  type: ChallengeType;
  prompt: string;
  hint: string;
  choices?: Choice[];
  answer: string | number;
  targetCount?: number;
  itemIcon?: string;
  itemColor?: string;
  totalItems?: number;
}

export interface Monster {
  id: string;
  name: string;
  bodyColor: string;
  accentColor: string;
  emotion: Emotion;
  problem: string;
  skill: string;
  badgeId: string;
  shape: 'round' | 'oval' | 'squish' | 'tall' | 'star';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  skill: string;
}

export interface GameProgress {
  completedPatients: string[];
  earnedBadges: string[];
  completedChallenges: number;
  practicedSkills: string[];
  completedStages: number[];
  stageStars: Record<number, number>;
  lastPlayedAt: string | null;
}

export interface LearningStage {
  id: number;
  title: string;
  subtitle: string;
  skill: string;
  icon: string;
  difficulty: string;
  kind: 'clinic' | 'snake-colors' | 'emotion-memory' | 'sequence-builder' | 'sound-match';
}
