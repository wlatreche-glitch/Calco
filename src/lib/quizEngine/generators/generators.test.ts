import { describe, expect, it } from 'vitest';
import { validateGeneratedQuestion } from '../validation';
import { generatePolynomialDerivativeQuestion } from './polynomialDerivative';
import { generatePolynomialIntegralQuestion } from './polynomialIntegral';
import { generateLimitQuestion } from './limitQuestion';
import { generateSequenceQuestion } from './sequenceQuestion';
import { generateProbabilityQuestion } from './probabilityQuestion';
import { generateVectorQuestion } from './vectorQuestion';
import { generateGeometryQuestion } from './geometryQuestion';

describe('Quiz subject generators', () => {
  const seeds = [
    'seed-deriv',
    'seed-integral',
    'seed-limit',
    'seed-sequence',
    'seed-probability',
    'seed-vector',
    'seed-geometry',
  ];

  it('generates valid questions for all subject generators', () => {
    const generators = [
      generatePolynomialDerivativeQuestion,
      generatePolynomialIntegralQuestion,
      generateLimitQuestion,
      generateSequenceQuestion,
      generateProbabilityQuestion,
      generateVectorQuestion,
      generateGeometryQuestion,
    ];

    generators.forEach((generator, index) => {
      const difficulty = index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard';
      const question = generator({ seed: seeds[index], difficulty });
      const validation = validateGeneratedQuestion(question);
      expect(validation.valid).toBe(true);
      expect(question.problem).toBeTruthy();
      expect(question.signature).toBeTruthy();
    });
  });
});
