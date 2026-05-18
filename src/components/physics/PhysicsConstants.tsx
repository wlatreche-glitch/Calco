import { useState } from 'react';
import { Ruler, Search, Copy, Check, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PHYSICS_CONSTANTS, convertUnit, getConstantsByCategory, PhysicalConstant } from '@/lib/physicsConstants';
import { toast } from 'sonner';

const categoryLabels: Record<PhysicalConstant['category'], { ar: string }> = {
  universal: { ar: 'ثوابت عالمية' },
  electromagnetic: { ar: 'ثوابت كهرومغناطيسية' },
  atomic: { ar: 'ثوابت ذرية' },
  thermodynamic: { ar: 'ثوابت حرارية' },
  mechanical: { ar: 'ثوابت ميكانيكية' },
};

const unitCategories = [
  { value: 'length', label: 'الطول', units: ['km', 'm', 'cm', 'mm', 'μm', 'nm'] },
  { value: 'time', label: 'الزمن', units: ['h', 'min', 's', 'ms', 'μs'] },
  { value: 'mass', label: 'الكتلة', units: ['t', 'kg', 'g', 'mg'] },
  { value: 'energy', label: 'الطاقة', units: ['MeV', 'keV', 'eV', 'kJ', 'J'] },
];

export default function PhysicsConstants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [inputValue, setInputValue] = useState('');
  const [convertedValue, setConvertedValue] = useState<string | null>(null);

  const handleCopy = (value: number, symbol: string) => {
    navigator.clipboard.writeText(value.toExponential());
    setCopiedSymbol(symbol);
    toast.success(`تم نسخ قيمة ${symbol}`);
    setTimeout(() => setCopiedSymbol(null), 2000);
  };

  const handleConvert = () => {
    if (!inputValue) return;
    try {
      const result = convertUnit(parseFloat(inputValue), fromUnit, toUnit);
      setConvertedValue(result.toExponential(4));
    } catch { toast.error('خطأ في التحويل'); }
  };

  const getCurrentUnits = () => unitCategories.find(c => c.value === selectedCategory)?.units || [];
  const filteredConstants = Object.values(PHYSICS_CONSTANTS).filter(c => c.nameAr.includes(searchTerm) || c.symbol.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500"><Ruler className="w-6 h-6 text-white" /></div>
            <CardTitle>الثوابت الفيزيائية ومحول الوحدات</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="constants" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="constants">الثوابت الفيزيائية</TabsTrigger>
          <TabsTrigger value="converter">محول الوحدات</TabsTrigger>
        </TabsList>

        <TabsContent value="constants" className="space-y-6">
          <Card><CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ابحث عن ثابت..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" />
            </div>
          </CardContent></Card>

          {Object.entries(categoryLabels).map(([category, labels]) => {
            const constants = getConstantsByCategory(category as PhysicalConstant['category']);
            if (constants.length === 0) return null;
            return (
              <Card key={category}>
                <CardHeader><CardTitle className="text-lg">{labels.ar}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {constants.filter(c => !searchTerm || c.nameAr.includes(searchTerm) || c.symbol.includes(searchTerm)).map(constant => (
                      <div key={constant.symbol} className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-mono font-bold text-primary">{constant.symbol}</span>
                              <Badge variant="outline" className="text-xs">{constant.unit}</Badge>
                            </div>
                            <p className="text-sm font-medium">{constant.nameAr}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(constant.value, constant.symbol)}>
                            {copiedSymbol === constant.symbol ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                        <div className="mt-3 p-2 rounded-lg bg-background/50 font-mono text-sm text-center">{constant.value.toExponential(4)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="converter">
          <Card><CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label>نوع الوحدة</Label>
              <Select value={selectedCategory} onValueChange={(v) => { setSelectedCategory(v); const units = unitCategories.find(c => c.value === v)?.units || []; setFromUnit(units[0]); setToUnit(units[1]); setConvertedValue(null); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{unitCategories.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
              <div className="space-y-2">
                <Label>من</Label>
                <div className="flex gap-2">
                  <Input type="number" value={inputValue} onChange={(e) => { setInputValue(e.target.value); setConvertedValue(null); }} placeholder="القيمة" className="flex-1" />
                  <Select value={fromUnit} onValueChange={setFromUnit}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger><SelectContent>{getCurrentUnits().map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); setConvertedValue(null); }}><ArrowRightLeft className="w-4 h-4" /></Button>
              <div className="space-y-2">
                <Label>إلى</Label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 rounded-lg bg-secondary/50 font-mono text-center min-h-[40px] flex items-center justify-center">{convertedValue || '—'}</div>
                  <Select value={toUnit} onValueChange={setToUnit}><SelectTrigger className="w-20"><SelectValue /></SelectTrigger><SelectContent>{getCurrentUnits().map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
            </div>
            <Button onClick={handleConvert} className="w-full">تحويل</Button>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
