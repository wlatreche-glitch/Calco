import { Card } from '@/components/ui/card';

interface PythagorasDiagramProps {
  rightAngleAt: 'A' | 'B' | 'C';
  sideA?: number;
  sideB?: number;
  sideC?: number;
}

export default function PythagorasDiagram({ rightAngleAt, sideA, sideB, sideC }: PythagorasDiagramProps) {
  // Triangle vertex positions based on right angle location
  const configs = {
    A: {
      // Right angle at A: A at top-left corner, B below, C to the right
      A: { x: 40, y: 30 },
      B: { x: 40, y: 130 },
      C: { x: 160, y: 30 },
      hypotenuse: 'BC',
    },
    B: {
      // Right angle at B (bottom-left)
      A: { x: 40, y: 30 },
      B: { x: 40, y: 130 },
      C: { x: 160, y: 130 },
      hypotenuse: 'AC',
    },
    C: {
      // Right angle at C (bottom-right)
      A: { x: 160, y: 30 },
      B: { x: 40, y: 130 },
      C: { x: 160, y: 130 },
      hypotenuse: 'AB',
    },
  };

  const config = configs[rightAngleAt];
  const { A, B, C } = config;
  const points = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;

  // Right angle square indicator at the correct vertex
  const rightVertex = config[rightAngleAt];
  const getSquare = () => {
    const size = 12;
    const rv = rightVertex;
    // Calculate directions toward the two adjacent vertices
    const otherVertices = (['A', 'B', 'C'] as const).filter(v => v !== rightAngleAt);
    const v1 = config[otherVertices[0]];
    const v2 = config[otherVertices[1]];
    
    const dir1 = { x: Math.sign(v1.x - rv.x), y: Math.sign(v1.y - rv.y) };
    const dir2 = { x: Math.sign(v2.x - rv.x), y: Math.sign(v2.y - rv.y) };
    
    const p1 = { x: rv.x + dir1.x * size, y: rv.y + dir1.y * size };
    const p2 = { x: rv.x + dir2.x * size, y: rv.y + dir2.y * size };
    const corner = { x: p1.x + dir2.x * size, y: p1.y + dir2.y * size };
    
    return `${p1.x},${p1.y} ${corner.x},${corner.y} ${p2.x},${p2.y}`;
  };

  // Midpoint for hypotenuse label
  const getHypotenuseLabel = () => {
    const hypVertices = (['A', 'B', 'C'] as const).filter(v => v !== rightAngleAt);
    const p1 = config[hypVertices[0]];
    const p2 = config[hypVertices[1]];
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    // Offset away from the triangle center
    const cx = (A.x + B.x + C.x) / 3;
    const cy = (A.y + B.y + C.y) / 3;
    const dx = mx - cx;
    const dy = my - cy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { x: mx + (dx / len) * 15, y: my + (dy / len) * 15 };
  };

  // Side label positions
  const getSideLabel = (p1: { x: number; y: number }, p2: { x: number; y: number }, offset: { x: number; y: number }) => ({
    x: (p1.x + p2.x) / 2 + offset.x,
    y: (p1.y + p2.y) / 2 + offset.y,
  });

  const hypLabel = getHypotenuseLabel();

  // Side midpoints with offsets for labels
  const bcLabel = getSideLabel(B, C, { x: 0, y: 15 });
  const acLabel = getSideLabel(A, C, { x: 12, y: 0 });
  const abLabel = getSideLabel(A, B, { x: -15, y: 0 });

  return (
    <Card className="p-4 bg-gradient-to-br from-emerald-500/5 to-transparent">
      <svg viewBox="0 0 200 160" className="w-full h-auto max-h-48">
        {/* Triangle */}
        <polygon
          points={points}
          fill="hsl(142.1 76.2% 36.3% / 0.08)"
          stroke="hsl(142.1 76.2% 36.3%)"
          strokeWidth="2.5"
        />

        {/* Right angle indicator */}
        <polyline
          points={getSquare()}
          fill="none"
          stroke="hsl(142.1 76.2% 36.3%)"
          strokeWidth="1.5"
        />

        {/* Point labels */}
        <text x={A.x} y={A.y - 8} textAnchor="middle" className="fill-emerald-600 text-xs font-bold">A</text>
        <text x={B.x - 10} y={B.y + 5} textAnchor="middle" className="fill-emerald-600 text-xs font-bold">B</text>
        <text x={C.x + 10} y={C.y + 5} textAnchor="middle" className="fill-emerald-600 text-xs font-bold">C</text>

        {/* Side labels with values */}
        {sideA !== undefined && (
          <text x={bcLabel.x} y={bcLabel.y} textAnchor="middle" className="fill-foreground text-[10px]">
            BC={sideA}
          </text>
        )}
        {sideB !== undefined && (
          <text x={acLabel.x} y={acLabel.y} textAnchor="middle" className="fill-foreground text-[10px]">
            AC={sideB}
          </text>
        )}
        {sideC !== undefined && (
          <text x={abLabel.x} y={abLabel.y} textAnchor="middle" className="fill-foreground text-[10px]">
            AB={sideC}
          </text>
        )}

        {/* Hypotenuse indicator */}
        <text x={hypLabel.x} y={hypLabel.y} textAnchor="middle" className="fill-amber-600 text-[9px] font-medium">
          الوتر
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border border-emerald-600 inline-block"></span>
          زاوية قائمة في {rightAngleAt}
        </span>
      </div>
    </Card>
  );
}
