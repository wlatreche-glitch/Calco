import { generatePolynomialDerivativeQuestion } from '../generators/polynomialDerivative';
import type { Difficulty, Template, GeneratedQuestion } from '../types';

export const polynomialDerivativeTemplate: Template = {
  id: 'poly-derivative-v1',
  category: 'derivatives',
  difficultyWeights: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  generate: ({ seed, difficulty }): GeneratedQuestion => {
    return generatePolynomialDerivativeQuestion({ seed, difficulty });
  },
  renderHints: ['use derivative rules', 'apply power rule'],
};
