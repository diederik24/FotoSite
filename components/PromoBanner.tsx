'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PromoBanner() {
  const deal = {
    title: 'Ontdek Ons Assortiment',
    link: '/catalogus',
    buttonText: 'Shop fruit deals',
  };

  return (
    <div className="promo-banner-container">
      <div className="promo-banner">
        <Image
          src="/Artikel Fotos/fruitbomen-planten-header.jpg"
          alt="Fruit Deals"
          fill
          className="promo-banner-image"
          priority
          style={{ objectFit: 'cover' }}
        />
        
        <div className="promo-banner-logo">
          <Image
            src="/Logo Links BOven .png"
            alt="Straver Pflanzen Export"
            width={180}
            height={54}
            className="promo-logo-image"
            priority
          />
        </div>
        
        <div className="promo-banner-title">{deal.title}</div>
        
        {deal.link && deal.buttonText && (
          <Link href={deal.link} className="promo-banner-button">
            {deal.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}
