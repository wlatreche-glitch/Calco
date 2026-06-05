import { generateProbabilityQuestion } from '../generators/probabilityQuestion';
import type { GeneratedQuestion, Template } from '../types';

export const probabilityTemplate: Template = {
  id: 'probability-v1',
  category: 'probabilities',
  difficultyWeights: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  generate: ({ seed, difficulty }): GeneratedQuestion => generateProbabilityQuestion({ seed, difficulty }),
  renderHints: ['احسب عدد النتائج المواتية', 'اقسم على عدد النتائج الممكنة'],
};
