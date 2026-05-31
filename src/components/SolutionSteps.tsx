import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Lightbulb, ArrowLeft } from 'lucide-react';
import { SolutionStep, SolverResult } from '@/lib/mathEngine';
import { MathContent } from '@/components/MathContent';

interface SolutionStepsProps {
  result: SolverResult;
  showDetailed?: boolean;
}

export default function SolutionSteps({ result, showDetailed = true }: SolutionStepsProps) {
  if (!result.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="font-medium text-destructive">{result.error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Result */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-xl bg-success/10 border border-success/20"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-success" />
          <div>
            <p className="text-sm text-muted-foreground">النتيجة</p>
            <div className="text-xl font-bold math-display" dir="ltr">
              <MathContent content={result.result} />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-muted-foreground">خطوات الحل</h3>

        <div className="space-y-3">
          {result.steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} total={result.steps.length} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function StepCard({ step, index, total }: { step: SolutionStep; index: number; total: number }) {
  const isLast = index === total - 1;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`step-card ${isLast ? 'success' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Step Number */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
          ${isLast ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}
        `}>
          {step.step}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm">{step.operation}</h4>
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {step.rule}
            </span>
          </div>
          
          <div className="p-3 rounded-lg bg-background border border-border/50 mb-2">
            <div className="text-base math-display" dir="ltr">
              <MathContent content={step.expression} />
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{step.explanation}</p>
        </div>
      </div>
    </motion.div>
  );
}
