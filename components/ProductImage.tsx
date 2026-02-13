'use client';

import { useState } from 'react';
import LazyImage from './LazyImage';
import ImageModal from './ImageModal';
import { Product } from '@/lib/types';

interface ProductImageProps {
  src?: string;
  alt: string;
  product?: Product;
}

export default function ProductImage({ src, alt, product }: ProductImageProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (src) {
      setIsImageModalOpen(true);
    }
  };

  return (
    <>
      <div 
        className="product-image" 
        onClick={handleImageClick}
        style={{ cursor: src ? 'pointer' : 'default' }}
        role={src ? 'button' : undefined}
        tabIndex={src ? 0 : undefined}
        onKeyDown={(e) => {
          if (src && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsImageModalOpen(true);
          }
        }}
      >
        {src ? (
          <LazyImage
            src={src}
            alt={alt}
            width={600}
            height={600}
            className="w-full h-full"
            priority={true}
          />
        ) : (
          <div className="product-image-placeholder w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span>Geen afbeelding</span>
          </div>
        )}
      </div>
      {src && (
        <ImageModal
          src={src}
          alt={alt}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          product={product}
        />
      )}
    </>
  );
}

