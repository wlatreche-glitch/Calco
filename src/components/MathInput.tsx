import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MathInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  examples?: string[];
  loading?: boolean;
}

export default function MathInput({
  placeholder = 'أدخل المعادلة أو التعبير الرياضي...',
  onSubmit,
  examples = [],
  loading = false
}: MathInputProps) {
  const [value, setValue] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = () => {
    if (value.trim() && !loading) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setValue('');
  };

  const handleExampleClick = (example: string) => {
    setValue(example);
    setShowExamples(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="input-math pr-4 pl-12"
            dir="ltr"
            disabled={loading}
          />
          
          {value && (
            <button
              onClick={handleClear}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-secondary transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || loading}
          className="btn-hero px-6"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <RotateCcw className="w-5 h-5" />
            </motion.div>
          ) : (
            <>
              <Send className="w-5 h-5 ml-2" />
              <span>حل</span>
            </>
          )}
        </Button>
      </div>

      {/* Examples Toggle */}
      {examples.length > 0 && (
        <div>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>أمثلة للتجربة</span>
          </button>
          
          {showExamples && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 flex flex-wrap gap-2"
            >
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="px-3 py-1.5 rounded-lg bg-secondary text-sm font-mono hover:bg-primary hover:text-primary-foreground transition-colors"
                  dir="ltr"
                >
                  {example}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
