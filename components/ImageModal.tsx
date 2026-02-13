'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/CartContext';
import { useLanguage } from '@/lib/LanguageContext';
import { Plus, Trash2 } from 'lucide-react';

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

function Lightbox({ src, alt, onClose, product }: { src: string; alt: string; onClose: () => void; product?: Product }) {
  const { addToCart, cartItems, removeFromCart } = useCart();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(0);

  // Check if product is in cart
  const cartItem = product ? cartItems.find(item => item.product.artikelcode === product.artikelcode) : null;
  const isInCart = cartItem !== undefined;
  const cartQuantity = cartItem?.quantity || 0;

  // Sync local quantity with cart quantity
  useEffect(() => {
    if (isInCart && product) {
      setQuantity(cartQuantity);
    }
  }, [isInCart, cartQuantity, product]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
    }
  };

  const handleRemoveFromCart = () => {
    if (product) {
      removeFromCart(product.artikelcode);
      setQuantity(0);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(Math.max(0, value));
  };

  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleQuantityClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  const handleQuantityBlur = () => {
    if (quantity > 0 && product) {
      addToCart(product, quantity);
    }
  };

  // Extract height from potmaat
  const extractHeight = (potmaat: string) => {
    const match = potmaat?.match(/(\d+)\s*cm/i);
    return match ? match[1] : '30';
  };

  const height = product?.potmaat ? extractHeight(product.potmaat) : '30';
  const verpakkingsinhoud = product?.verpakkingsinhoud || '1';
  // Sluit modal met Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        cursor: 'pointer',
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`lightbox-container ${product ? 'lightbox-with-panels' : 'lightbox-image-only'}`}
        style={{
          cursor: 'default'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -12,
            right: -12,
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: '#32B336',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease',
            zIndex: 100000
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#2a9a2d';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#32B336';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          aria-label="Sluiten"
        >
          ✕
        </button>

        {/* Linker paneel - Product info */}
        {product && (
          <div className="lightbox-panel lightbox-panel-left">
            <h2 className="lightbox-product-name">
              {product.wetenschappelijkeNaam || product.artikelomschrijving || 'Geen omschrijving'}
            </h2>
            <div className="lightbox-info-item">
              <span className="lightbox-label">Artikelnummer:</span>
              <span className="lightbox-value">{product.artikelcode}</span>
            </div>
            <div className="lightbox-info-item">
              <span className="lightbox-label">Categorie:</span>
              <span className="lightbox-value">{t('category.shrubs')}</span>
            </div>
          </div>
        )}

        {/* Midden - Productafbeelding */}
        <div className="lightbox-image-container">
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '90vh',
              background: '#fff',
              padding: 8,
              borderRadius: 8,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              objectFit: 'contain'
            }}
          />
        </div>

        {/* Rechter paneel - Bestelinformatie */}
        {product && (
          <div className="lightbox-panel lightbox-panel-right">
            <div className="lightbox-info-item">
              <span className="lightbox-label">Potmaat:</span>
              <span className="lightbox-value">{product.potmaat || 'N/A'}</span>
            </div>
            <div className="lightbox-info-item">
              <span className="lightbox-label">Hoogte:</span>
              <span className="lightbox-value">{height}cm</span>
            </div>
            <div className="lightbox-info-item">
              <span className="lightbox-label">Beschikbaarheid:</span>
              <span className="lightbox-value" style={{ color: '#32B336', fontWeight: 600 }}>Op voorraad</span>
            </div>
            <div className="lightbox-info-item">
              <span className="lightbox-label">Prijs:</span>
              <span className="lightbox-value" style={{ fontSize: '18px', fontWeight: 700, color: '#32B336' }}>€ 2.86</span>
            </div>
            
            <div className="lightbox-order-section">
              <div className="lightbox-quantity-control">
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={handleQuantityChange}
                  onFocus={handleQuantityFocus}
                  onClick={handleQuantityClick}
                  onBlur={handleQuantityBlur}
                  className="lightbox-quantity-input"
                  placeholder="0"
                />
                <span className="lightbox-quantity-suffix">x{verpakkingsinhoud}</span>
              </div>
              <button
                onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
                className={`lightbox-add-button ${isInCart ? 'lightbox-remove-button' : ''}`}
                disabled={quantity === 0 && !isInCart}
              >
                {isInCart ? <Trash2 size={20} /> : <Plus size={20} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ImageModal({ src, alt, isOpen, onClose, product }: ImageModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <Lightbox src={src} alt={alt} onClose={onClose} product={product} />,
    document.body
  );
}
