'use client';

import { useMemo } from 'react';
import Topbar from '@/components/Topbar';
import LogoBanner from '@/components/LogoBanner';
import PromoBanner from '@/components/PromoBanner';
import PromoCarousel from '@/components/PromoCarousel';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import InfiniteScrollTrigger from '@/components/InfiniteScrollTrigger';
import Footer from '@/components/Footer';
import OrderDeadline from '@/components/OrderDeadline';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { useSearch } from '@/lib/SearchContext';
import { useLanguage } from '@/lib/LanguageContext';

export default function Ontdekken() {
  const { searchTerm } = useSearch();
  const { t } = useLanguage();
  
  // Use infinite scroll hook with optimized pagination
  const {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    total,
  } = useInfiniteProducts({
    pageSize: 24, // Load 24 products at a time (optimal for grid layouts)
    searchTerm: searchTerm || '',
    enabled: true,
  });

  // Show skeleton loaders during initial load
  const showSkeletons = isLoading && products.length === 0;
  // Show loading more skeletons when loading additional pages
  const showLoadingMore = isLoadingMore && products.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <LogoBanner />
      <PromoBanner />
      <PromoCarousel />

      <div className="content-wrapper">
        {/* Results header - shows immediately */}
        {!showSkeletons && (
          <div className="results-info-container">
            <div className="results-info">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Ontdekken</h1>
              {searchTerm ? (
                <span>
                  {total > 0 ? `${total} ${t('products.found')} voor "${searchTerm}"` : 'Geen resultaten gevonden'}
                </span>
              ) : (
                <span>{total > 0 ? `${total} producten beschikbaar` : 'Geen producten beschikbaar'}</span>
              )}
            </div>
            <OrderDeadline />
          </div>
        )}

        {/* Error state */}
        {error && !showSkeletons && (
          <div className="no-results">
            <p className="text-red-600">Er is een fout opgetreden bij het laden van producten.</p>
            <p className="text-gray-500 text-sm mt-2">{error.message}</p>
          </div>
        )}

        {/* Product grid with progressive rendering */}
        <div className="products-grid">
          {/* Show skeletons during initial load */}
          {showSkeletons && (
            <>
              {Array.from({ length: 24 }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          )}

          {/* Render loaded products immediately */}
          {products.map((product, index) => (
            <ProductCard 
              key={product.artikelcode} 
              product={product} 
              priority={index < 12} // Only prioritize first 12 images
            />
          ))}

          {/* Show loading more skeletons */}
          {showLoadingMore && (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={`loading-more-${index}`} />
              ))}
            </>
          )}
        </div>

        {/* Infinite scroll trigger */}
        {!showSkeletons && !error && (
          <InfiniteScrollTrigger
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoadingMore}
            threshold={400} // Start loading 400px before reaching bottom
          />
        )}

        {/* Empty state */}
        {!showSkeletons && !error && products.length === 0 && (
          <div className="no-results">
            {t('results.no-results')}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
