'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'nl' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  nl: {
    'nav.home': 'Home',
    'nav.catalog': 'Catalogus',
    'nav.about': 'Over Ons',
    'nav.projects': 'Projecten',
    'nav.contact': 'Contact',
    'search.placeholder': 'Zoek artikelen...',
    'search.button': 'Zoeken',
    'products.found': 'artikelen gevonden',
    'cart.added': 'toegevoegd aan winkelwagen',
    'category.shrubs': 'Shrubs',
    'product.plantsize': 'Plantsize',
    'results.info': 'artikelen gevonden',
    'results.no-results': 'Geen artikelen gevonden. Probeer een andere zoekterm.',
    'bulk.shelf': 'shelf',
    'bulk.trolley': 'trolley',
    'bulk.packing': 'packing',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.catalog': 'Katalog',
    'nav.about': 'Über uns',
    'nav.projects': 'Projekte',
    'nav.contact': 'Kontakt',
    'search.placeholder': 'Artikel suchen...',
    'search.button': 'Suchen',
    'products.found': 'Artikel gefunden',
    'cart.added': 'zum Warenkorb hinzugefügt',
    'category.shrubs': 'Sträucher',
    'product.plantsize': 'Pflanzengröße',
    'results.info': 'Artikel gefunden',
    'results.no-results': 'Keine Artikel gefunden. Versuchen Sie einen anderen Suchbegriff.',
    'bulk.shelf': 'Regal',
    'bulk.trolley': 'Wagen',
    'bulk.packing': 'Verpackung',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'nl' || savedLang === 'de')) {
      setLanguageState(savedLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = savedLang;
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.nl] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
