import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Play, RotateCcw, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MathContent } from '@/components/MathContent';
import { PedagogyMode } from '@/lib/physicsEngine';

interface Props {
  mode: PedagogyMode;
}

type OpticsType = 'THIN_LENS' | 'MIRROR' | 'REFRACTION' | 'PRISM';
type LensType = 'convergent' | 'divergent';
type MirrorType = 'concave' | 'convex' | 'plane';

interface OpticsResult {
  imageDistance: number;
  magnification: number;
  imageNature: string;
  imageOrientation: string;
  formula: string;
  steps: { title: string; content: string }[];
  tips: string[];
}

const opticsTypes = [
  { value: 'THIN_LENS', label: 'عدسة رقيقة', labelFr: 'Lentille mince' },
  { value: 'MIRROR', label: 'مرآة كروية', labelFr: 'Miroir sphérique' },
  { value: 'REFRACTION', label: 'الانكسار', labelFr: 'Réfraction' },
  { value: 'PRISM', label: 'المنشور', labelFr: 'Prisme' },
];

export default function OpticsCalculator({ mode }: Props) {
  const [opticsType, setOpticsType] = useState<OpticsType>('THIN_LENS');
  const [lensType, setLensType] = useState<LensType>('convergent');
  const [mirrorType, setMirrorType] = useState<MirrorType>('concave');
  const [objectDistance, setObjectDistance] = useState<string>('');
  const [focalLength, setFocalLength] = useState<string>('');
  const [objectHeight, setObjectHeight] = useState<string>('');
  const [n1, setN1] = useState<string>('1');
  const [n2, setN2] = useState<string>('1.5');
  const [incidentAngle, setIncidentAngle] = useState<string>('');
  const [prismAngle, setPrismAngle] = useState<string>('60');
  const [result, setResult] = useState<OpticsResult | null>(null);

  const handleCalculate = () => {
    let calculatedResult: OpticsResult | null = null;

    switch (opticsType) {
      case 'THIN_LENS':
      case 'MIRROR': {
        const OA = parseFloat(objectDistance);
        let f = parseFloat(focalLength);
        
        // For divergent lens or convex mirror, f is negative
        if ((opticsType === 'THIN_LENS' && lensType === 'divergent') ||
            (opticsType === 'MIRROR' && mirrorType === 'convex')) {
          f = -Math.abs(f);
        }
        
        // Conjugate relation: 1/OA' - 1/OA = 1/f
        // OA' = 1 / (1/f + 1/OA)
        const OAPrime = 1 / (1/f + 1/(-OA));
        const magnification = OAPrime / (-OA);
        
        const isReal = OAPrime > 0;
        const isInverted = magnification < 0;
        
        calculatedResult = {
          imageDistance: OAPrime,
          magnification: magnification,
          imageNature: isReal ? 'حقيقية (réelle)' : 'وهمية (virtuelle)',
          imageOrientation: isInverted ? 'مقلوبة (renversée)' : 'معتدلة (droite)',
          formula: "1/OA' - 1/OA = 1/f'",
          steps: [
            { title: 'المعطيات', content: `OA = -${OA} (الجسم قبل العدسة) | f' = ${f} ${opticsType === 'THIN_LENS' ? 'cm' : 'cm'}` },
            { title: 'تطبيق علاقة التقارن', content: `1/OA' = 1/f' + 1/OA = 1/${f} + 1/${-OA}` },
            { title: 'حساب موضع الصورة', content: `OA' = ${OAPrime.toFixed(2)} cm` },
            { title: 'حساب التكبير', content: `γ = OA'/OA = ${OAPrime.toFixed(2)}/${-OA} = ${magnification.toFixed(2)}` },
          ],
          tips: [
            isReal ? 'الصورة الحقيقية يمكن استقبالها على شاشة' : 'الصورة الوهمية لا يمكن استقبالها على شاشة',
            Math.abs(magnification) > 1 ? 'الصورة مكبرة' : Math.abs(magnification) < 1 ? 'الصورة مصغرة' : 'الصورة بنفس حجم الجسم',
          ],
        };
        break;
      }
      
      case 'REFRACTION': {
        const n1Val = parseFloat(n1);
        const n2Val = parseFloat(n2);
        const i1 = parseFloat(incidentAngle) * Math.PI / 180;
        
        // Snell's law: n1 * sin(i1) = n2 * sin(i2)
        const sinI2 = (n1Val * Math.sin(i1)) / n2Val;
        
        if (Math.abs(sinI2) > 1) {
          // Total internal reflection
          calculatedResult = {
            imageDistance: 0,
            magnification: 0,
            imageNature: 'انعكاس كلي داخلي',
            imageOrientation: 'لا توجد موجة منكسرة',
            formula: 'n₁ sin(i₁) > n₂ → انعكاس كلي',
            steps: [
              { title: 'المعطيات', content: `n₁ = ${n1Val} | n₂ = ${n2Val} | i₁ = ${incidentAngle}°` },
              { title: 'تطبيق قانون سنال', content: `sin(i₂) = n₁ × sin(i₁) / n₂ = ${sinI2.toFixed(3)}` },
              { title: 'النتيجة', content: 'sin(i₂) > 1 ← انعكاس كلي داخلي!' },
            ],
            tips: [
              'الانعكاس الكلي يحدث عندما ينتقل الضوء من وسط أكثر كثافة إلى وسط أقل كثافة',
              `الزاوية الحرجة: i_c = arcsin(n₂/n₁) = ${(Math.asin(n2Val/n1Val) * 180 / Math.PI).toFixed(1)}°`,
            ],
          };
        } else {
          const i2 = Math.asin(sinI2) * 180 / Math.PI;
          calculatedResult = {
            imageDistance: i2,
            magnification: 0,
            imageNature: 'انكسار عادي',
            imageOrientation: i2 > parseFloat(incidentAngle) ? 'الشعاع يبتعد عن الناظم' : 'الشعاع يقترب من الناظم',
            formula: 'n₁ sin(i₁) = n₂ sin(i₂)',
            steps: [
              { title: 'المعطيات', content: `n₁ = ${n1Val} | n₂ = ${n2Val} | i₁ = ${incidentAngle}°` },
              { title: 'تطبيق قانون سنال-ديكارت', content: `n₁ × sin(i₁) = n₂ × sin(i₂)` },
              { title: 'حساب زاوية الانكسار', content: `i₂ = arcsin(${n1Val} × sin(${incidentAngle}°) / ${n2Val})` },
              { title: 'النتيجة', content: `i₂ = ${i2.toFixed(2)}°` },
            ],
            tips: [
              n2Val > n1Val ? 'الانتقال إلى وسط أكثر انكساراً ← الشعاع يقترب من الناظم' : 'الانتقال إلى وسط أقل انكساراً ← الشعاع يبتعد من الناظم',
            ],
          };
        }
        break;
      }
      
      case 'PRISM': {
        const A = parseFloat(prismAngle) * Math.PI / 180;
        const n = parseFloat(n2);
        const i1 = parseFloat(incidentAngle) * Math.PI / 180;
        
        // First refraction
        const r1 = Math.asin(Math.sin(i1) / n);
        // At minimum deviation: r1 = r2 = A/2
        const r2 = A - r1;
        // Second refraction
        const sinI2 = n * Math.sin(r2);
        
        if (Math.abs(sinI2) > 1) {
          calculatedResult = {
            imageDistance: 0,
            magnification: 0,
            imageNature: 'انعكاس كلي داخلي في المنشور',
            imageOrientation: '',
            formula: 'انعكاس كلي على الوجه الثاني',
            steps: [
              { title: 'المعطيات', content: `A = ${prismAngle}° | n = ${n} | i₁ = ${incidentAngle}°` },
              { title: 'الانكسار الأول', content: `r₁ = arcsin(sin(i₁)/n) = ${(r1 * 180 / Math.PI).toFixed(2)}°` },
              { title: 'داخل المنشور', content: `r₂ = A - r₁ = ${(r2 * 180 / Math.PI).toFixed(2)}°` },
              { title: 'النتيجة', content: 'انعكاس كلي على الوجه الثاني' },
            ],
            tips: [],
          };
        } else {
          const i2 = Math.asin(sinI2) * 180 / Math.PI;
          const D = (parseFloat(incidentAngle) + i2 - parseFloat(prismAngle));
          
          calculatedResult = {
            imageDistance: i2,
            magnification: D,
            imageNature: 'شعاع خارج',
            imageOrientation: `الانحراف D = ${D.toFixed(2)}°`,
            formula: 'D = i₁ + i₂ - A',
            steps: [
              { title: 'المعطيات', content: `A = ${prismAngle}° | n = ${n} | i₁ = ${incidentAngle}°` },
              { title: 'الانكسار الأول', content: `r₁ = arcsin(sin(${incidentAngle}°)/${n}) = ${(r1 * 180 / Math.PI).toFixed(2)}°` },
              { title: 'داخل المنشور', content: `r₂ = A - r₁ = ${prismAngle} - ${(r1 * 180 / Math.PI).toFixed(2)} = ${(r2 * 180 / Math.PI).toFixed(2)}°` },
              { title: 'الانكسار الثاني', content: `i₂ = arcsin(n × sin(r₂)) = ${i2.toFixed(2)}°` },
              { title: 'زاوية الانحراف', content: `D = i₁ + i₂ - A = ${parseFloat(incidentAngle)} + ${i2.toFixed(2)} - ${prismAngle} = ${D.toFixed(2)}°` },
            ],
            tips: [
              'عند الانحراف الأصغري: i₁ = i₂ و r₁ = r₂ = A/2',
              `Dₘᵢₙ = 2 × arcsin(n × sin(A/2)) - A`,
            ],
          };
        }
        break;
      }
    }

    setResult(calculatedResult);
  };

  const handleReset = () => {
    setObjectDistance('');
    setFocalLength('');
    setObjectHeight('');
    setIncidentAngle('');
    setResult(null);
  };

  const renderRayDiagram = () => {
    if (!result || (opticsType !== 'THIN_LENS' && opticsType !== 'MIRROR')) return null;

    const OA = parseFloat(objectDistance);
    const f = parseFloat(focalLength);
    const OAPrime = result.imageDistance;
    const gamma = result.magnification;
    
    // SVG dimensions
    const width = 500;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 15;

    const objectX = centerX - OA * scale;
    const imageX = centerX + OAPrime * scale;
    const focalX = centerX + f * scale;
    const focalXNeg = centerX - f * scale;
    
    const objectHeight = 40;
    const imageHeight = objectHeight * Math.abs(gamma) * (gamma < 0 ? -1 : 1);

    const isConvergent = (opticsType === 'THIN_LENS' && lensType === 'convergent') || 
                         (opticsType === 'MIRROR' && mirrorType === 'concave');

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">الرسم التخطيطي للأشعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center overflow-x-auto">
            <svg width={width} height={height} className="bg-secondary/20 rounded-xl">
              {/* المحور الرئيسي */}
              <line x1={20} y1={centerY} x2={width - 20} y2={centerY} stroke="hsl(var(--foreground))" strokeWidth="1" />
              
              {/* العدسة أو المرآة */}
              {opticsType === 'THIN_LENS' ? (
                <>
                  <line x1={centerX} y1={40} x2={centerX} y2={height - 40} stroke="hsl(var(--primary))" strokeWidth="2" />
                  {isConvergent ? (
                    <>
                      <polygon points={`${centerX},40 ${centerX-8},55 ${centerX+8},55`} fill="hsl(var(--primary))" />
                      <polygon points={`${centerX},${height-40} ${centerX-8},${height-55} ${centerX+8},${height-55}`} fill="hsl(var(--primary))" />
                    </>
                  ) : (
                    <>
                      <polygon points={`${centerX},40 ${centerX-8},40 ${centerX},55`} fill="hsl(var(--primary))" />
                      <polygon points={`${centerX},40 ${centerX+8},40 ${centerX},55`} fill="hsl(var(--primary))" />
                      <polygon points={`${centerX},${height-40} ${centerX-8},${height-40} ${centerX},${height-55}`} fill="hsl(var(--primary))" />
                      <polygon points={`${centerX},${height-40} ${centerX+8},${height-40} ${centerX},${height-55}`} fill="hsl(var(--primary))" />
                    </>
                  )}
                </>
              ) : (
                <path 
                  d={`M ${centerX + 20} ${40} Q ${centerX - 30} ${centerY} ${centerX + 20} ${height - 40}`} 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="3"
                />
              )}
              
              {/* البؤرة */}
              <circle cx={focalX} cy={centerY} r={4} fill="hsl(var(--destructive))" />
              <text x={focalX} y={centerY + 20} textAnchor="middle" className="text-xs fill-destructive">F'</text>
              <circle cx={focalXNeg} cy={centerY} r={4} fill="hsl(var(--destructive))" />
              <text x={focalXNeg} y={centerY + 20} textAnchor="middle" className="text-xs fill-destructive">F</text>
              
              {/* المركز البصري */}
              <circle cx={centerX} cy={centerY} r={3} fill="hsl(var(--foreground))" />
              <text x={centerX} y={centerY + 20} textAnchor="middle" className="text-xs fill-foreground">O</text>
              
              {/* الجسم */}
              <line x1={objectX} y1={centerY} x2={objectX} y2={centerY - objectHeight} stroke="#22c55e" strokeWidth="3" />
              <polygon points={`${objectX},${centerY - objectHeight} ${objectX-5},${centerY - objectHeight + 10} ${objectX+5},${centerY - objectHeight + 10}`} fill="#22c55e" />
              <text x={objectX} y={centerY + 20} textAnchor="middle" className="text-xs" fill="#22c55e">A</text>
              <text x={objectX} y={centerY - objectHeight - 10} textAnchor="middle" className="text-xs" fill="#22c55e">B</text>
              
              {/* الصورة */}
              <line 
                x1={imageX} 
                y1={centerY} 
                x2={imageX} 
                y2={centerY - imageHeight} 
                stroke="#3b82f6" 
                strokeWidth="3" 
                strokeDasharray={OAPrime < 0 ? "5,5" : "0"}
              />
              <text x={imageX} y={centerY + 20} textAnchor="middle" className="text-xs" fill="#3b82f6">A'</text>
              <text x={imageX} y={centerY - imageHeight - 10} textAnchor="middle" className="text-xs" fill="#3b82f6">B'</text>
              
              {/* الأشعة */}
              {/* شعاع موازي للمحور → يمر من البؤرة */}
              <line x1={objectX} y1={centerY - objectHeight} x2={centerX} y2={centerY - objectHeight} stroke="#f59e0b" strokeWidth="1.5" />
              <line x1={centerX} y1={centerY - objectHeight} x2={imageX} y2={centerY - imageHeight} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray={OAPrime < 0 ? "5,5" : "0"} />
              
              {/* شعاع يمر من المركز */}
              <line x1={objectX} y1={centerY - objectHeight} x2={imageX} y2={centerY - imageHeight} stroke="#ef4444" strokeWidth="1.5" strokeDasharray={OAPrime < 0 ? "5,5" : "0"} />
              
              {/* شعاع يمر من البؤرة → موازي */}
              <line x1={objectX} y1={centerY - objectHeight} x2={centerX} y2={centerY + (objectHeight * (centerX - objectX) / (focalXNeg - objectX))} stroke="#8b5cf6" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 justify-center text-sm">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700">شعاع موازي</Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-700">شعاع مركزي</Badge>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-700">شعاع بؤري</Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRefractionDiagram = () => {
    if (!result || opticsType !== 'REFRACTION') return null;

    const i1 = parseFloat(incidentAngle);
    const i2 = result.imageDistance;
    const width = 400;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;

    const rayLength = 100;
    const incidentEndX = centerX - rayLength * Math.sin(i1 * Math.PI / 180);
    const incidentEndY = centerY - rayLength * Math.cos(i1 * Math.PI / 180);
    const refractedEndX = centerX + rayLength * Math.sin(i2 * Math.PI / 180);
    const refractedEndY = centerY + rayLength * Math.cos(i2 * Math.PI / 180);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">رسم الانكسار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <svg width={width} height={height} className="bg-secondary/20 rounded-xl">
              {/* الوسط الأول */}
              <rect x={0} y={0} width={width} height={centerY} fill="hsl(var(--primary) / 0.1)" />
              <text x={30} y={30} className="text-sm" fill="hsl(var(--primary))">n₁ = {n1}</text>
              
              {/* الوسط الثاني */}
              <rect x={0} y={centerY} width={width} height={centerY} fill="hsl(var(--accent) / 0.2)" />
              <text x={30} y={height - 20} className="text-sm" fill="hsl(var(--accent-foreground))">n₂ = {n2}</text>
              
              {/* السطح الفاصل */}
              <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="hsl(var(--foreground))" strokeWidth="2" />
              
              {/* الناظم */}
              <line x1={centerX} y1={30} x2={centerX} y2={height - 30} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="5,5" />
              <text x={centerX + 10} y={50} className="text-xs" fill="hsl(var(--muted-foreground))">الناظم</text>
              
              {/* الشعاع الساقط */}
              <line x1={incidentEndX} y1={incidentEndY} x2={centerX} y2={centerY} stroke="#f59e0b" strokeWidth="2" />
              <polygon 
                points={`${centerX},${centerY} ${centerX - 8},${centerY - 15} ${centerX + 2},${centerY - 12}`} 
                fill="#f59e0b" 
              />
              
              {/* الشعاع المنكسر */}
              {result.imageNature !== 'انعكاس كلي داخلي' && (
                <>
                  <line x1={centerX} y1={centerY} x2={refractedEndX} y2={refractedEndY} stroke="#22c55e" strokeWidth="2" />
                  <polygon 
                    points={`${refractedEndX},${refractedEndY} ${refractedEndX - 5},${refractedEndY - 12} ${refractedEndX + 8},${refractedEndY - 8}`} 
                    fill="#22c55e" 
                  />
                </>
              )}
              
              {/* زاوية السقوط */}
              <path d={`M ${centerX} ${centerY - 40} A 40 40 0 0 0 ${centerX - 40 * Math.sin(i1 * Math.PI / 180)} ${centerY - 40 * Math.cos(i1 * Math.PI / 180)}`} fill="none" stroke="#f59e0b" strokeWidth="1" />
              <text x={centerX - 50} y={centerY - 50} className="text-xs" fill="#f59e0b">i₁ = {i1}°</text>
              
              {/* زاوية الانكسار */}
              {result.imageNature !== 'انعكاس كلي داخلي' && (
                <>
                  <path d={`M ${centerX} ${centerY + 40} A 40 40 0 0 1 ${centerX + 40 * Math.sin(i2 * Math.PI / 180)} ${centerY + 40 * Math.cos(i2 * Math.PI / 180)}`} fill="none" stroke="#22c55e" strokeWidth="1" />
                  <text x={centerX + 50} y={centerY + 50} className="text-xs" fill="#22c55e">i₂ = {i2.toFixed(1)}°</text>
                </>
              )}
            </svg>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* عنوان الأداة */}
      <Card className="border-2 border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-indigo-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>البصريات الهندسية</CardTitle>
              <p className="text-sm text-muted-foreground">Optique Géométrique</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قسم الإدخال */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المعطيات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>نوع العنصر البصري</Label>
              <Select value={opticsType} onValueChange={(v) => { setOpticsType(v as OpticsType); setResult(null); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {opticsTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground mr-2">({type.labelFr})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {opticsType === 'THIN_LENS' && (
              <div className="space-y-2">
                <Label>نوع العدسة</Label>
                <Select value={lensType} onValueChange={(v) => setLensType(v as LensType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="convergent">عدسة مقربة (Convergente)</SelectItem>
                    <SelectItem value="divergent">عدسة مفرقة (Divergente)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {opticsType === 'MIRROR' && (
              <div className="space-y-2">
                <Label>نوع المرآة</Label>
                <Select value={mirrorType} onValueChange={(v) => setMirrorType(v as MirrorType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concave">مرآة مقعرة (Concave)</SelectItem>
                    <SelectItem value="convex">مرآة محدبة (Convexe)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(opticsType === 'THIN_LENS' || opticsType === 'MIRROR') && (
              <>
                <div className="space-y-2">
                  <Label>بعد الجسم |OA| (cm)</Label>
                  <Input type="number" value={objectDistance} onChange={(e) => setObjectDistance(e.target.value)} placeholder="مثال: 30" />
                </div>
                <div className="space-y-2">
                  <Label>البعد البؤري |f'| (cm)</Label>
                  <Input type="number" value={focalLength} onChange={(e) => setFocalLength(e.target.value)} placeholder="مثال: 10" />
                </div>
              </>
            )}

            {(opticsType === 'REFRACTION' || opticsType === 'PRISM') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>قرينة الوسط الأول n₁</Label>
                    <Input type="number" value={n1} onChange={(e) => setN1(e.target.value)} placeholder="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>قرينة الوسط الثاني n₂</Label>
                    <Input type="number" value={n2} onChange={(e) => setN2(e.target.value)} placeholder="1.5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>زاوية السقوط i₁ (°)</Label>
                  <Input type="number" value={incidentAngle} onChange={(e) => setIncidentAngle(e.target.value)} placeholder="مثال: 30" />
                </div>
              </>
            )}

            {opticsType === 'PRISM' && (
              <div className="space-y-2">
                <Label>زاوية المنشور A (°)</Label>
                <Input type="number" value={prismAngle} onChange={(e) => setPrismAngle(e.target.value)} placeholder="60" />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleCalculate} className="flex-1 gap-2">
                <Play className="w-4 h-4" />حساب
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />مسح
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* قسم النتائج */}
        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-green-600">النتيجة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">القانون</p>
                  <div className="font-bold text-primary mx-auto max-w-full">
                    <MathContent content={result.formula} />
                  </div>
                </div>

                {(opticsType === 'THIN_LENS' || opticsType === 'MIRROR') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                      <p className="text-sm text-muted-foreground">موضع الصورة</p>
                      <p className="font-mono font-bold text-lg">OA' = {result.imageDistance.toFixed(2)} cm</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                      <p className="text-sm text-muted-foreground">التكبير</p>
                      <p className="font-mono font-bold text-lg">γ = {result.magnification.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">{result.imageNature}</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">{result.imageOrientation}</Badge>
                </div>

                {mode !== 'exam' && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />خطوات الحل
                    </h4>
                    {result.steps.map((step, i) => {
                      const combinedText = step.content ? `${step.title}: $${step.content}$` : step.title;
                      return (
                        <div key={i} className="p-3 rounded-lg bg-secondary/50">
                          <MathContent content={combinedText} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {result.tips.length > 0 && mode === 'learning' && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div className="space-y-1">
                        {result.tips.map((tip, i) => (
                          <p key={i} className="text-sm text-amber-700">{tip}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* الرسم التخطيطي */}
      {renderRayDiagram()}
      {renderRefractionDiagram()}
    </div>
  );
}
