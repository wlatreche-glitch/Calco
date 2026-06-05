import { describe, expect, it } from 'vitest';
import { QuizEngine } from './engine';

describe('Quiz engine performance', () => {
  it('generates 100 questions without failure', () => {
    const engine = new QuizEngine();
    const difficulties = ['easy', 'medium', 'hard'] as const;
    for (let index = 0; index < 100; index += 1) {
      const difficulty = difficulties[index % difficulties.length];
      const question = engine.generateQuestion({ seed: `perf-${index}`, difficulty });
      expect(question).toBeDefined();
      expect(question.signature).toBeTruthy();
    }
  });
});
