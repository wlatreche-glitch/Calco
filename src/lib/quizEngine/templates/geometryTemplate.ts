import { generateGeometryQuestion } from '../generators/geometryQuestion';
import type { GeneratedQuestion, Template } from '../types';

export const geometryTemplate: Template = {
  id: 'geometry-v1',
  category: 'geometry',
  difficultyWeights: {
    easy: 1,
    medium: 1,
    hard: 1,
  },
  generate: ({ seed, difficulty }): GeneratedQuestion => generateGeometryQuestion({ seed, difficulty }),
  renderHints: ['استخدم معادلة الدائرة القياسية', 'حدد المركز ونصف القطر أولاً'],
};
