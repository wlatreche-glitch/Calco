import { ChevronRight, Home, ChevronLeft } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isCurrent?: boolean;
}

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
}

/**
 * Mobile-first navigation component with back button
 * Shows breadcrumb trail and provides navigation controls
 * On mobile: Back button + breadcrumb trail
 * On desktop: Full breadcrumb trail
 */
export default function NavigationBreadcrumb({
  items,
  onBack,
  showBackButton = false,
  className,
}: NavigationBreadcrumbProps) {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  const prev = items[items.length - 2];

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }

    if (prev?.path) {
      navigate(prev.path);
      return;
    }

    navigate('/');
  }, [navigate, onBack, prev]);

  useEffect(() => {
    if (!showBackButton) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        if (target.closest('input,textarea,select') || target.isContentEditable) {
          return;
        }
      }

      const isAltLeft = event.key === 'ArrowLeft' && event.altKey && !event.ctrlKey && !event.metaKey;
      const isCtrlAltLeft = event.key === 'ArrowLeft' && event.ctrlKey && event.altKey;
      const isCtrlBracket = event.key === '[' && event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;

      if (isAltLeft || isCtrlAltLeft || isCtrlBracket) {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleBack, showBackButton]);

  return (
    <div className={cn('flex items-center justify-between gap-2 mb-4 py-3 px-3 rounded-lg bg-secondary/50', className)}>
      <div className="flex items-center gap-1 flex-wrap min-w-0 flex-1">
        {/* Back button on mobile — previous breadcrumb or browser history */}
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-shrink-0 p-1.5 rounded hover:bg-secondary transition-colors"
            title="العودة (Alt+←)"
            aria-label="العودة"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        )}

        {/* Home link */}
        <Link
          to="/"
          className="flex-shrink-0 p-1.5 rounded hover:bg-secondary transition-colors"
          title="الرئيسية"
        >
          <Home className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        </Link>

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1 min-w-0">
            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />

            {item.isCurrent ? (
              <span className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                {item.label}
              </span>
            ) : item.path ? (
              <Link
                to={item.path}
                className="text-sm text-primary hover:underline truncate max-w-[120px] sm:max-w-none transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
