import { useCallback, useEffect, useMemo, useState } from 'react';
import { monsters } from '../data/monsters';
import type { GameProgress, Monster } from '../types';

const STORAGE_KEY = 'clinica-monstruitos-progress-v1';

const emptyProgress: GameProgress = {
  completedPatients: [],
  earnedBadges: [],
  completedChallenges: 0,
  practicedSkills: [],
  completedStages: [],
  stageStars: {},
  lastPlayedAt: null,
};

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function readProgress(): GameProgress {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyProgress;
    const parsed = JSON.parse(stored) as Partial<GameProgress>;

    return {
      completedPatients: Array.isArray(parsed.completedPatients) ? parsed.completedPatients : [],
      earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : [],
      completedChallenges: Number(parsed.completedChallenges ?? 0),
      practicedSkills: Array.isArray(parsed.practicedSkills) ? parsed.practicedSkills : [],
      completedStages: Array.isArray(parsed.completedStages) ? parsed.completedStages : [],
      stageStars: parsed.stageStars && typeof parsed.stageStars === 'object' ? parsed.stageStars as Record<number, number> : {},
      lastPlayedAt: parsed.lastPlayedAt ?? null,
    };
  } catch {
    return emptyProgress;
  }
}

export function useGameProgress() {
  const [progress, setProgress] = useState<GameProgress>(() => readProgress());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeChallenge = useCallback((monster: Monster) => {
    setProgress((current) => ({
      ...current,
      completedChallenges: current.completedChallenges + 1,
      practicedSkills: unique([...current.practicedSkills, monster.skill]),
      lastPlayedAt: new Date().toISOString(),
    }));
  }, []);

  const completePatient = useCallback((monster: Monster) => {
    setProgress((current) => {
      const completedPatients = unique([...current.completedPatients, monster.id]);
      const completedFirstStage = completedPatients.length >= monsters.length;

      return {
        ...current,
        completedPatients,
        earnedBadges: unique([...current.earnedBadges, monster.badgeId]),
        completedStages: completedFirstStage ? unique([...current.completedStages, 1]) : current.completedStages,
        stageStars: completedFirstStage ? { ...current.stageStars, 1: 3 } : current.stageStars,
        practicedSkills: unique([...current.practicedSkills, monster.skill]),
        lastPlayedAt: new Date().toISOString(),
      };
    });
  }, []);

  const completeStage = useCallback((stageId: number, stars: number, skill: string) => {
    setProgress((current) => ({
      ...current,
      completedStages: unique([...current.completedStages, stageId]),
      stageStars: {
        ...current.stageStars,
        [stageId]: Math.max(current.stageStars[stageId] ?? 0, stars),
      },
      practicedSkills: unique([...current.practicedSkills, skill]),
      completedChallenges: current.completedChallenges + 1,
      lastPlayedAt: new Date().toISOString(),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(emptyProgress);
  }, []);

  const completionPercent = useMemo(() => {
    return Math.round((progress.completedPatients.length / monsters.length) * 100);
  }, [progress.completedPatients.length]);

  return {
    progress,
    completionPercent,
    completeChallenge,
    completePatient,
    completeStage,
    resetProgress,
  };
}
