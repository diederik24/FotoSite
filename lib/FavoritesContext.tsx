'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './types';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (artikelcode: string) => void;
  isFavorite: (artikelcode: string) => boolean;
  getTotalFavorites: () => number;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = 'straver-favorites';

// Helper functie om favorieten op te slaan in localStorage
function saveFavoritesToStorage(products: Product[]) {
  try {
    const favoritesData = products.map(product => ({
      artikelcode: product.artikelcode,
      artikelomschrijving: product.artikelomschrijving,
      afbeelding: product.afbeelding,
      potmaat: product.potmaat,
      verpakkingsinhoud: product.verpakkingsinhoud,
      wetenschappelijkeNaam: product.wetenschappelijkeNaam,
      prijs: product.prijs,
      voorraad: product.voorraad,
      beschikbaar: product.beschikbaar,
    }));
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesData));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}

// Helper functie om favorieten te laden uit localStorage
function loadFavoritesFromStorage(): Product[] {
  try {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return [];
    
    const favoritesData = JSON.parse(stored);
    return favoritesData.map((item: any) => ({
      artikelcode: item.artikelcode,
      artikelomschrijving: item.artikelomschrijving,
      afbeelding: item.afbeelding,
      potmaat: item.potmaat,
      verpakkingsinhoud: item.verpakkingsinhoud,
      wetenschappelijkeNaam: item.wetenschappelijkeNaam,
      prijs: item.prijs,
      voorraad: item.voorraad,
      beschikbaar: item.beschikbaar,
    }));
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      return loadFavoritesFromStorage();
    }
    return [];
  });

  // Sla favorieten op wanneer ze veranderen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveFavoritesToStorage(favorites);
    }
  }, [favorites]);

  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      // Check of product al in favorieten zit
      if (prev.some(item => item.artikelcode === product.artikelcode)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (artikelcode: string) => {
    setFavorites(prev => prev.filter(item => item.artikelcode !== artikelcode));
  };

  const isFavorite = (artikelcode: string) => {
    return favorites.some(item => item.artikelcode === artikelcode);
  };

  const getTotalFavorites = () => {
    return favorites.length;
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getTotalFavorites,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
