import { motion } from 'framer-motion';
import { LimitResult } from '@/lib/functionAnalysis';
import { Infinity, ArrowRight, AlertCircle } from 'lucide-react';

interface LimitsTableProps {
  limits: LimitResult[];
}

export default function LimitsTable({ limits }: LimitsTableProps) {
  if (limits.length === 0) return null;

  const getTypeIcon = (type: LimitResult['type']) => {
    switch (type) {
      case 'domain-boundary':
        return <Infinity className="w-4 h-4 text-blue-500" />;
      case 'vertical-asymptote':
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case 'critical-point':
        return <ArrowRight className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getTypeLabel = (type: LimitResult['type']) => {
    switch (type) {
      case 'domain-boundary':
        return 'طرف المجال';
      case 'vertical-asymptote':
        return 'مقارب شاقولي';
      case 'critical-point':
        return 'نقطة حرجة';
    }
  };

  const getTypeBadgeClass = (type: LimitResult['type']) => {
    switch (type) {
      case 'domain-boundary':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'vertical-asymptote':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'critical-point':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6"
    >
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Infinity className="w-5 h-5 text-primary" />
        جدول النهايات
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-right font-semibold bg-muted/50">النقطة</th>
              <th className="p-3 text-right font-semibold bg-muted/50">النوع</th>
              <th className="p-3 text-center font-semibold bg-muted/50" dir="ltr">
                lim⁻
              </th>
              <th className="p-3 text-center font-semibold bg-muted/50" dir="ltr">
                lim⁺
              </th>
              <th className="p-3 text-center font-semibold bg-muted/50">النهاية</th>
            </tr>
          </thead>
          <tbody>
            {limits.map((limit, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="p-3 font-mono text-center" dir="ltr">
                  x → {limit.point}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getTypeBadgeClass(limit.type)}`}>
                    {getTypeIcon(limit.type)}
                    {getTypeLabel(limit.type)}
                  </span>
                </td>
                <td className="p-3 font-mono text-center" dir="ltr">
                  {limit.point === '+∞' || limit.point === '-∞' ? '—' : limit.leftLimit}
                </td>
                <td className="p-3 font-mono text-center" dir="ltr">
                  {limit.point === '+∞' || limit.point === '-∞' ? '—' : limit.rightLimit}
                </td>
                <td className="p-3 font-mono text-center font-semibold" dir="ltr">
                  <span className={
                    limit.limit === '+∞' || limit.limit === '-∞' 
                      ? 'text-rose-600' 
                      : limit.limit === 'غير موجودة' 
                        ? 'text-amber-600' 
                        : 'text-emerald-600'
                  }>
                    {limit.limit}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed descriptions */}
      <div className="mt-4 space-y-2">
        <h4 className="font-semibold text-sm text-muted-foreground">التفاصيل:</h4>
        <div className="grid gap-2">
          {limits.map((limit, index) => (
            <div
              key={index}
              className="text-sm p-2 rounded-lg bg-muted/30 font-mono"
              dir="ltr"
            >
              {limit.description}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1">
          <Infinity className="w-3 h-3 text-blue-500" />
          طرف المجال (±∞)
        </span>
        <span className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-purple-500" />
          مقارب شاقولي
        </span>
        <span className="flex items-center gap-1">
          <ArrowRight className="w-3 h-3 text-emerald-500" />
          نقطة حرجة
        </span>
      </div>
    </motion.div>
  );
}
