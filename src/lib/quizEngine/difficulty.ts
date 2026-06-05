import { createRng } from './seed';
import type { Difficulty } from './types';

export const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export interface DifficultyProfile {
  degreeRange: [number, number];
  coefficientRange: [number, number];
  complexityFactor: number;
  description: string;
}

export const difficultyProfiles: Record<Difficulty, DifficultyProfile> = {
  easy: {
    degreeRange: [1, 2],
    coefficientRange: [-3, 3],
    complexityFactor: 0.6,
    description: 'معادلات بسيطة وسهلة الفهم، مع خطوات مباشرة.',
  },
  medium: {
    degreeRange: [2, 3],
    coefficientRange: [-5, 5],
    complexityFactor: 1.0,
    description: 'تركيبات متعددة الحدود المعتدلة مع متغيرات متعددة.',
  },
  hard: {
    degreeRange: [3, 4],
    coefficientRange: [-8, 8],
    complexityFactor: 1.5,
    description: 'تراكيب معقدة وعناصر ترابط، مع تحديات تحليلية أعلى.',
  },
};

export function pickDifficulty(seed: string, preference?: Partial<Record<Difficulty, number>>): Difficulty {
  const rng = createRng(`${seed}-difficulty`);
  const weights: Record<Difficulty, number> = {
    easy: preference?.easy ?? 1,
    medium: preference?.medium ?? 1,
    hard: preference?.hard ?? 1,
  };
  const totalWeight = Object.values(weights).reduce((sum, v) => sum + v, 0);
  let choice = rng.random() * totalWeight;
  for (const level of difficulties) {
    choice -= weights[level];
    if (choice <= 0) {
      return level;
    }
  }
  return 'hard';
}

export function getDifficultyProfile(level: Difficulty): DifficultyProfile {
  return difficultyProfiles[level];
}
