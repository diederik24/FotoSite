'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '@/lib/types';
import LazyImage from './LazyImage';
import { Heart, Package, Ruler, Plus, Trash2, X, AlertTriangle } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useFavorites } from '@/lib/FavoritesContext';
import { useLanguage } from '@/lib/LanguageContext';
import Toast from './Toast';
import ImageModal from './ImageModal';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [quantity, setQuantity] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const { addToCart, cartItems, removeFromCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { t } = useLanguage();
  
  const favoriteStatus = isFavorite(product.artikelcode);
  
  // Check if product is in cart and get its quantity
  const cartItem = cartItems.find(item => item.product.artikelcode === product.artikelcode);
  const isInCart = cartItem !== undefined;
  const cartQuantity = cartItem?.quantity || 0;

  // Sync local quantity with cart quantity
  useEffect(() => {
    if (isInCart) {
      setQuantity(cartQuantity);
    }
  }, [isInCart, cartQuantity]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favoriteStatus) {
      removeFromFavorites(product.artikelcode);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    addToCart(product, newQuantity);
    setShowToast(true);
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRemoveConfirm(true);
  };

  const confirmRemoveFromCart = () => {
    removeFromCart(product.artikelcode);
    setQuantity(0);
    setShowRemoveConfirm(false);
  };

  const cancelRemoveFromCart = () => {
    setShowRemoveConfirm(false);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Selecteer alleen als de waarde 0 is, anders laat de cursor staan
    if (e.target.value === '0' || e.target.value === '') {
      e.target.select();
    }
  };

  const handleQuantityClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Selecteer alleen als de waarde 0 is, anders laat de cursor staan
    const target = e.currentTarget;
    if (target.value === '0' || target.value === '') {
      if (e.detail === 1) {
        setTimeout(() => {
          if (target && document.activeElement === target) {
            target.select();
          }
        }, 0);
      }
    }
  };

  const handleQuantityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseInt(e.target.value) || 0;
    const finalQuantity = Math.max(0, value);
    setQuantity(finalQuantity);
    
    // Voeg automatisch toe aan winkelwagen als quantity > 0
    if (finalQuantity > 0) {
      addToCart(product, finalQuantity);
      setShowToast(true);
    }
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      const value = parseInt(e.currentTarget.value) || 0;
      const finalQuantity = Math.max(0, value);
      setQuantity(finalQuantity);
      
      // Voeg automatisch toe aan winkelwagen als quantity > 0
      if (finalQuantity > 0) {
        addToCart(product, finalQuantity);
        setShowToast(true);
      }
      
      // Blur het input veld
      e.currentTarget.blur();
    }
  };

  // Extract height from potmaat or use default
  const extractHeight = (potmaat: string) => {
    const match = potmaat.match(/(\d+)\s*cm/i);
    return match ? match[1] : '30';
  };

  const height = product.potmaat ? extractHeight(product.potmaat) : '30';
  const verpakkingsinhoud = product.verpakkingsinhoud || '1';

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Alleen openen als je niet op de favorite button klikt
    if ((e.target as HTMLElement).closest('.product-card-favorite')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (product.afbeelding) {
      setIsImageModalOpen(true);
    }
  };

  return (
    <div className="product-card">
      <div 
        className="product-card-image" 
        onClick={handleImageClick} 
        style={{ cursor: product.afbeelding ? 'pointer' : 'default' }}
        role={product.afbeelding ? 'button' : undefined}
        tabIndex={product.afbeelding ? 0 : undefined}
        onKeyDown={(e) => {
          if (product.afbeelding && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsImageModalOpen(true);
          }
        }}
      >
        {product.afbeelding ? (
          <LazyImage
            src={product.afbeelding}
            alt={product.artikelomschrijving || product.artikelcode}
            width={280}
            height={180}
            className="w-full h-full"
            priority={priority}
          />
        ) : (
          <div className="product-card-image-placeholder w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <span>Geen afbeelding</span>
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          className="product-card-favorite"
          aria-label="Add to favorites"
        >
          <Heart 
            size={20} 
            fill={favoriteStatus ? 'white' : 'none'} 
            stroke="white"
            strokeWidth={2}
          />
        </button>
      </div>
      <div className="product-card-info">
        <div className="product-card-header-row">
          <div className="product-card-plantsize">
            <span>{t('product.plantsize')} {height}cm</span>
          </div>
          
          {product.categorie && (
            <div className="product-card-category">
              {product.categorie}
            </div>
          )}
        </div>

        <Link href={`/product/${product.artikelcode}`} className="product-card-title">
          {product.wetenschappelijkeNaam || product.artikelomschrijving || 'Geen omschrijving'}
        </Link>

        <div className="product-card-specs">
          {product.potmaat && (
            <div className="product-card-spec-item">
              <Package size={16} />
              <span>{product.potmaat}</span>
            </div>
          )}
          <div className="product-card-spec-item">
            <Ruler size={16} />
            <span>{height}cm</span>
          </div>
        </div>

        <div className="product-card-price-section">
          <div 
            className={`product-card-quantity-price ${isInCart ? 'in-cart' : ''}`}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              // Als je klikt op het linker deel (niet op suffix of prijs), focus het input veld
              if (!target.closest('.product-card-quantity-suffix') && 
                  !target.closest('.product-card-price') && 
                  !target.closest('.product-card-remove-button')) {
                const input = e.currentTarget.querySelector('.product-card-quantity-input') as HTMLInputElement;
                if (input) {
                  input.focus();
                }
              }
            }}
          >
            {isInCart && (
              <button
                onClick={handleRemoveFromCart}
                className="product-card-remove-button"
                aria-label="Remove from cart"
              >
                <Trash2 size={16} />
              </button>
            )}
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={handleQuantityChange}
              onFocus={handleQuantityFocus}
              onClick={handleQuantityClick}
              onBlur={handleQuantityBlur}
              onKeyDown={handleQuantityKeyDown}
              className="product-card-quantity-input"
              aria-label="Quantity"
            />
            <span className="product-card-quantity-suffix">x{verpakkingsinhoud}</span>
            <span className="product-card-price">
              {product.prijs ? `€ ${product.prijs.toFixed(2)}` : 'Prijs op aanvraag'}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="product-card-add-button"
            aria-label="Add to cart"
          >
            <Plus size={20} />
          </button>
        </div>

        {product.prijs && (
          <div className="product-card-bulk-pricing">
            <div className="product-card-bulk-item">
              <span>36x1 {t('bulk.shelf')} € {product.prijs.toFixed(2)}</span>
              <button onClick={() => {
                const bulkQuantity = 36;
                setQuantity(bulkQuantity);
                addToCart(product, bulkQuantity);
                setShowToast(true);
              }} className="product-card-bulk-add">
                <Plus size={12} />
              </button>
            </div>
            <div className="product-card-bulk-item">
              <span>216x1 {t('bulk.trolley')} € {product.prijs.toFixed(2)}</span>
              <button onClick={() => {
                const bulkQuantity = 216;
                setQuantity(bulkQuantity);
                addToCart(product, bulkQuantity);
                setShowToast(true);
              }} className="product-card-bulk-add">
                <Plus size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
      <Toast
        message={`${product.artikelomschrijving || product.artikelcode} ${t('cart.added')}`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      {product.afbeelding && (
        <ImageModal
          src={product.afbeelding}
          alt={product.artikelomschrijving || product.artikelcode}
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          product={product}
        />
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
          onClick={cancelRemoveFromCart}
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
                onClick={cancelRemoveFromCart}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Sluiten"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <p className="font-semibold text-gray-900">
                {product.wetenschappelijkeNaam || product.artikelomschrijving || product.artikelcode}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-mono">{product.artikelcode}</p>
              {product.potmaat && (
                <p className="text-xs text-gray-500 mt-1">{product.potmaat}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelRemoveFromCart}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={confirmRemoveFromCart}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Verwijderen
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

