import { generatePolynomialIntegralQuestion } from '../generators/polynomialIntegral';
import type { GeneratedQuestion, Template } from '../types';

export const polynomialIntegralTemplate: Template = {
  id: 'poly-integral-v1',
  category: 'integrals',
  difficultyWeights: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  generate: ({ seed, difficulty }): GeneratedQuestion => generatePolynomialIntegralQuestion({ seed, difficulty }),
  renderHints: ['تحقق من قاعدة القوة', 'أضف ثابت التكامل C'],
};
