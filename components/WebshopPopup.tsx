'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WebshopPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check of de popup al eerder is gesloten (localStorage)
    const hasSeenPopup = localStorage.getItem('webshop-popup-closed');
    
    if (!hasSeenPopup) {
      // Toon popup na een korte delay voor betere UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Sla op dat de popup is gesloten
    localStorage.setItem('webshop-popup-closed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="webshop-popup-overlay" onClick={handleClose}>
      <div className="webshop-popup" onClick={(e) => e.stopPropagation()}>
        <button 
          className="webshop-popup-close" 
          onClick={handleClose}
          aria-label="Sluiten"
        >
          <X size={24} />
        </button>
        <div className="webshop-popup-container">
          {/* Left side - Image/Preview */}
          <div className="webshop-popup-image">
            <div className="webshop-popup-laptop">
              <Image
                src="/Artikel Fotos/fruitbomen-planten-header.jpg"
                alt="Nieuwe webshop preview"
                fill
                className="webshop-popup-preview"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="webshop-popup-content">
            <div className="webshop-popup-badge">NIEUW!</div>
            <h2 className="webshop-popup-title">Onze nieuwe webshop</h2>
            <p className="webshop-popup-quote">
              &quot;Van jarenlange expertise naar digitale innovatie - ontdek het nieuwe tijdperk van online planten bestellen.&quot;
            </p>
            <Link 
              href="/catalogus" 
              className="webshop-popup-button"
              onClick={handleClose}
            >
              Bekijk webshop
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
