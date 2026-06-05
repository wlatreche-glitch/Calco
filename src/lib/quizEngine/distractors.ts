import { createRng } from './seed';
import type { Rng } from './helpers';

export interface DistractorOptions {
  count?: number;
  strategy?: 'arithmetic' | 'offByOne' | 'signError' | 'random';
}

function generateArithmeticDistractors(correctAnswer: number, rng: Rng, count: number): number[] {
  const distractors: number[] = [];
  const offset = Math.max(1, Math.abs(correctAnswer) / 2);
  
  distractors.push(correctAnswer + offset);
  if (distractors.length < count) distractors.push(correctAnswer - offset);
  if (distractors.length < count) distractors.push(correctAnswer * 2);
  if (distractors.length < count) distractors.push(Math.max(1, Math.floor(correctAnswer / 2)));
  
  return distractors.slice(0, count).filter((d) => d !== correctAnswer);
}

function generateOffByOneDistractors(correctAnswer: number, rng: Rng, count: number): number[] {
  const distractors: number[] = [];
  
  if (typeof correctAnswer === 'number') {
    distractors.push(correctAnswer + 1);
    if (distractors.length < count) distractors.push(correctAnswer - 1);
    if (distractors.length < count) distractors.push(correctAnswer + 2);
    if (distractors.length < count) distractors.push(correctAnswer - 2);
  }
  
  return distractors.slice(0, count).filter((d) => d !== correctAnswer);
}

function generateSignErrorDistractors(correctAnswer: number, rng: Rng, count: number): number[] {
  const distractors: number[] = [];
  
  if (typeof correctAnswer === 'number') {
    distractors.push(-correctAnswer);
    if (distractors.length < count) distractors.push(Math.abs(correctAnswer));
  }
  
  return distractors.slice(0, count).filter((d) => d !== correctAnswer);
}

export function generateNumericDistractors(
  correctAnswer: number,
  rng: Rng,
  options: DistractorOptions = {},
): number[] {
  const { count = 3, strategy = 'arithmetic' } = options;
  
  let distractors: number[] = [];
  
  switch (strategy) {
    case 'offByOne':
      distractors = generateOffByOneDistractors(correctAnswer, rng, count);
      break;
    case 'signError':
      distractors = generateSignErrorDistractors(correctAnswer, rng, count);
      break;
    case 'random':
      distractors = Array.from({ length: count }, () => rng.randomInt(-20, 20)).filter(
        (d) => d !== correctAnswer,
      );
      break;
    case 'arithmetic':
    default:
      distractors = generateArithmeticDistractors(correctAnswer, rng, count);
  }
  
  return distractors.slice(0, count);
}

export function shuffleAnswerChoices<T>(
  correctAnswer: T,
  distractors: T[],
  rng: Rng,
): { choices: T[]; correctIndex: number } {
  const allChoices = [correctAnswer, ...distractors];
  
  for (let i = allChoices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng.random() * (i + 1));
    [allChoices[i], allChoices[j]] = [allChoices[j], allChoices[i]];
  }
  
  const correctIndex = allChoices.indexOf(correctAnswer);
  return { choices: allChoices, correctIndex };
}
