import { motion } from 'framer-motion';
import calcoImg from '@/assets/calco-mascot.png';

interface CalcoMascotProps {
  size?: number;
  float?: boolean;
  glow?: boolean;
  className?: string;
  priority?: boolean;
}

/**
 * Calco — the brand mascot. A small, reusable, animated avatar used across the app.
 */
export default function CalcoMascot({
  size = 220,
  float = true,
  glow = true,
  className = '',
  priority = false,
}: CalcoMascotProps) {
  const animate = float
    ? { y: [0, -10, 0], rotate: [0, 1.5, -1.5, 0] }
    : undefined;

  return (
    <motion.div
      animate={animate}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className={`relative inline-block ${glow ? 'animate-pulse-glow' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={calcoImg}
        alt="Calco — مساعد التعلم الذكي"
        width={size}
        height={size}
        loading={priority ? 'eager' : 'lazy'}
        className="w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
      />
    </motion.div>
  );
}