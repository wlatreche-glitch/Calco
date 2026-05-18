interface TrigonometryDiagramProps {
  rightAngleAt: 'A' | 'B' | 'C';
  knownAngleVertex?: 'A' | 'B' | 'C';
  targetAngleVertex?: 'A' | 'B' | 'C';
  mode: 'findSide' | 'findAngle';
  knownSideName?: string;
  targetSideName?: string;
  side1Name?: string;
  side2Name?: string;
}

export default function TrigonometryDiagram({
  rightAngleAt,
  knownAngleVertex,
  targetAngleVertex,
  mode,
  knownSideName,
  targetSideName,
  side1Name,
  side2Name,
}: TrigonometryDiagramProps) {
  // Triangle vertex positions based on right angle
  const positions: Record<'A' | 'B' | 'C', { x: number; y: number }> = (() => {
    switch (rightAngleAt) {
      case 'A': return { A: { x: 80, y: 40 }, B: { x: 80, y: 200 }, C: { x: 280, y: 40 } };
      case 'B': return { A: { x: 280, y: 40 }, B: { x: 80, y: 200 }, C: { x: 80, y: 40 } };
      case 'C': return { A: { x: 80, y: 40 }, B: { x: 280, y: 200 }, C: { x: 280, y: 40 } };
    }
  })();

  const activeAngle = mode === 'findSide' ? knownAngleVertex : targetAngleVertex;

  // Determine side roles relative to activeAngle
  const getSideRole = (sideName: string): 'hypotenuse' | 'opposite' | 'adjacent' | null => {
    if (!activeAngle || !sideName) return null;
    // hypotenuse is opposite the right angle
    const hypSide = rightAngleAt === 'A' ? 'BC' : rightAngleAt === 'B' ? 'AC' : 'AB';
    if (sideName === hypSide) return 'hypotenuse';
    // opposite: side not touching the active angle vertex
    const touchesAngle = sideName.includes(activeAngle);
    return touchesAngle ? 'adjacent' : 'opposite';
  };

  // Get highlighted sides
  const highlightedSides: { name: string; role: string }[] = [];
  if (mode === 'findSide') {
    if (knownSideName) {
      const role = getSideRole(knownSideName);
      if (role) highlightedSides.push({ name: knownSideName, role });
    }
    if (targetSideName) {
      const role = getSideRole(targetSideName);
      if (role) highlightedSides.push({ name: targetSideName, role });
    }
  } else {
    if (side1Name) {
      const role = getSideRole(side1Name);
      if (role) highlightedSides.push({ name: side1Name, role });
    }
    if (side2Name) {
      const role = getSideRole(side2Name);
      if (role) highlightedSides.push({ name: side2Name, role });
    }
  }

  const roleColors: Record<string, string> = {
    hypotenuse: '#ef4444',
    opposite: '#3b82f6',
    adjacent: '#22c55e',
  };

  const roleLabels: Record<string, string> = {
    hypotenuse: 'الوتر',
    opposite: 'المقابل',
    adjacent: 'المجاور',
  };

  const sideEndpoints: Record<string, ['A' | 'B' | 'C', 'A' | 'B' | 'C']> = {
    BC: ['B', 'C'],
    AC: ['A', 'C'],
    AB: ['A', 'B'],
  };

  // Right angle marker
  const rp = positions[rightAngleAt];
  const others = (['A', 'B', 'C'] as const).filter(v => v !== rightAngleAt);
  const d1 = { x: positions[others[0]].x - rp.x, y: positions[others[0]].y - rp.y };
  const d2 = { x: positions[others[1]].x - rp.x, y: positions[others[1]].y - rp.y };
  const len1 = Math.sqrt(d1.x * d1.x + d1.y * d1.y);
  const len2 = Math.sqrt(d2.x * d2.x + d2.y * d2.y);
  const sz = 15;
  const u1 = { x: (d1.x / len1) * sz, y: (d1.y / len1) * sz };
  const u2 = { x: (d2.x / len2) * sz, y: (d2.y / len2) * sz };
  const rightAnglePath = `M ${rp.x + u1.x},${rp.y + u1.y} L ${rp.x + u1.x + u2.x},${rp.y + u1.y + u2.y} L ${rp.x + u2.x},${rp.y + u2.y}`;

  // Angle arc for active angle
  let arcPath = '';
  if (activeAngle && activeAngle !== rightAngleAt) {
    const ap = positions[activeAngle];
    const otherVerts = (['A', 'B', 'C'] as const).filter(v => v !== activeAngle);
    const va = { x: positions[otherVerts[0]].x - ap.x, y: positions[otherVerts[0]].y - ap.y };
    const vb = { x: positions[otherVerts[1]].x - ap.x, y: positions[otherVerts[1]].y - ap.y };
    const a1 = Math.atan2(va.y, va.x);
    const a2 = Math.atan2(vb.y, vb.x);
    const r = 25;
    let startA = a1, endA = a2;
    let diff = endA - startA;
    if (diff < -Math.PI) diff += 2 * Math.PI;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    const sweep = diff > 0 ? 1 : 0;
    const sx = ap.x + r * Math.cos(startA);
    const sy = ap.y + r * Math.sin(startA);
    const ex = ap.x + r * Math.cos(endA);
    const ey = ap.y + r * Math.sin(endA);
    arcPath = `M ${sx},${sy} A ${r},${r} 0 0,${sweep} ${ex},${ey}`;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 360 260" className="w-full max-w-sm bg-secondary/30 rounded-xl border">
        {/* Triangle */}
        <polygon
          points={`${positions.A.x},${positions.A.y} ${positions.B.x},${positions.B.y} ${positions.C.x},${positions.C.y}`}
          fill="hsl(var(--primary) / 0.05)"
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
        />

        {/* Right angle marker */}
        <path d={rightAnglePath} fill="none" stroke="hsl(var(--foreground))" strokeWidth="1.5" />

        {/* Angle arc */}
        {arcPath && (
          <path d={arcPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        )}

        {/* Highlighted sides with role colors and labels */}
        {highlightedSides.map(({ name, role }) => {
          const [v1, v2] = sideEndpoints[name];
          const p1 = positions[v1];
          const p2 = positions[v2];
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = -dy / len;
          const ny = dx / len;
          const offset = 14;
          return (
            <g key={name}>
              <line
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke={roleColors[role]}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <text
                x={mx + nx * offset}
                y={my + ny * offset}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="bold"
                fill={roleColors[role]}
              >
                {roleLabels[role]}
              </text>
            </g>
          );
        })}

        {/* Vertex labels */}
        {(['A', 'B', 'C'] as const).map(v => {
          const p = positions[v];
          const isActive = v === activeAngle;
          const isRight = v === rightAngleAt;
          // Offset label away from center
          const cx = (positions.A.x + positions.B.x + positions.C.x) / 3;
          const cy = (positions.A.y + positions.B.y + positions.C.y) / 3;
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ox = (dx / dist) * 20;
          const oy = (dy / dist) * 20;
          return (
            <g key={v}>
              {isActive && (
                <circle cx={p.x} cy={p.y} r="8" fill="#f59e0b" opacity="0.25" />
              )}
              <text
                x={p.x + ox}
                y={p.y + oy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill={isActive ? '#f59e0b' : isRight ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))'}
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Active angle label */}
        {activeAngle && activeAngle !== rightAngleAt && (
          <text
            x={positions[activeAngle].x + (positions[activeAngle].x < 180 ? -30 : 30)}
            y={positions[activeAngle].y + (positions[activeAngle].y < 120 ? -8 : 12)}
            textAnchor="middle"
            fontSize="11"
            fill="#f59e0b"
            fontWeight="bold"
          >
            θ
          </text>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-1 rounded" style={{ background: '#ef4444' }} /> الوتر</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1 rounded" style={{ background: '#3b82f6' }} /> المقابل</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1 rounded" style={{ background: '#22c55e' }} /> المجاور</span>
        <span className="flex items-center gap-1"><span className="w-3 h-1 rounded" style={{ background: '#f59e0b' }} /> الزاوية θ</span>
      </div>
    </div>
  );
}
