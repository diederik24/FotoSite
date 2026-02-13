'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Sparkles, TrendingUp, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export default function WinkelwagenPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart, addToCart } = useCart();
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [addToCartModal, setAddToCartModal] = useState<{ product: Product; quantity: number } | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [removeConfirmItem, setRemoveConfirmItem] = useState<{ artikelcode: string; naam: string } | null>(null);

  const handleQuantityChange = (artikelcode: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Vraag bevestiging voordat item wordt verwijderd
      const item = cartItems.find(item => item.product.artikelcode === artikelcode);
      if (item) {
        setRemoveConfirmItem({
          artikelcode: item.product.artikelcode,
          naam: item.product.artikelomschrijving || item.product.artikelcode
        });
      }
    } else {
      updateQuantity(artikelcode, newQuantity);
    }
  };

  const handleRemoveClick = (artikelcode: string) => {
    const item = cartItems.find(item => item.product.artikelcode === artikelcode);
    if (item) {
      setRemoveConfirmItem({
        artikelcode: item.product.artikelcode,
        naam: item.product.artikelomschrijving || item.product.artikelcode
      });
    }
  };

  const confirmRemove = () => {
    if (removeConfirmItem) {
      removeFromCart(removeConfirmItem.artikelcode);
      setRemoveConfirmItem(null);
    }
  };

  const cancelRemove = () => {
    setRemoveConfirmItem(null);
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (document.referrer) {
        window.history.back();
      } else {
        router.push('/ontdekken');
      }
    }
  };

  // Laad suggesties voor upsell
  useEffect(() => {
    async function loadSuggestions() {
      if (cartItems.length === 0) {
        setIsLoadingSuggestions(false);
        return;
      }

      try {
        const allProducts = await getAllProducts();
        // Filter producten die al in winkelwagen zitten
        const cartArticleCodes = cartItems.map(item => item.product.artikelcode);
        const availableProducts = allProducts.filter(
          p => !cartArticleCodes.includes(p.artikelcode) && p.beschikbaar !== false
        );
        
        // Neem willekeurige 6 producten als suggesties
        const shuffled = availableProducts.sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 6));
      } catch (error) {
        console.error('Error loading suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }

    loadSuggestions();
  }, [cartItems]);

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
          <h1 className="text-3xl font-bold text-gray-900">Winkelwagen</h1>
          <p className="text-gray-600 mt-2">
            {totalItems === 0 
              ? 'Je winkelwagen is leeg' 
              : `${totalItems} ${totalItems === 1 ? 'artikel' : 'artikelen'}`
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Je winkelwagen is leeg
            </h2>
            <p className="text-gray-600 mb-6">
              Voeg producten toe om verder te gaan
            </p>
            <button
              onClick={handleGoBack}
              className="inline-block px-6 py-3 bg-[#3bb13b] text-white rounded-lg font-medium hover:bg-[#34a034] transition-colors"
            >
              Verder winkelen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const price = item.product.prijs || 0;
                      const itemTotal = price * item.quantity;
                      const isOutOfStock = item.product.voorraad !== undefined && 
                                         item.product.voorraad !== null && 
                                         item.quantity > item.product.voorraad;
                      
                      return (
                        <div key={item.product.artikelcode} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                          {/* Image */}
                          <div 
                            className="w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 cursor-pointer hover:border-[#3bb13b] transition-colors"
                            onClick={() => {
                              if (item.product.afbeelding) {
                                setSelectedImage({
                                  src: item.product.afbeelding,
                                  alt: item.product.artikelomschrijving || item.product.artikelcode
                                });
                              }
                            }}
                          >
                            {item.product.afbeelding ? (
                              <Image
                                src={item.product.afbeelding}
                                alt={item.product.artikelomschrijving || item.product.artikelcode}
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
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {item.product.wetenschappelijkeNaam || item.product.artikelomschrijving || item.product.artikelcode}
                                </h3>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                                  <span className="font-mono">{item.product.artikelcode}</span>
                                  {item.product.potmaat && (
                                    <span className="px-2 py-1 bg-gray-100 rounded">
                                      {item.product.potmaat}
                                    </span>
                                  )}
                                  {isOutOfStock && (
                                    <span className="text-red-600 font-medium">
                                      Niet genoeg voorraad beschikbaar
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveClick(item.product.artikelcode)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                aria-label="Verwijderen"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            {/* Quantity and Price */}
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                <button
                                  onClick={() => handleQuantityChange(item.product.artikelcode, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
                                  aria-label="Verminder"
                                >
                                  <Minus size={14} />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max={item.product.voorraad !== undefined && item.product.voorraad !== null ? item.product.voorraad : undefined}
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    handleQuantityChange(item.product.artikelcode, value);
                                  }}
                                  className="w-12 text-center border-0 bg-transparent font-semibold focus:outline-none"
                                />
                                <button
                                  onClick={() => handleQuantityChange(item.product.artikelcode, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  aria-label="Verhoog"
                                  disabled={item.product.voorraad !== undefined && item.product.voorraad !== null && item.quantity >= item.product.voorraad}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <div className="text-right">
                                {price > 0 ? (
                                  <>
                                    <div className="text-sm text-gray-600">€ {price.toFixed(2)} per stuk</div>
                                    <div className="text-lg font-bold text-gray-900">€ {itemTotal.toFixed(2)}</div>
                                  </>
                                ) : (
                                  <div className="text-sm text-gray-500 italic">Prijs op aanvraag</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Clear Cart Button */}
              <div className="mt-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  Winkelwagen legen
                </button>
              </div>

              {/* Upsell Section - Anderen kochten ook */}
              {cartItems.length > 0 && suggestedProducts.length > 0 && (
                <div className="mt-8">
                  <div className="bg-gradient-to-r from-[#3bb13b] to-[#34a034] rounded-lg p-6 text-white mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={20} />
                      <h2 className="text-xl font-bold">Voeg deze populaire producten toe</h2>
                    </div>
                    <p className="text-green-50 text-sm">
                      Andere klanten kochten deze producten vaak samen met jouw bestelling
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {suggestedProducts.map((product) => {
                      const price = product.prijs || 0;
                      return (
                        <div
                          key={product.artikelcode}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                        >
                          <Link href={`/product/${product.artikelcode}`} className="block">
                            <div className="aspect-square bg-white relative overflow-hidden border border-gray-200">
                              {product.afbeelding ? (
                                <Image
                                  src={product.afbeelding}
                                  alt={product.artikelomschrijving || product.artikelcode}
                                  width={150}
                                  height={150}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag size={32} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                          </Link>
                          <div className="p-3">
                            <Link href={`/product/${product.artikelcode}`}>
                              <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 hover:text-[#3bb13b] transition-colors">
                                {product.wetenschappelijkeNaam || product.artikelomschrijving || product.artikelcode}
                              </h3>
                            </Link>
                            <div className="text-xs text-gray-500 mb-2 font-mono">
                              {product.artikelcode}
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              {price > 0 ? (
                                <span className="font-bold text-gray-900">€ {price.toFixed(2)}</span>
                              ) : (
                                <span className="text-xs text-gray-500 italic">Op aanvraag</span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleOpenAddToCartModal(product);
                              }}
                              className="w-full px-3 py-2 bg-[#3bb13b] text-white text-xs font-semibold rounded-lg hover:bg-[#34a034] transition-colors flex items-center justify-center gap-1"
                            >
                              <Plus size={14} />
                              Toevoegen
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bulk Order Incentive */}
              {totalPrice > 0 && totalPrice < 500 && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <TrendingUp className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900 mb-1">
                        Bestel voor €{Math.ceil(500 - totalPrice).toFixed(2)} meer en profiteer van bulk korting!
                      </h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Bij bestellingen boven €500 ontvang je automatisch extra korting op je volgende bestelling.
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((totalPrice / 500) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-600">
                        {Math.ceil((totalPrice / 500) * 100)}% van €500 bereikt
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Bestellingsoverzicht</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotaal</span>
                    <span className="font-medium">€ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>BTW</span>
                    <span className="font-medium">0% (Intracommunautaire levering)</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Totaal</span>
                      <span className="text-xl font-bold text-[#3bb13b]">€ {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full px-6 py-3 bg-[#3bb13b] text-white rounded-lg font-semibold text-center hover:bg-[#34a034] transition-colors mb-4"
                >
                  Naar afrekenen
                </Link>

                <button
                  onClick={handleGoBack}
                  className="block w-full px-6 py-3 text-gray-700 border border-gray-300 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
                >
                  Verder winkelen
                </button>
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
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseAddToCartModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Sluiten"
              >
                <X size={24} />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product toevoegen</h2>
                
                {/* Product Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex gap-4 relative">
                    {/* Product Image */}
                    <div 
                      className="w-24 h-24 flex-shrink-0 bg-white rounded-lg overflow-visible border border-gray-200 flex items-center justify-center cursor-pointer group"
                      onMouseEnter={() => addToCartModal.product.afbeelding && setHoveredImage(addToCartModal.product.afbeelding)}
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
                          {/* Hover enlarged image */}
                          {hoveredImage === addToCartModal.product.afbeelding && (
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-64 h-64 flex items-center justify-center">
                                <Image
                                  src={addToCartModal.product.afbeelding}
                                  alt={addToCartModal.product.artikelomschrijving || addToCartModal.product.artikelcode}
                                  width={256}
                                  height={256}
                                  className="w-full h-full object-contain"
                                  unoptimized
                                />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <ShoppingBag size={32} className="text-gray-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {addToCartModal.product.wetenschappelijkeNaam || addToCartModal.product.artikelomschrijving || addToCartModal.product.artikelcode}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-mono">{addToCartModal.product.artikelcode}</span>
                        {addToCartModal.product.potmaat && (
                          <span className="ml-2 px-2 py-1 bg-white rounded text-xs">
                            {addToCartModal.product.potmaat}
                          </span>
                        )}
                      </div>
                      {addToCartModal.product.prijs ? (
                        <div className="text-lg font-bold text-[#3bb13b]">
                          € {addToCartModal.product.prijs.toFixed(2)}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">Prijs op aanvraag</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aantal
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <button
                      onClick={() => handleModalQuantityChange(-1)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
                      disabled={addToCartModal.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={addToCartModal.product.voorraad !== undefined && addToCartModal.product.voorraad !== null ? addToCartModal.product.voorraad : undefined}
                      value={addToCartModal.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setAddToCartModal({
                          ...addToCartModal,
                          quantity: Math.max(1, value)
                        });
                      }}
                      className="w-20 text-center border-0 bg-transparent font-semibold text-lg focus:outline-none"
                    />
                    <button
                      onClick={() => handleModalQuantityChange(1)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
                      disabled={addToCartModal.product.voorraad !== undefined && addToCartModal.product.voorraad !== null && addToCartModal.quantity >= addToCartModal.product.voorraad}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {addToCartModal.product.verpakkingsinhoud && (
                    <span className="text-sm text-gray-600">
                      x{addToCartModal.product.verpakkingsinhoud}
                    </span>
                  )}
                </div>
              </div>

              {/* Total */}
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

              {/* Actions */}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Product verwijderen?</h3>
                  <p className="text-sm text-gray-600">
                    Weet je zeker dat je dit product uit je winkelwagen wilt verwijderen?
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
