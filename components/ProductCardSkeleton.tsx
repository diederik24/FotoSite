'use client';

/**
 * Skeleton loader for product cards
 * Mimics the structure of ProductCard for seamless transition
 */
export default function ProductCardSkeleton() {
  return (
    <div className="product-card animate-pulse">
      {/* Image skeleton */}
      <div className="product-card-image bg-gray-200">
        <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"></div>
      </div>

      {/* Content skeleton */}
      <div className="product-card-info">
        {/* Plantsize skeleton */}
        <div className="product-card-plantsize">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Title skeleton */}
        <div className="product-card-title">
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>

        {/* Price section skeleton */}
        <div className="product-card-price-section">
          <div className="product-card-quantity-price">
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>

        {/* Bulk pricing skeleton */}
        <div className="product-card-bulk-pricing">
          <div className="product-card-bulk-item">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="product-card-bulk-item">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
