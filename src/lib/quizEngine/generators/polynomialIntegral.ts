import { createRng } from '../seed';
import {
  createSignature,
  formatPolynomialExpression,
  formatPolynomialText,
  randomCoefficients,
  toLatexPolynomial,
} from '../helpers';
import { getDifficultyProfile } from '../difficulty';
import { generateNumericDistractors, shuffleAnswerChoices } from '../distractors';
import type { Difficulty, GeneratedQuestion } from '../types';
import { validateGeneratedQuestion } from '../validation';

const integralHints = [
  'اوجد التكامل غير المحدد للدالة',
  'ما هو التكامل التالي؟',
  'اكتب الدالة التي تنتمي للتكامل',
];

export function generatePolynomialIntegralQuestion(opts: {
  seed: string;
  difficulty: Difficulty;
}): GeneratedQuestion {
  const { seed, difficulty } = opts;
  const rng = createRng(`${seed}-integral`);
  const profile = getDifficultyProfile(difficulty);
  const degree = rng.randomInt(profile.degreeRange[0], profile.degreeRange[1]);
  const coefficients = randomCoefficients(rng, degree, profile.coefficientRange[0], profile.coefficientRange[1]);
  const integrandExpression = formatPolynomialExpression(coefficients);
  const integrandText = formatPolynomialText(coefficients);
  const integratedCoefficients = coefficients.map((coeff, index) => {
    const power = degree - index + 1;
    return coeff / power;
  });
  const integralText = integratedCoefficients
    .map((coeff, index) => {
      const power = degree - index + 1;
      if (coeff === 0) return null;
      const absCoeff = Math.abs(coeff);
      const sign = coeff < 0 ? '-' : '+';
      const coeffPart = power === 0 ? `${absCoeff}` : absCoeff === 1 ? '' : `${absCoeff}`;
      const powerText = power === 0 ? '' : power === 1 ? 'x' : `x^${power}`;
      return `${sign} ${coeffPart}${powerText}`.trim();
    })
    .filter(Boolean)
    .join(' ')
    .replace(/^\+\s*/, '');
  const latex = `\int ${toLatexPolynomial(coefficients)} \, dx`;
  const latexAnswer = `${integralText} + C`;
  const prompt = integralHints[rng.randomInt(0, integralHints.length - 1)];
  const problem = `${prompt}: ${integrandText}`;
  const signature = createSignature(['integral-poly', degree, coefficients.join(','), difficulty]);

  // Generate numeric distractors based on the first coefficient
  const distractorCount = difficulty === 'easy' ? 2 : 3;
  const distractors = generateNumericDistractors(
    integratedCoefficients[0] ?? 0,
    rng,
    { count: distractorCount, strategy: 'arithmetic' },
  ).map((num) => `${num > 0 ? '+' : ''}${num}x^${degree + 1} + C`.trim());

  const { choices, correctIndex } = shuffleAnswerChoices(latexAnswer, distractors, rng);

  const question: GeneratedQuestion = {
    id: `quiz-${signature}`,
    seed,
    signature,
    category: 'integrals',
    difficulty,
    format: 'multiple-choice',
    problem,
    latex,
    solution: latexAnswer,
    answer: integralText,
    choices,
    correctIndex,
    distractors,
    metadata: {
      type: 'polynomial-integral',
      checkExpressions: [integrandExpression],
    },
  };

  const validation = validateGeneratedQuestion(question);
  if (!validation.valid) {
    throw new Error(`Generated polynomial integral question failed validation: ${validation.errors.join('; ')}`);
  }

  return question;
}
