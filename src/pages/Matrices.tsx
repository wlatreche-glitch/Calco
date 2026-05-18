import { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Plus, Minus, X, Equal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import * as math from 'mathjs';

type Matrix = number[][];

interface MatrixResult {
  operation: string;
  result: Matrix | number;
  steps: string[];
}

export default function Matrices() {
  const [size, setSize] = useState({ rows: 2, cols: 2 });
  const [matrixA, setMatrixA] = useState<Matrix>([[1, 2], [3, 4]]);
  const [matrixB, setMatrixB] = useState<Matrix>([[5, 6], [7, 8]]);
  const [result, setResult] = useState<MatrixResult | null>(null);

  const updateMatrix = (
    matrix: Matrix,
    setMatrix: (m: Matrix) => void,
    row: number,
    col: number,
    value: string
  ) => {
    const newMatrix = matrix.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? (parseFloat(value) || 0) : c))
    );
    setMatrix(newMatrix);
  };

  const resizeMatrices = (rows: number, cols: number) => {
    const newSize = { rows: Math.max(1, Math.min(5, rows)), cols: Math.max(1, Math.min(5, cols)) };
    setSize(newSize);
    
    const resize = (m: Matrix): Matrix => {
      const newMatrix: Matrix = [];
      for (let i = 0; i < newSize.rows; i++) {
        newMatrix[i] = [];
        for (let j = 0; j < newSize.cols; j++) {
          newMatrix[i][j] = m[i]?.[j] ?? 0;
        }
      }
      return newMatrix;
    };
    
    setMatrixA(resize(matrixA));
    setMatrixB(resize(matrixB));
  };

  const calculate = (operation: 'add' | 'subtract' | 'multiply' | 'determinant' | 'inverse') => {
    try {
      const steps: string[] = [];
      let resultValue: Matrix | number;
      let operationName = '';

      switch (operation) {
        case 'add':
          operationName = 'جمع المصفوفتين';
          steps.push('نجمع العناصر المتناظرة في نفس الموضع');
          resultValue = math.add(matrixA, matrixB) as Matrix;
          break;
        
        case 'subtract':
          operationName = 'طرح المصفوفتين';
          steps.push('نطرح العناصر المتناظرة في نفس الموضع');
          resultValue = math.subtract(matrixA, matrixB) as Matrix;
          break;
        
        case 'multiply':
          operationName = 'ضرب المصفوفتين';
          steps.push('نضرب كل صف من A في كل عمود من B');
          steps.push('c[i][j] = Σ(a[i][k] × b[k][j])');
          resultValue = math.multiply(matrixA, matrixB) as Matrix;
          break;
        
        case 'determinant':
          operationName = 'محدد المصفوفة A';
          if (size.rows !== size.cols) {
            throw new Error('يجب أن تكون المصفوفة مربعة');
          }
          steps.push('نحسب المحدد باستخدام قاعدة سارس أو التوسيع');
          resultValue = math.det(matrixA);
          break;
        
        case 'inverse':
          operationName = 'معكوس المصفوفة A';
          if (size.rows !== size.cols) {
            throw new Error('يجب أن تكون المصفوفة مربعة');
          }
          const det = math.det(matrixA);
          if (Math.abs(det) < 0.0001) {
            throw new Error('المصفوفة غير قابلة للعكس (det = 0)');
          }
          steps.push(`المحدد = ${det.toFixed(4)}`);
          steps.push('نحسب المصفوفة المرافقة ثم نقسم على المحدد');
          resultValue = math.inv(matrixA) as Matrix;
          break;
        
        default:
          throw new Error('عملية غير معروفة');
      }

      setResult({
        operation: operationName,
        result: resultValue,
        steps
      });
    } catch (error) {
      setResult({
        operation: 'خطأ',
        result: [],
        steps: [error instanceof Error ? error.message : 'حدث خطأ']
      });
    }
  };

  const renderMatrix = (
    matrix: Matrix,
    setMatrix: (m: Matrix) => void,
    label: string,
    editable = true
  ) => (
    <div className="space-y-2">
      <h3 className="font-semibold text-center">{label}</h3>
      <div className="inline-flex flex-col gap-1 p-2 rounded-xl bg-secondary/50">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((cell, j) => (
              <input
                key={j}
                type="number"
                value={cell}
                onChange={(e) => updateMatrix(matrix, setMatrix, i, j, e.target.value)}
                disabled={!editable}
                className="w-14 h-10 text-center rounded-lg border border-border bg-background font-mono text-sm disabled:bg-secondary"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderResultMatrix = (matrix: Matrix | number) => {
    if (typeof matrix === 'number') {
      return (
        <div className="text-2xl font-bold text-center text-primary">
          {matrix.toFixed(4)}
        </div>
      );
    }
    
    return (
      <div className="inline-flex flex-col gap-1 p-2 rounded-xl bg-success/10 border border-success/20">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((cell, j) => (
              <div
                key={j}
                className="w-14 h-10 flex items-center justify-center rounded-lg bg-success/5 font-mono text-sm"
              >
                {typeof cell === 'number' ? cell.toFixed(2) : cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <NavigationBreadcrumb
        items={[
          { label: 'رياضيات الباكالوريا', path: '/bac-math' },
          { label: 'المصفوفات', isCurrent: true },
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
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 mb-4">
          <Grid3X3 className="w-5 h-5" />
          <span className="font-medium">المصفوفات</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">عمليات المصفوفات</h1>
        <p className="text-muted-foreground">
          الجمع، الطرح، الضرب، المحدد، والمعكوس
        </p>
      </motion.div>

      {/* Size Controls */}
      <div className="card-elevated p-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span className="text-sm font-medium">حجم المصفوفة:</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => resizeMatrices(size.rows - 1, size.cols)}
              disabled={size.rows <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-16 text-center font-mono">{size.rows} × {size.cols}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => resizeMatrices(size.rows + 1, size.cols)}
              disabled={size.rows >= 5}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setMatrixA(Array(size.rows).fill(null).map(() => Array(size.cols).fill(0)));
              setMatrixB(Array(size.rows).fill(null).map(() => Array(size.cols).fill(0)));
              setResult(null);
            }}
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            مسح
          </Button>
        </div>
      </div>

      {/* Matrices Input */}
      <div className="card-elevated p-6">
        <div className="flex flex-wrap items-start justify-center gap-8">
          {renderMatrix(matrixA, setMatrixA, 'المصفوفة A')}
          <div className="flex flex-col gap-2 py-8">
            <Button onClick={() => calculate('add')} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
            </Button>
            <Button onClick={() => calculate('subtract')} variant="outline" size="sm" className="gap-2">
              <Minus className="w-4 h-4" />
            </Button>
            <Button onClick={() => calculate('multiply')} variant="outline" size="sm" className="gap-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
          {renderMatrix(matrixB, setMatrixB, 'المصفوفة B')}
        </div>
      </div>

      {/* Single Matrix Operations */}
      <div className="card-elevated p-6">
        <h3 className="font-semibold mb-4 text-center">عمليات على المصفوفة A</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => calculate('determinant')} variant="secondary">
            حساب المحدد (det)
          </Button>
          <Button onClick={() => calculate('inverse')} variant="secondary">
            المصفوفة المعكوسة (A⁻¹)
          </Button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-center">{result.operation}</h2>
          
          {/* Steps */}
          {result.steps.length > 0 && (
            <div className="mb-4 space-y-1">
              {result.steps.map((step, i) => (
                <p key={i} className="text-sm text-muted-foreground text-center">{step}</p>
              ))}
            </div>
          )}
          
          {/* Result Display */}
          <div className="flex justify-center">
            {renderResultMatrix(result.result)}
          </div>
        </motion.div>
      )}

      {/* Educational Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3">📘 قواعد أساسية</h3>
          <ul className="text-sm text-secondary-foreground space-y-2">
            <li>• الجمع والطرح: نفس الأبعاد مطلوبة</li>
            <li>• الضرب A×B: عدد أعمدة A = عدد صفوف B</li>
            <li>• المحدد: للمصفوفات المربعة فقط</li>
            <li>• المعكوس: يجب أن يكون det ≠ 0</li>
          </ul>
        </div>

        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3">🎯 صيغة المحدد 2×2</h3>
          <div className="text-center math-display text-lg">
            det(A) = a₁₁×a₂₂ - a₁₂×a₂₁
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            الفرق بين حاصل ضرب القطر الرئيسي والقطر الثانوي
          </p>
        </div>
      </div>
    </div>
  );
}
