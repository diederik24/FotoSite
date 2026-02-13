'use client';

import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number; // Distance from bottom to trigger load (in pixels)
}

/**
 * Intersection Observer based infinite scroll trigger
 * More performant than scroll event listeners
 */
export default function InfiniteScrollTrigger({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
}: InfiniteScrollTriggerProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Trigger when the sentinel element becomes visible
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`, // Start loading before reaching the bottom
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  if (!hasMore) {
    return null;
  }

  return (
    <div ref={observerTarget} className="h-4 w-full" aria-hidden="true">
      {/* Sentinel element for intersection observer */}
    </div>
  );
}
