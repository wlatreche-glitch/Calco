import { evaluate, parse } from 'mathjs';
import type { GeneratedQuestion } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const positiveSamples = [0.1, 0.5, 1, 2, 3, 5, 10];
const fullSamples = [-5, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 5];

function containsLog(expression: string): boolean {
  return /\b(log|ln)\s*\(/i.test(expression);
}

function containsDivision(expression: string): boolean {
  return /\//.test(expression);
}

function safeEvaluate(expression: string, scope: Record<string, any>) {
  const node = parse(expression);
  return node.evaluate(scope);
}

export function validateExpression(expression: string, variable = 'x'): ValidationResult {
  const errors: string[] = [];
  const normalized = expression.trim();
  if (!normalized) {
    return { valid: false, errors: ['التعبير فارغ'] };
  }

  const samples = containsLog(normalized) ? positiveSamples : fullSamples;
  for (const value of samples) {
    try {
      const result = safeEvaluate(normalized, { [variable]: value });
      if (result === null || result === undefined) {
        errors.push(`القيمة غير معرفة عند ${variable}=${value}`);
        continue;
      }
      if (typeof result === 'number' && (!Number.isFinite(result) || Number.isNaN(result))) {
        errors.push(`التعبير غير صالح عند ${variable}=${value}: ${result}`);
      }
    } catch (error) {
      if (containsDivision(normalized) && String(error).includes('Division by zero')) {
        errors.push(`المقام يساوي صفر عند ${variable}=${value}`);
      } else if (containsLog(normalized)) {
        errors.push(`دومين اللوغاريتم غير صالح عند ${variable}=${value}`);
      } else {
        errors.push(`خطأ في التقييم عند ${variable}=${value}: ${String(error)}`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateGeneratedQuestion(question: GeneratedQuestion): ValidationResult {
  const errors: string[] = [];
  if (!question.id) errors.push('معرف السؤال مفقود');
  if (!question.signature) errors.push('توقيع السؤال مفقود');
  if (!question.category) errors.push('تصنيف السؤال مفقود');
  if (!question.problem) errors.push('نص السؤال مفقود');
  if (question.answer === undefined || question.answer === null) {
    errors.push('الإجابة مفقودة');
  }

  const expressions = Array.isArray(question.metadata?.checkExpressions)
    ? question.metadata.checkExpressions
    : [];

  expressions.forEach((expression) => {
    const result = validateExpression(expression, 'x');
    if (!result.valid) {
      errors.push(...result.errors.map((msg) => `فشل التحقق من التعبير '${expression}': ${msg}`));
    }
  });

  return { valid: errors.length === 0, errors };
}
