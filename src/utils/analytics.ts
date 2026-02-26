// Analytics and Performance Tracking Utilities

// Core Web Vitals tracking
export const reportWebVitals = (onPerfEntry?: (metric: { name: string; value: number }) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    try {
      // Simple performance metrics collection without web-vitals library
      const collectMetrics = () => {
        if ('performance' in window) {
          // First Contentful Paint
          const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
          if (fcpEntry) {
            onPerfEntry({ name: 'FCP', value: Math.round(fcpEntry.startTime) });
          }

          // Largest Contentful Paint (simplified)
          const paintEntries = performance.getEntriesByType('paint');
          const lastPaint = paintEntries[paintEntries.length - 1];
          if (lastPaint) {
            onPerfEntry({ name: 'LCP', value: Math.round(lastPaint.startTime) });
          }

          // Time to First Byte
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            const ttfb = navigation.responseStart - navigation.fetchStart;
            onPerfEntry({ name: 'TTFB', value: Math.round(ttfb) });
          }
        }
      };

      // Collect metrics after page load
      if (document.readyState === 'complete') {
        setTimeout(collectMetrics, 100);
      } else {
        window.addEventListener('load', () => setTimeout(collectMetrics, 100));
      }
    } catch (error) {
      console.warn('Failed to collect performance metrics:', error);
    }
  }
};

// Custom event tracking
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as unknown as { gtag: Function }).gtag) {
    (window as unknown as { gtag: Function }).gtag('event', eventName, {
      'event_category': properties?.category || 'user_interaction',
      'event_label': properties?.label,
      'value': properties?.value,
      'custom_parameters': properties
    });
  }

  // Custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {
      // Silently fail - don't break the app
    });
  }
};

// Page view tracking
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: title,
      page_location: window.location.href,
    });
  }

  // Custom page view tracking
  trackEvent('page_view', {
    path,
    title,
    referrer: document.referrer,
  });
};

// Form submission tracking
export const trackFormSubmission = (formName: string, success: boolean, errors?: string[]) => {
  trackEvent('form_submission', {
    category: 'conversion',
    label: formName,
    value: success ? 1 : 0,
    success,
    errors: errors?.join(', '),
  });
};

// Newsletter signup tracking
export const trackNewsletterSignup = (email: string, source: string) => {
  trackEvent('newsletter_signup', {
    category: 'conversion',
    label: source,
    email_domain: email.split('@')[1],
  });
};

// Download tracking
export const trackDownload = (filename: string, category: string) => {
  trackEvent('file_download', {
    category: 'engagement',
    label: filename,
    file_type: filename.split('.').pop(),
    file_category: category,
  });
};

// External link tracking
export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent('external_link_click', {
    category: 'navigation',
    label: url,
    link_text: linkText,
    domain: new URL(url).hostname,
  });
};

// Search tracking
export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', {
    category: 'search',
    label: query,
    results_count: resultsCount,
  });
};

// Performance metrics collection
export const collectPerformanceMetrics = () => {
  if ('performance' in window && 'navigation' in performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      // Core Web Vitals
      fcp: 0, // First Contentful Paint
      lcp: 0, // Largest Contentful Paint
      fid: 0, // First Input Delay
      cls: 0, // Cumulative Layout Shift
      ttfb: 0, // Time to First Byte
      
      // Additional metrics
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
      resources: performance.getEntriesByType('resource').length,
    };

    // Get paint metrics
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcpEntry) metrics.fcp = fcpEntry.startTime;

    // Send metrics to analytics
    trackEvent('performance_metrics', {
      category: 'performance',
      ...metrics,
    });
  }
};

// Error tracking
export const trackError = (error: Error, errorInfo?: Record<string, unknown>) => {
  trackEvent('javascript_error', {
    category: 'error',
    label: error.message,
    error_name: error.name,
    error_stack: error.stack,
    error_info: errorInfo,
    url: window.location.href,
  });
};

// User engagement tracking
export const trackUserEngagement = () => {
  let timeOnPage = 0;
  let startTime = Date.now();
  
  const updateTimeOnPage = () => {
    timeOnPage += Date.now() - startTime;
    startTime = Date.now();
  };

  // Track when user becomes inactive
  const handleVisibilityChange = () => {
    if (document.hidden) {
      updateTimeOnPage();
      trackEvent('page_engagement', {
        category: 'engagement',
        time_on_page: timeOnPage,
        page: window.location.pathname,
      });
    } else {
      startTime = Date.now();
    }
  };

  // Track when user leaves the page
  const handleBeforeUnload = () => {
    updateTimeOnPage();
    trackEvent('page_exit', {
      category: 'engagement',
      time_on_page: timeOnPage,
      page: window.location.pathname,
    });
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
};

// Conversion tracking
export const trackConversion = (conversionType: string, value?: number, currency?: string) => {
  trackEvent('conversion', {
    category: 'conversion',
    label: conversionType,
    value,
    currency,
  });
};

// A/B testing utilities
export const trackABTest = (testName: string, variation: string) => {
  trackEvent('ab_test', {
    category: 'experiment',
    label: testName,
    variation,
  });
  
  // Store in localStorage for consistency
  localStorage.setItem(`ab_test_${testName}`, variation);
};

export const getABTestVariation = (testName: string, variations: string[]): string => {
  // Return existing variation if already assigned
  const existing = localStorage.getItem(`ab_test_${testName}`);
  if (existing) {
    return existing;
  }
  
  // Assign new variation
  const variation = variations[Math.floor(Math.random() * variations.length)];
  localStorage.setItem(`ab_test_${testName}`, variation);
  
  // Track the assignment
  trackABTest(testName, variation);
  
  return variation;
};