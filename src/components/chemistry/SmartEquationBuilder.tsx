import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sparkles, Plus, X, Pencil, Wand2, ArrowRight, Lightbulb,
  Beaker, FlaskConical, AlertTriangle, Atom, Droplet, Zap,
} from 'lucide-react';
import {
  type ParsedEquation, type Species, type SpeciesKind,
  parseQuickInput, makeSpecies, formatEquation, classifySpecies,
  detectReactionType, isBalanced, suggestCompletion, normalizeFormula,
  PRESETS, newId,
} from '@/lib/equationParser';

interface Props {
  value?: ParsedEquation;
  onChange?: (eq: ParsedEquation) => void;
}

const KIND_STYLES: Record<SpeciesKind, { bg: string; text: string; ring: string; icon: any; labelAr: string }> = {
  acid:     { bg: 'bg-rose-500/15',    text: 'text-rose-700 dark:text-rose-300',     ring: 'ring-rose-500/40',    icon: Droplet, labelAr: 'حمض' },
  base:     { bg: 'bg-blue-500/15',    text: 'text-blue-700 dark:text-blue-300',     ring: 'ring-blue-500/40',    icon: Beaker,  labelAr: 'أساس' },
  ion:      { bg: 'bg-purple-500/15',  text: 'text-purple-700 dark:text-purple-300', ring: 'ring-purple-500/40',  icon: Zap,     labelAr: 'شاردة' },
  molecule: { bg: 'bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-500/40', icon: Atom,    labelAr: 'جزيء' },
  solid:    { bg: 'bg-slate-500/15',   text: 'text-slate-700 dark:text-slate-300',   ring: 'ring-slate-500/40',   icon: FlaskConical, labelAr: 'صلب' },
  unknown:  { bg: 'bg-muted',          text: 'text-foreground',                       ring: 'ring-muted',          icon: Atom,    labelAr: 'غير محدد' },
};

function SpeciesChip({
  s, onRemove, onEdit,
}: { s: Species; onRemove: () => void; onEdit: (formula: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(s.formula);
  const style = KIND_STYLES[s.kind];
  const Icon = style.icon;

  if (editing) {
    return (
      <div className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ring-1 ${style.bg} ${style.ring}`}>
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { onEdit(draft); setEditing(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { onEdit(draft); setEditing(false); }
            if (e.key === 'Escape') { setDraft(s.formula); setEditing(false); }
          }}
          dir="ltr"
          className="h-7 w-28 text-sm"
        />
      </div>
    );
  }

  return (
    <div className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 ring-1 transition-all ${style.bg} ${style.text} ${style.ring} hover:shadow-sm`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="font-mono text-sm font-bold" dir="ltr">{s.formula}</span>
      <Badge variant="outline" className="text-[10px] py-0 h-4 px-1 font-normal border-current">
        {style.labelAr}
      </Badge>
      <button
        type="button"
        onClick={() => { setDraft(s.formula); setEditing(true); }}
        className="opacity-60 hover:opacity-100 rounded p-0.5"
        aria-label="تعديل"
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="opacity-60 hover:opacity-100 rounded p-0.5"
        aria-label="حذف"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function AddSpeciesButton({
  onAdd,
}: { onAdd: (s: Species) => void }) {
  const [open, setOpen] = useState(false);
  const [free, setFree] = useState('');
  const [kind, setKind] = useState<SpeciesKind>('molecule');

  const groups: { title: string; items: typeof PRESETS }[] = [
    { title: 'حموض', items: PRESETS.filter(p => p.kind === 'acid') },
    { title: 'أسس', items: PRESETS.filter(p => p.kind === 'base') },
    { title: 'جزيئات', items: PRESETS.filter(p => p.kind === 'molecule') },
    { title: 'شوارد', items: PRESETS.filter(p => p.kind === 'ion') },
    { title: 'صلب', items: PRESETS.filter(p => p.kind === 'solid') },
  ];

  const submitFree = () => {
    const f = normalizeFormula(free);
    if (!f) return;
    const sp = makeSpecies(f);
    // Allow override from kind picker if auto-classification looks wrong
    const detected = classifySpecies(f);
    onAdd({ ...sp, kind: detected === 'unknown' ? kind : sp.kind });
    setFree('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full border-dashed">
          <Plus className="w-3.5 h-3.5 ml-1" /> أضف نوعاً
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" dir="rtl">
        <div className="space-y-3">
          <div>
            <Label className="text-xs">إدخال حرّ (مثال: CH3COOH أو Fe2+)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={free}
                dir="ltr"
                onChange={(e) => setFree(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitFree()}
                placeholder="CH3COOH"
                className="h-9"
              />
              <Button size="sm" onClick={submitFree}>إضافة</Button>
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {(['acid','base','ion','molecule','solid'] as SpeciesKind[]).map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition ${kind === k ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted hover:bg-muted/70'}`}
                >
                  {KIND_STYLES[k].labelAr}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t pt-3 space-y-2 max-h-64 overflow-y-auto">
            {groups.map(g => (
              <div key={g.title}>
                <p className="text-[11px] font-semibold text-muted-foreground mb-1">{g.title}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map(it => (
                    <button
                      key={it.formula}
                      type="button"
                      onClick={() => { onAdd(makeSpecies(it.formula)); setOpen(false); }}
                      className={`text-xs font-mono px-2 py-1 rounded-full border ${KIND_STYLES[it.kind].bg} ${KIND_STYLES[it.kind].text} hover:shadow-sm`}
                      dir="ltr"
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SideBox({
  title, list, onAdd, onRemove, onEdit,
}: {
  title: string;
  list: Species[];
  onAdd: (s: Species) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, formula: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0 rounded-xl border bg-muted/20 p-3">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{title}</p>
      <div className="flex flex-wrap items-center gap-2">
        {list.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            {idx > 0 && <span className="text-muted-foreground font-bold">+</span>}
            <SpeciesChip
              s={s}
              onRemove={() => onRemove(s.id)}
              onEdit={(f) => onEdit(s.id, f)}
            />
          </div>
        ))}
        <AddSpeciesButton onAdd={onAdd} />
      </div>
    </div>
  );
}

const TYPE_LABEL_AR: Record<string, string> = {
  acid_base: 'تفاعل حمض/أساس',
  redox: 'تفاعل أكسدة-إرجاع',
  precipitation: 'تفاعل ترسيب',
  general: 'تفاعل عام / توازن',
  unknown: 'غير محدد',
};

export default function SmartEquationBuilder({ value, onChange }: Props) {
  const [reactants, setReactants] = useState<Species[]>(value?.reactants ?? []);
  const [products, setProducts]   = useState<Species[]>(value?.products  ?? []);
  const [arrow, setArrow]         = useState<ParsedEquation['arrow']>(value?.arrow ?? '⇌');
  const [quick, setQuick]         = useState('');

  const detectedType = useMemo(() => detectReactionType(reactants, products), [reactants, products]);
  const balanced     = useMemo(() => isBalanced(reactants, products), [reactants, products]);

  const equation: ParsedEquation = useMemo(() => ({
    reactants, products, arrow, detectedType, balanced,
    warnings: !balanced && reactants.length && products.length ? ['⚠️ المعادلة قد تكون غير متوازنة'] : [],
  }), [reactants, products, arrow, detectedType, balanced]);

  useEffect(() => { onChange?.(equation); }, [equation, onChange]);

  // ---- mutations ----
  const addToSide = (side: 'r' | 'p') => (s: Species) =>
    side === 'r' ? setReactants(l => [...l, s]) : setProducts(l => [...l, s]);
  const removeFromSide = (side: 'r' | 'p') => (id: string) =>
    side === 'r' ? setReactants(l => l.filter(x => x.id !== id)) : setProducts(l => l.filter(x => x.id !== id));
  const editOnSide = (side: 'r' | 'p') => (id: string, formula: string) => {
    const f = normalizeFormula(formula);
    const updater = (l: Species[]) =>
      l.map(x => x.id === id ? { ...x, formula: f, kind: classifySpecies(f) } : x);
    side === 'r' ? setReactants(updater) : setProducts(updater);
  };

  const applyQuick = () => {
    const eq = parseQuickInput(quick);
    setReactants(eq.reactants);
    setProducts(eq.products);
    setArrow(eq.arrow);
  };

  const autoComplete = () => {
    const sug = suggestCompletion(reactants);
    if (!sug) return;
    // ensure H2O is present on reactants for acid/base reactions
    if (!reactants.some(r => r.formula === 'H2O')) {
      setReactants(l => [...l, makeSpecies('H2O')]);
    }
    setProducts(sug.products);
    setArrow('⇌');
  };

  const reset = () => { setReactants([]); setProducts([]); setArrow('⇌'); setQuick(''); };

  // contextual hint
  const hint = useMemo(() => {
    if (reactants.length === 1 && reactants[0].kind === 'acid' && products.length === 0)
      return '💡 هذا حمض ضعيف — هل تريد إضافة الماء وتوليد المعادلة تلقائياً؟';
    if (reactants.length === 1 && reactants[0].kind === 'base' && products.length === 0)
      return '💡 هذه قاعدة ضعيفة — اضغط "إكمال تلقائي" للحصول على B + H₂O ⇌ BH⁺ + OH⁻';
    return null;
  }, [reactants, products]);

  const typeStyle =
    detectedType === 'acid_base' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30' :
    detectedType === 'redox'     ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' :
    detectedType === 'precipitation' ? 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30' :
    'bg-primary/10 text-primary border-primary/30';

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          مُنشئ المعادلة الذكي
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          ابنِ معادلتك بالمكونات (chips) أو الصق المعادلة مباشرةً — الأداة تكشف النوع تلقائياً.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="builder">🧩 منشئ ذكي</TabsTrigger>
            <TabsTrigger value="quick">✍️ إدخال سريع</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-2 pt-3">
            <Label className="text-xs">اكتب المعادلة (مثال: CH3COOH + H2O = CH3COO- + H3O+)</Label>
            <div className="flex gap-2">
              <Input
                value={quick}
                onChange={(e) => setQuick(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyQuick()}
                placeholder="CH3COOH + H2O ⇌ CH3COO- + H3O+"
                dir="ltr"
              />
              <Button onClick={applyQuick} size="sm">
                <Wand2 className="w-4 h-4 ml-1" /> تحليل
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              مدعوم: <span dir="ltr">→, =, ⇌, &lt;=&gt;</span>. الفصل بين الأنواع بـ <span dir="ltr">+</span>.
            </p>
          </TabsContent>

          <TabsContent value="builder" className="pt-3">
            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <SideBox
                title="المتفاعلات"
                list={reactants}
                onAdd={addToSide('r')}
                onRemove={removeFromSide('r')}
                onEdit={editOnSide('r')}
              />
              <div className="flex md:flex-col items-center justify-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-2" dir="rtl">
                    <div className="flex flex-col gap-1">
                      {(['→','⇌','='] as const).map(a => (
                        <button
                          key={a}
                          onClick={() => setArrow(a)}
                          className={`px-2 py-1 rounded text-sm font-mono ${arrow === a ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="font-mono text-lg">{arrow}</span>
              </div>
              <SideBox
                title="النواتج"
                list={products}
                onAdd={addToSide('p')}
                onRemove={removeFromSide('p')}
                onEdit={editOnSide('p')}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Live preview */}
        {(reactants.length > 0 || products.length > 0) && (
          <div className="rounded-lg border bg-background p-3 text-center">
            <p className="text-[11px] text-muted-foreground mb-1">معاينة المعادلة</p>
            <p className="font-mono text-base" dir="ltr">{formatEquation(equation) || '—'}</p>
          </div>
        )}

        {/* Status row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`border ${typeStyle}`}>
            <Sparkles className="w-3 h-3 ml-1" /> {TYPE_LABEL_AR[detectedType]}
          </Badge>
          {reactants.length > 0 && products.length > 0 && (
            <Badge variant="outline" className={balanced ? 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300' : 'border-amber-500/40 text-amber-700 dark:text-amber-300'}>
              {balanced ? '✓ متوازنة' : '⚠️ غير متوازنة'}
            </Badge>
          )}
          <div className="flex-1" />
          {(reactants.some(r => r.kind === 'acid' || r.kind === 'base') && products.length === 0) && (
            <Button size="sm" variant="secondary" onClick={autoComplete}>
              <Wand2 className="w-3.5 h-3.5 ml-1" /> إكمال تلقائي
            </Button>
          )}
          {(reactants.length > 0 || products.length > 0) && (
            <Button size="sm" variant="ghost" onClick={reset}>
              <X className="w-3.5 h-3.5 ml-1" /> تفريغ
            </Button>
          )}
        </div>

        {/* Hint */}
        {hint && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-sm">
            <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <span>{hint}</span>
          </div>
        )}

        {/* Warnings */}
        {equation.warnings.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{equation.warnings.join(' — ')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
