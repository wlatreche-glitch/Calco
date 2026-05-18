import { motion } from 'framer-motion';
import { Circle, Triangle, Square, Diamond } from 'lucide-react';
import { SpecialPoint, Asymptote } from '@/lib/functionAnalysis';

interface SpecialPointsLegendProps {
  roots: SpecialPoint[];
  extrema: SpecialPoint[];
  inflectionPoints: SpecialPoint[];
  asymptotes: Asymptote[];
}

export default function SpecialPointsLegend({ 
  roots, 
  extrema, 
  inflectionPoints, 
  asymptotes 
}: SpecialPointsLegendProps) {
  const hasData = roots.length > 0 || extrema.length > 0 || inflectionPoints.length > 0 || asymptotes.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-4"
    >
      <h4 className="font-semibold mb-3">النقاط الخاصة والمستقيمات المقاربة</h4>
      
      <div className="grid gap-3 md:grid-cols-2">
        {/* Roots */}
        {roots.length > 0 && (
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 mt-0.5" />
            <div>
              <span className="font-medium text-sm">الأصفار (الجذور)</span>
              <div className="text-xs text-muted-foreground space-y-0.5">
                {roots.map((r, i) => (
                  <div key={i}>({r.x}, {r.y})</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Extrema */}
        {extrema.length > 0 && (
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1 mt-0.5">
              <Triangle className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <Triangle className="w-4 h-4 text-rose-500 fill-rose-500 rotate-180" />
            </div>
            <div>
              <span className="font-medium text-sm">القيم القصوى</span>
              <div className="text-xs text-muted-foreground space-y-0.5">
                {extrema.map((e, i) => (
                  <div key={i} className={e.type === 'extremum-max' ? 'text-emerald-600' : 'text-rose-600'}>
                    {e.type === 'extremum-max' ? '▲ عظمى' : '▼ صغرى'}: ({e.x}, {e.y})
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inflection Points */}
        {inflectionPoints.length > 0 && (
          <div className="flex items-start gap-2">
            <Diamond className="w-4 h-4 text-amber-500 fill-amber-500 mt-0.5" />
            <div>
              <span className="font-medium text-sm">نقاط الانعطاف</span>
              <div className="text-xs text-muted-foreground space-y-0.5">
                {inflectionPoints.map((p, i) => (
                  <div key={i}>({p.x}, {p.y})</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Asymptotes */}
        {asymptotes.length > 0 && (
          <div className="flex items-start gap-2">
            <div className="w-4 h-0.5 bg-purple-500 mt-2 border-dashed" style={{ borderStyle: 'dashed' }} />
            <div>
              <span className="font-medium text-sm">المستقيمات المقاربة</span>
              <div className="text-xs text-muted-foreground space-y-0.5">
                {asymptotes.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      a.type === 'vertical' ? 'bg-red-100 text-red-700' :
                      a.type === 'horizontal' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {a.type === 'vertical' ? 'شاقولي' : a.type === 'horizontal' ? 'أفقي' : 'مائل'}
                    </span>
                    <span dir="ltr">{a.equation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
