import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <Link href={`/product/${product.artikelcode}`} className="product-card">
      <div className="product-card-image">
        {product.afbeelding ? (
          <Image
            src={product.afbeelding}
            alt={product.artikelomschrijving || product.artikelcode}
            width={280}
            height={250}
            className="w-full h-full object-contain"
            loading={priority ? "eager" : undefined}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
          />
        ) : (
          <div className="product-card-image-placeholder">🌿</div>
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

