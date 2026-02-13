'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (artikelcode: string) => void;
  updateQuantity: (artikelcode: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'straver-cart';

// Helper functie om cart items op te slaan in localStorage
function saveCartToStorage(items: CartItem[]) {
  try {
    // Sla alleen essentiële data op (geen volledige product objecten)
    const cartData = items.map(item => ({
      artikelcode: item.product.artikelcode,
      quantity: item.quantity,
      // Sla basis product info op voor fallback
      product: {
        artikelcode: item.product.artikelcode,
        artikelomschrijving: item.product.artikelomschrijving,
        prijs: item.product.prijs,
        afbeelding: item.product.afbeelding,
        potmaat: item.product.potmaat,
        verpakkingsinhoud: item.product.verpakkingsinhoud,
      }
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// Helper functie om cart items te laden uit localStorage
function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    
    const cartData = JSON.parse(stored);
    // Converteer terug naar CartItem format
    return cartData.map((item: any) => ({
      product: item.product as Product,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Laad cart uit localStorage bij mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      setCartItems(savedCart);
    }
    setIsLoaded(true);
  }, []);

  // Sla cart op in localStorage wanneer cartItems veranderen
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product.artikelcode);
      return;
    }

    // Check voorraad als beschikbaar
    if (product.voorraad !== undefined && product.voorraad !== null) {
      const currentQuantity = cartItems.find(
        item => item.product.artikelcode === product.artikelcode
      )?.quantity || 0;
      
      if (quantity > product.voorraad) {
        console.warn(`Niet genoeg voorraad voor ${product.artikelcode}. Beschikbaar: ${product.voorraad}`);
        // Limiteer tot beschikbare voorraad
        quantity = product.voorraad;
      }
    }

    // Check of product beschikbaar is
    if (product.beschikbaar === false) {
      console.warn(`Product ${product.artikelcode} is niet beschikbaar`);
      return;
    }

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.artikelcode === product.artikelcode
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          product: product, // Update product data (voor prijs updates)
          quantity: quantity,
        };
        return updatedItems;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (artikelcode: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.artikelcode !== artikelcode)
    );
  };

  const updateQuantity = (artikelcode: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(artikelcode);
      return;
    }

    // Check voorraad
    const cartItem = cartItems.find(item => item.product.artikelcode === artikelcode);
    if (cartItem && cartItem.product.voorraad !== undefined && cartItem.product.voorraad !== null) {
      if (quantity > cartItem.product.voorraad) {
        console.warn(`Niet genoeg voorraad. Beschikbaar: ${cartItem.product.voorraad}`);
        quantity = cartItem.product.voorraad;
      }
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.artikelcode === artikelcode
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.prijs || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
