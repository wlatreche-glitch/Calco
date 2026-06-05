import { describe, expect, it } from 'vitest';
import { createRng } from './seed';
import { generateNumericDistractors, shuffleAnswerChoices } from './distractors';

describe('Distractor generation', () => {
  it('generates arithmetic distractors for a numeric answer', () => {
    const rng = createRng('seed-distractor');
    const distractors = generateNumericDistractors(10, rng, { count: 3, strategy: 'arithmetic' });
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain(10);
  });

  it('generates off-by-one distractors', () => {
    const rng = createRng('seed-offbyone');
    const distractors = generateNumericDistractors(5, rng, { count: 2, strategy: 'offByOne' });
    expect(distractors).toContain(4);
    expect(distractors).toContain(6);
  });

  it('generates sign-error distractors', () => {
    const rng = createRng('seed-sign');
    const distractors = generateNumericDistractors(7, rng, { count: 2, strategy: 'signError' });
    expect(distractors).toContain(-7);
  });

  it('shuffles answer choices and returns correct index', () => {
    const rng = createRng('seed-shuffle');
    const correctAnswer = 'A';
    const distractors = ['B', 'C', 'D'];
    const { choices, correctIndex } = shuffleAnswerChoices(correctAnswer, distractors, rng);
    expect(choices).toHaveLength(4);
    expect(choices[correctIndex]).toBe(correctAnswer);
  });
});
