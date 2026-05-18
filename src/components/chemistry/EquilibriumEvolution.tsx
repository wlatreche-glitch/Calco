import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { FlaskConical, Calculator, Lightbulb, AlertTriangle, CheckCircle2, BookOpen, Sparkles, XCircle, HelpCircle } from 'lucide-react';
import { solveEquilibrium, type SystemType, type EquilibriumInput } from '@/lib/chemistryEngine';
import SmartEquationBuilder from './SmartEquationBuilder';
import type { ParsedEquation } from '@/lib/equationParser';
import DynamicInputPanel from './DynamicInputPanel';
import type { InputKey, RawInputs, UserMode } from '@/lib/dynamicInputSystem';
import { defaultUnitSelections, toCanonical, type UnitSelections } from '@/lib/unitConversions';

export default function EquilibriumEvolution() {
  const [systemType, setSystemType] = useState<SystemType>('auto');
  const [raw, setRaw] = useState<RawInputs>({
    C0: '0.01',
    V: '0.1',
    pH: '3.4',
    K: '',
    Qr: '',
    sigma: '',
    lambdaCation: '0.0350',
    lambdaAnion: '0.0041',
    n0: '',
    Vm: '',
  });
  const [userMode, setUserMode] = useState<UserMode>('auto');
  const [units, setUnits] = useState<UnitSelections>(() => defaultUnitSelections());
  const [hintMode, setHintMode] = useState<boolean>(false);
  const [acidLabel, setAcidLabel] = useState<string>('AH');
  const [baseLabel, setBaseLabel] = useState<string>('A⁻');
  const [submitted, setSubmitted] = useState(false);

  const updateRaw = (key: InputKey, value: string) =>
    setRaw(prev => ({ ...prev, [key]: value }));

  const updateUnit = (key: InputKey, unit: string) =>
    setUnits(prev => ({ ...prev, [key]: unit }));

  // Parse a raw string and convert to canonical unit using current selection.
  const parseConv = (key: InputKey): number | undefined => {
    const s = raw[key];
    if (!s) return undefined;
    const n = parseFloat(s);
    if (isNaN(n)) return undefined;
    return toCanonical(key, n, units[key]);
  };

  // Smart Equation Builder state — feeds into solver inputs
  const handleEquationChange = (eq: ParsedEquation) => {
    // Auto-set system type from detection
    if (eq.detectedType === 'acid_base') {
      const hasAcid = eq.reactants.some(s => s.kind === 'acid');
      const hasBase = eq.reactants.some(s => s.kind === 'base');
      if (hasAcid) setSystemType('acid');
      else if (hasBase) setSystemType('base');
    } else if (eq.detectedType !== 'unknown' && eq.reactants.length > 0) {
      setSystemType('general');
    }
    // Auto-fill acid/base labels from first non-water reactant & first non-H3O+/OH- product
    const firstReactant = eq.reactants.find(s => s.formula !== 'H2O');
    const firstProduct  = eq.products.find(s => !/^H3O\+?$/.test(s.formula) && !/^(OH|HO)-?$/.test(s.formula));
    if (firstReactant) setAcidLabel(firstReactant.formula);
    if (firstProduct)  setBaseLabel(firstProduct.formula);
  };

  const input: EquilibriumInput = useMemo(() => ({
    systemType,
    C0: parseConv('C0'),
    V: parseConv('V'),
    pH: raw.pH ? parseFloat(raw.pH) : undefined,
    K: raw.K ? parseFloat(raw.K) : undefined,
    Qr: raw.Qr ? parseFloat(raw.Qr) : undefined,
    sigma: parseConv('sigma'),
    lambdaCation: parseConv('lambdaCation'),
    lambdaAnion: parseConv('lambdaAnion'),
    n0: parseConv('n0'),
    Vm: parseConv('Vm'),
    symbolic: !raw.V,
    hintMode,
    acidLabel,
    baseLabel,
  }), [systemType, raw, units, hintMode, acidLabel, baseLabel]);

  const result = useMemo(() => solveEquilibrium(input), [input]);

  const fmt = (n?: number) => {
    if (n === undefined || !isFinite(n)) return '—';
    if (n === 0) return '0';
    const abs = Math.abs(n);
    if (abs < 1e-3 || abs >= 1e4) return n.toExponential(2);
    return Number(n.toPrecision(4)).toString();
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card className="border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <FlaskConical className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">تطور جملة كيميائية نحو التوازن</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Évolution d'un système chimique vers l'équilibre — Bac Algérie
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Smart Equation Builder */}
      <SmartEquationBuilder onChange={handleEquationChange} />

      {/* Dynamic Input System */}
      <DynamicInputPanel
        values={raw}
        onChange={updateRaw}
        userMode={userMode}
        onModeChange={setUserMode}
        units={units}
        onUnitChange={updateUnit}
      />

      {/* Settings (system type + labels + hint mode) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            الإعدادات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>نوع الجملة</Label>
              <Select value={systemType} onValueChange={(v) => setSystemType(v as SystemType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">🤖 كشف تلقائي (Auto)</SelectItem>
                  <SelectItem value="acid">حمض (AH + H₂O ⇌ A⁻ + H₃O⁺)</SelectItem>
                  <SelectItem value="base">أساس (B + H₂O ⇌ BH⁺ + HO⁻)</SelectItem>
                  <SelectItem value="general">تفاعل عام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>رمز المتفاعل</Label>
                <Input value={acidLabel} onChange={(e) => setAcidLabel(e.target.value)} placeholder="AH" />
              </div>
              <div className="space-y-2">
                <Label>رمز الناتج</Label>
                <Input value={baseLabel} onChange={(e) => setBaseLabel(e.target.value)} placeholder="A⁻" />
              </div>
            </div>
          </div>

          {/* Hint mode toggle */}
          <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <div>
                <p className="text-sm font-semibold">وضع التلميح</p>
                <p className="text-xs text-muted-foreground">يعرض خطوات إرشادية بدل الحلّ الكامل</p>
              </div>
            </div>
            <Switch checked={hintMode} onCheckedChange={setHintMode} />
          </div>

          <Button className="w-full" onClick={() => setSubmitted(true)}>
            <FlaskConical className="w-4 h-4 ml-2" />
            احسب وحلّ التمرين
          </Button>
        </CardContent>
      </Card>

      {submitted && (
        <div className="space-y-4">
          {/* Detected type */}
          {result.detectedType && (
            <Card className="border-primary/40 bg-primary/5">
              <CardContent className="p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  <strong>الكشف التلقائي:</strong> {result.detectedType}
                </span>
              </CardContent>
            </Card>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="p-4 space-y-1">
                {result.warnings.map((w, i) => (
                  <p key={i} className="text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {w}
                  </p>
                ))}
              </CardContent>
            </Card>
          )}

          {/* HINT MODE */}
          {hintMode && result.hints && result.hints.length > 0 && (
            <Card className="border-amber-500/50 bg-amber-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  تلميحات تدريجية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm list-decimal pr-4">
                  {result.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

          {/* 1) Données */}
          <Card className="border-warning/40 bg-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className="bg-warning text-warning-foreground">1</Badge>
                المعطيات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li>• نوع الجملة: <strong>{systemType === 'acid' ? 'حمض' : systemType === 'base' ? 'أساس' : 'عام'}</strong></li>
                {raw.C0 && <li>• C₀ = <strong>{fmt(parseFloat(raw.C0))} mol/L</strong></li>}
                {raw.V ? (
                  <li>• V = <strong>{fmt(parseFloat(raw.V))} L</strong></li>
                ) : (
                  <li>• V = <strong className="text-destructive">غير معطى (حل رمزي)</strong></li>
                )}
                {raw.pH && <li>• pH = <strong>{raw.pH}</strong></li>}
                {raw.K && <li>• K = <strong>{fmt(parseFloat(raw.K))}</strong></li>}
                {raw.sigma && <li>• σ = <strong>{fmt(parseFloat(raw.sigma))} S/m</strong></li>}
                {raw.n0 && <li>• n₀ = <strong>{fmt(parseFloat(raw.n0))} mol</strong></li>}
                {raw.C0 && raw.V && (
                  <li>• n₀ = C₀ · V = <strong>{fmt(parseFloat(raw.C0) * parseFloat(raw.V))} mol</strong></li>
                )}
              </ul>
            </CardContent>
          </Card>

          {/* 2) Équation */}
          {result.equation && (
            <Card className="border-purple-500/40 bg-purple-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-purple-500 text-white">2</Badge>
                  المعادلة الكيميائية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-mono text-center py-2">{result.equation}</p>
              </CardContent>
            </Card>
          )}

          {/* 3) Tableau d'avancement */}
          {result.table.length > 0 && (
            <Card className="border-emerald-500/40 bg-emerald-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white">3</Badge>
                  جدول التقدم
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الحالة</TableHead>
                      {result.speciesHeader.map((s, i) => (
                        <TableHead key={i} className="text-center font-bold">{s}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.table.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.state}</TableCell>
                        {row.values.map((v, j) => (
                          <TableCell key={j} className="text-center font-mono text-sm">{v}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* 4) Calculs */}
          {result.steps.length > 0 && (
            <Card className="border-blue-500/40 bg-blue-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-blue-500 text-white">4</Badge>
                  الحسابات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.steps.map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-background/60 border">
                    <p className="text-sm font-semibold mb-1">{s.label}</p>
                    <p className="text-sm font-mono text-muted-foreground" dir="ltr">{s.expression}</p>
                    {s.value && (
                      <p className="text-sm font-bold text-primary mt-1" dir="ltr">= {s.value}</p>
                    )}
                    {s.why && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
                        <Lightbulb className="w-3 h-3 mt-0.5 text-amber-600 shrink-0" />
                        <span>💡 {s.why}</span>
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Rejected solutions */}
          {result.rejectedSolutions && result.rejectedSolutions.length > 0 && (
            <Card className="border-rose-500/40 bg-rose-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  حلول مرفوضة (تحقق فيزيائي)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {result.rejectedSolutions.map((r, i) => (
                    <li key={i} className="text-rose-700 dark:text-rose-300">• {r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Concentrations */}
          {result.concentrations && result.concentrations.length > 0 && (
            <Card className="border-teal-500/40 bg-teal-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-teal-500 text-white">★</Badge>
                  التراكيز النهائية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {result.concentrations.map((c, i) => (
                    <div key={i} className="p-2 rounded bg-background/60 border text-center">
                      <p className="text-xs text-muted-foreground" dir="ltr">{c.name}</p>
                      <p className="text-sm font-mono font-bold" dir="ltr">{fmt(c.value)}</p>
                      <p className="text-[10px] text-muted-foreground">{c.unit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5) Qr */}
          {result.Qr !== undefined && (
            <Card className="border-orange-500/40 bg-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white">5</Badge>
                  خارج التفاعل Q_r
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-mono text-center" dir="ltr">Q_r = {fmt(result.Qr)}</p>
              </CardContent>
            </Card>
          )}

          {/* 6) Comparaison */}
          {result.Qr !== undefined && result.K !== undefined && (
            <Card className="border-red-500/40 bg-red-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-red-500 text-white">6</Badge>
                  المقارنة مع K
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-base font-mono text-center" dir="ltr">
                  Q_r = {fmt(result.Qr)} {result.comparison === 'less' ? '<' : result.comparison === 'greater' ? '>' : '='} K = {fmt(result.K)}
                </p>
                <p className="text-sm text-center text-muted-foreground">
                  {result.comparison === 'less' && 'التطور في الاتجاه المباشر (تشكيل النواتج)'}
                  {result.comparison === 'greater' && 'التطور في الاتجاه العكسي (تشكيل المتفاعلات)'}
                  {result.comparison === 'equal' && 'الجملة في حالة توازن'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 7) Conclusion */}
          <Card className="border-emerald-600/50 bg-emerald-600/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white">7</Badge>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                الاستنتاج النهائي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed font-medium">{result.conclusion}</p>
            </CardContent>
          </Card>

          {/* 8) Formulas */}
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">8</Badge>
                <BookOpen className="w-4 h-4 text-primary" />
                تذكير بالقوانين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm font-mono" dir="ltr">
                {result.formulas.map((f, i) => (
                  <li key={i} className="p-2 rounded bg-secondary/50">{f}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 9) Alerts */}
          {result.alerts.length > 0 && (
            <Card className="border-amber-500/40 bg-amber-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge className="bg-amber-500 text-white">9</Badge>
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  تنبيهات ذكية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {result.alerts.map((a, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}