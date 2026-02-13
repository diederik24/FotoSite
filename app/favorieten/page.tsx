'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/lib/FavoritesContext';
import { useCart } from '@/lib/CartContext';
import { Heart, ArrowLeft, ShoppingBag, X, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';

export default function FavorietenPage() {
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [addToCartModal, setAddToCartModal] = useState<{ product: Product; quantity: number } | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [removeConfirmItem, setRemoveConfirmItem] = useState<{ artikelcode: string; naam: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration error door pas na mount te renderen
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemoveClick = (artikelcode: string) => {
    const item = favorites.find(item => item.artikelcode === artikelcode);
    if (item) {
      setRemoveConfirmItem({
        artikelcode: item.artikelcode,
        naam: item.artikelomschrijving || item.artikelcode
      });
    }
  };

  const confirmRemove = () => {
    if (removeConfirmItem) {
      removeFromFavorites(removeConfirmItem.artikelcode);
      setRemoveConfirmItem(null);
    }
  };

  const cancelRemove = () => {
    setRemoveConfirmItem(null);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (document.referrer) {
        window.history.back();
      } else {
        router.push('/ontdekken');
      }
    }
  };

  const handleOpenAddToCartModal = (product: Product) => {
    setAddToCartModal({ product, quantity: 1 });
  };

  const handleCloseAddToCartModal = () => {
    setAddToCartModal(null);
  };

  const handleAddToCartFromModal = () => {
    if (addToCartModal && addToCartModal.quantity > 0) {
      addToCart(addToCartModal.product, addToCartModal.quantity);
      setAddToCartModal(null);
    }
  };

  const handleModalQuantityChange = (delta: number) => {
    if (addToCartModal) {
      const newQuantity = Math.max(1, addToCartModal.quantity + delta);
      const maxQuantity = addToCartModal.product.voorraad !== undefined && addToCartModal.product.voorraad !== null 
        ? addToCartModal.product.voorraad 
        : undefined;
      
      if (maxQuantity && newQuantity > maxQuantity) {
        return;
      }
      
      setAddToCartModal({
        ...addToCartModal,
        quantity: newQuantity
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Terug naar overzicht</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart size={32} className="text-[#e91e63]" fill="#e91e63" />
            Favorieten
          </h1>
          <p className="text-gray-600 mt-2">
            {!isMounted ? (
              'Laden...'
            ) : favorites.length === 0 ? (
              'Je hebt nog geen favorieten'
            ) : (
              `${favorites.length} ${favorites.length === 1 ? 'product' : 'producten'} in je favorieten`
            )}
          </p>
        </div>

        {!isMounted ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3bb13b]"></div>
            <p className="mt-4 text-gray-500">Favorieten laden...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Je hebt nog geen favorieten
            </h2>
            <p className="text-gray-600 mb-6">
              Voeg producten toe aan je favorieten om ze hier te bekijken
            </p>
            <button
              onClick={handleGoBack}
              className="inline-block px-6 py-3 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
            >
              Verder winkelen
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {favorites.map((product) => {
                  const price = product.prijs || 0;
                  
                  return (
                    <div key={product.artikelcode} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      {/* Image */}
                      <div 
                        className="w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 cursor-pointer hover:border-[#3bb13b] transition-colors"
                        onClick={() => {
                          if (product.afbeelding) {
                            setSelectedImage({
                              src: product.afbeelding,
                              alt: product.artikelomschrijving || product.artikelcode
                            });
                          }
                        }}
                      >
                        {product.afbeelding ? (
                          <Image
                            src={product.afbeelding}
                            alt={product.artikelomschrijving || product.artikelcode}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${product.artikelcode}`}>
                              <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#3bb13b] transition-colors">
                                {product.wetenschappelijkeNaam || product.artikelomschrijving || product.artikelcode}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                              <span className="font-mono">{product.artikelcode}</span>
                              {product.potmaat && (
                                <span className="px-2 py-1 bg-gray-100 rounded">
                                  {product.potmaat}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                              {price > 0 ? (
                                <div className="text-lg font-bold text-gray-900">€ {price.toFixed(2)}</div>
                              ) : (
                                <div className="text-sm text-gray-500 italic">Prijs op aanvraag</div>
                              )}
                              {/* Stock Indicator */}
                              {product.voorraad !== undefined && product.voorraad !== null ? (
                                product.voorraad === 0 ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-red">
                                    <div className="absolute inset-0 bg-gradient-radial from-red-400/30 via-red-500/20 to-transparent opacity-60"></div>
                                    <div className="w-2 h-2 bg-red-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                    <span className="text-xs font-medium text-red-700 relative z-10">Niet op voorraad</span>
                                  </div>
                                ) : product.voorraad <= 10 ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-red">
                                    <div className="absolute inset-0 bg-gradient-radial from-red-400/30 via-red-500/20 to-transparent opacity-60"></div>
                                    <div className="w-2 h-2 bg-red-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                    <span className="text-xs font-medium text-red-700 relative z-10">Low Stock</span>
                                  </div>
                                ) : product.voorraad <= 50 ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-orange">
                                    <div className="absolute inset-0 bg-gradient-radial from-orange-400/30 via-orange-500/20 to-transparent opacity-60"></div>
                                    <div className="relative z-10 flex items-center justify-center w-4 h-4">
                                      {/* Outer yellow ring */}
                                      <div className="absolute w-4 h-4 rounded-full border-2 border-yellow-400"></div>
                                      {/* Middle orange ring */}
                                      <div className="absolute w-3 h-3 rounded-full border-2 border-orange-500"></div>
                                      {/* Inner orange circle */}
                                      <div className="absolute w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_6px_rgba(249,115,22,0.6)]"></div>
                                    </div>
                                    <span className="text-xs font-medium text-orange-700 relative z-10">Limited Stock</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-green">
                                    <div className="absolute inset-0 bg-gradient-radial from-green-400/30 via-green-500/20 to-transparent opacity-60"></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    <span className="text-xs font-medium text-green-700 relative z-10">Op voorraad</span>
                                  </div>
                                )
                              ) : product.beschikbaar === false ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full relative overflow-hidden stock-indicator stock-indicator-red">
                                  <div className="absolute inset-0 bg-gradient-radial from-red-400/30 via-red-500/20 to-transparent opacity-60"></div>
                                  <div className="w-2 h-2 bg-red-500 rounded-full relative z-10 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                  <span className="text-xs font-medium text-red-700 relative z-10">Niet beschikbaar</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full relative overflow-hidden stock-indicator">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full relative z-10"></div>
                                  <span className="text-xs font-medium text-gray-600 relative z-10">Beschikbaarheid onbekend</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveClick(product.artikelcode)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Verwijderen uit favorieten"
                          >
                            <Heart size={18} fill="#e91e63" className="text-[#e91e63]" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => handleOpenAddToCartModal(product)}
                            disabled={
                              (product.voorraad !== undefined && product.voorraad !== null && product.voorraad === 0) ||
                              product.beschikbaar === false
                            }
                            className="px-4 py-2 bg-[#3bb13b] text-white text-sm font-semibold rounded-lg hover:bg-[#34a034] transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                          >
                            <Plus size={16} />
                            Toevoegen aan winkelwagen
                          </button>
                          <Link
                            href={`/product/${product.artikelcode}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Bekijk details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-md w-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 text-white bg-[#3bb13b] hover:bg-[#34a034] rounded-full p-2 transition-colors z-10 shadow-lg"
                aria-label="Sluiten"
              >
                <X size={20} />
              </button>
              <div className="bg-white rounded-lg overflow-hidden shadow-xl p-4">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={400}
                  height={400}
                  className="w-full h-auto object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        )}

        {/* Add to Cart Modal */}
        {addToCartModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseAddToCartModal}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Aantal toevoegen</h2>
                <button
                  onClick={handleCloseAddToCartModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Sluiten"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex gap-4">
                    <div 
                      className="w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative"
                      onMouseEnter={() => setHoveredImage(addToCartModal.product.afbeelding || null)}
                      onMouseLeave={() => setHoveredImage(null)}
                    >
                      {addToCartModal.product.afbeelding ? (
                        <>
                          <Image
                            src={addToCartModal.product.afbeelding}
                            alt={addToCartModal.product.artikelomschrijving || addToCartModal.product.artikelcode}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                            unoptimized
                          />
                          {hoveredImage === addToCartModal.product.afbeelding && (
                            <div className="absolute -right-32 top-0 w-48 h-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-10 hidden md:block">
                              <Image
                                src={addToCartModal.product.afbeelding}
                                alt={addToCartModal.product.artikelomschrijving || addToCartModal.product.artikelcode}
                                width={192}
                                height={192}
                                className="w-full h-full object-contain"
                                unoptimized
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <ShoppingBag size={32} className="text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {addToCartModal.product.wetenschappelijkeNaam || addToCartModal.product.artikelomschrijving || addToCartModal.product.artikelcode}
                      </h3>
                      <p className="text-xs text-gray-500 font-mono mb-2">{addToCartModal.product.artikelcode}</p>
                      {addToCartModal.product.potmaat && (
                        <p className="text-xs text-gray-500">{addToCartModal.product.potmaat}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aantal
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleModalQuantityChange(-1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label="Verminder"
                  >
                    <span className="text-lg">−</span>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={addToCartModal.product.voorraad !== undefined && addToCartModal.product.voorraad !== null ? addToCartModal.product.voorraad : undefined}
                    value={addToCartModal.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      const maxQuantity = addToCartModal.product.voorraad !== undefined && addToCartModal.product.voorraad !== null 
                        ? addToCartModal.product.voorraad 
                        : undefined;
                      const finalValue = maxQuantity ? Math.min(value, maxQuantity) : value;
                      setAddToCartModal({
                        ...addToCartModal,
                        quantity: Math.max(1, finalValue)
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#3bb13b]"
                  />
                  <button
                    onClick={() => handleModalQuantityChange(1)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Verhoog"
                    disabled={addToCartModal.product.voorraad !== undefined && addToCartModal.product.voorraad !== null && addToCartModal.quantity >= addToCartModal.product.voorraad}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {addToCartModal.product.prijs && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotaal:</span>
                    <span className="text-xl font-bold text-[#3bb13b]">
                      € {(addToCartModal.product.prijs * addToCartModal.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCloseAddToCartModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleAddToCartFromModal}
                  className="flex-1 px-4 py-3 bg-[#3bb13b] text-white rounded-lg font-semibold hover:bg-[#34a034] transition-colors"
                >
                  Toevoegen aan winkelwagen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Confirmation Modal */}
        {removeConfirmItem && typeof window !== 'undefined' && createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
            onClick={cancelRemove}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Verwijderen uit favorieten?</h3>
                  <p className="text-sm text-gray-600">
                    Weet je zeker dat je dit product uit je favorieten wilt verwijderen?
                  </p>
                </div>
                <button
                  onClick={cancelRemove}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                  aria-label="Sluiten"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <p className="font-semibold text-gray-900">
                  {removeConfirmItem.naam}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-mono">{removeConfirmItem.artikelcode}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelRemove}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={confirmRemove}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </main>
    </div>
  );
}
