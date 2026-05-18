import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  titleFr: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: string;
  delay?: number;
}

export default function ModuleCard({
  title,
  titleFr,
  description,
  icon: Icon,
  path,
  gradient,
  delay = 0
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={path} className="block">
        <div className="module-card group h-full">
          {/* Gradient Background Overlay */}
          <div 
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl ${gradient}`}
          />
          
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          {/* Content */}
          <h3 className="text-xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{titleFr}</p>
          <p className="text-sm text-secondary-foreground">{description}</p>
          
          {/* Arrow indicator */}
          <div className="mt-4 flex items-center gap-2 text-primary font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <span>ابدأ الآن</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ←
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
