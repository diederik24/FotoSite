import Link from 'next/link';
import { Product } from '@/lib/types';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link href={`/product/${product.artikelcode}`} className="product-card">
      <div className="product-card-image">
        {product.afbeelding ? (
          <LazyImage
            src={product.afbeelding}
            alt={product.artikelomschrijving || product.artikelcode}
            width={280}
            height={250}
            className="w-full h-full"
            priority={priority}
          />
        ) : (
          <div className="product-card-image-placeholder w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span>Geen afbeelding</span>
          </div>
        )}
      </div>
      <div className="product-card-info">
        <div className="product-card-code">{product.artikelcode || ''}</div>
        <div className="product-card-title">
          {product.artikelomschrijving || 'Geen omschrijving'}
        </div>
        <div className="product-card-details">
          {product.potmaat && <div>Potmaat: {product.potmaat}</div>}
          {product.verpakkingsinhoud && <div>Verpakkingsinhoud: {product.verpakkingsinhoud}</div>}
        </div>
      </div>
    </Link>
  );
}

