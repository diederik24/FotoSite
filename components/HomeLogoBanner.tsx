'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageContext';

export default function HomeLogoBanner() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isB2BPage = pathname === '/b2b';

  useEffect(() => {
    // Op B2B pagina altijd wit (scrolled)
    if (isB2BPage) {
      setIsScrolled(true);
      return;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0dd9582d-b5e3-4551-a1e3-4b3bb3b65520',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeLogoBanner.tsx:15',message:'Scroll listener setup started',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldBeScrolled = scrollPosition > 50;
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/0dd9582d-b5e3-4551-a1e3-4b3bb3b65520',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeLogoBanner.tsx:18',message:'Scroll event fired',data:{scrollPosition,shouldBeScrolled,currentIsScrolled:isScrolled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      setIsScrolled(shouldBeScrolled);
    };

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0dd9582d-b5e3-4551-a1e3-4b3bb3b65520',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeLogoBanner.tsx:26',message:'Adding scroll listener',data:{windowScrollY:window.scrollY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    window.addEventListener('scroll', handleScroll);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0dd9582d-b5e3-4551-a1e3-4b3bb3b65520',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeLogoBanner.tsx:30',message:'Initial scroll check',data:{initialScrollY:window.scrollY,initialIsScrolled:window.scrollY > 50},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion

    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isB2BPage]);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/0dd9582d-b5e3-4551-a1e3-4b3bb3b65520',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeLogoBanner.tsx:42',message:'isScrolled state changed',data:{isScrolled,className:`home-logo-banner ${isScrolled ? 'scrolled' : ''}`},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  }, [isScrolled]);
  // #endregion

  const bannerRef = useRef<HTMLDivElement>(null);

  // #region agent log
  useEffect(() => {
    if (bannerRef.current) {
      const element = bannerRef.current;
      const computedStyle = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      fetch('http://127.0.0.1:7242/ingest/0dd9582d-b5e3-4551-a1e3-4b3bb3b65520',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeLogoBanner.tsx:50',message:'DOM element state check',data:{className:element.className,hasScrolledClass:element.classList.contains('scrolled'),computedBackground:computedStyle.backgroundColor,computedColor:computedStyle.color,computedZIndex:computedStyle.zIndex,computedPosition:computedStyle.position,computedTop:computedStyle.top,elementTop:rect.top,elementHeight:rect.height,isScrolled,windowScrollY:window.scrollY},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
      
      // Check again after a short delay to see if CSS transition completes
      setTimeout(() => {
        const computedStyleAfter = window.getComputedStyle(element);
        const rectAfter = element.getBoundingClientRect();
        fetch('http://127.0.0.1:7242/ingest/0dd9582d-b5e3-4551-a1e3-4b3bb3b65520',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeLogoBanner.tsx:58',message:'DOM element state check after delay',data:{className:element.className,hasScrolledClass:element.classList.contains('scrolled'),computedBackground:computedStyleAfter.backgroundColor,computedColor:computedStyleAfter.color,elementTop:rectAfter.top,elementHeight:rectAfter.height,isScrolled},timestamp:Date.now(),sessionId:'debug-session',runId:'run2',hypothesisId:'D'})}).catch(()=>{});
      }, 350);
    }
  }, [isScrolled]);
  // #endregion

  return (
    <div ref={bannerRef} className={`home-logo-banner ${isScrolled ? 'scrolled' : ''}`}>
      <div className="home-logo-banner-container">
        {/* Logo Section - Left with diagonal cut */}
        <Link href="/" className="home-logo-section">
          <Image 
            src="/Logo Links BOven .png" 
            alt="Straver Pflanzen Export" 
            width={220} 
            height={66}
            className="home-logo-image"
            priority
          />
        </Link>

        {/* Navigation Links - Center */}
        <nav className="home-nav-links">
          <Link 
            href="/" 
            className={`home-nav-link ${pathname === '/' ? 'home-nav-link-active' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/info" 
            className={`home-nav-link ${pathname === '/info' ? 'home-nav-link-active' : ''}`}
          >
            Ons verhaal
          </Link>
          <Link 
            href="/contact" 
            className={`home-nav-link ${pathname === '/contact' ? 'home-nav-link-active' : ''}`}
          >
            Werken bij
          </Link>
          <Link 
            href="/contact" 
            className={`home-nav-link ${pathname === '/contact' ? 'home-nav-link-active' : ''}`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Side - Language & Webshop */}
        <div className="home-nav-right">
          <HomeLanguageSwitcher />
          <Link href="/catalogus" className="home-webshop-button">
            Webshop
            <span className="home-webshop-icon"></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="home-mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="home-mobile-menu">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="home-mobile-nav-link">
            Home
          </Link>
          <Link href="/info" onClick={() => setIsMobileMenuOpen(false)} className="home-mobile-nav-link">
            Ons verhaal
          </Link>
          <Link href="/b2b" onClick={() => setIsMobileMenuOpen(false)} className="home-mobile-nav-link">
            Werken bij
          </Link>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="home-mobile-nav-link">
            Contact
          </Link>
          <Link href="/catalogus" onClick={() => setIsMobileMenuOpen(false)} className="home-mobile-webshop-button">
            Webshop
          </Link>
        </div>
      )}
    </div>
  );
}


function HomeLanguageSwitcher() {
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
    <div className="home-language-switcher" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="home-language-button"
        aria-label="Select language"
      >
        <Image 
          src={currentLang.flag} 
          alt={currentLang.name}
          width={20}
          height={15}
          className="home-language-flag"
        />
        <span className="home-language-text">{currentLang.name}</span>
        <ChevronDown size={14} className={`home-language-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="home-language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`home-language-option ${language === lang.code ? 'active' : ''}`}
              aria-label={lang.name}
            >
              <Image 
                src={lang.flag} 
                alt={lang.name}
                width={20}
                height={15}
                className="home-language-flag"
              />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
