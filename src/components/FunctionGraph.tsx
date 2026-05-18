import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { generateGraphPoints } from '@/lib/mathEngine';
import { SpecialPoint, Asymptote } from '@/lib/functionAnalysis';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface FunctionGraphProps {
  expression: string;
  xMin?: number;
  xMax?: number;
  color?: string;
  showGrid?: boolean;
  specialPoints?: SpecialPoint[];
  asymptotes?: Asymptote[];
  showSpecialPoints?: boolean;
  showAsymptotes?: boolean;
}

export default function FunctionGraph({
  expression,
  xMin: initialXMin = -10,
  xMax: initialXMax = 10,
  color = 'hsl(215, 80%, 35%)',
  showGrid = true,
  specialPoints = [],
  asymptotes = [],
  showSpecialPoints = true,
  showAsymptotes = true
}: FunctionGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Calculate adjusted range based on zoom and pan
  const xRange = (initialXMax - initialXMin) / zoom;
  const xCenter = (initialXMax + initialXMin) / 2 + panX;
  const xMin = xCenter - xRange / 2;
  const xMax = xCenter + xRange / 2;

  const data = useMemo(() => {
    return generateGraphPoints(expression, xMin, xMax);
  }, [expression, xMin, xMax]);

  const yValues = data.map(d => d.y).filter(y => isFinite(y));
  const baseYMin = Math.min(...yValues, -5);
  const baseYMax = Math.max(...yValues, 5);
  const yRange = (baseYMax - baseYMin) / zoom;
  const yCenter = (baseYMax + baseYMin) / 2 + panY;
  const yMin = yCenter - yRange / 2;
  const yMax = yCenter + yRange / 2;
  const yPadding = (yMax - yMin) * 0.1;

  // Generate oblique asymptote line data
  const obliqueAsymptoteData = useMemo(() => {
    return asymptotes
      .filter(a => a.type === 'oblique' && a.slope !== undefined && a.intercept !== undefined)
      .map(a => {
        const points = [];
        for (let x = xMin; x <= xMax; x += (xMax - xMin) / 50) {
          points.push({ x, y: a.slope! * x + a.intercept! });
        }
        return { ...a, points };
      });
  }, [asymptotes, xMin, xMax]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.5, 10));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.5, 0.1));
  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Pan controls
  const handlePanLeft = () => setPanX(prev => prev - xRange * 0.2);
  const handlePanRight = () => setPanX(prev => prev + xRange * 0.2);
  const handlePanUp = () => setPanY(prev => prev + yRange * 0.2);
  const handlePanDown = () => setPanY(prev => prev - yRange * 0.2);

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-secondary/50 rounded-xl">
        <p className="text-muted-foreground">لا يمكن رسم هذه الدالة</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-elevated p-4"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">الرسم البياني</h3>
          <p className="text-sm text-muted-foreground math-display" dir="ltr">
            f(x) = {expression}
          </p>
        </div>
        
        {/* Legend for special points */}
        {showSpecialPoints && specialPoints.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            {specialPoints.some(p => p.type === 'root') && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-blue-500" /> صفر
              </span>
            )}
            {specialPoints.some(p => p.type === 'extremum-max') && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> عظمى
              </span>
            )}
            {specialPoints.some(p => p.type === 'extremum-min') && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> صغرى
              </span>
            )}
            {specialPoints.some(p => p.type === 'inflection') && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> انعطاف
              </span>
            )}
          </div>
        )}
      </div>

      {/* Zoom and Pan Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">التكبير:</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
            disabled={zoom <= 0.1}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-32">
            <Slider
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              min={0.1}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
            disabled={zoom >= 10}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-12">
            {(zoom * 100).toFixed(0)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">التحريك:</span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePanLeft}
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePanRight}
            >
              →
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePanUp}
            >
              ↑
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePanDown}
            >
              ↓
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          إعادة ضبط
        </Button>

        <div className="text-xs text-muted-foreground mr-auto" dir="ltr">
          x: [{xMin.toFixed(1)}, {xMax.toFixed(1)}] | y: [{yMin.toFixed(1)}, {yMax.toFixed(1)}]
        </div>
      </div>
      
      <div className="h-[400px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.5}
              />
            )}
            <XAxis 
              dataKey="x" 
              type="number"
              domain={[xMin, xMax]}
              tickFormatter={(v) => v.toFixed(1)}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              type="number"
              domain={[yMin - yPadding, yMax + yPadding]}
              tickFormatter={(v) => v.toFixed(1)}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const point = payload[0].payload;
                  const specialPoint = specialPoints.find(
                    p => Math.abs(p.x - point.x) < 0.1 && Math.abs(p.y - point.y) < 0.1
                  );
                  return (
                    <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                      <p className="text-sm font-mono">
                        x = {point.x.toFixed(4)}
                      </p>
                      <p className="text-sm font-mono text-primary">
                        f(x) = {point.y.toFixed(4)}
                      </p>
                      {specialPoint && (
                        <p className="text-xs mt-1 font-semibold text-emerald-600">
                          {specialPoint.label}
                        </p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Axes */}
            <ReferenceLine x={0} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
            <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
            
            {/* Vertical Asymptotes */}
            {showAsymptotes && asymptotes
              .filter(a => a.type === 'vertical')
              .map((a, i) => (
                <ReferenceLine
                  key={`v-asymp-${i}`}
                  x={a.value}
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  label={{
                    value: a.equation,
                    position: 'top',
                    fill: '#a855f7',
                    fontSize: 10
                  }}
                />
              ))
            }
            
            {/* Horizontal Asymptotes */}
            {showAsymptotes && asymptotes
              .filter(a => a.type === 'horizontal')
              .map((a, i) => (
                <ReferenceLine
                  key={`h-asymp-${i}`}
                  y={a.value}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  label={{
                    value: a.equation,
                    position: 'right',
                    fill: '#3b82f6',
                    fontSize: 10
                  }}
                />
              ))
            }
            
            {/* Oblique Asymptotes */}
            {showAsymptotes && obliqueAsymptoteData.map((a, i) => (
              <Line
                key={`o-asymp-${i}`}
                data={a.points}
                type="linear"
                dataKey="y"
                stroke="#9333ea"
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                isAnimationActive={false}
              />
            ))}
            
            {/* Main function line */}
            <Line
              type="monotone"
              dataKey="y"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: color }}
              connectNulls={false}
            />
            
            {/* Special points markers */}
            {showSpecialPoints && specialPoints.map((point, i) => (
              <ReferenceLine
                key={`sp-${i}`}
                x={point.x}
                stroke="transparent"
                label={{
                  value: '',
                  position: 'center'
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Special points overlay using SVG */}
      {showSpecialPoints && specialPoints.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {specialPoints.map((p, i) => (
            <span key={i} className={`px-2 py-1 rounded-full ${
              p.type === 'root' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              p.type === 'extremum-max' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
              p.type === 'extremum-min' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              {p.label}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
