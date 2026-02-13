'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSearch } from '@/lib/SearchContext';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Menu, X, Search, ShoppingCart, User, Heart } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import OrderDeadline from './OrderDeadline';
// Cart sidebar removed - now using /winkelwagen page
import { plantenData } from '@/data/products';
import { getAllProducts, searchProducts } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export default function LogoBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useSearch();
  const { getTotalItems } = useCart();
  const { getTotalFavorites } = useFavorites();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(plantenData);
  const [useSupabase, setUseSupabase] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fix hydration error door pas na mount te renderen
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Laad producten bij mount
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
      }
    }
    loadProducts();
  }, []);

  // Cart sidebar removed - now using /winkelwagen page

  // Filter producten op basis van zoekterm
  const filteredProducts = useMemo(() => {
    // Als er geen zoekterm is, toon eerste 8 producten
    if (!searchTerm.trim()) {
      return products.slice(0, 8);
    }

    const term = searchTerm.toLowerCase().trim();
    
    const filtered = products.filter(product => {
      const code = (product.artikelcode || '').toLowerCase();
      const omschrijving = (product.artikelomschrijving || '').toLowerCase();
      return code.includes(term) || omschrijving.includes(term);
    }).slice(0, 8); // Maximaal 8 resultaten in dropdown
    
    return filtered;
  }, [searchTerm, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setOpen(false);
      // Navigate to ontdekken page to show search results
      router.push('/ontdekken');
    }
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) {
      setOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Open dropdown wanneer er resultaten zijn of wanneer er getypt wordt
  useEffect(() => {
    if (searchTerm.trim() && filteredProducts.length > 0) {
      setOpen(true);
    }
  }, [searchTerm, filteredProducts.length]);

  const totalProducts = products.length;

  return (
    <>
      <div className="logo-banner">
        <div className="logo-banner-inner">
          {/* Logo - Links */}
          <div className="logo-banner-logo">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Logo Links BOven .png" 
                alt="Straver Pflanzen Export" 
                width={220} 
                height={66}
                className="logo-banner-image"
              />
            </Link>
          </div>

          {/* Zoekbalk - Midden/Links */}
          <div className={`dropdown-nav ${open ? 'open' : ''} logo-banner-search`}>
              <form onSubmit={handleSearch} className="relative">
                <div className="search-icon-left">
                  <Search size={18} />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  placeholder={t('search.placeholder')}
                  className="search-input-nav"
                />
                <button 
                  type="submit"
                  className="search-button-nav"
                  aria-label="Zoeken"
                >
                  <Search size={20} className="text-white" />
                </button>
              </form>
              {open && (
                <div ref={dropdownRef} className="dropdown-menu-nav">
                  {filteredProducts.length === 0 ? (
                    <div className="dropdown-item-nav-empty">
                      {t('results.no-results')}
                    </div>
                  ) : (
                    <div className="dropdown-products-list">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.artikelcode}
                          href={`/product/${product.artikelcode}`}
                          className="dropdown-product-item-link"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          <div className="dropdown-product-info">
                            <div className="dropdown-product-title">
                              {product.artikelomschrijving || product.artikelcode}
                            </div>
                            <div className="dropdown-product-code">{product.artikelcode}</div>
                            {product.potmaat && (
                              <div className="dropdown-product-path">{product.potmaat}</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Right Side - Icons */}
          <div className="logo-banner-right">
            {/* Favorieten Icon */}
            <Link 
              href="/favorieten"
              className="favorites-icon-container"
              aria-label="Favorieten"
            >
              <Heart size={20} className="favorites-icon" />
              {isMounted && getTotalFavorites() > 0 && (
                <span className="favorites-badge">{getTotalFavorites()}</span>
              )}
            </Link>

            {/* Winkelwagen Icon */}
            <Link 
              href="/winkelwagen"
              className="cart-icon-container"
              aria-label="Winkelwagen"
            >
              <ShoppingCart size={20} className="cart-icon" />
              {isMounted && getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </Link>

            {/* Gebruiker Icon */}
            <Link href="/b2b" className="user-icon-container">
              <User size={20} className="user-icon" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="logo-banner-mobile-toggle md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <nav className="flex flex-col">
            {/* Geen navigatie links meer */}
          </nav>
        </div>
      )}
    </>
  );
}


