'use client';

import { useEffect } from 'react';
import { Product } from '@/lib/types';

interface ImagePreloaderProps {
  products: Product[];
}

export default function ImagePreloader({ products }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload alleen de eerste 20-30 afbeeldingen voor sneller laden
    // Te veel preloaden kan de performance juist schaden
    const preloadImages = () => {
      const maxPreload = 25; // Alleen eerste 25 afbeeldingen preloaden
      const productsToPreload = products.slice(0, maxPreload);
      
      productsToPreload.forEach((product, index) => {
        if (product.afbeelding) {
          // Gebruik link preload alleen voor eerste 12 (above the fold)
          if (index < 12) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = product.afbeelding;
            link.fetchPriority = 'high';
            document.head.appendChild(link);
          }

          // Image object voor browser cache (alleen eerste 25)
          const img = new Image();
          img.decoding = 'async';
          img.loading = 'lazy';
          img.src = product.afbeelding;
        }
      });
    };

    if (products.length > 0) {
      // Delay kleine beetje zodat pagina eerst renderd
      const timer = setTimeout(() => {
        preloadImages();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [products]);

  return null; // Geen visuele output
}


