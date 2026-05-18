import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, BookOpen, Lightbulb, Plus, Trash2, Timer, Activity, FlaskConical } from 'lucide-react';
import { solveKinetics, type KineticsInput, type KineticsSource, type ReactantSpec, type KineticsPoint } from '@/lib/kineticsEngine';

export default function KineticsTracker() {
  const [equation, setEquation] = useState('Zn + 2 H⁺ → Zn²⁺ + H₂');
  const [source, setSource] = useState<KineticsSource>('volume');
  const [productCoef, setProductCoef] = useState('1');
  const [Vm, setVm] = useState('24');
  const [Vsol, setVsol] = useState('0.1');
  const [askedTime, setAskedTime] = useState('');

  const [reactants, setReactants] = useState<ReactantSpec[]>([
    { label: 'Zn', n0: 0.005, coef: 1 },
    { label: 'H⁺', n0: 0.02, coef: 2 },
  ]);

  const [points, setPoints] = useState<KineticsPoint[]>([
    { t: 0,   V: 0 },
    { t: 30,  V: 30 },
    { t: 60,  V: 55 },
    { t: 120, V: 90 },
    { t: 240, V: 110 },
    { t: 480, V: 120 },
  ]);

  const updateReactant = (i: number, patch: Partial<ReactantSpec>) =>
    setReactants(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const addReactant = () => setReactants(p => [...p, { label: '', n0: 0, coef: 1 }]);
  const delReactant = (i: number) => setReactants(p => p.filter((_, idx) => idx !== i));

  const updatePoint = (i: number, patch: Partial<KineticsPoint>) =>
    setPoints(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  const addPoint = () => setPoints(p => [...p, { t: 0 }]);
  const delPoint = (i: number) => setPoints(p => p.filter((_, idx) => idx !== i));

  // For 'volume', input field is mL → convert to L for engine
  const normalizedPoints: KineticsPoint[] = useMemo(() => points.map(p => {
    if (source === 'volume' && p.V !== undefined) return { ...p, V: p.V / 1000 }; // mL → L
    return p;
  }), [points, source]);

  const input: KineticsInput = useMemo(() => ({
    source,
    points: normalizedPoints,
    reactants,
    productCoef: parseFloat(productCoef) || 1,
    Vm: parseFloat(Vm) || 24,
    Vsol: parseFloat(Vsol) || 1,
    askedTime: askedTime ? parseFloat(askedTime) : undefined,
  }), [source, normalizedPoints, reactants, productCoef, Vm, Vsol, askedTime]);

  const result = useMemo(() => solveKinetics(input), [input]);

  const fmt = (n?: number, d = 4) => {
    if (n === undefined || !isFinite(n)) return '—';
    if (n === 0) return '0';
    const a = Math.abs(n);
    if (a < 1e-3 || a >= 1e4) return n.toExponential(2);
    return Number(n.toPrecision(d)).toString();
  };

  // Simple SVG plot of x vs t
  const plot = useMemo(() => {
    const W = 480, H = 240, P = 32;
    if (result.table.length < 2) return null;
    const ts = result.table.map(p => p.t);
    const xs = result.table.map(p => p.x);
    const tMax = Math.max(...ts);
    const xMax = Math.max(...xs, result.xmax);
    const sx = (t: number) => P + (t / tMax) * (W - 2 * P);
    const sy = (x: number) => H - P - (x / xMax) * (H - 2 * P);
    const path = result.table.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.t)} ${sy(p.x)}`).join(' ');
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-muted/30 rounded-lg">
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="currentColor" strokeOpacity={0.4} />
        <line x1={P} y1={P} x2={P} y2={H - P} stroke="currentColor" strokeOpacity={0.4} />
        <line x1={P} y1={sy(result.xmax)} x2={W - P} y2={sy(result.xmax)} stroke="hsl(var(--destructive))" strokeDasharray="4 4" strokeOpacity={0.6} />
        <text x={W - P} y={sy(result.xmax) - 4} textAnchor="end" fontSize="10" fill="hsl(var(--destructive))">x_max</text>
        <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth={2.5} />
        {result.table.map((p, i) => (
          <circle key={i} cx={sx(p.t)} cy={sy(p.x)} r={3} fill="hsl(var(--primary))" />
        ))}
        {result.tHalf !== undefined && (
          <>
            <line x1={sx(result.tHalf)} y1={P} x2={sx(result.tHalf)} y2={H - P} stroke="hsl(var(--accent-foreground))" strokeDasharray="2 3" strokeOpacity={0.6} />
            <text x={sx(result.tHalf) + 4} y={P + 12} fontSize="10" fill="currentColor">t₁ₐ₂</text>
          </>
        )}
        <text x={W - P} y={H - 8} textAnchor="end" fontSize="10" fill="currentColor" opacity={0.6}>t (s)</text>
        <text x={4} y={P + 4} fontSize="10" fill="currentColor" opacity={0.6}>x (mol)</text>
      </svg>
    );
  }, [result]);

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Timer className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">المتابعة الزمنية لتحول كيميائي</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Suivi temporel — Bac Algérie</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Equation */}
      <Card>
        <CardHeader><CardTitle className="text-base">المعادلة الكيميائية</CardTitle></CardHeader>
        <CardContent>
          <Input value={equation} onChange={(e) => setEquation(e.target.value)} dir="ltr" className="font-mono" />
        </CardContent>
      </Card>

      {/* Reactants → xmax */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>المتفاعلات (الكميات الابتدائية)</span>
            <Button size="sm" variant="outline" onClick={addReactant}><Plus className="w-4 h-4" /></Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {reactants.map((r, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Label className="text-xs">الرمز</Label>
                <Input value={r.label} onChange={(e) => updateReactant(i, { label: e.target.value })} />
              </div>
              <div className="col-span-4">
                <Label className="text-xs">n₀ (mol)</Label>
                <Input inputMode="decimal" value={r.n0} onChange={(e) => updateReactant(i, { n0: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="col-span-3">
                <Label className="text-xs">المعامل ν</Label>
                <Input inputMode="decimal" value={r.coef} onChange={(e) => updateReactant(i, { coef: parseFloat(e.target.value) || 1 })} />
              </div>
              <Button size="icon" variant="ghost" onClick={() => delReactant(i)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Source selector */}
      <Card>
        <CardHeader><CardTitle className="text-base">نوع المعطيات</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Tabs value={source} onValueChange={(v) => setSource(v as KineticsSource)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="volume">حجم الغاز</TabsTrigger>
              <TabsTrigger value="concentration">تركيز</TabsTrigger>
              <TabsTrigger value="x">x مباشرة</TabsTrigger>
            </TabsList>
            <TabsContent value="volume" className="grid grid-cols-3 gap-2 pt-3">
              <div><Label className="text-xs">Vm (L/mol)</Label><Input inputMode="decimal" value={Vm} onChange={(e) => setVm(e.target.value)} /></div>
              <div><Label className="text-xs">معامل الناتج الغازي</Label><Input inputMode="decimal" value={productCoef} onChange={(e) => setProductCoef(e.target.value)} /></div>
              <div><Label className="text-xs">V_sol (L)</Label><Input inputMode="decimal" value={Vsol} onChange={(e) => setVsol(e.target.value)} /></div>
            </TabsContent>
            <TabsContent value="concentration" className="grid grid-cols-2 gap-2 pt-3">
              <div><Label className="text-xs">معامل الناتج المتابع</Label><Input inputMode="decimal" value={productCoef} onChange={(e) => setProductCoef(e.target.value)} /></div>
              <div><Label className="text-xs">V_sol (L)</Label><Input inputMode="decimal" value={Vsol} onChange={(e) => setVsol(e.target.value)} /></div>
            </TabsContent>
            <TabsContent value="x" className="pt-3">
              <div><Label className="text-xs">V_sol (L) — للسرعة الحجمية</Label><Input inputMode="decimal" value={Vsol} onChange={(e) => setVsol(e.target.value)} /></div>
            </TabsContent>
          </Tabs>

          <div>
            <Label className="text-xs">حساب السرعة عند زمن t (اختياري)</Label>
            <Input inputMode="decimal" placeholder="مثال: 60" value={askedTime} onChange={(e) => setAskedTime(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Points table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>جدول القياسات</span>
            <Button size="sm" variant="outline" onClick={addPoint}><Plus className="w-4 h-4" /></Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>t (s)</TableHead>
                  <TableHead>
                    {source === 'volume' ? 'V (mL)' : source === 'concentration' ? '[P] (mol/L)' : 'x (mol)'}
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {points.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell><Input inputMode="decimal" value={p.t} onChange={(e) => updatePoint(i, { t: parseFloat(e.target.value) || 0 })} /></TableCell>
                    <TableCell>
                      {source === 'volume' && (
                        <Input inputMode="decimal" value={p.V ?? ''} onChange={(e) => updatePoint(i, { V: parseFloat(e.target.value) || 0 })} />
                      )}
                      {source === 'concentration' && (
                        <Input inputMode="decimal" value={p.C ?? ''} onChange={(e) => updatePoint(i, { C: parseFloat(e.target.value) || 0 })} />
                      )}
                      {source === 'x' && (
                        <Input inputMode="decimal" value={p.x ?? ''} onChange={(e) => updatePoint(i, { x: parseFloat(e.target.value) || 0 })} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => delPoint(i)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            النتائج
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="x_max" value={`${fmt(result.xmax)} mol`} />
            <Stat label="المتفاعل المحدّ" value={result.limiting} />
            <Stat label="x_f" value={`${fmt(result.xfinal)} mol`} />
            <Stat label="t₁ₐ₂" value={result.tHalf !== undefined ? `${fmt(result.tHalf, 3)} s` : '—'} />
          </div>

          {result.vAtAsked !== undefined && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
              <strong>السرعة عند t = {askedTime} s :</strong>{' '}
              <span dir="ltr" className="font-mono">v ≈ {result.vAtAsked.toExponential(3)} mol·L⁻¹·s⁻¹</span>
            </div>
          )}
          {result.vAverage !== undefined && (
            <div className="p-3 rounded-lg bg-muted/40 text-sm">
              <strong>السرعة المتوسطة :</strong>{' '}
              <span dir="ltr" className="font-mono">v_moy ≈ {result.vAverage.toExponential(3)} mol·L⁻¹·s⁻¹</span>
            </div>
          )}

          {plot && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">منحنى x = f(t)</p>
              {plot}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            خطوات الحل (أسلوب الباك)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.steps.map((s, i) => (
            <div key={i} className="rounded-lg border bg-card p-3">
              <p className="font-semibold text-sm mb-1">{s.title}</p>
              {s.formula && <p dir="ltr" className="font-mono text-xs bg-muted/40 rounded px-2 py-1 my-1">{s.formula}</p>}
              {s.detail && <p className="text-xs text-muted-foreground">{s.detail}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Traps */}
      {result.traps.length > 0 && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              فخاخ الباك — انتبه!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {result.traps.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Reminder */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            🧠 صندوق التذكير — قوانين الدرس
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {result.reminder.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <Badge variant="secondary" className="shrink-0">{i + 1}</Badge>
                <span dir="ltr" className="font-mono">{r}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">🎯 خوارزمية الحل:</p>
            <p>1. اكتب المعادلة وموازنتها — 2. أنشئ جدول التقدم — 3. عبّر عن x بدلالة المعطى (V, C, …) — 4. احسب x_max وحدّد المتفاعل المحدّ — 5. أجب عن السؤال (v, t₁ₐ₂, τ).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold text-sm mt-1">{value}</p>
    </div>
  );
}