import { Card } from '@/components/ui/card';

interface ThalesDiagramProps {
  AB?: number;
  AC?: number;
  AD?: number;
  AE?: number;
  isParallel?: boolean;
  configuration?: 'triangle' | 'butterfly';
}

export default function ThalesDiagram({ AB, AC, AD, AE, isParallel = true, configuration = 'triangle' }: ThalesDiagramProps) {
  if (configuration === 'butterfly') {
    return (
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent">
        <svg viewBox="0 0 220 170" className="w-full h-auto max-h-52">
          {/* Butterfly/bowtie: two triangles sharing vertex A at center */}
          {/* Triangle ABD on the left, Triangle ACE on the right */}
          
          {/* Point A at center */}
          <circle cx="110" cy="85" r="3" className="fill-primary" />
          <text x="110" y="78" textAnchor="middle" className="fill-primary text-xs font-bold">A</text>
          
          {/* Line from B through A to C */}
          <line x1="30" y1="35" x2="190" y2="135" stroke="hsl(var(--primary))" strokeWidth="2" />
          {/* Line from D through A to E */}
          <line x1="30" y1="135" x2="190" y2="35" stroke="hsl(var(--primary))" strokeWidth="2" />
          
          {/* Points */}
          <circle cx="30" cy="35" r="3" className="fill-primary" />
          <text x="20" y="32" textAnchor="middle" className="fill-primary text-xs font-bold">B</text>
          
          <circle cx="190" cy="135" r="3" className="fill-primary" />
          <text x="200" y="140" textAnchor="middle" className="fill-primary text-xs font-bold">C</text>
          
          <circle cx="30" cy="135" r="3" className="fill-primary" />
          <text x="20" y="140" textAnchor="middle" className="fill-primary text-xs font-bold">D</text>
          
          <circle cx="190" cy="35" r="3" className="fill-primary" />
          <text x="200" y="32" textAnchor="middle" className="fill-primary text-xs font-bold">E</text>
          
          {/* Line BD */}
          <line
            x1="30" y1="35" x2="30" y2="135"
            stroke={isParallel ? "hsl(var(--chart-1))" : "hsl(var(--muted-foreground))"}
            strokeWidth="2"
            strokeDasharray={isParallel ? "0" : "5,5"}
          />
          
          {/* Line CE */}
          <line
            x1="190" y1="35" x2="190" y2="135"
            stroke={isParallel ? "hsl(var(--chart-1))" : "hsl(var(--muted-foreground))"}
            strokeWidth="2"
            strokeDasharray={isParallel ? "0" : "5,5"}
          />

          {/* Parallel symbols on BD and CE */}
          {isParallel && (
            <g>
              <line x1="25" y1="82" x2="35" y2="82" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
              <line x1="25" y1="87" x2="35" y2="87" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
              <line x1="185" y1="82" x2="195" y2="82" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
              <line x1="185" y1="87" x2="195" y2="87" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
            </g>
          )}

          {/* Length labels */}
          {AB !== undefined && (
            <text x="60" y="50" textAnchor="middle" className="fill-foreground text-[10px]">AB={AB}</text>
          )}
          {AC !== undefined && (
            <text x="160" y="120" textAnchor="middle" className="fill-foreground text-[10px]">AC={AC}</text>
          )}
          {AD !== undefined && (
            <text x="60" y="120" textAnchor="middle" className="fill-foreground text-[10px]">AD={AD}</text>
          )}
          {AE !== undefined && (
            <text x="160" y="50" textAnchor="middle" className="fill-foreground text-[10px]">AE={AE}</text>
          )}
        </svg>

        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-chart-1 inline-block"></span>
            (BD) {isParallel ? '//' : '≠//'} (CE)
          </span>
          <span>شكل الفراشة</span>
        </div>
      </Card>
    );
  }

  // Triangle configuration (default)
  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent">
      <svg viewBox="0 0 220 170" className="w-full h-auto max-h-52">
        {/* Triangle ABC */}
        <polygon
          points="110,15 25,150 195,150"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
        />

        {/* Points D on AB and E on AC */}
        {/* D is at roughly 50% of AB, E at 50% of AC */}
        {/* AB: from (110,15) to (25,150) → D at ~(67.5, 82.5) */}
        {/* AC: from (110,15) to (195,150) → E at ~(152.5, 82.5) */}

        {/* Line DE - the parallel line */}
        <line
          x1="67"
          y1="83"
          x2="153"
          y2="83"
          stroke={isParallel ? "hsl(var(--chart-1))" : "hsl(var(--muted-foreground))"}
          strokeWidth="2.5"
          strokeDasharray={isParallel ? "0" : "5,5"}
        />

        {/* Point labels */}
        <text x="110" y="10" textAnchor="middle" className="fill-primary text-xs font-bold">A</text>
        <text x="15" y="155" textAnchor="end" className="fill-primary text-xs font-bold">B</text>
        <text x="205" y="155" textAnchor="start" className="fill-primary text-xs font-bold">C</text>

        {/* Points D and E with dots */}
        <circle cx="67" cy="83" r="4" className="fill-chart-1" />
        <circle cx="153" cy="83" r="4" className="fill-chart-1" />
        <text x="55" y="80" textAnchor="end" className="fill-chart-1 text-xs font-bold">D</text>
        <text x="165" y="80" textAnchor="start" className="fill-chart-1 text-xs font-bold">E</text>

        {/* Parallel symbol markers on DE and BC */}
        {isParallel && (
          <g>
            {/* On DE */}
            <line x1="107" y1="78" x2="107" y2="88" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
            <line x1="113" y1="78" x2="113" y2="88" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
            {/* On BC */}
            <line x1="107" y1="145" x2="107" y2="155" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
            <line x1="113" y1="145" x2="113" y2="155" stroke="hsl(var(--chart-2))" strokeWidth="1.5" />
          </g>
        )}

        {/* Length labels */}
        {AD !== undefined && (
          <text x="78" y="42" textAnchor="middle" className="fill-foreground text-[10px]">AD={AD}</text>
        )}
        {AB !== undefined && (
          <text x="35" y="120" textAnchor="middle" className="fill-foreground text-[10px]">AB={AB}</text>
        )}
        {AE !== undefined && (
          <text x="142" y="42" textAnchor="middle" className="fill-foreground text-[10px]">AE={AE}</text>
        )}
        {AC !== undefined && (
          <text x="185" y="120" textAnchor="middle" className="fill-foreground text-[10px]">AC={AC}</text>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-chart-1 inline-block"></span>
          (DE) {isParallel ? '//' : '≠//'} (BC)
        </span>
      </div>
    </Card>
  );
}
