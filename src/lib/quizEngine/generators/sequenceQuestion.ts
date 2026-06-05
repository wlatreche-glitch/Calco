import { createRng } from '../seed';
import { choose, createSignature, randomIntRange } from '../helpers';
import { getDifficultyProfile } from '../difficulty';
import { generateNumericDistractors, shuffleAnswerChoices } from '../distractors';
import type { Difficulty, GeneratedQuestion } from '../types';
import { validateGeneratedQuestion } from '../validation';

export function generateSequenceQuestion(opts: {
  seed: string;
  difficulty: Difficulty;
}): GeneratedQuestion {
  const { seed, difficulty } = opts;
  const rng = createRng(`${seed}-sequence`);
  const profile = getDifficultyProfile(difficulty);
  const sequenceTypes = ['arithmetic', 'geometric'] as const;
  const sequenceType = choose(rng, sequenceTypes);
  const firstTerm = randomIntRange(rng, profile.coefficientRange[0] || 1, profile.coefficientRange[1] || 5);
  const step = randomIntRange(rng, 1, Math.max(2, profile.coefficientRange[1]));
  const thirdTerm = sequenceType === 'arithmetic' ? firstTerm + 2 * step : firstTerm * Math.pow(step, 2);
  const terms = sequenceType === 'arithmetic'
    ? [firstTerm, firstTerm + step, firstTerm + 2 * step]
    : [firstTerm, firstTerm * step, thirdTerm];
  const answer = sequenceType === 'arithmetic' ? firstTerm + 3 * step : firstTerm * Math.pow(step, 3);
  const problem = `أكمل المتتالية واذكر الحد الرابع: ${terms.join(', ')}...`;
  const signature = createSignature(['sequence', sequenceType, firstTerm, step, difficulty]);

  // Generate numeric distractors based on the answer
  const distractorCount = difficulty === 'easy' ? 2 : 3;
  const distractors = generateNumericDistractors(
    answer as number,
    rng,
    { count: distractorCount, strategy: 'offByOne' },
  );

  const { choices, correctIndex } = shuffleAnswerChoices(answer, distractors, rng);

  const question: GeneratedQuestion = {
    id: `quiz-${signature}`,
    seed,
    signature,
    category: 'sequences',
    difficulty,
    format: 'multiple-choice',
    problem,
    latex: `(${terms.join(', ')},\;...)`,
    solution: `${answer}`,
    answer,
    choices,
    correctIndex,
    distractors,
    metadata: {
      type: 'sequence-term',
      sequenceType,
      terms,
    },
  };

  const validation = validateGeneratedQuestion(question);
  if (!validation.valid) {
    throw new Error(`Generated sequence question failed validation: ${validation.errors.join('; ')}`);
  }

  return question;
}
