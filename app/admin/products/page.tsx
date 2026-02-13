'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Loader2
} from 'lucide-react';
import { getAllProducts, deleteProduct, deleteProducts } from '@/lib/supabase';
import { useToast } from '@/lib/ToastContext';
import type { Product } from '@/lib/types';

const ITEMS_PER_PAGE = 20;

export default function AdminProductsPage() {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Laad producten
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const allProducts = await getAllProducts();
      console.log('Loaded products:', allProducts.length);
      setProducts(allProducts);
      
      if (allProducts.length === 0) {
        console.warn('Geen producten gevonden in database');
        // Geen error toast, gewoon lege lijst tonen
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast.error(`Fout bij het laden van producten: ${error.message || 'Onbekende fout'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter producten op zoekterm
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.artikelcode.toLowerCase().includes(term) ||
      product.artikelomschrijving.toLowerCase().includes(term) ||
      product.wetenschappelijkeNaam?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // Paginering
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset pagina bij zoeken
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Verwijder product
  const handleDelete = async (artikelcode: string) => {
    if (!confirm(`Weet je zeker dat je product "${artikelcode}" wilt verwijderen?`)) {
      return;
    }

    setIsDeleting(artikelcode);
    try {
      await deleteProduct(artikelcode);
      setProducts(products.filter(p => p.artikelcode !== artikelcode));
      toast.success('Product succesvol verwijderd');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Fout bij het verwijderen van product');
    } finally {
      setIsDeleting(null);
    }
  };

  // Verwijder meerdere producten
  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    
    if (!confirm(`Weet je zeker dat je ${selectedProducts.size} product(en) wilt verwijderen?`)) {
      return;
    }

    try {
      await deleteProducts(Array.from(selectedProducts));
      setProducts(products.filter(p => !selectedProducts.has(p.artikelcode)));
      setSelectedProducts(new Set());
      toast.success(`${selectedProducts.size} product(en) succesvol verwijderd`);
    } catch (error: any) {
      console.error('Error deleting products:', error);
      toast.error(error.message || 'Fout bij het verwijderen van producten');
    }
  };

  // Toggle selectie
  const toggleSelect = (artikelcode: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(artikelcode)) {
      newSelected.delete(artikelcode);
    } else {
      newSelected.add(artikelcode);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map(p => p.artikelcode)));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#3bb13b] mx-auto mb-4" />
          <p className="text-gray-600">Producten laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productbeheer</h1>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'producten'}
            {searchTerm && ` gevonden voor "${searchTerm}"`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
        >
          <Plus size={20} />
          Nieuw Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Zoekbalk */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Zoek op artikelcode, omschrijving of wetenschappelijke naam..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3bb13b]/20 focus:border-[#3bb13b] outline-none"
            />
          </div>

          {/* Bulk acties */}
          {selectedProducts.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              <Trash2 size={18} />
              Verwijder ({selectedProducts.size})
            </button>
          )}
        </div>
      </div>

      {/* Producten tabel */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm ? 'Geen producten gevonden' : 'Nog geen producten'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `Geen producten gevonden voor "${searchTerm}"`
              : products.length === 0
                ? 'Er zijn nog geen producten in de database.'
                : 'Geen producten gevonden op deze pagina'
            }
          </p>
          {products.length === 0 && !searchTerm && (
            <div className="space-y-4">
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
              >
                <Plus size={20} />
                Nieuw Product Toevoegen
              </Link>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-md mx-auto">
                <p className="text-sm text-blue-800 font-semibold mb-2">💡 Troubleshooting:</p>
                <p className="text-sm text-blue-700 mb-2">
                  Als je producten verwacht maar ze niet ziet, controleer:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Of Supabase correct is geconfigureerd (.env.local)</li>
                  <li>Of de products tabel bestaat in Supabase</li>
                  <li>Of er producten zijn geïmporteerd</li>
                  <li>Open de browser console (F12) voor meer details</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-[#3bb13b] focus:ring-[#3bb13b]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Afbeelding
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Artikelcode
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Omschrijving
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Potmaat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Verpakking
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Acties
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.artikelcode} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.artikelcode)}
                          onChange={() => toggleSelect(product.artikelcode)}
                          className="rounded border-gray-300 text-[#3bb13b] focus:ring-[#3bb13b]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 relative bg-gray-100 rounded-lg overflow-hidden">
                          {product.afbeelding ? (
                            <Image
                              src={product.afbeelding}
                              alt={product.artikelomschrijving}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="text-gray-400" size={24} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{product.artikelcode}</div>
                        {product.wetenschappelijkeNaam && (
                          <div className="text-sm text-gray-500 italic">{product.wetenschappelijkeNaam}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-900">{product.artikelomschrijving}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.potmaat}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900">{product.verpakkingsinhoud}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.artikelcode}/edit`}
                            className="p-2 text-gray-600 hover:text-[#3bb13b] hover:bg-gray-100 rounded-lg transition-colors"
                            title="Bewerken"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.artikelcode)}
                            disabled={isDeleting === product.artikelcode}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Verwijderen"
                          >
                            {isDeleting === product.artikelcode ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginering */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
              <div className="text-sm text-gray-700">
                Toon {startIndex + 1} tot {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} van {filteredProducts.length} producten
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Pagina {currentPage} van {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
