'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const languages = [
    { code: 'nl' as const, name: 'Nederlands', flag: '/NL Vlag.png' },
    { code: 'de' as const, name: 'Deutsch', flag: '/DE Vlag.png' },
  ];

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-switcher-button"
        aria-label="Select language"
      >
        <div className="language-flag">
          <Image 
            src={currentLang.flag} 
            alt={currentLang.name}
            width={20}
            height={15}
            className="language-flag-image"
          />
        </div>
        <ChevronDown size={14} className={`language-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              aria-label={lang.name}
            >
              <div className="language-flag">
                <Image 
                  src={lang.flag} 
                  alt={lang.name}
                  width={24}
                  height={18}
                  className="language-flag-image"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
