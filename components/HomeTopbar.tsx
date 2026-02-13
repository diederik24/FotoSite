'use client';

import { Package, Grid, Headphones, Layers } from 'lucide-react';

const StarCheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z"></path>
  </svg>
);

// Optie 1: Focus op traditie + moderniteit
// const topbarItems = [
//   { icon: Package, text: '7000+ wisselende artikelen in ons assortiment' },
//   { icon: Grid, text: 'Al 50+ jaar in planten • Nu ook online' },
//   { icon: Headphones, text: 'Bewezen kwaliteit • Nieuw digitaal tijdperk' },
//   { icon: Layers, text: 'Generaties ervaring • Moderne online webshop' },
// ];

// Optie 2: Meer impactvol
// const topbarItems = [
//   { icon: Package, text: '7000+ artikelen • Elke week nieuwe aanvoer' },
//   { icon: Grid, text: 'Decennia expertise • Nu volledig digitaal' },
//   { icon: Headphones, text: 'Vertrouwde naam • Innovatieve webshop' },
//   { icon: Layers, text: 'Van traditie naar technologie • Online bestellen' },
// ];

// Optie 3: Kort en krachtig
const topbarItems = [
  { icon: Package, text: '7000+ wisselende artikelen' },
  { icon: Grid, text: 'Grote variatie voor uw assortiment' },
  { icon: StarCheckIcon, text: 'Jarenlange ervaring • Nieuw online tijdperk' },
  { icon: Layers, text: 'Van plantenkennis naar digitale innovatie' },
];

export default function HomeTopbar() {
  return (
    <div className="home-topbar">
      <div className="home-topbar-scrolling">
        <div className="home-topbar-track">
          {/* Originele set */}
          {topbarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={`original-${index}`} className="home-topbar-item">
                <Icon size={16} />
                <span>{item.text}</span>
              </div>
            );
          })}
          {/* Duplicate set 1 voor seamless loop */}
          {topbarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={`duplicate-1-${index}`} className="home-topbar-item">
                <Icon size={16} />
                <span>{item.text}</span>
              </div>
            );
          })}
          {/* Duplicate set 2 voor extra smooth loop */}
          {topbarItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={`duplicate-2-${index}`} className="home-topbar-item">
                <Icon size={16} />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
