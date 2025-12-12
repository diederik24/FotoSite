'use client';

import { useEffect } from 'react';
import { Product } from '@/lib/types';

interface ImagePreloaderProps {
  products: Product[];
}

export default function ImagePreloader({ products }: ImagePreloaderProps) {
  useEffect(() => {
    // Preload alle afbeeldingen voor sneller laden
    const preloadImages = () => {
      products.forEach((product, index) => {
        if (product.afbeelding) {
          // Gebruik link preload voor betere performance
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = product.afbeelding;
          link.fetchPriority = index < 20 ? 'high' : 'auto';
          document.head.appendChild(link);

          // Ook Image object voor browser cache
          const img = new Image();
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

