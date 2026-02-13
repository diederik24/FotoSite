'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getProductsPaginated } from '@/lib/supabase';
import type { Product } from '@/lib/types';

interface UseInfiniteProductsOptions {
  pageSize?: number;
  searchTerm?: string;
  enabled?: boolean;
}

interface UseInfiniteProductsReturn {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  loadMore: () => void;
  reset: () => void;
  total: number;
}

/**
 * Custom hook for infinite scroll product loading
 * Implements progressive rendering with skeleton loaders
 */
export function useInfiniteProducts(
  options: UseInfiniteProductsOptions = {}
): UseInfiniteProductsReturn {
  const { pageSize = 24, searchTerm = '', enabled = true } = options;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  const isLoadingRef = useRef(false);

  // Load initial products
  const loadProducts = useCallback(async (page: number, reset: boolean = false) => {
    // Prevent concurrent requests
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    
    if (reset) {
      setIsLoading(true);
      setProducts([]);
      setCurrentPage(1);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const { products: newProducts, hasMore: moreAvailable, total: totalCount } = 
        await getProductsPaginated(page, pageSize, searchTerm);

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }

      setHasMore(moreAvailable);
      setTotal(totalCount);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load products'));
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [pageSize, searchTerm]);

  // Initial load
  useEffect(() => {
    if (enabled) {
      loadProducts(1, true);
    }
  }, [enabled, searchTerm]); // Reset when search term changes

  // Load more function
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoadingRef.current) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadProducts(nextPage, false);
    }
  }, [currentPage, hasMore, isLoadingMore, loadProducts]);

  // Reset function
  const reset = useCallback(() => {
    setProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setError(null);
    if (enabled) {
      loadProducts(1, true);
    }
  }, [enabled, loadProducts]);

  return {
    products,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    reset,
    total,
  };
}
