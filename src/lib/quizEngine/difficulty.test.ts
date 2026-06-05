import { describe, expect, it } from 'vitest';
import { difficultyProfiles, getDifficultyProfile, pickDifficulty } from './difficulty';

describe('Difficulty engine', () => {
  it('exposes all difficulty profiles', () => {
    expect(difficultyProfiles.easy).toBeDefined();
    expect(difficultyProfiles.medium).toBeDefined();
    expect(difficultyProfiles.hard).toBeDefined();
  });

  it('returns a valid profile for each difficulty', () => {
    expect(getDifficultyProfile('easy').degreeRange[0]).toBe(1);
    expect(getDifficultyProfile('medium').coefficientRange[1]).toBe(5);
    expect(getDifficultyProfile('hard').complexityFactor).toBe(1.5);
  });

  it('picks difficulty consistently with a seed', () => {
    const first = pickDifficulty('seed-diff');
    const second = pickDifficulty('seed-diff');
    expect(first).toBe(second);
  });
});
