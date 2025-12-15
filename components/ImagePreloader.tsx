'use client';

import { useEffect } from 'react';
import { Product } from '@/lib/types';

interface ImagePreloaderProps {
  products: Product[];
}

export default function ImagePreloader({ products }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload alleen de eerste 12 afbeeldingen (above the fold) voor sneller laden
    const preloadImages = () => {
      const maxPreload = 12; // Alleen eerste 12 afbeeldingen preloaden
      const productsToPreload = products.slice(0, maxPreload);
      
      productsToPreload.forEach((product) => {
        if (product.afbeelding) {
          // Gebruik link preload voor snellere initial load
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = product.afbeelding;
          link.fetchPriority = 'high';
          document.head.appendChild(link);
        }
      });
    };

    if (products.length > 0) {
      // Start preloading direct voor snellere initial load
      preloadImages();
    }
  }, [products]);

  return null; // Geen visuele output
}


