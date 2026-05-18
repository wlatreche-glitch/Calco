import { Card } from '@/components/ui/card';

interface DistanceDiagramProps {
  type: 'distance' | 'radius' | 'diameter';
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  radius?: number;
  diameter?: number;
}

export default function DistanceDiagram({ type, x1, y1, x2, y2, radius, diameter }: DistanceDiagramProps) {
  if (type === 'distance') {
    const hasA = x1 !== undefined && y1 !== undefined;
    const hasB = x2 !== undefined && y2 !== undefined;
    const hasCoords = hasA && hasB;

    // Determine data range
    const allX: number[] = [0];
    const allY: number[] = [0];
    if (hasA) { allX.push(x1!); allY.push(y1!); }
    if (hasB) { allX.push(x2!); allY.push(y2!); }

    const dataMinX = Math.min(...allX);
    const dataMaxX = Math.max(...allX);
    const dataMinY = Math.min(...allY);
    const dataMaxY = Math.max(...allY);

    // Add margin around data
    const rangeX = dataMaxX - dataMinX || 2;
    const rangeY = dataMaxY - dataMinY || 2;
    const margin = 0.8;
    const gMinX = Math.floor(dataMinX - rangeX * margin);
    const gMaxX = Math.ceil(dataMaxX + rangeX * margin);
    const gMinY = Math.floor(dataMinY - rangeY * margin);
    const gMaxY = Math.ceil(dataMaxY + rangeY * margin);

    // Ensure at least a few units visible
    const viewMinX = Math.min(gMinX, -1);
    const viewMaxX = Math.max(gMaxX, 1);
    const viewMinY = Math.min(gMinY, -1);
    const viewMaxY = Math.max(gMaxY, 1);

    // SVG layout
    const svgW = 280, svgH = 220;
    const pad = { l: 30, r: 20, t: 20, b: 30 };
    const plotW = svgW - pad.l - pad.r;
    const plotH = svgH - pad.t - pad.b;

    // Make uniform scale (متجانس)
    const scaleX = plotW / (viewMaxX - viewMinX);
    const scaleY = plotH / (viewMaxY - viewMinY);
    const scale = Math.min(scaleX, scaleY);

    // Center the plot
    const usedW = (viewMaxX - viewMinX) * scale;
    const usedH = (viewMaxY - viewMinY) * scale;
    const offsetX = pad.l + (plotW - usedW) / 2;
    const offsetY = pad.t + (plotH - usedH) / 2;

    const toSvgX = (ux: number) => offsetX + (ux - viewMinX) * scale;
    const toSvgY = (uy: number) => offsetY + (viewMaxY - uy) * scale;

    // Origin position
    const ox = toSvgX(0);
    const oy = toSvgY(0);

    // Grid lines
    const gridLinesX: number[] = [];
    for (let i = viewMinX; i <= viewMaxX; i++) gridLinesX.push(i);
    const gridLinesY: number[] = [];
    for (let i = viewMinY; i <= viewMaxY; i++) gridLinesY.push(i);

    // Point positions
    const ptA = hasA ? { x: toSvgX(x1!), y: toSvgY(y1!) } : null;
    const ptB = hasB ? { x: toSvgX(x2!), y: toSvgY(y2!) } : null;

    return (
      <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-transparent">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto max-h-56">
          {/* Grid lines */}
          {gridLinesX.map(v => (
            <line key={`gx${v}`} x1={toSvgX(v)} y1={offsetY} x2={toSvgX(v)} y2={offsetY + usedH}
              stroke="hsl(var(--muted-foreground))" strokeWidth={v === 0 ? 0 : 0.3} opacity="0.3" />
          ))}
          {gridLinesY.map(v => (
            <line key={`gy${v}`} x1={offsetX} y1={toSvgY(v)} x2={offsetX + usedW} y2={toSvgY(v)}
              stroke="hsl(var(--muted-foreground))" strokeWidth={v === 0 ? 0 : 0.3} opacity="0.3" />
          ))}

          {/* X axis */}
          <line x1={offsetX} y1={oy} x2={offsetX + usedW} y2={oy}
            stroke="hsl(var(--foreground))" strokeWidth="1.5" />
          {/* Arrow X */}
          <polygon points={`${offsetX + usedW},${oy} ${offsetX + usedW - 6},${oy - 3} ${offsetX + usedW - 6},${oy + 3}`}
            fill="hsl(var(--foreground))" />
          <text x={offsetX + usedW - 2} y={oy - 6} textAnchor="end"
            className="fill-foreground text-[9px] font-bold">x</text>

          {/* Y axis */}
          <line x1={ox} y1={offsetY} x2={ox} y2={offsetY + usedH}
            stroke="hsl(var(--foreground))" strokeWidth="1.5" />
          {/* Arrow Y */}
          <polygon points={`${ox},${offsetY} ${ox - 3},${offsetY + 6} ${ox + 3},${offsetY + 6}`}
            fill="hsl(var(--foreground))" />
          <text x={ox - 6} y={offsetY + 6} textAnchor="end"
            className="fill-foreground text-[9px] font-bold">y</text>

          {/* Origin label */}
          <text x={ox - 5} y={oy + 12} textAnchor="middle"
            className="fill-foreground text-[8px] font-medium">O</text>

          {/* Tick marks & labels on X axis */}
          {gridLinesX.filter(v => v !== 0).map(v => (
            <g key={`tx${v}`}>
              <line x1={toSvgX(v)} y1={oy - 3} x2={toSvgX(v)} y2={oy + 3}
                stroke="hsl(var(--foreground))" strokeWidth="1" />
              <text x={toSvgX(v)} y={oy + 13} textAnchor="middle"
                className="fill-muted-foreground text-[7px]">{v}</text>
            </g>
          ))}

          {/* Tick marks & labels on Y axis */}
          {gridLinesY.filter(v => v !== 0).map(v => (
            <g key={`ty${v}`}>
              <line x1={ox - 3} y1={toSvgY(v)} x2={ox + 3} y2={toSvgY(v)}
                stroke="hsl(var(--foreground))" strokeWidth="1" />
              <text x={ox - 7} y={toSvgY(v) + 3} textAnchor="end"
                className="fill-muted-foreground text-[7px]">{v}</text>
            </g>
          ))}

          {/* Distance line */}
          {ptA && ptB && (
            <line x1={ptA.x} y1={ptA.y} x2={ptB.x} y2={ptB.y}
              stroke="hsl(var(--chart-1))" strokeWidth="2" strokeDasharray="5,3" />
          )}

          {/* Point A */}
          {ptA && (
            <>
              <circle cx={ptA.x} cy={ptA.y} r="5" className="fill-blue-500" />
              <text x={ptA.x + 8} y={ptA.y - 6} textAnchor="start"
                className="fill-blue-600 text-[9px] font-bold">
                A({x1},{y1})
              </text>
            </>
          )}

          {/* Point B */}
          {ptB && (
            <>
              <circle cx={ptB.x} cy={ptB.y} r="5" className="fill-blue-500" />
              <text x={ptB.x + 8} y={ptB.y - 6} textAnchor="start"
                className="fill-blue-600 text-[9px] font-bold">
                B({x2},{y2})
              </text>
            </>
          )}

          {/* Distance label */}
          {ptA && ptB && (
            <text x={(ptA.x + ptB.x) / 2 + 10} y={(ptA.y + ptB.y) / 2 - 8}
              textAnchor="middle" className="fill-chart-1 text-[10px] font-medium">d(A,B)</text>
          )}
        </svg>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          المسافة بين نقطتين في معلم متعامد ومتجانس
        </div>
      </Card>
    );
  }

  // Circle diagram for radius/diameter
  return (
    <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-transparent">
      <svg viewBox="0 0 200 160" className="w-full h-auto max-h-48">
        <circle cx="100" cy="80" r="55"
          fill="hsl(var(--purple-500) / 0.1)"
          stroke="hsl(270 95.2% 60%)" strokeWidth="2" />
        <circle cx="100" cy="80" r="4" className="fill-purple-600" />
        <text x="100" y="72" textAnchor="middle" className="fill-purple-600 text-xs font-bold">O</text>

        {type === 'radius' ? (
          <>
            <line x1="100" y1="80" x2="155" y2="80" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <circle cx="155" cy="80" r="4" className="fill-chart-1" />
            <text x="155" y="72" textAnchor="middle" className="fill-chart-1 text-xs font-bold">A</text>
            <text x="128" y="75" textAnchor="middle" className="fill-chart-1 text-[10px] font-medium">
              r{radius !== undefined ? `=${radius}` : ''}
            </text>
          </>
        ) : (
          <>
            <line x1="45" y1="80" x2="155" y2="80" stroke="hsl(var(--chart-2))" strokeWidth="2" />
            <circle cx="45" cy="80" r="4" className="fill-chart-2" />
            <circle cx="155" cy="80" r="4" className="fill-chart-2" />
            <text x="45" y="72" textAnchor="middle" className="fill-chart-2 text-xs font-bold">A</text>
            <text x="155" y="72" textAnchor="middle" className="fill-chart-2 text-xs font-bold">B</text>
            <text x="100" y="95" textAnchor="middle" className="fill-chart-2 text-[10px] font-medium">
              d{diameter !== undefined ? `=${diameter}` : ''}
            </text>
          </>
        )}

        <text x="100" y="150" textAnchor="middle" className="fill-muted-foreground text-[10px]">
          {type === 'radius' ? 'r = d ÷ 2' : 'd = 2 × r'}
        </text>
      </svg>
    </Card>
  );
}
