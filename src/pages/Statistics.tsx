import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Plus, Trash2, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DataPoint {
  value: number;
  frequency: number;
}

interface StatResult {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  sum: number;
  count: number;
}

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2', '#d97706', '#7c3aed'];

export default function Statistics() {
  const [data, setData] = useState<DataPoint[]>([
    { value: 10, frequency: 3 },
    { value: 15, frequency: 5 },
    { value: 20, frequency: 8 },
    { value: 25, frequency: 4 },
    { value: 30, frequency: 2 },
  ]);
  const [result, setResult] = useState<StatResult | null>(null);

  const addDataPoint = () => {
    setData([...data, { value: 0, frequency: 1 }]);
  };

  const removeDataPoint = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const updateDataPoint = (index: number, field: 'value' | 'frequency', val: number) => {
    const newData = [...data];
    newData[index][field] = val;
    setData(newData);
  };

  const calculate = () => {
    const expandedData: number[] = [];
    data.forEach(d => {
      for (let i = 0; i < d.frequency; i++) {
        expandedData.push(d.value);
      }
    });

    if (expandedData.length === 0) return;

    // Sort for median
    const sorted = [...expandedData].sort((a, b) => a - b);
    const n = sorted.length;

    // Mean
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    let median: number;
    if (n % 2 === 0) {
      median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    } else {
      median = sorted[Math.floor(n / 2)];
    }

    // Mode
    const freq: Record<number, number> = {};
    sorted.forEach(v => {
      freq[v] = (freq[v] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(freq));
    const mode = Object.entries(freq)
      .filter(([_, f]) => f === maxFreq)
      .map(([v]) => Number(v));

    // Variance & StdDev
    const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    setResult({
      mean,
      median,
      mode,
      variance,
      stdDev,
      sum,
      count: n
    });
  };

  const chartData = data.map((d, i) => ({
    name: d.value.toString(),
    frequency: d.frequency,
    fill: COLORS[i % COLORS.length]
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <NavigationBreadcrumb
        items={[
          { label: 'رياضيات الباكالوريا', path: '/bac-math' },
          { label: 'الإحصاء', isCurrent: true },
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
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-teal-500/10 text-teal-600 mb-4">
          <BarChart3 className="w-5 h-5" />
          <span className="font-medium">الإحصاء والاحتمالات</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">الإحصاء الوصفي</h1>
        <p className="text-muted-foreground">
          حساب المقاييس الإحصائية مع التمثيل البياني
        </p>
      </motion.div>

      {/* Data Input */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">جدول التكرار</h3>
          <Button onClick={addDataPoint} variant="outline" size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة قيمة
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-4 text-right font-medium">القيمة (xᵢ)</th>
                <th className="py-2 px-4 text-right font-medium">التكرار (nᵢ)</th>
                <th className="py-2 px-4 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((point, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      value={point.value}
                      onChange={(e) => updateDataPoint(index, 'value', Number(e.target.value))}
                      className="w-24 px-3 py-1 rounded-lg border border-border bg-background text-center"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="1"
                      value={point.frequency}
                      onChange={(e) => updateDataPoint(index, 'frequency', Math.max(1, Number(e.target.value)))}
                      className="w-24 px-3 py-1 rounded-lg border border-border bg-background text-center"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => removeDataPoint(index)}
                      className="p-1 rounded hover:bg-destructive/20"
                      disabled={data.length <= 1}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={calculate} className="w-full mt-4 btn-hero">
          <Calculator className="w-5 h-5 ml-2" />
          حساب المقاييس الإحصائية
        </Button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card-elevated p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">المتوسط الحسابي</p>
              <p className="text-2xl font-bold text-primary">{result.mean.toFixed(2)}</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">الوسيط</p>
              <p className="text-2xl font-bold text-emerald-600">{result.median.toFixed(2)}</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">المنوال</p>
              <p className="text-2xl font-bold text-amber-600">{result.mode.join(', ')}</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">العدد الكلي</p>
              <p className="text-2xl font-bold text-muted-foreground">{result.count}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card-elevated p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">التباين (σ²)</p>
              <p className="text-2xl font-bold text-violet-600">{result.variance.toFixed(4)}</p>
            </div>
            <div className="card-elevated p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">الانحراف المعياري (σ)</p>
              <p className="text-2xl font-bold text-rose-600">{result.stdDev.toFixed(4)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="card-elevated p-6">
              <h3 className="font-bold mb-4">المدرج التكراري</h3>
              <div className="h-[250px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
                              <p className="text-sm">القيمة: {payload[0].payload.name}</p>
                              <p className="text-sm text-primary">التكرار: {payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="frequency" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="card-elevated p-6">
              <h3 className="font-bold mb-4">الرسم الدائري</h3>
              <div className="h-[250px]" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="frequency"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Formulas */}
      <div className="card-elevated p-6">
        <h3 className="font-bold mb-4">📘 الصيغ الإحصائية</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">المتوسط الحسابي:</p>
              <p className="math-display">x̄ = Σ(xᵢ × nᵢ) / Σnᵢ</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">التباين:</p>
              <p className="math-display">σ² = Σ(xᵢ - x̄)² × nᵢ / Σnᵢ</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">الانحراف المعياري:</p>
              <p className="math-display">σ = √(σ²)</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">الوسيط:</p>
              <p className="text-sm">القيمة المركزية بعد الترتيب</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
