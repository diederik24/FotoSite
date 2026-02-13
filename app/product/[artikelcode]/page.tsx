import { notFound } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import ProductDetailClient from './ProductDetailClient';
import { getProductByCode as getProductByCodeSupabase, getAllProducts } from '@/lib/supabase';

// Genereer alle statische product pagina's uit Supabase
export async function generateStaticParams() {
  try {
    const supabaseProducts = await getAllProducts();
    return supabaseProducts.map((product) => ({
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
  
  // Haal product op uit Supabase
  const product = await getProductByCodeSupabase(artikelcode);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Topbar />

      <ProductDetailClient product={product} />

      <Footer />
    </div>
  );
}
