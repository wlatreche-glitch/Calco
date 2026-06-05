import { generateVectorQuestion } from '../generators/vectorQuestion';
import type { GeneratedQuestion, Template } from '../types';

export const vectorTemplate: Template = {
  id: 'vector-v1',
  category: 'vectors',
  difficultyWeights: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  generate: ({ seed, difficulty }): GeneratedQuestion => generateVectorQuestion({ seed, difficulty }),
  renderHints: ['استخدم صيغة المسافة في المستوى', 'افصل بين الإحداثيات'],
};
