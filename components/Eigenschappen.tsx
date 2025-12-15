import { Product } from '@/lib/types';

interface EigenschappenProps {
  product: Product;
}

export default function Eigenschappen({ product }: EigenschappenProps) {
  return (
    <div className="eigenschappen">
      <h2>Eigenschappen</h2>
      
      <div className="eigenschap-item">
        <span className="eigenschap-label">Artikelomschrijving</span>
        <span className="eigenschap-waarde">{product.artikelomschrijving || '-'}</span>
      </div>

      <div className="eigenschap-item">
        <span className="eigenschap-label">Potmaat</span>
        <span className="eigenschap-waarde">{product.potmaat || '-'}</span>
      </div>

      <div className="eigenschap-item">
        <span className="eigenschap-label">Artikelcode</span>
        <span className="eigenschap-waarde">{product.artikelcode}</span>
      </div>

      <div className="eigenschap-item">
        <span className="eigenschap-label">Verpakkingsinhoud</span>
        <span className="eigenschap-waarde">{product.verpakkingsinhoud || '-'}</span>
      </div>
    </div>
  );
}


