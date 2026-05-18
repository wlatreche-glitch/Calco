import { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Droplet, Waves, Ruler, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// ---------- helpers ----------
const round2 = (n: number) => Math.round(n * 100) / 100;
const fmt = (n: number) => {
  if (!isFinite(n)) return '—';
  const r = round2(n);
  return Number.isInteger(r) ? r.toString() : r.toString();
};

type Step = { law?: string; substitution?: string; note?: string; result?: { label: string; value: string; unit: string } };

function StepBlock({ steps, warning }: { steps: Step[]; warning?: string }) {
  if (warning) {
    return (
      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <p className="text-sm text-destructive font-medium">{warning}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-xl border border-primary/20 bg-card p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
            <span className="text-sm font-semibold text-muted-foreground">الخطوة {i + 1}</span>
          </div>
          {s.note && <p className="text-sm text-muted-foreground">{s.note}</p>}
          {s.law && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary">القانون</p>
              <code dir="ltr" className="block text-base font-mono bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                {s.law}
              </code>
            </div>
          )}
          {s.substitution && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-accent-foreground">التعويض</p>
              <code dir="ltr" className="block text-base font-mono bg-muted rounded-lg px-3 py-2">
                {s.substitution}
              </code>
            </div>
          )}
          {s.result && (
            <div className="space-y-1">
              <p className="text-xs font-bold text-success">النتيجة</p>
              <div className="flex items-center gap-2 bg-success/10 border-2 border-success/40 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <code dir="ltr" className="text-lg font-bold text-success">
                  {s.result.label} = {s.result.value} {s.result.unit}
                </code>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ---------- Mode 1: Dynamometer ----------
function DynamometerMode() {
  const [massVal, setMassVal] = useState('');
  const [massUnit, setMassUnit] = useState<'kg' | 'g'>('kg');
  const [pVal, setPVal] = useState('');
  const [pAppVal, setPAppVal] = useState('');
  const [gVal, setGVal] = useState('10');
  const [steps, setSteps] = useState<Step[]>([]);
  const [warning, setWarning] = useState<string>();

  const compute = () => {
    setWarning(undefined);
    const g = parseFloat(gVal);
    const pApp = parseFloat(pAppVal);
    const mRaw = parseFloat(massVal);
    let P = parseFloat(pVal);
    const out: Step[] = [];

    if (isNaN(pApp) || isNaN(g)) {
      setWarning('يرجى إدخال الثقل الظاهري وقيمة الجاذبية.');
      setSteps([]);
      return;
    }

    let mKg = NaN;
    if (!isNaN(mRaw)) {
      mKg = mRaw;
      if (massUnit === 'g') {
        mKg = mRaw / 1000;
        out.push({
          note: 'تحويل الكتلة من غرام إلى كيلوغرام',
          law: 'm (kg) = m (g) / 1000',
          substitution: `m = ${fmt(mRaw)} / 1000`,
          result: { label: 'm', value: fmt(mKg), unit: 'kg' },
        });
      }
      if (isNaN(P)) {
        P = mKg * g;
        out.push({
          note: 'حساب الثقل الحقيقي',
          law: 'P = m × g',
          substitution: `P = ${fmt(mKg)} × ${fmt(g)}`,
          result: { label: 'P', value: fmt(P), unit: 'N' },
        });
      }
    }

    if (isNaN(P)) {
      setWarning('يجب إدخال الكتلة m أو الثقل الحقيقي P.');
      setSteps([]);
      return;
    }

    if (pApp > P) {
      setWarning('تنبيه: الثقل الظاهري لا يمكن أن يكون أكبر من الثقل الحقيقي.');
      setSteps([]);
      return;
    }

    const Fa = P - pApp;
    out.push({
      note: 'حساب دافعة أرخميدس',
      law: 'Fa = P − P_app',
      substitution: `Fa = ${fmt(P)} − ${fmt(pApp)}`,
      result: { label: 'Fa', value: fmt(Fa), unit: 'N' },
    });

    const mL = Fa / g;
    out.push({
      note: 'استنتاج كتلة السائل المُزاح',
      law: 'm_L = Fa / g',
      substitution: `m_L = ${fmt(Fa)} / ${fmt(g)}`,
      result: { label: 'm_L', value: fmt(mL), unit: 'kg' },
    });

    setSteps(out);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div>
          <Label className="text-sm">الكتلة m (اختياري إذا أعطي P)</Label>
          <div className="flex gap-2 mt-1">
            <Input inputMode="decimal" value={massVal} onChange={e => setMassVal(e.target.value)} placeholder="مثال: 400" />
            <Select value={massUnit} onValueChange={v => setMassUnit(v as 'kg' | 'g')}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-sm">الثقل الحقيقي P (N) — اختياري</Label>
          <Input className="mt-1" inputMode="decimal" value={pVal} onChange={e => setPVal(e.target.value)} placeholder="مثال: 4" />
        </div>
        <div>
          <Label className="text-sm">الثقل الظاهري P_app (N)</Label>
          <Input className="mt-1" inputMode="decimal" value={pAppVal} onChange={e => setPAppVal(e.target.value)} placeholder="مثال: 3.2" />
        </div>
        <div>
          <Label className="text-sm">شدة الجاذبية g (N/kg)</Label>
          <Input className="mt-1" inputMode="decimal" value={gVal} onChange={e => setGVal(e.target.value)} />
        </div>
      </div>
      <Button className="w-full" onClick={compute}>احسب</Button>
      {(steps.length > 0 || warning) && <StepBlock steps={steps} warning={warning} />}
    </div>
  );
}

// ---------- Mode 2: Liquid Properties ----------
function LiquidPropertiesMode() {
  const [rho, setRho] = useState('');
  const [vVal, setVVal] = useState('');
  const [vUnit, setVUnit] = useState<'m3' | 'cm3'>('cm3');
  const [gVal, setGVal] = useState('10');
  const [steps, setSteps] = useState<Step[]>([]);
  const [warning, setWarning] = useState<string>();

  const compute = () => {
    setWarning(undefined);
    const r = parseFloat(rho);
    const vRaw = parseFloat(vVal);
    const g = parseFloat(gVal);
    if (isNaN(r) || isNaN(vRaw) || isNaN(g)) {
      setWarning('يرجى إدخال جميع القيم: الكتلة الحجمية، الحجم، والجاذبية.');
      setSteps([]);
      return;
    }
    const out: Step[] = [];
    let V = vRaw;
    if (vUnit === 'cm3') {
      V = vRaw * 1e-6;
      out.push({
        note: 'تحويل الحجم من cm³ إلى m³',
        law: 'V (m³) = V (cm³) × 10⁻⁶',
        substitution: `V = ${fmt(vRaw)} × 10⁻⁶`,
        result: { label: 'V', value: V.toExponential(2), unit: 'm³' },
      });
    }
    const Fa = r * V * g;
    out.push({
      note: 'حساب دافعة أرخميدس',
      law: 'Fa = ρ × V × g',
      substitution: `Fa = ${fmt(r)} × ${V.toExponential(2)} × ${fmt(g)}`,
      result: { label: 'Fa', value: fmt(Fa), unit: 'N' },
    });
    out.push({
      note: 'استنتاج ثقل السائل المُزاح',
      law: 'P_L = Fa',
      substitution: `P_L = ${fmt(Fa)}`,
      result: { label: 'P_L', value: fmt(Fa), unit: 'N' },
    });
    setSteps(out);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div>
          <Label className="text-sm">الكتلة الحجمية ρ (kg/m³)</Label>
          <Input className="mt-1" inputMode="decimal" value={rho} onChange={e => setRho(e.target.value)} placeholder="مثال: 1000 (ماء)" />
        </div>
        <div>
          <Label className="text-sm">الحجم المغمور V</Label>
          <div className="flex gap-2 mt-1">
            <Input inputMode="decimal" value={vVal} onChange={e => setVVal(e.target.value)} placeholder="مثال: 200" />
            <Select value={vUnit} onValueChange={v => setVUnit(v as 'm3' | 'cm3')}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cm3">cm³</SelectItem>
                <SelectItem value="m3">m³</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-sm">شدة الجاذبية g (N/kg)</Label>
          <Input className="mt-1" inputMode="decimal" value={gVal} onChange={e => setGVal(e.target.value)} />
        </div>
      </div>
      <Button className="w-full" onClick={compute}>احسب</Button>
      {(steps.length > 0 || warning) && <StepBlock steps={steps} warning={warning} />}
    </div>
  );
}

// ---------- Mode 3: Floatation ----------
function FloatationMode() {
  const [pVal, setPVal] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [warning, setWarning] = useState<string>();

  const compute = () => {
    setWarning(undefined);
    const P = parseFloat(pVal);
    if (isNaN(P) || P <= 0) {
      setWarning('يرجى إدخال الثقل الحقيقي P بقيمة موجبة.');
      setSteps([]);
      return;
    }
    setSteps([
      {
        note: 'بما أن الجسم يطفو في حالة توازن، فإن مجموع القوى المطبقة عليه معدوم.',
        law: 'Fa = P  (شرط التوازن)',
        substitution: `Fa = ${fmt(P)}`,
        result: { label: 'Fa', value: fmt(P), unit: 'N' },
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 text-sm text-muted-foreground">
        💡 الجسم الطافي في حالة توازن: دافعة أرخميدس تساوي الثقل الحقيقي.
      </div>
      <div>
        <Label className="text-sm">الثقل الحقيقي P (N)</Label>
        <Input className="mt-1" inputMode="decimal" value={pVal} onChange={e => setPVal(e.target.value)} placeholder="مثال: 5" />
      </div>
      <Button className="w-full" onClick={compute}>احسب</Button>
      {(steps.length > 0 || warning) && <StepBlock steps={steps} warning={warning} />}
    </div>
  );
}

// ---------- Optional: Vector Scale ----------
function ScaleMode() {
  const [force, setForce] = useState('');
  const [scale, setScale] = useState('');
  const [steps, setSteps] = useState<Step[]>([]);
  const [warning, setWarning] = useState<string>();

  const compute = () => {
    setWarning(undefined);
    const F = parseFloat(force);
    const X = parseFloat(scale);
    if (isNaN(F) || isNaN(X) || X <= 0) {
      setWarning('يرجى إدخال شدة القوة وسلم الرسم (قيمة موجبة).');
      setSteps([]);
      return;
    }
    const L = F / X;
    setSteps([
      {
        note: `سلم الرسم: 1 cm يمثل ${fmt(X)} N`,
        law: 'L (cm) = F / X',
        substitution: `L = ${fmt(F)} / ${fmt(X)}`,
        result: { label: 'L', value: fmt(L), unit: 'cm' },
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <div>
          <Label className="text-sm">شدة القوة F (N)</Label>
          <Input className="mt-1" inputMode="decimal" value={force} onChange={e => setForce(e.target.value)} placeholder="مثال: 4" />
        </div>
        <div>
          <Label className="text-sm">سلم الرسم X (1 cm يمثل X N)</Label>
          <Input className="mt-1" inputMode="decimal" value={scale} onChange={e => setScale(e.target.value)} placeholder="مثال: 2" />
        </div>
      </div>
      <Button className="w-full" onClick={compute}>احسب</Button>
      {(steps.length > 0 || warning) && <StepBlock steps={steps} warning={warning} />}
    </div>
  );
}

// ---------- Main ----------
export default function ArchimedesCalculator() {
  return (
    <div dir="rtl" className="w-full max-w-[550px] mx-auto" style={{ fontFamily: 'Tajawal, Cairo, sans-serif' }}>
      <Card className="border-2 border-primary/30 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">دافعة أرخميدس</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Poussée d'Archimède — فيزياء BEM</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <Tabs defaultValue="dyn" className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-auto gap-1 p-1">
              <TabsTrigger value="dyn" className="flex-col gap-1 py-2 px-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Waves className="w-4 h-4" />
                <span>الربيعة</span>
              </TabsTrigger>
              <TabsTrigger value="liq" className="flex-col gap-1 py-2 px-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Droplet className="w-4 h-4" />
                <span>السائل</span>
              </TabsTrigger>
              <TabsTrigger value="float" className="flex-col gap-1 py-2 px-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Anchor className="w-4 h-4" />
                <span>الطفو</span>
              </TabsTrigger>
              <TabsTrigger value="scale" className="flex-col gap-1 py-2 px-1 text-[11px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Ruler className="w-4 h-4" />
                <span>السلم</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dyn" className="mt-4"><DynamometerMode /></TabsContent>
            <TabsContent value="liq" className="mt-4"><LiquidPropertiesMode /></TabsContent>
            <TabsContent value="float" className="mt-4"><FloatationMode /></TabsContent>
            <TabsContent value="scale" className="mt-4"><ScaleMode /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}