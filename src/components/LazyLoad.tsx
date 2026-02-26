import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyComponentProps {
  componentPath: string;
  fallback?: React.ReactNode;
}

// Removed createLazyComponent due to Vite dynamic import limitations
// Use specific lazy exports instead

// Specific lazy components for heavy pages
export const LazyFoto = lazy(() => import('@/pages/Foto').then(module => ({ default: module.default })));
export const LazyArticoli = lazy(() => import('@/pages/Articoli').then(module => ({ default: module.default })));
export const LazyAdmin = lazy(() => import('@/pages/Admin').then(module => ({ default: module.default })));

export const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      <p className="text-muted-foreground">Caricamento...</p>
    </div>
  </div>
);

export default LoadingSpinner;