import { createRng } from '../seed';
import { createSignature, formatPolynomialExpression, randomCoefficients } from '../helpers';
import { getDifficultyProfile } from '../difficulty';
import { generateNumericDistractors, shuffleAnswerChoices } from '../distractors';
import type { Difficulty, GeneratedQuestion } from '../types';
import { validateGeneratedQuestion } from '../validation';

function safeNumber(value: number) {
  if (Number.isInteger(value)) return value;
  return Number(value.toFixed(2));
}

export function generateLimitQuestion(opts: {
  seed: string;
  difficulty: Difficulty;
}): GeneratedQuestion {
  const { seed, difficulty } = opts;
  const rng = createRng(`${seed}-limit`);
  const profile = getDifficultyProfile(difficulty);
  const degree = rng.randomInt(profile.degreeRange[0], profile.degreeRange[1]);
  const coefficients = randomCoefficients(rng, degree, profile.coefficientRange[0], profile.coefficientRange[1]);
  const a = rng.randomInt(1, 5);

  const polynomialExpression = formatPolynomialExpression(coefficients);
  const polynomialText = polynomialExpression.replace(/\*x/g, 'x');
  const limitExpression = `\lim_{x \to ${a}} (${polynomialText})`;
  const answer = safeNumber(coefficients.reduce((sum, coeff, index) => {
    const power = degree - index;
    return sum + coeff * Math.pow(a, power);
  }, 0));
  const problem = `احسب النهاية: ${limitExpression}`;
  const signature = createSignature(['limit-poly', degree, coefficients.join(','), a, difficulty]);

  // Generate numeric distractors based on the answer
  const distractorCount = difficulty === 'easy' ? 2 : 3;
  const distractors = generateNumericDistractors(
    answer as number,
    rng,
    { count: distractorCount, strategy: 'random' },
  ).map((num) => safeNumber(num));

  const { choices, correctIndex } = shuffleAnswerChoices(answer, distractors, rng);

  const question: GeneratedQuestion = {
    id: `quiz-${signature}`,
    seed,
    signature,
    category: 'limits',
    difficulty,
    format: 'multiple-choice',
    problem,
    latex: limitExpression,
    solution: `${answer}`,
    answer,
    choices,
    correctIndex,
    distractors,
    metadata: {
      type: 'polynomial-limit',
      checkExpressions: [polynomialExpression],
    },
  };

  const validation = validateGeneratedQuestion(question);
  if (!validation.valid) {
    throw new Error(`Generated limit question failed validation: ${validation.errors.join('; ')}`);
  }

  return question;
}
