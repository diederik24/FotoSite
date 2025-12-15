'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [useFallback, setUseFallback] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px voordat het in view komt
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  // Reset error state wanneer src verandert
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    setUseFallback(false);
  }, [src]);

  const handleLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Probeer eerst fallback naar normale img tag
    if (!useFallback) {
      setUseFallback(true);
      setIsLoaded(false);
      setHasError(false);
    } else {
      // Als fallback ook faalt, toon error
      setHasError(true);
      onError?.();
    }
  };

  // Timeout voor het geval de afbeelding te lang duurt (15 seconden)
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      timeoutRef.current = setTimeout(() => {
        if (!isLoaded) {
          handleError();
        }
      }, 15000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isInView, isLoaded, hasError, useFallback]);

  return (
    <div ref={imgRef} className={`relative ${className}`} style={{ width, height }}>
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          <span>Afbeelding laden mislukt</span>
        </div>
      ) : (
        <>
          {/* Loading placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-0">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Next.js Image of fallback naar normale img */}
          {isInView && (
            useFallback ? (
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`w-full h-full object-contain transition-opacity duration-300 relative z-10 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
              />
            ) : (
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`w-full h-full object-contain transition-opacity duration-300 relative z-10 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading={priority ? 'eager' : 'lazy'}
                priority={priority}
                fetchPriority={priority ? 'high' : 'auto'}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
              />
            )
          )}
        </>
      )}
    </div>
  );
}

