'use client';

import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [loadError, setLoadError] = useState<string | null>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Debug logging (alleen in development)
  const isDev = process.env.NODE_ENV === 'development';
  const debugLog = (message: string, data?: any) => {
    if (isDev) {
      console.log(`[LazyImage ${src}] ${message}`, data || '');
    }
  };

  // Intersection Observer voor non-priority afbeeldingen
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            debugLog('In view, start loading');
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView, src]);

  // Reset state wanneer src verandert
  useEffect(() => {
    setIsLoaded(false);
    setLoadError(null);
    retryCountRef.current = 0;
  }, [src]);

  const handleLoad = () => {
    debugLog('Image loaded successfully', {
      src,
      complete: imgElementRef.current?.complete,
      naturalWidth: imgElementRef.current?.naturalWidth,
      naturalHeight: imgElementRef.current?.naturalHeight,
    });
    setIsLoaded(true);
    setLoadError(null);
    onLoad?.();
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const errorInfo = {
      src,
      attemptedSrc: img.src,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      retryCount: retryCountRef.current,
    };
    
    debugLog('Image error event', errorInfo);
    
    retryCountRef.current += 1;
    
    if (retryCountRef.current < maxRetries) {
      // Probeer opnieuw na korte delay
      setTimeout(() => {
        if (imgElementRef.current) {
          debugLog(`Retry ${retryCountRef.current}/${maxRetries}`);
          imgElementRef.current.src = src;
        }
      }, 1000 * retryCountRef.current);
    } else {
      // Alle retries gefaald
      setLoadError(`Failed after ${maxRetries} attempts`);
      console.error(`[LazyImage] Failed to load: ${src}`, errorInfo);
      onError?.();
    }
  };

  // Check of afbeelding al geladen is wanneer img element wordt gemaakt
  useEffect(() => {
    if (isInView && imgElementRef.current) {
      const img = imgElementRef.current;
      // Check of afbeelding al compleet is geladen (bijv. uit cache)
      if (img.complete && img.naturalHeight !== 0) {
        debugLog('Image already loaded from cache');
        setIsLoaded(true);
        setLoadError(null);
        onLoad?.();
      } else {
        debugLog('Image not yet loaded, waiting for load event');
      }
    }
  }, [isInView, onLoad, src]);

  return (
    <div ref={imgRef} className={`relative ${className}`} style={{ width, height }}>
      {/* Loading placeholder - alleen tonen als nog niet geladen */}
      {!isLoaded && isInView && !loadError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-0">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error message */}
      {loadError && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-0">
          <div className="text-red-600 text-xs text-center p-2">
            <div>❌ Fout</div>
            <div className="mt-1">{loadError}</div>
            {isDev && (
              <div className="mt-1 text-gray-500 text-[10px] break-all">
                {src}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Normale img tag - simpel en betrouwbaar zoals bol.com */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {isInView && (
        <img
          ref={(img) => {
            imgElementRef.current = img;
            if (img) {
              debugLog('Image ref set', {
                src,
                complete: img.complete,
                naturalHeight: img.naturalHeight,
                naturalWidth: img.naturalWidth,
                srcAttr: img.getAttribute('src'),
                currentSrc: img.src,
              });
              
              // Check of afbeelding al geladen is (cached)
              if (img.complete && img.naturalHeight !== 0) {
                debugLog('Image already loaded from cache');
                setIsLoaded(true);
                setLoadError(null);
                onLoad?.();
              }
            }
          }}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-contain transition-opacity duration-200 relative z-10 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
