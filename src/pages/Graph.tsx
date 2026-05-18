import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { generateGraphPoints } from '@/lib/mathEngine';

interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const colors = [
  '#2563eb', // blue
  '#16a34a', // green
  '#dc2626', // red
  '#9333ea', // purple
  '#ea580c', // orange
  '#0891b2', // cyan
];

const defaultFunctions: GraphFunction[] = [
  { id: '1', expression: 'x^2', color: colors[0], visible: true },
];

const functionExamples = [
  'x^2',
  'x^3',
  'sin(x)',
  'cos(x)',
  'exp(x)',
  'log(x)',
  '1/x',
  'sqrt(x)'
];

export default function Graph() {
  const [functions, setFunctions] = useState<GraphFunction[]>(defaultFunctions);
  const [newExpression, setNewExpression] = useState('');
  const [xRange, setXRange] = useState({ min: -10, max: 10 });

  const addFunction = () => {
    if (!newExpression.trim()) return;
    
    const newFunc: GraphFunction = {
      id: Date.now().toString(),
      expression: newExpression.trim(),
      color: colors[functions.length % colors.length],
      visible: true
    };
    
    setFunctions([...functions, newFunc]);
    setNewExpression('');
  };

  const removeFunction = (id: string) => {
    setFunctions(functions.filter(f => f.id !== id));
  };

  const toggleVisibility = (id: string) => {
    setFunctions(functions.map(f => 
      f.id === id ? { ...f, visible: !f.visible } : f
    ));
  };

  // Generate combined data
  const generateCombinedData = () => {
    const allPoints: Record<number, Record<string, number>> = {};
    
    functions.forEach((func) => {
      if (!func.visible) return;
      
      const points = generateGraphPoints(func.expression, xRange.min, xRange.max, 300);
      points.forEach(point => {
        const key = Math.round(point.x * 100) / 100;
        if (!allPoints[key]) {
          allPoints[key] = { x: key };
        }
        allPoints[key][func.id] = point.y;
      });
    });

    return Object.values(allPoints).sort((a, b) => a.x - b.x);
  };

  const data = generateCombinedData();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <NavigationBreadcrumb
        items={[
          { label: 'رياضيات الباكالوريا', path: '/bac-math' },
          { label: 'الرسم البياني', isCurrent: true },
        ]}
        onBack={() => window.history.back()}
        showBackButton
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-violet-500/10 text-violet-600 mb-4">
          <LineChart className="w-5 h-5" />
          <span className="font-medium">الرسم البياني</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">رسم الدوال التفاعلي</h1>
        <p className="text-muted-foreground">
          ارسم دوال متعددة وقارن بينها
        </p>
      </motion.div>

      {/* Controls */}
      <div className="card-elevated p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Add Function Input */}
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newExpression}
              onChange={(e) => setNewExpression(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFunction()}
              placeholder="أدخل الدالة مثل: x^2 + 2x"
              className="input-math flex-1"
              dir="ltr"
            />
            <Button onClick={addFunction} className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة
            </Button>
          </div>

          {/* Range Controls */}
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <span className="text-muted-foreground">من:</span>
              <input
                type="number"
                value={xRange.min}
                onChange={(e) => setXRange({ ...xRange, min: Number(e.target.value) })}
                className="w-16 px-2 py-1 rounded-lg border border-border bg-background text-center"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted-foreground">إلى:</span>
              <input
                type="number"
                value={xRange.max}
                onChange={(e) => setXRange({ ...xRange, max: Number(e.target.value) })}
                className="w-16 px-2 py-1 rounded-lg border border-border bg-background text-center"
              />
            </label>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground ml-2">أمثلة:</span>
          {functionExamples.map((ex) => (
            <button
              key={ex}
              onClick={() => setNewExpression(ex)}
              className="px-3 py-1 rounded-lg bg-secondary text-sm font-mono hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Functions List */}
      {functions.length > 0 && (
        <div className="card-elevated p-4">
          <h3 className="font-semibold mb-3">الدوال المرسومة:</h3>
          <div className="flex flex-wrap gap-2">
            {functions.map((func) => (
              <motion.div
                key={func.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: func.color }}
                />
                <code className="text-sm font-mono">{func.expression}</code>
                <button
                  onClick={() => toggleVisibility(func.id)}
                  className="p-1 rounded hover:bg-background/50"
                >
                  {func.visible ? (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => removeFunction(func.id)}
                  className="p-1 rounded hover:bg-destructive/20"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Graph */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-elevated p-6"
      >
        <div className="h-[500px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="x"
                type="number"
                domain={[xRange.min, xRange.max]}
                tickFormatter={(v) => v.toFixed(0)}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                type="number"
                domain={['auto', 'auto']}
                tickFormatter={(v) => v.toFixed(1)}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm font-mono mb-1">x = {payload[0].payload.x.toFixed(2)}</p>
                        {payload.map((p: any) => {
                          const func = functions.find(f => f.id === p.dataKey);
                          return func ? (
                            <p key={p.dataKey} className="text-sm font-mono" style={{ color: func.color }}>
                              {func.expression} = {p.value?.toFixed(4)}
                            </p>
                          ) : null;
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value) => {
                  const func = functions.find(f => f.id === value);
                  return func?.expression || value;
                }}
              />
              <ReferenceLine x={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
              <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
              
              {functions.map((func) => (
                func.visible && (
                  <Line
                    key={func.id}
                    type="monotone"
                    dataKey={func.id}
                    name={func.id}
                    stroke={func.color}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                )
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Tips */}
      <div className="card-elevated p-6">
        <h3 className="font-bold mb-3">💡 نصائح للرسم البياني</h3>
        <ul className="text-sm text-secondary-foreground space-y-2">
          <li>• أضف دوال متعددة للمقارنة بينها</li>
          <li>• استخدم التكبير/التصغير لرؤية التفاصيل</li>
          <li>• مرر الفأرة على المنحنى لرؤية القيم الدقيقة</li>
          <li>• <code className="bg-secondary px-1 rounded">sin(x)</code>, <code className="bg-secondary px-1 rounded">cos(x)</code>, <code className="bg-secondary px-1 rounded">exp(x)</code>, <code className="bg-secondary px-1 rounded">log(x)</code> مدعومة</li>
        </ul>
      </div>
    </div>
  );
}
