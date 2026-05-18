import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { VariationInterval } from '@/lib/functionAnalysis';

interface VariationTableProps {
  derivative: string;
  variationTable: VariationInterval[];
  criticalPoints: number[];
}

export default function VariationTable({ derivative, variationTable, criticalPoints }: VariationTableProps) {
  if (variationTable.length === 0) {
    return (
      <div className="p-4 bg-secondary/50 rounded-xl text-center text-muted-foreground">
        لا يمكن إنشاء جدول التغيرات لهذه الدالة
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated overflow-hidden"
    >
      <div className="p-4 border-b border-border bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
        <h3 className="font-bold text-lg">جدول التغيرات</h3>
        <p className="text-sm text-muted-foreground mt-1" dir="ltr">
          f'(x) = {derivative}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          {/* X row */}
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-right font-semibold w-20 border-l border-border">x</th>
              {variationTable.map((interval, idx) => (
                <th key={idx} className="p-3 text-center border-l border-border" colSpan={2}>
                  <div className="flex items-center justify-around text-sm">
                    <span className="text-muted-foreground">{interval.from}</span>
                    <span className="text-muted-foreground mx-2">→</span>
                    <span className="text-muted-foreground">{interval.to}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Derivative sign row */}
            <tr className="border-b border-border">
              <td className="p-3 text-right font-semibold bg-muted/30 border-l border-border">f'(x)</td>
              {variationTable.map((interval, idx) => (
                <td key={idx} className="p-3 text-center border-l border-border" colSpan={2}>
                  <span className={`text-xl font-bold ${
                    interval.derivativeSign === '+' ? 'text-emerald-500' :
                    interval.derivativeSign === '-' ? 'text-rose-500' :
                    'text-muted-foreground'
                  }`}>
                    {interval.derivativeSign}
                  </span>
                </td>
              ))}
            </tr>

            {/* Variation row with arrows */}
            <tr>
              <td className="p-3 text-right font-semibold bg-muted/30 border-l border-border">f(x)</td>
              {variationTable.map((interval, idx) => (
                <td key={idx} className="p-4 border-l border-border" colSpan={2}>
                  <div className="flex items-center justify-center min-h-[60px]">
                    {interval.variation === 'increasing' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-end gap-2">
                          <span className="text-xs text-muted-foreground">{interval.fromValue}</span>
                          <TrendingUp className="w-8 h-8 text-emerald-500" />
                          <span className="text-xs text-muted-foreground">{interval.toValue}</span>
                        </div>
                        <span className="text-xs text-emerald-600 mt-1">متزايدة ↗</span>
                      </div>
                    ) : interval.variation === 'decreasing' ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground">{interval.fromValue}</span>
                          <TrendingDown className="w-8 h-8 text-rose-500" />
                          <span className="text-xs text-muted-foreground">{interval.toValue}</span>
                        </div>
                        <span className="text-xs text-rose-600 mt-1">متناقصة ↘</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Minus className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">ثابتة</span>
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Critical points summary */}
      {criticalPoints.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/20">
          <p className="text-sm">
            <span className="font-semibold">النقاط الحرجة: </span>
            {criticalPoints.map((p, i) => (
              <span key={i} className="inline-block px-2 py-1 bg-primary/10 rounded mx-1">
                x = {p}
              </span>
            ))}
          </p>
        </div>
      )}
    </motion.div>
  );
}
