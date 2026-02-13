'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/lib/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

function CartSidebar({ isOpen, onClose }: CartProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = (artikelcode: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(artikelcode);
    } else {
      updateQuantity(artikelcode, newQuantity);
    }
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`cart-overlay ${isAnimating ? 'cart-overlay-open' : ''}`}
        onClick={onClose}
      />
      <div className={`cart-sidebar ${isAnimating ? 'cart-sidebar-open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-content">
            <h2 className="cart-title">Winkelwagen</h2>
            <span className="cart-item-count">({totalItems} {totalItems === 1 ? 'artikel' : 'artikelen'})</span>
          </div>
          <button
            onClick={onClose}
            className="cart-close-btn"
            aria-label="Sluiten"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={64} className="cart-empty-icon" />
              <h3 className="cart-empty-title">Je winkelwagen is leeg</h3>
              <p className="cart-empty-text">Voeg producten toe om verder te gaan</p>
              <Link href="/" onClick={onClose} className="cart-empty-button">
                Verder winkelen
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => {
                  const price = item.product.prijs || 0;
                  const itemTotal = price * item.quantity;
                  const isOutOfStock = item.product.voorraad !== undefined && item.product.voorraad !== null && item.quantity > item.product.voorraad;
                  
                  return (
                    <div key={item.product.artikelcode} className="cart-item">
                      <div className="cart-item-image">
                        {item.product.afbeelding ? (
                          <Image
                            src={item.product.afbeelding}
                            alt={item.product.artikelomschrijving || item.product.artikelcode}
                            width={80}
                            height={80}
                            className="cart-item-img"
                            unoptimized
                          />
                        ) : (
                          <div className="cart-item-placeholder">
                            <ShoppingBag size={24} />
                          </div>
                        )}
                      </div>

                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <h3 className="cart-item-name">
                            {item.product.wetenschappelijkeNaam || item.product.artikelomschrijving || item.product.artikelcode}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.product.artikelcode)}
                            className="cart-item-remove"
                            aria-label="Verwijderen"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="cart-item-info">
                          <span className="cart-item-code">{item.product.artikelcode}</span>
                          {item.product.potmaat && (
                            <span className="cart-item-spec">{item.product.potmaat}</span>
                          )}
                          {isOutOfStock && (
                            <span className="cart-item-stock out-of-stock">
                              Niet genoeg voorraad beschikbaar
                            </span>
                          )}
                        </div>

                        <div className="cart-item-footer">
                          <div className="cart-item-quantity">
                            <button
                              onClick={() => handleQuantityChange(item.product.artikelcode, item.quantity - 1)}
                              className="cart-quantity-btn"
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
                              className="cart-quantity-input"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.product.artikelcode, item.quantity + 1)}
                              className="cart-quantity-btn"
                              aria-label="Verhoog"
                              disabled={item.product.voorraad !== undefined && item.product.voorraad !== null && item.quantity >= item.product.voorraad}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="cart-item-price">
                            {price > 0 ? (
                              <>
                                <span className="cart-item-price-unit">€ {price.toFixed(2)}</span>
                                <span className="cart-item-price-total">€ {itemTotal.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="cart-item-price-no-price">Prijs op aanvraag</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Subtotaal</span>
                  <span className="cart-summary-value">€ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">BTW</span>
                  <span className="cart-summary-value">0% (Intracommunautaire levering)</span>
                </div>
                <div className="cart-summary-divider"></div>
                <div className="cart-summary-row cart-summary-total">
                  <span className="cart-summary-label">Totaal</span>
                  <span className="cart-summary-value">€ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Cart Actions */}
              <div className="cart-actions">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="cart-checkout-btn"
                >
                  Naar afrekenen
                </Link>
                <Link
                  href="/winkelwagen"
                  onClick={onClose}
                  className="cart-view-full-btn"
                >
                  Volledige winkelwagen bekijken
                </Link>
                <button
                  onClick={clearCart}
                  className="cart-clear-btn"
                >
                  Winkelwagen legen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function Cart({ isOpen, onClose }: CartProps) {
  if (!isOpen) return null;

  return createPortal(
    <CartSidebar isOpen={isOpen} onClose={onClose} />,
    document.body
  );
}
