import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, AlertTriangle, Lightbulb, Wand2, Eye, EyeOff } from 'lucide-react';
import {
  buildInputConfig,
  inputLabels,
  type InputKey,
  type RawInputs,
  type UserMode,
} from '@/lib/dynamicInputSystem';
import { unitOptionsByKey, type UnitSelections } from '@/lib/unitConversions';

interface Props {
  values: RawInputs;
  onChange: (key: InputKey, value: string) => void;
  userMode: UserMode;
  onModeChange: (m: UserMode) => void;
  units: UnitSelections;
  onUnitChange: (key: InputKey, unit: string) => void;
}

const ALL_KEYS: InputKey[] = [
  'C0', 'V', 'pH', 'sigma', 'lambdaCation', 'lambdaAnion',
  'K', 'Qr', 'n0', 'Vm',
];

export default function DynamicInputPanel({ values, onChange, userMode, onModeChange, units, onUnitChange }: Props) {
  const config = useMemo(() => buildInputConfig(values, userMode), [values, userMode]);

  const visibleKeys = ALL_KEYS.filter(k => !config.hiddenInputs.includes(k));
  const hiddenKeys = ALL_KEYS.filter(k => config.hiddenInputs.includes(k));

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" />
            نظام الإدخال الذكي
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">الوضع:</Label>
            <Select value={userMode} onValueChange={(v) => onModeChange(v as UserMode)}>
              <SelectTrigger className="h-8 w-[150px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">🤖 تلقائي</SelectItem>
                <SelectItem value="pH">pH</SelectItem>
                <SelectItem value="sigma">ناقلية σ</SelectItem>
                <SelectItem value="n">مولي n</SelectItem>
                <SelectItem value="K">K (نوعي)</SelectItem>
                <SelectItem value="Vm">غاز Vm</SelectItem>
                <SelectItem value="mixed">مختلط</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detection banner */}
        <div className="rounded-lg border bg-primary/5 p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">{config.detectedLabel}</p>
            <p className="text-xs text-muted-foreground">{config.solvingStrategy}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <Badge variant={config.mode === 'symbolic' ? 'destructive' : 'secondary'} className="text-[10px]">
                {config.mode === 'symbolic' ? '🔣 حل رمزي'
                  : config.mode === 'qualitative' ? '🧠 تحليل نوعي'
                  : '🔢 حل عددي'}
              </Badge>
              {config.requiredInputs.length > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  مطلوب: {config.requiredInputs.join(' · ')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Visible inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleKeys.map((k) => {
            const meta = inputLabels[k];
            const isRequired = config.requiredInputs.includes(k);
            const isOptional = config.optionalInputs.includes(k);
            const unitCfg = unitOptionsByKey[k];
            return (
              <div key={k} className="space-y-1">
                <Label className="flex items-center gap-2 text-sm">
                  <span>{meta.label}</span>
                  {isRequired && <Badge className="bg-primary text-primary-foreground text-[9px] h-4">مطلوب</Badge>}
                  {isOptional && <Badge variant="outline" className="text-[9px] h-4">اختياري</Badge>}
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="any"
                    value={values[k] ?? ''}
                    onChange={(e) => onChange(k, e.target.value)}
                    placeholder={meta.placeholder}
                    className={`flex-1 ${isRequired && !values[k] ? 'border-destructive/50' : ''}`}
                  />
                  {unitCfg && (
                    <Select
                      value={units[k] ?? unitCfg.defaultUnit}
                      onValueChange={(v) => onUnitChange(k, v)}
                    >
                      <SelectTrigger className="h-9 w-[110px] text-xs shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {unitCfg.options.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {meta.hint && (
                  <p className="text-[10px] text-muted-foreground">{meta.hint}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Hidden inputs collapsed indicator */}
        {hiddenKeys.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <EyeOff className="w-3 h-3" />
            <span>تم إخفاء {hiddenKeys.length} حقل غير ضروري لهذا النوع من التمارين.</span>
          </div>
        )}

        {/* Warnings */}
        {config.warnings.length > 0 && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 space-y-1">
            {config.warnings.map((w, i) => (
              <p key={i} className="text-sm flex items-start gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{w}</span>
              </p>
            ))}
          </div>
        )}

        {/* Hints */}
        {config.hints.length > 0 && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 space-y-1">
            {config.hints.map((h, i) => (
              <p key={i} className="text-sm flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                <span>{h}</span>
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}