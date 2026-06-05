import { describe, expect, it } from 'vitest';
import { QuizEngine } from './engine';
import { AntiRepetitionStore } from './antiRepetition';
import { polynomialDerivativeTemplate } from './templates/polynomialDerivativeTemplate';
import { TemplateRegistry } from './registry';

describe('QuizEngine', () => {
  it('generates a question and tracks its signature', () => {
    const registry = new TemplateRegistry();
    registry.register(polynomialDerivativeTemplate);
    const store = new AntiRepetitionStore({ capacity: 5 });
    const engine = new QuizEngine({ registry, antiRepetitionStore: store });
    const question = engine.generateQuestion({ seed: 'engine-test', difficulty: 'medium' });
    expect(question.category).toBe('derivatives');
    expect(store.has(question.signature)).toBe(true);
  });

  it('changes retry seeds when the first generated question was already used', () => {
    const registry = new TemplateRegistry();
    registry.register({
      id: 'seeded-template',
      category: 'seeded',
      generate: ({ seed, difficulty }) => ({
        id: `quiz-${seed}`,
        seed,
        signature: `sig-${seed}`,
        category: 'seeded',
        difficulty,
        problem: `Problem for ${seed}`,
        answer: seed,
      }),
    });
    const store = new AntiRepetitionStore({ capacity: 5 });
    const engine = new QuizEngine({ registry, antiRepetitionStore: store, templateRetryLimit: 3 });

    const firstQuestion = engine.generateQuestion({ seed: 'same-seed', difficulty: 'easy', category: 'seeded' });
    const secondQuestion = engine.generateQuestion({ seed: 'same-seed', difficulty: 'easy', category: 'seeded' });

    expect(secondQuestion.signature).not.toBe(firstQuestion.signature);
    expect(secondQuestion.seed).toContain('attempt-1');
  });
});
