import { createRng } from '../seed';
import { createSignature, randomIntRange } from '../helpers';
import { shuffleAnswerChoices } from '../distractors';
import type { Difficulty, GeneratedQuestion } from '../types';
import { validateGeneratedQuestion } from '../validation';

export function generateGeometryQuestion(opts: {
  seed: string;
  difficulty: Difficulty;
}): GeneratedQuestion {
  const { seed, difficulty } = opts;
  const rng = createRng(`${seed}-geometry`);
  const centerX = randomIntRange(rng, -5, 5);
  const centerY = randomIntRange(rng, -5, 5);
  const radius = randomIntRange(rng, 2, 6);
  const problem = `اكتب معادلة الدائرة ذات المركز (${centerX}, ${centerY}) ونصف القطر ${radius}`;
  const latex = `(x - ${centerX})^2 + (y - ${centerY})^2 = ${radius}^2`;
  const signature = createSignature(['geometry-circle', centerX, centerY, radius, difficulty]);

  // Generate distractor circle equations by varying center or radius
  const distractors: string[] = [];
  const distractorCount = difficulty === 'easy' ? 2 : 3;

  // Distractor 1: Changed center x
  distractors.push(`(x - ${centerX + 1})^2 + (y - ${centerY})^2 = ${radius}^2`);

  // Distractor 2: Changed radius
  distractors.push(`(x - ${centerX})^2 + (y - ${centerY})^2 = ${radius + 1}^2`);

  // Distractor 3 (if needed): Changed both center and radius
  if (distractorCount > 2) {
    distractors.push(`(x - ${centerX - 1})^2 + (y - ${centerY + 1})^2 = ${radius - 1}^2`);
  }

  const { choices, correctIndex } = shuffleAnswerChoices(latex, distractors.slice(0, distractorCount), rng);

  const question: GeneratedQuestion = {
    id: `quiz-${signature}`,
    seed,
    signature,
    category: 'geometry',
    difficulty,
    format: 'multiple-choice',
    problem,
    latex,
    solution: latex,
    answer: latex,
    choices,
    correctIndex,
    distractors: distractors.slice(0, distractorCount),
    metadata: {
      type: 'circle-equation',
      center: [centerX, centerY],
      radius,
    },
  };

  const validation = validateGeneratedQuestion(question);
  if (!validation.valid) {
    throw new Error(`Generated geometry question failed validation: ${validation.errors.join('; ')}`);
  }

  return question;
}
