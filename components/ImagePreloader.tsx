'use client';

import { useEffect } from 'react';
import { Product } from '@/lib/types';

interface ImagePreloaderProps {
  products: Product[];
}

export default function ImagePreloader({ products }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload alleen de eerste 12 afbeeldingen door Image objecten te maken
    // Dit voorkomt conflicten met link preload tags
    const preloadImages = () => {
      const maxPreload = 12;
      const productsToPreload = products.slice(0, maxPreload);
      
      productsToPreload.forEach((product) => {
        if (product.afbeelding) {
          // Gebruik Image object voor browser cache zonder conflicten
          const img = new Image();
          img.src = product.afbeelding;
          img.fetchPriority = 'high';
        }
      });
    };

    if (products.length > 0) {
      // Kleine delay zodat de DOM eerst renderd
      const timer = setTimeout(() => {
        preloadImages();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [products]);

  return null; // Geen visuele output
}


