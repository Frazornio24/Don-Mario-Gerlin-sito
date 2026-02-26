import { useEffect, useState } from 'react';

interface WebVitals {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  resources: number;
  webVitals?: WebVitals;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run in development or when explicitly enabled
    if (process.env.NODE_ENV !== 'development' && !localStorage.getItem('show-perf-monitor')) {
      return;
    }

    const measurePerformance = () => {
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const resources = performance.getEntriesByType('resource');

        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;

        // Web Vitals calculation
        const webVitals: WebVitals = {};

        // First Contentful Paint
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
        if (fcpEntry) {
          webVitals.fcp = Math.round(fcpEntry.startTime);
        }

        // Largest Contentful Paint (approximation)
        const paintEntries = performance.getEntriesByType('paint');
        const lcpEntry = paintEntries[paintEntries.length - 1];
        if (lcpEntry) {
          webVitals.lcp = Math.round(lcpEntry.startTime);
        }

        // Time to First Byte
        webVitals.ttfb = Math.round(navigation.responseStart - navigation.fetchStart);

        const performanceData: PerformanceMetrics = {
          loadTime: Math.round(loadTime),
          domContentLoaded: Math.round(domContentLoaded),
          resources: resources.length,
          webVitals
        };

        setMetrics(performanceData);

        // Log to console for debugging
        console.group('Performance Metrics');
        console.log('Load Time:', performanceData.loadTime + 'ms');
        console.log('DOM Content Loaded:', performanceData.domContentLoaded + 'ms');
        console.log('Resources Loaded:', performanceData.resources);
        console.log('Web Vitals:', performanceData.webVitals);
        console.groupEnd();

      } catch (error) {
        console.error('Error measuring performance:', error);
      }
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      setTimeout(measurePerformance, 100);
    } else {
      window.addEventListener('load', () => setTimeout(measurePerformance, 100));
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  if (!metrics || !isVisible) return null;

  const getPerformanceGrade = (value: number, type: string) => {
    switch (type) {
      case 'loadTime':
        if (value < 2000) return { grade: 'A', color: 'text-green-500' };
        if (value < 3000) return { grade: 'B', color: 'text-yellow-500' };
        return { grade: 'C', color: 'text-red-500' };
      
      case 'fcp':
        if (value < 1800) return { grade: 'A', color: 'text-green-500' };
        if (value < 3000) return { grade: 'B', color: 'text-yellow-500' };
        return { grade: 'C', color: 'text-red-500' };
      
      case 'lcp':
        if (value < 2500) return { grade: 'A', color: 'text-green-500' };
        if (value < 4000) return { grade: 'B', color: 'text-yellow-500' };
        return { grade: 'C', color: 'text-red-500' };
      
      default:
        return { grade: 'A', color: 'text-green-500' };
    }
  };

  const loadGrade = getPerformanceGrade(metrics.loadTime, 'loadTime');
  const fcpGrade = metrics.webVitals?.fcp ? getPerformanceGrade(metrics.webVitals.fcp, 'fcp') : null;
  const lcpGrade = metrics.webVitals?.lcp ? getPerformanceGrade(metrics.webVitals.lcp, 'lcp') : null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">Performance Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/70 hover:text-white"
          aria-label="Chiudi monitor performance"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span className={loadGrade.color}>
            {metrics.loadTime}ms ({loadGrade.grade})
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>DOM Ready:</span>
          <span>{metrics.domContentLoaded}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span>Resources:</span>
          <span>{metrics.resources}</span>
        </div>
        
        {metrics.webVitals && (
          <>
            {fcpGrade && (
              <div className="flex justify-between">
                <span>FCP:</span>
                <span className={fcpGrade.color}>
                  {metrics.webVitals.fcp}ms ({fcpGrade.grade})
                </span>
              </div>
            )}
            
            {lcpGrade && (
              <div className="flex justify-between">
                <span>LCP:</span>
                <span className={lcpGrade.color}>
                  {metrics.webVitals.lcp}ms ({lcpGrade.grade})
                </span>
              </div>
            )}
            
            {metrics.webVitals.ttfb && (
              <div className="flex justify-between">
                <span>TTFB:</span>
                <span>{metrics.webVitals.ttfb}ms</span>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/20 text-xs text-white/60">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;