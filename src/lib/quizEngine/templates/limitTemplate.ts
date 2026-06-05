import { generateLimitQuestion } from '../generators/limitQuestion';
import type { GeneratedQuestion, Template } from '../types';

export const limitTemplate: Template = {
  id: 'limit-v1',
  category: 'limits',
  difficultyWeights: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  generate: ({ seed, difficulty }): GeneratedQuestion => generateLimitQuestion({ seed, difficulty }),
  renderHints: ['قم بالتعويض المباشر أولاً', 'ابحث عن نهاية قيمة الدالة'],
};
