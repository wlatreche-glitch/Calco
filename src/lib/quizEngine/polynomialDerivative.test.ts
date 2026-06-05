import { describe, expect, it } from 'vitest';
import { generatePolynomialDerivativeQuestion } from './generators/polynomialDerivative';
import { validateGeneratedQuestion } from './validation';

describe('Polynomial derivative quiz generator', () => {
  it('generates a valid easy polynomial derivative question', () => {
    const question = generatePolynomialDerivativeQuestion({ seed: 'seed-deriv-easy', difficulty: 'easy' });
    expect(question.category).toBe('derivatives');
    expect(question.difficulty).toBe('easy');
    expect(question.latex).toContain('f(x)=');
    expect(question.solution).toContain("f'(x)=");
    const validation = validateGeneratedQuestion(question);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('generates different signatures for different seeds', () => {
    const questionA = generatePolynomialDerivativeQuestion({ seed: 'seed-A', difficulty: 'medium' });
    const questionB = generatePolynomialDerivativeQuestion({ seed: 'seed-B', difficulty: 'medium' });
    expect(questionA.signature).not.toBe(questionB.signature);
  });
});
