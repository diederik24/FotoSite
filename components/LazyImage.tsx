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
  const imgRef = useRef<HTMLDivElement>(null);
  const imgElementRef = useRef<HTMLImageElement | null>(null);

  // Intersection Observer voor non-priority afbeeldingen
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
  }, [priority, isInView]);

  // Reset state wanneer src verandert
  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Geen error handler - laat de browser het zelf afhandelen
  // Als de afbeelding niet laadt, blijft het gewoon op loading state staan

  // Check of afbeelding al geladen is wanneer img element wordt gemaakt
  useEffect(() => {
    if (isInView && imgElementRef.current) {
      const img = imgElementRef.current;
      // Check of afbeelding al compleet is geladen (bijv. uit cache)
      if (img.complete && img.naturalHeight !== 0) {
        setIsLoaded(true);
        onLoad?.();
      }
    }
  }, [isInView, onLoad]);

  return (
    <div ref={imgRef} className={`relative ${className}`} style={{ width, height }}>
      {/* Loading placeholder - alleen tonen als nog niet geladen */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-0">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Normale img tag - simpel en betrouwbaar zoals bol.com */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {isInView && (
        <img
          ref={(img) => {
            imgElementRef.current = img;
            if (img) {
              // Check of afbeelding al geladen is (cached)
              if (img.complete && img.naturalHeight !== 0) {
                setIsLoaded(true);
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
        />
      )}
    </div>
  );
}

