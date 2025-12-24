'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSearch } from '@/lib/SearchContext';
import { Menu, X, Search } from 'lucide-react';
import { plantenData } from '@/data/products';
import { getAllProducts, searchProducts } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export default function LogoBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(plantenData);
  const [useSupabase, setUseSupabase] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      router.push('/');
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

  return (
    <>
      <div className="logo-banner">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <Image 
              src="/Logo Links BOven .png" 
              alt="Straver Pflanzen Export" 
              width={280} 
              height={84}
              className="max-w-[200px] md:max-w-[280px] h-auto block"
            />
            <button 
              className="md:hidden text-gray-700 hover:text-[#32B336] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <div className={`dropdown-nav ${open ? 'open' : ''} w-full md:flex-1 md:max-w-md md:mx-8 order-3 md:order-2`}>
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
                placeholder="Zoeken..."
                className="search-input-nav"
              />
            </form>
            {open && (
              <div ref={dropdownRef} className="dropdown-menu-nav">
                {filteredProducts.length === 0 ? (
                  <div className="dropdown-item-nav-empty">
                    Geen artikelen gevonden
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
          <nav className="hidden md:flex items-center gap-4 order-2 md:order-3">
            <Link 
              href="/"
            >
              Catalogus
            </Link>
            <Link 
              href="/info"
            >
              Over Ons
            </Link>
            <Link 
              href="/contact"
            >
              Contact
            </Link>
            <Link 
              href="/b2b" 
              className="b2b-button"
            >
              B2B Portal
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link 
              href="/"
              className="text-gray-800 py-2 px-2 hover:text-[#32B336] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catalogus
            </Link>
            <Link 
              href="/info"
              className="text-gray-800 py-2 px-2 hover:text-[#32B336] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Over Ons
            </Link>
            <Link 
              href="/contact"
              className="text-gray-800 py-2 px-2 hover:text-[#32B336] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href="/b2b" 
              className="b2b-button-mobile text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              B2B Portal
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}


