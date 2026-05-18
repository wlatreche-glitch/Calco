/**
 * Integration Template - How to Use Math System in Your Components
 * 
 * Copy this template and adapt it for your specific needs.
 */

// ============================================
// TEMPLATE 1: Physics Calculator Page
// ============================================

import { useState } from 'react';
import { StepExplanation, EquationRenderer, ScienceCard, MathBlockArabic } from '@/components/math';
import { normalizeToLatex, createScientificEquation } from '@/lib/mathFormatter';

export function PhysicsCalculatorTemplate() {
  const [input, setInput] = useState({ mass: 0, velocity: 0 });
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const ke = 0.5 * input.mass * input.velocity ** 2;
    setResult(ke);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Input Section */}
      <ScienceCard
        title="حاسبة الطاقة الحركية"
        icon="⚛️"
        subject="physics"
        content="أدخل كتلة الجسم وسرعته لحساب طاقته الحركية"
      />

      {/* Input Controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-bold mb-1">الكتلة (kg)</label>
          <input
            type="number"
            value={input.mass}
            onChange={(e) => setInput({ ...input, mass: +e.target.value })}
            className="w-full p-2 rounded bg-white/10 border border-white/20"
            dir="ltr"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">السرعة (m/s)</label>
          <input
            type="number"
            value={input.velocity}
            onChange={(e) => setInput({ ...input, velocity: +e.target.value })}
            className="w-full p-2 rounded bg-white/10 border border-white/20"
            dir="ltr"
          />
        </div>
      </div>

      {/* Solution Steps */}
      {result !== null && (
        <div className="space-y-4">
          <div className="space-y-3">
            <StepExplanation
              stepNumber={1}
              title="الصيغة الأساسية"
              explanation="صيغة الطاقة الحركية:"
              math="E_k = \\frac{1}{2}mv^2"
            />

            <StepExplanation
              stepNumber={2}
              title="تعويض القيم"
              explanation="نعوض الكتلة والسرعة:"
              math={`E_k = \\frac{1}{2} \\times ${input.mass} \\times ${input.velocity}^2`}
            />

            <StepExplanation
              stepNumber={3}
              title="الحساب"
              explanation="نحسب الطاقة:"
              math={`E_k = ${result} \\text{ J}`}
            />
          </div>

          {/* Result */}
          <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
            <p className="text-right text-sm text-gray-300 mb-2">الإجابة النهائية:</p>
            <MathBlockArabic math={`E_k = ${result} \\text{ J}`} />
          </div>
        </div>
      )}

      <button
        onClick={calculate}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 font-bold hover:opacity-90"
      >
        احسب الطاقة الحركية
      </button>
    </div>
  );
}

// ============================================
// TEMPLATE 2: Step-by-Step Solver
// ============================================

import { SolutionStep } from '@/lib/physicsEngine';

interface SolverResult {
  steps: SolutionStep[];
  finalAnswer: number;
  unit: string;
}

export function StepSolverTemplate({ result }: { result: SolverResult }) {
  return (
    <div className="space-y-4" dir="rtl">
      {/* Solution Steps */}
      <div className="space-y-3">
        {result.steps.map((step, idx) => (
          <StepExplanation
            key={idx}
            stepNumber={step.stepNumber}
            title={step.titleAr}
            explanation={step.explanation}
            math={step.formula}
            tip={step.tip}
            warning={step.warning}
          />
        ))}
      </div>

      {/* Final Result */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
        <p className="text-right text-sm text-gray-300 mb-3">الناتج النهائي:</p>
        <EquationRenderer
          steps={[
            {
              equation: `${result.finalAnswer} \\text{ ${result.unit}}`,
              annotation: 'الإجابة'
            }
          ]}
        />
      </div>
    </div>
  );
}

// ============================================
// TEMPLATE 3: Quiz Question with Explanation
// ============================================

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: Array<{ text?: string; math?: string }>;
}

export function QuizQuestionTemplate({ question, selected }: { question: QuizQuestion; selected: number }) {
  const isCorrect = selected === question.answer;

  return (
    <div className="space-y-4" dir="rtl">
      {/* Result Indicator */}
      <div
        className={`rounded-lg p-3 text-right ${
          isCorrect
            ? 'bg-emerald-500/10 border border-emerald-500/30'
            : 'bg-red-500/10 border border-red-500/30'
        }`}
      >
        <p className={`font-bold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
          {isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة خاطئة'}
        </p>
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <h3 className="font-bold text-sm">الشرح:</h3>
        {question.explain.map((segment, idx) =>
          segment.math ? (
            <MathBlockArabic key={idx} math={segment.math} />
          ) : (
            <p key={idx} className="text-sm text-gray-300 leading-relaxed">
              {segment.text}
            </p>
          )
        )}
      </div>
    </div>
  );
}

// ============================================
// TEMPLATE 4: AI-Generated Content with Normalization
// ============================================

interface AIResponse {
  explanation: string;
  formula: string;  // May be raw ASCII or LaTeX
  steps: string[];
}

export function AIContentTemplate({ aiResponse }: { aiResponse: AIResponse }) {
  // Normalize the AI-generated formula
  const normalizedFormula = normalizeToLatex(aiResponse.formula);
  const normalizedSteps = aiResponse.steps.map((step) => ({
    equation: normalizeToLatex(step),
  }));

  return (
    <div className="space-y-4" dir="rtl">
      {/* AI Explanation */}
      <p className="text-sm text-gray-300 leading-relaxed">{aiResponse.explanation}</p>

      {/* Normalized Formula */}
      <MathBlockArabic
        title="الصيغة"
        math={normalizedFormula}
      />

      {/* Steps */}
      {normalizedSteps.length > 0 && (
        <EquationRenderer
          title="خطوات الحل"
          steps={normalizedSteps}
        />
      )}
    </div>
  );
}

// ============================================
// TEMPLATE 5: Subject-Specific Cards Grid
// ============================================

import { ScienceCard } from '@/components/math';

interface SubjectContent {
  title: string;
  formula: string;
  description: string;
}

export function SubjectGridTemplate({ content }: { content: Record<string, SubjectContent> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
      {/* Physics */}
      {content.physics && (
        <ScienceCard
          title={content.physics.title}
          icon="⚛️"
          subject="physics"
          content={content.physics.description}
          blockMath={content.physics.formula}
        />
      )}

      {/* Chemistry */}
      {content.chemistry && (
        <ScienceCard
          title={content.chemistry.title}
          icon="🧪"
          subject="chemistry"
          content={content.chemistry.description}
          blockMath={content.chemistry.formula}
        />
      )}

      {/* Mathematics */}
      {content.math && (
        <ScienceCard
          title={content.math.title}
          icon="∑"
          subject="math"
          content={content.math.description}
          blockMath={content.math.formula}
        />
      )}
    </div>
  );
}

// ============================================
// TEMPLATE 6: Complete Educational Sequence
// ============================================

interface EducationalModule {
  topic: string;
  introduction: string;
  concept: { title: string; formula: string };
  steps: { title: string; explanation: string; formula: string }[];
  examples: { description: string; formula: string }[];
}

export function EducationalSequenceTemplate({ module }: { module: EducationalModule }) {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Introduction */}
      <ScienceCard
        title={module.topic}
        content={module.introduction}
        icon="📚"
        subject="general"
      />

      {/* Core Concept */}
      <div>
        <h2 className="text-lg font-bold mb-3">المفهوم الأساسي</h2>
        <MathBlockArabic
          title={module.concept.title}
          math={module.concept.formula}
        />
      </div>

      {/* Step-by-Step Explanation */}
      <div>
        <h2 className="text-lg font-bold mb-3">شرح مفصل</h2>
        <div className="space-y-3">
          {module.steps.map((step, idx) => (
            <StepExplanation
              key={idx}
              stepNumber={idx + 1}
              title={step.title}
              explanation={step.explanation}
              math={step.formula}
            />
          ))}
        </div>
      </div>

      {/* Examples */}
      <div>
        <h2 className="text-lg font-bold mb-3">أمثلة تطبيقية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {module.examples.map((example, idx) => (
            <div
              key={idx}
              className="rounded-lg p-3 bg-white/5 border border-white/10"
              dir="rtl"
            >
              <p className="text-sm text-gray-300 mb-2">{example.description}</p>
              <div dir="ltr">
                <MathBlockArabic math={example.formula} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default {
  PhysicsCalculatorTemplate,
  StepSolverTemplate,
  QuizQuestionTemplate,
  AIContentTemplate,
  SubjectGridTemplate,
  EducationalSequenceTemplate,
};
