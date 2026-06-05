import { describe, expect, it } from 'vitest';
import { generateQuiz, unitAr } from './coachEngine';

function questionKey(question: ReturnType<typeof generateQuiz>['questions'][number]) {
  return JSON.stringify({
    unit: question.unit,
    q: question.q,
    options: question.options,
    answer: question.answer,
  });
}

function hasArabic(value: unknown) {
  return /[\u0600-\u06FF]/.test(JSON.stringify(value));
}

describe('generateQuiz', () => {
  it('generates the requested count for procedural physics and math quizzes', () => {
    expect(generateQuiz('physics', undefined, 10).questions).toHaveLength(10);
    expect(generateQuiz('math', undefined, 10).questions).toHaveLength(10);
  });

  it('creates fresh variants for repeated unit-focused physics and math questions', () => {
    const physicsQuestions = generateQuiz('physics', 'Motion', 5).questions;
    const mathQuestions = generateQuiz('math', 'Functions', 5).questions;

    expect(new Set(physicsQuestions.map(questionKey)).size).toBeGreaterThan(1);
    expect(new Set(mathQuestions.map(questionKey)).size).toBeGreaterThan(1);
  });

  it('uses Arabic wording for Algerian BAC physics and math variants', () => {
    const physicsQuestion = generateQuiz('physics', 'Electricity', 1).questions[0];
    const mathQuestion = generateQuiz('math', 'Derivatives', 1).questions[0];

    expect(hasArabic(physicsQuestion.q)).toBe(true);
    expect(hasArabic(physicsQuestion.explain)).toBe(true);
    expect(hasArabic(mathQuestion.q)).toBe(true);
    expect(hasArabic(mathQuestion.explain)).toBe(true);
    expect(unitAr('Motion')).toBe('الحركة');
  });
});
