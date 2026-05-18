import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pushRecent } from '@/lib/userPrefs';
import { applySeo } from '@/lib/seo';

const TRACKABLE = new Set([
  '/equations', '/functions', '/graph', '/physics', '/bem-math',
  '/bem-physics', '/bac-chemistry', '/coach', '/matrices',
  '/sequences', '/statistics', '/exercises',
]);

export default function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    applySeo(pathname);
    if (TRACKABLE.has(pathname)) pushRecent(pathname);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}