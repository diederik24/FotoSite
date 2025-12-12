import { createClient } from '@supabase/supabase-js';
import type { Product } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials niet gevonden. Gebruik .env.local om SUPABASE_URL en SUPABASE_ANON_KEY in te stellen.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functie om database data naar Product type te converteren
function mapDbProductToProduct(dbProduct: any): Product {
  return {
    artikelcode: dbProduct.artikelcode,
    artikelomschrijving: dbProduct.artikelomschrijving,
    afbeelding: dbProduct.afbeelding,
    potmaat: dbProduct.potmaat,
    verpakkingsinhoud: dbProduct.verpakkingsinhoud,
    wetenschappelijkeNaam: dbProduct.wetenschappelijkenaam || undefined,
    createdAt: dbProduct.created_at ? new Date(dbProduct.created_at) : undefined,
    updatedAt: dbProduct.updated_at ? new Date(dbProduct.updated_at) : undefined,
  };
}

// Helper functies voor producten
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('artikelcode');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map(mapDbProductToProduct);
}

export async function getProductByCode(artikelcode: string): Promise<Product | null> {
  // Probeer eerst exact match (uppercase)
  let { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('artikelcode', artikelcode.toUpperCase())
    .single();

  // Als dat niet werkt, probeer case-insensitive
  if (error && error.code === 'PGRST116') {
    const { data: allData, error: allError } = await supabase
      .from('products')
      .select('*');
    
    if (!allError && allData) {
      const found = allData.find(
        (p: any) => p.artikelcode?.toUpperCase() === artikelcode.toUpperCase()
      );
      if (found) {
        data = found;
        error = null;
      }
    }
  }

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data ? mapDbProductToProduct(data) : null;
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const term = searchTerm.toLowerCase().trim();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`artikelcode.ilike.%${term}%,artikelomschrijving.ilike.%${term}%`)
    .order('artikelcode');

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return (data || []).map(mapDbProductToProduct);
}

