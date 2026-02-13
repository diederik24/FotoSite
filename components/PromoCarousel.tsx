'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  link?: string;
  textOverlay?: string;
}

const promoSlides: PromoSlide[] = [
  {
    id: '1',
    title: 'Tot 40% korting*',
    subtitle: 'op fruitbomen',
    image: '/Buxus_cat.JPG.jpeg',
    badge: 'Tot 40% korting',
    link: '/catalogus',
    textOverlay: 'Buxus',
  },
  {
    id: '2',
    title: 'Tot 50% korting*',
    subtitle: 'op bessenstruiken',
    image: '/Agapanthus_cat.PNG',
    badge: 'Tot 50% korting',
    link: '/catalogus',
    textOverlay: 'Agapanthus',
  },
  {
    id: '3',
    title: '2+1 gratis',
    subtitle: 'op appelbomen',
    image: '/Acer_cat.JPG.jpeg',
    badge: '2+1 gratis',
    link: '/catalogus',
    textOverlay: 'Acer',
  },
  {
    id: '4',
    title: 'Speciale aanbieding',
    subtitle: 'op planten',
    image: '/ChatGPT Image 1 feb 2026, 10_42_46.png',
    badge: 'Aanbieding',
    link: '/catalogus',
    textOverlay: 'Fargesia',
  },
  {
    id: '5',
    title: '',
    subtitle: '',
    image: '/Camellia_cat.png',
    link: '/catalogus',
    textOverlay: 'Camellia',
  },
  {
    id: '6',
    title: '',
    subtitle: '',
    image: '/Hydrangea_cat.png',
    link: '/catalogus',
    textOverlay: 'Hydrangea',
  },
  {
    id: '7',
    title: '',
    subtitle: '',
    image: '/Helloborus_cat.png',
    link: '/catalogus',
    textOverlay: 'Helleborus',
  },
  {
    id: '8',
    title: '',
    subtitle: '',
    image: '/ChatGPT Image 1 feb 2026, 11_11_50.png',
    link: '/catalogus',
    textOverlay: 'Carex',
  },
  {
    id: '9',
    title: '',
    subtitle: '',
    image: '/Fruit cat3.png',
    link: '/catalogus',
    textOverlay: 'Fruit',
  },
  {
    id: '10',
    title: '',
    subtitle: '',
    image: '/ChatGPT Image 31 jan 2026, 17_10_37-Photoroom.png',
    link: '/catalogus',
  },
  {
    id: '11',
    title: '',
    subtitle: '',
    image: '/ChatGPT Image 31 jan 2026, 17_17_40.png',
    link: '/catalogus',
  },
  {
    id: '12',
    title: '',
    subtitle: '',
    image: '/ChatGPT Image 31 jan 2026, 17_10_37.png',
    link: '/catalogus',
  },
];

export default function PromoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Helper functie om te checken of een slide de speciale styling moet hebben
  const hasSpecialStyling = (slideId: string) => {
    return ['5', '6', '7', '9', '10', '11', '12'].includes(slideId);
  };

  const scrollBySlides = (direction: 'prev' | 'next') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstSlide = container.querySelector('.promo-carousel-slide') as HTMLElement;
      
      if (!firstSlide) return;
      
      const slideWidth = firstSlide.offsetWidth + 20; // Breedte van 1 kaart + gap
      const scrollAmount = slideWidth * 4; // Scroll precies 4 kaarten tegelijk
      
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      // Rond de huidige scroll positie af naar het dichtstbijzijnde veelvoud van 4 kaarten
      const currentIndex = Math.round(currentScroll / slideWidth);
      const currentGroupIndex = Math.floor(currentIndex / 4);
      
      let newGroupIndex: number;
      
      if (direction === 'next') {
        // Ga naar de volgende groep van 4 kaarten
        newGroupIndex = currentGroupIndex + 1;
        const totalGroups = Math.ceil(promoSlides.length / 4);
        // Als we voorbij het einde gaan, ga terug naar het begin
        if (newGroupIndex >= totalGroups) {
          newGroupIndex = 0;
        }
      } else {
        // Ga naar de vorige groep van 4 kaarten
        newGroupIndex = currentGroupIndex - 1;
        const totalGroups = Math.ceil(promoSlides.length / 4);
        // Als we voorbij het begin gaan, ga naar het einde
        if (newGroupIndex < 0) {
          newGroupIndex = totalGroups - 1;
        }
      }
      
      // Bereken de nieuwe scroll positie op basis van de groep index
      const newScroll = newGroupIndex * scrollAmount;
      
      container.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });
      
      // Update currentIndex
      const newIndex = newGroupIndex * 4;
      setCurrentIndex(Math.min(newIndex, promoSlides.length - 1));
    }
  };

  const handlePrev = () => {
    scrollBySlides('prev');
  };

  const handleNext = () => {
    scrollBySlides('next');
  };

  return (
    <div className="promo-carousel-container">
      <div className="promo-carousel-wrapper">
        <button 
          className="promo-carousel-arrow promo-carousel-arrow-left"
          onClick={handlePrev}
          aria-label="Vorige slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="promo-carousel" ref={scrollContainerRef}>
          {promoSlides.map((slide) => (
            <div key={slide.id} className="promo-carousel-slide">
              {slide.link ? (
                <Link href={slide.link} className="promo-slide-link">
                  <div 
                    className="promo-slide-content"
                    style={hasSpecialStyling(slide.id) ? { background: 'white' } : {}}
                  >
                    {slide.image && (
                      <div 
                        className="promo-slide-image"
                        style={hasSpecialStyling(slide.id) ? { backgroundColor: 'white' } : {}}
                      >
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="promo-slide-img"
                          style={{ 
                            objectFit: hasSpecialStyling(slide.id) ? 'contain' : 'cover', 
                            objectPosition: 'center center',
                            transform: slide.id === '5' ? 'scale(1.1)' : (slide.id === '9' ? 'scale(1.3)' : (hasSpecialStyling(slide.id) ? 'scale(0.85)' : 'none')),
                            maxWidth: hasSpecialStyling(slide.id) ? '100%' : 'none',
                            maxHeight: hasSpecialStyling(slide.id) ? '100%' : 'none'
                          }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="promo-slide-overlay"></div>
                      </div>
                    )}
                    {slide.textOverlay && (
                      <div className="promo-slide-text-overlay">
                        {slide.textOverlay}
                      </div>
                    )}
                    <div className="promo-slide-arrow">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </Link>
              ) : (
                <div 
                  className="promo-slide-content"
                  style={hasSpecialStyling(slide.id) ? { background: 'white' } : {}}
                >
                  {slide.image && (
                    <div 
                      className="promo-slide-image"
                      style={hasSpecialStyling(slide.id) ? { backgroundColor: 'white' } : {}}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="promo-slide-img"
                        style={{ 
                          objectFit: hasSpecialStyling(slide.id) ? 'contain' : 'cover', 
                          objectPosition: 'center center',
                          transform: slide.id === '5' ? 'scale(1.1)' : (slide.id === '9' ? 'scale(1.0)' : (hasSpecialStyling(slide.id) ? 'scale(0.85)' : 'none')),
                          maxWidth: hasSpecialStyling(slide.id) ? '100%' : 'none',
                          maxHeight: hasSpecialStyling(slide.id) ? '100%' : 'none'
                        }}
                      />
                      <div className="promo-slide-overlay"></div>
                    </div>
                  )}
                  {slide.textOverlay && (
                    <div className="promo-slide-text-overlay">
                      {slide.textOverlay}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          className="promo-carousel-arrow promo-carousel-arrow-right"
          onClick={handleNext}
          aria-label="Volgende slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
