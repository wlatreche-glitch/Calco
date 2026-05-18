import { Card } from '@/components/ui/card';

interface ShapeDiagramProps {
  shape: string;
  values?: Record<string, number>;
}

export default function ShapeDiagram({ shape, values = {} }: ShapeDiagramProps) {
  const renderShape = () => {
    switch (shape) {
      case 'rectangle':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-auto max-h-32">
            <rect x="30" y="20" width="140" height="80" fill="hsl(var(--purple-500) / 0.1)" stroke="hsl(270 95.2% 60%)" strokeWidth="2" />
            <text x="100" y="115" textAnchor="middle" className="fill-foreground text-[10px]">L{values.length ? `=${values.length}` : ''}</text>
            <text x="15" y="65" textAnchor="middle" className="fill-foreground text-[10px]">W{values.width ? `=${values.width}` : ''}</text>
          </svg>
        );
      
      case 'square':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-auto max-h-36">
            <rect x="50" y="20" width="100" height="100" fill="hsl(var(--blue-500) / 0.1)" stroke="hsl(217.2 91.2% 59.8%)" strokeWidth="2" />
            <line x1="95" y1="120" x2="105" y2="120" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <line x1="95" y1="20" x2="105" y2="20" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <line x1="50" y1="65" x2="50" y2="75" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <line x1="150" y1="65" x2="150" y2="75" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <text x="100" y="135" textAnchor="middle" className="fill-foreground text-[10px]">a{values.side ? `=${values.side}` : ''}</text>
          </svg>
        );
      
      case 'triangle':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-auto max-h-36">
            <polygon points="100,20 30,100 170,100" fill="hsl(var(--emerald-500) / 0.1)" stroke="hsl(142.1 76.2% 36.3%)" strokeWidth="2" />
            <line x1="100" y1="20" x2="100" y2="100" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="100" y="115" textAnchor="middle" className="fill-foreground text-[10px]">b{values.base ? `=${values.base}` : ''}</text>
            <text x="115" y="65" textAnchor="start" className="fill-chart-1 text-[10px]">h{values.height ? `=${values.height}` : ''}</text>
          </svg>
        );
      
      case 'parallelogram':
        return (
          <svg viewBox="0 0 200 120" className="w-full h-auto max-h-32">
            <polygon points="50,20 170,20 150,100 30,100" fill="hsl(var(--amber-500) / 0.1)" stroke="hsl(45.4 93.4% 47.5%)" strokeWidth="2" />
            <line x1="50" y1="20" x2="50" y2="100" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="100" y="115" textAnchor="middle" className="fill-foreground text-[10px]">b{values.base ? `=${values.base}` : ''}</text>
            <text x="35" y="65" textAnchor="end" className="fill-chart-1 text-[10px]">h{values.height ? `=${values.height}` : ''}</text>
          </svg>
        );
      
      case 'trapezoid':
        return (
          <svg viewBox="0 0 200 130" className="w-full h-auto max-h-36">
            <polygon points="60,30 140,30 170,100 30,100" fill="hsl(var(--rose-500) / 0.1)" stroke="hsl(346.8 77.2% 49.8%)" strokeWidth="2" />
            <line x1="60" y1="30" x2="60" y2="100" stroke="hsl(var(--chart-1))" strokeWidth="1.5" strokeDasharray="4,2" />
            <text x="100" y="25" textAnchor="middle" className="fill-foreground text-[10px]">b₂{values.base2 ? `=${values.base2}` : ''}</text>
            <text x="100" y="115" textAnchor="middle" className="fill-foreground text-[10px]">b₁{values.base1 ? `=${values.base1}` : ''}</text>
            <text x="45" y="70" textAnchor="end" className="fill-chart-1 text-[10px]">h{values.height ? `=${values.height}` : ''}</text>
          </svg>
        );
      
      case 'circle':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-auto max-h-36">
            <circle cx="100" cy="70" r="50" fill="hsl(var(--cyan-500) / 0.1)" stroke="hsl(186 100% 42%)" strokeWidth="2" />
            <circle cx="100" cy="70" r="3" className="fill-cyan-600" />
            <line x1="100" y1="70" x2="150" y2="70" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <text x="125" y="65" textAnchor="middle" className="fill-chart-1 text-[10px]">r{values.radius ? `=${values.radius}` : ''}</text>
          </svg>
        );
      
      case 'cube':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-auto max-h-36">
            {/* Front face */}
            <rect x="50" y="50" width="70" height="70" fill="hsl(var(--blue-500) / 0.1)" stroke="hsl(217.2 91.2% 59.8%)" strokeWidth="2" />
            {/* Top face */}
            <polygon points="50,50 80,25 150,25 120,50" fill="hsl(var(--blue-500) / 0.15)" stroke="hsl(217.2 91.2% 59.8%)" strokeWidth="2" />
            {/* Side face */}
            <polygon points="120,50 150,25 150,95 120,120" fill="hsl(var(--blue-500) / 0.2)" stroke="hsl(217.2 91.2% 59.8%)" strokeWidth="2" />
            <text x="85" y="135" textAnchor="middle" className="fill-foreground text-[10px]">a{values.side ? `=${values.side}` : ''}</text>
          </svg>
        );
      
      case 'rectangular_prism':
        return (
          <svg viewBox="0 0 200 140" className="w-full h-auto max-h-36">
            {/* Front face */}
            <rect x="40" y="50" width="90" height="60" fill="hsl(var(--emerald-500) / 0.1)" stroke="hsl(142.1 76.2% 36.3%)" strokeWidth="2" />
            {/* Top face */}
            <polygon points="40,50 70,25 160,25 130,50" fill="hsl(var(--emerald-500) / 0.15)" stroke="hsl(142.1 76.2% 36.3%)" strokeWidth="2" />
            {/* Side face */}
            <polygon points="130,50 160,25 160,85 130,110" fill="hsl(var(--emerald-500) / 0.2)" stroke="hsl(142.1 76.2% 36.3%)" strokeWidth="2" />
            <text x="85" y="125" textAnchor="middle" className="fill-foreground text-[9px]">L{values.length ? `=${values.length}` : ''}</text>
            <text x="155" y="60" textAnchor="start" className="fill-foreground text-[9px]">W{values.width ? `=${values.width}` : ''}</text>
            <text x="170" y="95" textAnchor="start" className="fill-foreground text-[9px]">H{values.height ? `=${values.height}` : ''}</text>
          </svg>
        );
      
      case 'cylinder':
        return (
          <svg viewBox="0 0 200 150" className="w-full h-auto max-h-40">
            {/* Top ellipse */}
            <ellipse cx="100" cy="30" rx="50" ry="15" fill="hsl(var(--purple-500) / 0.15)" stroke="hsl(270 95.2% 60%)" strokeWidth="2" />
            {/* Body */}
            <path d="M 50 30 L 50 110 A 50 15 0 0 0 150 110 L 150 30" fill="hsl(var(--purple-500) / 0.1)" stroke="hsl(270 95.2% 60%)" strokeWidth="2" />
            {/* Bottom ellipse (hidden part) */}
            <path d="M 50 110 A 50 15 0 0 1 150 110" fill="none" stroke="hsl(270 95.2% 60%)" strokeWidth="2" strokeDasharray="4,2" />
            {/* Radius */}
            <line x1="100" y1="30" x2="150" y2="30" stroke="hsl(var(--chart-1))" strokeWidth="2" />
            <text x="125" y="25" textAnchor="middle" className="fill-chart-1 text-[10px]">r{values.radius ? `=${values.radius}` : ''}</text>
            {/* Height */}
            <line x1="160" y1="30" x2="160" y2="110" stroke="hsl(var(--chart-2))" strokeWidth="2" />
            <text x="175" y="75" textAnchor="middle" className="fill-chart-2 text-[10px]">h{values.height ? `=${values.height}` : ''}</text>
          </svg>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-secondary/50 to-transparent">
      {renderShape()}
    </Card>
  );
}
