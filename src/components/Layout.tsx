import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calculator,
  LineChart,
  FunctionSquare,
  Grid3X3,
  BarChart3,
  TrendingUp,
  Home,
  Menu,
  X,
  Dices,
  Atom,
  Zap,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import calcoImg from '@/assets/calco-mascot.png';
import Footer from './Footer';
import FeedbackButton from './FeedbackButton';
import SmartSearch from './SmartSearch';

interface LayoutProps {
  children: ReactNode;
}

const modules = [
  { path: '/', icon: Home, label: 'الرئيسية', labelFr: 'Accueil' },
  { path: '/equations', icon: Calculator, label: 'المعادلات', labelFr: 'Équations' },
  { path: '/functions', icon: FunctionSquare, label: 'الدوال', labelFr: 'Fonctions' },
  { path: '/graph', icon: LineChart, label: 'الرسم البياني', labelFr: 'Graphique' },
  { path: '/physics', icon: Atom, label: 'الفيزياء', labelFr: 'Physique' },
  { path: '/matrices', icon: Grid3X3, label: 'المصفوفات', labelFr: 'Matrices' },
  { path: '/sequences', icon: TrendingUp, label: 'المتتاليات', labelFr: 'Suites' },
  { path: '/statistics', icon: BarChart3, label: 'الإحصاء', labelFr: 'Statistiques' },
  { path: '/exercises', icon: Dices, label: 'التمارين', labelFr: 'Exercices' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo — Calco brand */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-calco-blue via-calco-violet to-calco-cyan flex items-center justify-center shadow-glow overflow-hidden">
                <img
                  src={calcoImg}
                  alt="Calco"
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                  width={40}
                  height={40}
                />
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-calco-yellow animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-extrabold text-lg leading-none calco-text flex items-center gap-1">
                  CALCO
                  <Zap className="w-3.5 h-3.5 text-calco-yellow fill-calco-yellow" />
                </h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">الحاسبة التعليمية الذكية</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {modules.map((module) => {
                const isActive = location.pathname === module.path;
                const Icon = module.icon;
                
                return (
                  <Link
                    key={module.path}
                    to={module.path}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-glow' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{module.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="بحث"
                className="p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="القائمة"
                className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-background"
          >
            <div className="container mx-auto px-4 py-4 grid grid-cols-2 gap-2">
              {modules.map((module) => {
                const isActive = location.pathname === module.path;
                const Icon = module.icon;
                
                return (
                  <Link
                    key={module.path}
                    to={module.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{module.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
      <FeedbackButton />
      <SmartSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
