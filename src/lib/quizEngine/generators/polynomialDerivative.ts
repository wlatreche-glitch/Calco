import { createRng } from '../seed';
import {
  buildPolynomialDerivativeHint,
  createSignature,
  derivePolynomialCoefficients,
  formatPolynomialExpression,
  formatPolynomialText,
  randomCoefficients,
  toLatexPolynomial,
} from '../helpers';
import { getDifficultyProfile } from '../difficulty';
import { generateNumericDistractors, shuffleAnswerChoices } from '../distractors';
import type { Difficulty, GeneratedQuestion } from '../types';
import { validateGeneratedQuestion } from '../validation';

export function generatePolynomialDerivativeQuestion(opts: {
  seed: string;
  difficulty: Difficulty;
  avoidSignatures?: string[];
}): GeneratedQuestion {
  const { seed, difficulty } = opts;
  const rng = createRng(`${seed}-derivative`);
  const profile = getDifficultyProfile(difficulty);
  const degree = rng.randomInt(profile.degreeRange[0], profile.degreeRange[1]);
  const coefficients = randomCoefficients(rng, degree, profile.coefficientRange[0], profile.coefficientRange[1]);
  const polynomialExpression = formatPolynomialExpression(coefficients);
  const polynomialText = formatPolynomialText(coefficients);
  const derivativeCoefficients = derivePolynomialCoefficients(coefficients);
  const derivativeExpression = formatPolynomialExpression(derivativeCoefficients);
  const derivativeText = formatPolynomialText(derivativeCoefficients);
  const latex = `f(x)=${toLatexPolynomial(coefficients)}`;
  const latexAnswer = `f'(x)=${toLatexPolynomial(derivativeCoefficients)}`;
  const problemPrefix = buildPolynomialDerivativeHint(rng);
  const problem = `${problemPrefix}: ${polynomialText}`;
  const signature = createSignature(['deriv-poly', degree, coefficients.join(','), difficulty]);

  // Generate numeric distractors based on the leading coefficient
  const distractorCount = difficulty === 'easy' ? 2 : 3;
  const distractors = generateNumericDistractors(
    derivativeCoefficients[0] ?? 0,
    rng,
    { count: distractorCount, strategy: 'arithmetic' },
  ).map((num) => `${num > 0 ? '+' : ''}${num}x^${degree}`);

  const { choices, correctIndex } = shuffleAnswerChoices(derivativeExpression, distractors, rng);

  const question: GeneratedQuestion = {
    id: `quiz-${signature}`,
    seed,
    signature,
    category: 'derivatives',
    difficulty,
    format: 'multiple-choice',
    problem,
    latex,
    solution: latexAnswer,
    answer: derivativeExpression,
    choices,
    correctIndex,
    distractors,
    metadata: {
      type: 'polynomial-derivative',
      degree,
      coefficients,
      problemExpression: polynomialExpression,
      answerExpression: derivativeExpression,
      checkExpressions: [polynomialExpression, derivativeExpression],
    },
  };

  const validation = validateGeneratedQuestion(question);
  if (!validation.valid) {
    throw new Error(`Generated polynomial derivative question failed validation: ${validation.errors.join('; ')}`);
  }

  return question;
}
