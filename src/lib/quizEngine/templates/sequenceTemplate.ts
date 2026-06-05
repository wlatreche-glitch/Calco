import { generateSequenceQuestion } from '../generators/sequenceQuestion';
import type { GeneratedQuestion, Template } from '../types';

export const sequenceTemplate: Template = {
  id: 'sequence-v1',
  category: 'sequences',
  difficultyWeights: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  generate: ({ seed, difficulty }): GeneratedQuestion => generateSequenceQuestion({ seed, difficulty }),
  renderHints: ['حدد نوع المتتالية', 'ابحث عن الفرق أو النسبة الثابتة'],
};
