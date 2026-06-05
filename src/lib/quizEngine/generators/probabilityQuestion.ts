import { createRng } from '../seed';
import { createSignature, randomIntRange } from '../helpers';
import { generateNumericDistractors, shuffleAnswerChoices } from '../distractors';
import type { Difficulty, GeneratedQuestion } from '../types';
import { validateGeneratedQuestion } from '../validation';

function simplifyFraction(numerator: number, denominator: number) {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return `${numerator / divisor}/${denominator / divisor}`;
}

export function generateProbabilityQuestion(opts: {
  seed: string;
  difficulty: Difficulty;
}): GeneratedQuestion {
  const { seed, difficulty } = opts;
  const rng = createRng(`${seed}-probability`);
  const total = randomIntRange(rng, 4, 10);
  const success = randomIntRange(rng, 1, total - 1);
  const answer = simplifyFraction(success, total);
  const problem = `في صندوق يحتوي على ${total} كرات، ${success} منها حمراء. ما هو احتمال سحب كرة حمراء؟`;
  const signature = createSignature(['probability', total, success, difficulty]);

  // Generate distractor fractions
  const distractorCount = difficulty === 'easy' ? 2 : 3;
  const distractors = generateNumericDistractors(success, rng, { count: distractorCount, strategy: 'signError' })
    .filter((num) => num !== success && num > 0 && num < total)
    .slice(0, distractorCount)
    .map((num) => simplifyFraction(num, total));

  // If we don't have enough distractors, create some manually
  while (distractors.length < distractorCount) {
    const altNumerator = randomIntRange(rng, 1, total - 1);
    const altFraction = simplifyFraction(altNumerator, total);
    if (!distractors.includes(altFraction) && altFraction !== answer) {
      distractors.push(altFraction);
    }
  }

  const { choices, correctIndex } = shuffleAnswerChoices(answer, distractors.slice(0, distractorCount), rng);

  const question: GeneratedQuestion = {
    id: `quiz-${signature}`,
    seed,
    signature,
    category: 'probabilities',
    difficulty,
    format: 'multiple-choice',
    problem,
    latex: `\frac{${success}}{${total}}`,
    solution: answer,
    answer,
    choices,
    correctIndex,
    distractors: distractors.slice(0, distractorCount),
    metadata: {
      type: 'simple-probability',
      numerator: success,
      denominator: total,
    },
  };

  const validation = validateGeneratedQuestion(question);
  if (!validation.valid) {
    throw new Error(`Generated probability question failed validation: ${validation.errors.join('; ')}`);
  }

  return question;
}
