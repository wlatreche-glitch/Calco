import { createRng } from '../seed';
import { createSignature, randomIntRange } from '../helpers';
import { generateNumericDistractors, shuffleAnswerChoices } from '../distractors';
import type { Difficulty, GeneratedQuestion } from '../types';
import { validateGeneratedQuestion } from '../validation';

function vectorDistance(a: [number, number], b: [number, number]) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

export function generateVectorQuestion(opts: {
  seed: string;
  difficulty: Difficulty;
}): GeneratedQuestion {
  const { seed, difficulty } = opts;
  const rng = createRng(`${seed}-vector`);
  const a: [number, number] = [randomIntRange(rng, -5, 5), randomIntRange(rng, -5, 5)];
  const b: [number, number] = [randomIntRange(rng, -5, 5), randomIntRange(rng, -5, 5)];
  const answer = Number(vectorDistance(a, b).toFixed(2));
  const problem = `احسب المسافة بين النقطتين A(${a[0]}, ${a[1]}) و B(${b[0]}, ${b[1]})`;
  const signature = createSignature(['vector-distance', a.join(','), b.join(','), difficulty]);

  // Generate numeric distractors based on the answer
  const distractorCount = difficulty === 'easy' ? 2 : 3;
  const distractors = generateNumericDistractors(
    answer,
    rng,
    { count: distractorCount, strategy: 'arithmetic' },
  ).map((num) => Number(num.toFixed(2)));

  const { choices, correctIndex } = shuffleAnswerChoices(answer, distractors, rng);

  const question: GeneratedQuestion = {
    id: `quiz-${signature}`,
    seed,
    signature,
    category: 'vectors',
    difficulty,
    format: 'multiple-choice',
    problem,
    latex: `\sqrt{(${b[0]}-${a[0]})^2 + (${b[1]}-${a[1]})^2}`,
    solution: `${answer}`,
    answer,
    choices,
    correctIndex,
    distractors,
    metadata: {
      type: 'vector-distance',
      pointA: a,
      pointB: b,
    },
  };

  const validation = validateGeneratedQuestion(question);
  if (!validation.valid) {
    throw new Error(`Generated vector question failed validation: ${validation.errors.join('; ')}`);
  }

  return question;
}
