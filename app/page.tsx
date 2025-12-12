'use client';

import { useState, useMemo, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import LogoBanner from '@/components/LogoBanner';
import ProductCard from '@/components/ProductCard';
import { plantenData } from '@/data/products';
import { getAllProducts, searchProducts } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(plantenData);
  const [isLoading, setIsLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  // Preload alle afbeeldingen voor sneller laden
  useEffect(() => {
    const preloadImages = (productList: Product[]) => {
      productList.forEach((product, index) => {
        if (product.afbeelding) {
          const img = new Image();
          img.src = product.afbeelding;
          // Stagger loading voor betere performance
          if (index < 20) {
            img.loading = 'eager' as any;
          }
        }
      });
    };

    if (products.length > 0) {
      preloadImages(products);
    }
  }, [products]);

  // Probeer producten uit Supabase te laden
  useEffect(() => {
    async function loadProducts() {
      try {
        const supabaseProducts = await getAllProducts();
        if (supabaseProducts.length > 0) {
          setProducts(supabaseProducts);
          setUseSupabase(true);
        }
      } catch (error) {
        console.log('Supabase niet beschikbaar, gebruik statische data');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Zoek in Supabase of statische data
  useEffect(() => {
    if (!searchTerm.trim()) {
      if (useSupabase) {
        getAllProducts().then(setProducts);
      } else {
        setProducts(plantenData);
      }
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    if (useSupabase) {
      searchProducts(searchTerm).then(setProducts);
    } else {
      const filtered = plantenData.filter(product => {
        const code = (product.artikelcode || '').toLowerCase();
        const omschrijving = (product.artikelomschrijving || '').toLowerCase();
        return code.includes(term) || omschrijving.includes(term);
      });
      setProducts(filtered);
    }
  }, [searchTerm, useSupabase]);

  const filteredProducts = products;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <LogoBanner />

      <div className="content-wrapper">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Zoek op artikelcode, artikelomschrijving..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Zoeken
            </button>
          </form>
          {filteredProducts.length > 0 && (
            <div className="results-info">
              {filteredProducts.length} artikel{filteredProducts.length !== 1 ? 'en' : ''} gevonden{searchTerm ? ` voor "${searchTerm}"` : ''}
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-results">
            Geen artikelen gevonden. Probeer een andere zoekterm.
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.artikelcode} 
                product={product} 
                priority={index < 12} // Eerste 12 afbeeldingen krijgen priority
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

