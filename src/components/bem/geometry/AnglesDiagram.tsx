import { Card } from '@/components/ui/card';

interface AnglesDiagramProps {
  type: 'parallel_transversal' | 'triangle_sum' | 'isosceles' | 'equilateral';
  angleType?: 'corresponding' | 'alternate' | 'co_interior';
  givenAngle?: number;
}

export default function AnglesDiagram({ type, angleType = 'corresponding', givenAngle }: AnglesDiagramProps) {
  if (type === 'parallel_transversal') {
    return (
      <Card className="p-4 bg-gradient-to-br from-orange-500/5 to-transparent">
        <svg viewBox="0 0 240 160" className="w-full h-auto max-h-48">
          {/* Parallel line d1 */}
          <line x1="10" y1="45" x2="230" y2="45" stroke="hsl(25 95% 53%)" strokeWidth="2.5" />
          {/* Parallel line d2 */}
          <line x1="10" y1="115" x2="230" y2="115" stroke="hsl(25 95% 53%)" strokeWidth="2.5" />

          {/* Parallel symbol arrows on d1 */}
          <polygon points="200,40 206,45 200,50" fill="hsl(25 95% 53%)" />
          {/* Parallel symbol arrows on d2 */}
          <polygon points="200,110 206,115 200,120" fill="hsl(25 95% 53%)" />

          {/* Transversal line (Δ) */}
          <line x1="70" y1="5" x2="170" y2="155" stroke="hsl(var(--primary))" strokeWidth="2.5" />

          {/* Intersection point on d1 */}
          <circle cx="100" cy="45" r="3.5" className="fill-primary" />
          {/* Intersection point on d2 */}
          <circle cx="140" cy="115" r="3.5" className="fill-primary" />

          {/* Angle arc at d1 intersection */}
          <path
            d="M 115 45 A 15 15 0 0 0 106 32"
            fill="none"
            stroke="hsl(var(--chart-1))"
            strokeWidth="2.5"
          />
          {/* Angle arc at d2 intersection */}
          {angleType === 'corresponding' && (
            <path
              d="M 155 115 A 15 15 0 0 0 146 102"
              fill="none"
              stroke="hsl(var(--chart-1))"
              strokeWidth="2.5"
            />
          )}
          {angleType === 'alternate' && (
            <path
              d="M 125 115 A 15 15 0 0 1 134 128"
              fill="none"
              stroke="hsl(var(--chart-1))"
              strokeWidth="2.5"
            />
          )}
          {angleType === 'co_interior' && (
            <path
              d="M 155 115 A 15 15 0 0 0 146 102"
              fill="none"
              stroke="hsl(var(--chart-2))"
              strokeWidth="2.5"
            />
          )}

          {/* Angle labels */}
          <text x="118" y="38" className="fill-chart-1 text-[11px] font-bold">α</text>
          {angleType === 'co_interior' ? (
            <text x="158" y="108" className="fill-chart-2 text-[11px] font-bold">β</text>
          ) : (
            <text x="158" y="108" className="fill-chart-1 text-[11px] font-bold">α</text>
          )}

          {/* Line labels */}
          <text x="235" y="48" className="fill-orange-600 text-[11px] font-bold">(d₁)</text>
          <text x="235" y="118" className="fill-orange-600 text-[11px] font-bold">(d₂)</text>
          <text x="173" y="155" className="fill-primary text-[11px] font-bold">(Δ)</text>

          {/* Angle value if provided */}
          {givenAngle !== undefined && (
            <text x="120" y="85" textAnchor="middle" className="fill-foreground text-xs font-medium">
              α = {givenAngle}°
            </text>
          )}
        </svg>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          {angleType === 'corresponding' && 'زاويتان متناظرتان (متساويتان)'}
          {angleType === 'alternate' && 'زاويتان متبادلتان داخلياً (متساويتان)'}
          {angleType === 'co_interior' && 'زاويتان داخليتان من جهة واحدة (مجموعهما 180°)'}
        </div>
      </Card>
    );
  }

  if (type === 'triangle_sum') {
    return (
      <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-transparent">
        <svg viewBox="0 0 200 140" className="w-full h-auto max-h-40">
          <polygon
            points="100,20 30,120 170,120"
            fill="hsl(217.2 91.2% 59.8% / 0.08)"
            stroke="hsl(217.2 91.2% 59.8%)"
            strokeWidth="2.5"
          />

          {/* Angle arcs */}
          <path d="M 92 35 A 15 15 0 0 1 108 35" fill="none" stroke="hsl(var(--chart-1))" strokeWidth="2.5" />
          <path d="M 45 120 A 15 15 0 0 0 38 108" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2.5" />
          <path d="M 155 120 A 15 15 0 0 1 162 108" fill="none" stroke="hsl(var(--chart-3))" strokeWidth="2.5" />

          <text x="100" y="50" textAnchor="middle" className="fill-chart-1 text-xs font-bold">α</text>
          <text x="48" y="108" className="fill-chart-2 text-xs font-bold">β</text>
          <text x="152" y="108" className="fill-chart-3 text-xs font-bold">γ</text>

          <text x="100" y="15" textAnchor="middle" className="fill-blue-600 text-xs font-bold">A</text>
          <text x="22" y="125" className="fill-blue-600 text-xs font-bold">B</text>
          <text x="178" y="125" className="fill-blue-600 text-xs font-bold">C</text>

          <text x="100" y="90" textAnchor="middle" className="fill-foreground text-[10px]">α + β + γ = 180°</text>
        </svg>
      </Card>
    );
  }

  if (type === 'isosceles') {
    return (
      <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-transparent">
        <svg viewBox="0 0 200 140" className="w-full h-auto max-h-40">
          <polygon
            points="100,15 35,120 165,120"
            fill="hsl(270 95.2% 60% / 0.08)"
            stroke="hsl(270 95.2% 60%)"
            strokeWidth="2.5"
          />

          {/* Equal side marks */}
          <line x1="62" y1="62" x2="68" y2="72" stroke="hsl(var(--chart-1))" strokeWidth="2.5" />
          <line x1="132" y1="62" x2="138" y2="72" stroke="hsl(var(--chart-1))" strokeWidth="2.5" />

          <path d="M 50 120 A 15 15 0 0 0 42 105" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2.5" />
          <path d="M 150 120 A 15 15 0 0 1 158 105" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2.5" />
          <path d="M 92 30 A 12 12 0 0 1 108 30" fill="none" stroke="hsl(var(--chart-3))" strokeWidth="2.5" />

          <text x="100" y="10" textAnchor="middle" className="fill-purple-600 text-xs font-bold">A</text>
          <text x="27" y="125" className="fill-purple-600 text-xs font-bold">B</text>
          <text x="173" y="125" className="fill-purple-600 text-xs font-bold">C</text>

          <text x="50" y="102" className="fill-chart-2 text-[10px] font-bold">β</text>
          <text x="150" y="102" className="fill-chart-2 text-[10px] font-bold">β</text>
          <text x="100" y="40" textAnchor="middle" className="fill-chart-3 text-[10px] font-bold">α</text>
        </svg>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          AB = AC (الساقان متساويان)
        </div>
      </Card>
    );
  }

  // Equilateral
  return (
    <Card className="p-4 bg-gradient-to-br from-emerald-500/5 to-transparent">
      <svg viewBox="0 0 200 140" className="w-full h-auto max-h-40">
        <polygon
          points="100,15 30,120 170,120"
          fill="hsl(142.1 76.2% 36.3% / 0.08)"
          stroke="hsl(142.1 76.2% 36.3%)"
          strokeWidth="2.5"
        />

        {/* Equal side marks */}
        <line x1="60" y1="62" x2="66" y2="72" stroke="hsl(var(--chart-1))" strokeWidth="2.5" />
        <line x1="134" y1="62" x2="140" y2="72" stroke="hsl(var(--chart-1))" strokeWidth="2.5" />
        <line x1="95" y1="120" x2="105" y2="120" stroke="hsl(var(--chart-1))" strokeWidth="2.5" />

        <path d="M 92 30 A 12 12 0 0 1 108 30" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2.5" />
        <path d="M 45 120 A 15 15 0 0 0 38 105" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2.5" />
        <path d="M 155 120 A 15 15 0 0 1 162 105" fill="none" stroke="hsl(var(--chart-2))" strokeWidth="2.5" />

        <text x="100" y="10" textAnchor="middle" className="fill-emerald-600 text-xs font-bold">A</text>
        <text x="22" y="125" className="fill-emerald-600 text-xs font-bold">B</text>
        <text x="178" y="125" className="fill-emerald-600 text-xs font-bold">C</text>

        <text x="100" y="45" textAnchor="middle" className="fill-chart-2 text-[10px]">60°</text>
        <text x="48" y="105" className="fill-chart-2 text-[10px]">60°</text>
        <text x="152" y="105" className="fill-chart-2 text-[10px]">60°</text>
      </svg>

      <div className="mt-2 text-center text-xs text-muted-foreground">
        جميع الأضلاع والزوايا متساوية
      </div>
    </Card>
  );
}
