import { notFound } from 'next/navigation';
import Topbar from '@/components/Topbar';
import LogoBanner from '@/components/LogoBanner';
import ProductImage from '@/components/ProductImage';
import Eigenschappen from '@/components/Eigenschappen';
import Footer from '@/components/Footer';
import { getProductByCode as getProductByCodeStatic } from '@/data/products';
import { plantenData } from '@/data/products';
import { getProductByCode as getProductByCodeSupabase, getAllProducts } from '@/lib/supabase';

// Genereer alle statische product pagina's
export async function generateStaticParams() {
  try {
    // Probeer eerst uit Supabase, anders gebruik statische data
    try {
      const supabaseProducts = await getAllProducts();
      if (supabaseProducts.length > 0) {
        return supabaseProducts.map((product) => ({
          artikelcode: product.artikelcode,
        }));
      }
    } catch (error) {
      // Supabase niet beschikbaar, gebruik statische data
    }
    
    return plantenData.map((product) => ({
      artikelcode: product.artikelcode,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

interface ProductPageProps {
  params: {
    artikelcode: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { artikelcode } = params;
  
  // Probeer eerst Supabase
  let product = null;
  try {
    product = await getProductByCodeSupabase(artikelcode);
    // Als Supabase producten heeft maar dit product niet, gebruik dan Supabase als bron
    // (geen fallback naar statische data als Supabase werkt)
    if (!product) {
      // Check of Supabase überhaupt werkt door te kijken of er producten zijn
      const allProducts = await getAllProducts();
      if (allProducts.length > 0) {
        // Supabase werkt maar dit product bestaat niet
        notFound();
      }
      // Supabase werkt niet, gebruik statische data als fallback
      product = getProductByCodeStatic(artikelcode);
    }
  } catch (error) {
    // Supabase niet beschikbaar, gebruik statische data als fallback
    console.warn('Supabase niet beschikbaar, gebruik statische data:', error);
    product = getProductByCodeStatic(artikelcode);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Topbar />
      <LogoBanner />

      <div className="content-wrapper">
        <div className="product-titles">
          <div className="product-title">
            {product.artikelomschrijving || 'Geen omschrijving'}
            {product.potmaat ? ` ${product.potmaat}` : ''}
          </div>
          <div className="product-subtitle">
            {product.artikelcode} {product.wetenschappelijkeNaam ? `– ${product.wetenschappelijkeNaam}` : ''}
          </div>
        </div>

        <div className="product-content">
          <div className="product-image-container">
            <ProductImage 
              src={product.afbeelding} 
              alt={product.artikelomschrijving || product.artikelcode} 
            />
          </div>

          <Eigenschappen product={product} />
        </div>

        <Footer />
      </div>
    </div>
  );
}
