import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { analyzeFunction, generateGraphPoints, PedagogyMode } from '@/lib/linearFunctionEngine';

interface Props { mode: PedagogyMode }

const CANVAS_W = 360;
const CANVAS_H = 360;

function toCanvas(x: number, y: number, scale: number, originX: number, originY: number) {
  return {
    cx: originX + x * scale,
    cy: originY - y * scale,
  };
}

export default function GraphRenderer({ mode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [funcInput, setFuncInput] = useState('');
  const [scale, setScale] = useState(30);
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof analyzeFunction> | null>(null);
  const [error, setError] = useState('');

  const originX = CANVAS_W / 2;
  const originY = CANVAS_H / 2;

  const draw = useCallback((a: number, b: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = '#0f172a10';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid
    ctx.strokeStyle = '#94a3b820';
    ctx.lineWidth = 1;
    const xRange = Math.ceil(CANVAS_W / 2 / scale) + 1;
    const yRange = Math.ceil(CANVAS_H / 2 / scale) + 1;

    for (let i = -xRange; i <= xRange; i++) {
      const { cx } = toCanvas(i, 0, scale, originX, originY);
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, CANVAS_H);
      ctx.strokeStyle = i === 0 ? '#94a3b850' : '#94a3b820';
      ctx.lineWidth = i === 0 ? 1.5 : 1;
      ctx.stroke();
    }
    for (let j = -yRange; j <= yRange; j++) {
      const { cy } = toCanvas(0, j, scale, originX, originY);
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(CANVAS_W, cy);
      ctx.strokeStyle = j === 0 ? '#94a3b850' : '#94a3b820';
      ctx.lineWidth = j === 0 ? 1.5 : 1;
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    // X axis
    ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(CANVAS_W, originY); ctx.stroke();
    // Arrow X
    ctx.beginPath(); ctx.moveTo(CANVAS_W - 10, originY - 5);
    ctx.lineTo(CANVAS_W, originY); ctx.lineTo(CANVAS_W - 10, originY + 5); ctx.stroke();
    // Y axis
    ctx.beginPath(); ctx.moveTo(originX, CANVAS_H); ctx.lineTo(originX, 0); ctx.stroke();
    // Arrow Y
    ctx.beginPath(); ctx.moveTo(originX - 5, 10);
    ctx.lineTo(originX, 0); ctx.lineTo(originX + 5, 10); ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px monospace';
    ctx.fillText('x', CANVAS_W - 15, originY - 8);
    ctx.fillText('y', originX + 6, 12);
    ctx.fillText('O', originX + 4, originY + 14);

    // Tick marks & numbers
    ctx.font = '10px monospace';
    ctx.fillStyle = '#94a3b8';
    for (let i = -xRange; i <= xRange; i++) {
      if (i === 0) continue;
      const { cx } = toCanvas(i, 0, scale, originX, originY);
      ctx.beginPath(); ctx.moveTo(cx, originY - 3); ctx.lineTo(cx, originY + 3);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.stroke();
      if (Math.abs(i) <= 5) ctx.fillText(i.toString(), cx - 4, originY + 14);
    }
    for (let j = -yRange; j <= yRange; j++) {
      if (j === 0) continue;
      const { cy } = toCanvas(0, j, scale, originX, originY);
      ctx.beginPath(); ctx.moveTo(originX - 3, cy); ctx.lineTo(originX + 3, cy);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.stroke();
      if (Math.abs(j) <= 5) ctx.fillText(j.toString(), originX + 5, cy + 4);
    }

    // Draw the function line
    const points = generateGraphPoints(a, b, -CANVAS_W / 2 / scale - 1, CANVAS_W / 2 / scale + 1);

    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    let first = true;
    for (const pt of points) {
      const { cx, cy } = toCanvas(pt.x, pt.y, scale, originX, originY);
      if (cy < -20 || cy > CANVAS_H + 20) { first = true; continue; }
      if (first) { ctx.moveTo(cx, cy); first = false; }
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();

    // Key points
    const drawPoint = (x: number, y: number, label: string, color: string) => {
      const { cx, cy } = toCanvas(x, y, scale, originX, originY);
      if (cx < 0 || cx > CANVAS_W || cy < 0 || cy > CANVAS_H) return;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = '11px monospace';
      ctx.fillText(label, cx + 8, cy - 6);
    };

    // Y intercept
    drawPoint(0, b, `B(0,${b})`, '#22c55e');

    // X intercept (if exists and not at origin)
    if (a !== 0) {
      const xi = -b / a;
      if (Math.abs(xi) < 50) {
        drawPoint(xi, 0, `A(${parseFloat(xi.toFixed(2))},0)`, '#f59e0b');
      }
    }

    // Slope indicator (rise/run) for learning mode
    if (mode === 'learning' && a !== 0) {
      const runX = 1;
      const startX = 0;
      const startY = b;
      const endX = startX + runX;
      const endY = startY + a;

      const { cx: sx, cy: sy } = toCanvas(startX, startY, scale, originX, originY);
      const { cx: ex, cy: ey } = toCanvas(endX, endY, scale, originX, originY);
      const { cx: mx } = toCanvas(endX, startY, scale, originX, originY);

      // Run (horizontal)
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(mx, sy);
      ctx.strokeStyle = '#f59e0b80'; ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]); ctx.stroke(); ctx.setLineDash([]);

      // Rise (vertical)
      ctx.beginPath(); ctx.moveTo(mx, sy); ctx.lineTo(ex, ey);
      ctx.strokeStyle = '#ef444480'; ctx.lineWidth = 2;
      ctx.setLineDash([4, 2]); ctx.stroke(); ctx.setLineDash([]);

      // Labels
      ctx.font = '10px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('run=1', (sx + mx) / 2 - 15, sy + 14);
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`rise=${a}`, mx + 4, (sy + ey) / 2);
    }
  }, [scale, mode, originX, originY]);

  const handleDraw = () => {
    if (!funcInput.trim()) return;
    const result = analyzeFunction(funcInput, 'exam');
    if (result.errors.length > 0) {
      setError(result.errors[0]);
      setAnalysisResult(null);
      return;
    }
    setError('');
    setAnalysisResult(result);
    draw(result.a, result.b);
  };

  useEffect(() => {
    if (analysisResult) draw(analysisResult.a, analysisResult.b);
  }, [scale, analysisResult, draw]);

  const examples = ['2x + 1', '-x + 3', '3x', '0.5x - 2', '-2x + 4'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">رسم التمثيل البياني</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>الدالة</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">f(x) =</span>
                <Input
                  value={funcInput}
                  onChange={e => setFuncInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleDraw()}
                  placeholder="مثال: 2x + 1"
                  className="text-lg font-mono text-center"
                  dir="ltr"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm">أمثلة:</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map(ex => (
                  <Badge
                    key={ex} variant="outline"
                    className="cursor-pointer hover:bg-primary/10 font-mono text-xs"
                    onClick={() => setFuncInput(ex)}
                  >{ex}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleDraw} className="flex-1 gap-2">
                <Play className="w-4 h-4" /> رسم
              </Button>
              <Button variant="outline" onClick={() => { setFuncInput(''); setAnalysisResult(null); setError(''); const ctx = canvasRef.current?.getContext('2d'); if (ctx) ctx.clearRect(0, 0, CANVAS_W, CANVAS_H); }} className="gap-2">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-3 pt-2">
              <Label className="text-sm">تكبير:</Label>
              <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(s + 10, 80))} className="gap-1">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(s - 10, 15))} className="gap-1">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">Scale: {scale}</span>
            </div>

            {/* Legend */}
            {analysisResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <p className="text-sm font-medium">المعلومات:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-indigo-500 rounded" />
                    <span>f(x) = {analysisResult.a}x {analysisResult.b >= 0 ? '+' : ''}{analysisResult.b}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>B(0, {analysisResult.yIntercept})</span>
                  </div>
                  {analysisResult.xIntercept !== null && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>A({parseFloat(analysisResult.xIntercept.toFixed(2))}, 0)</span>
                    </div>
                  )}
                  {mode === 'learning' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 border-t-2 border-dashed border-amber-500" />
                        <span>run = 1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0.5 border-t-2 border-dashed border-red-500" />
                        <span>rise = {analysisResult.a}</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">المستوى الإحداثي</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex justify-center">
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="rounded-b-xl bg-background border-t border-border"
              style={{ maxWidth: '100%' }}
            />
          </CardContent>
        </Card>
      </div>

      {mode === 'learning' && (
        <Card className="border-2 border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="p-4 text-sm space-y-2">
            <p className="font-semibold text-indigo-700">🎨 قراءة التمثيل البياني</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <span>النقطة B(0,b): تقاطع محور y</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span>النقطة A(−b/a, 0): تقاطع محور x</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-indigo-500 rounded shrink-0" />
                <span>الميل a = rise/run</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
