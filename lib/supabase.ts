import { createClient } from '@supabase/supabase-js';
import type { Product } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials niet gevonden. Gebruik .env.local om SUPABASE_URL en SUPABASE_ANON_KEY in te stellen.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functie om categorie te bepalen op basis van artikelcode
function determineCategory(artikelcode: string, artikelomschrijving: string): string {
  const code = artikelcode.toUpperCase();
  const omschrijving = artikelomschrijving.toLowerCase();
  
  // Bepaal categorie op basis van artikelcode prefix
  if (code.startsWith('V09')) {
    return 'Fruit';
  }
  if (code.startsWith('V08')) {
    return 'Bomen';
  }
  if (code.startsWith('V07')) {
    return 'Heesters';
  }
  if (code.startsWith('V06')) {
    return 'Vaste Planten';
  }
  
  // Bepaal categorie op basis van omschrijving
  if (omschrijving.includes('fruit') || omschrijving.includes('appel') || omschrijving.includes('peer') || omschrijving.includes('kers')) {
    return 'Fruit';
  }
  if (omschrijving.includes('boom') || omschrijving.includes('tree')) {
    return 'Bomen';
  }
  if (omschrijving.includes('heester') || omschrijving.includes('shrub')) {
    return 'Heesters';
  }
  if (omschrijving.includes('vaste plant') || omschrijving.includes('perennial')) {
    return 'Vaste Planten';
  }
  
  // Default categorie
  return 'Shrubs';
}

// Helper functie om database data naar Product type te converteren
function mapDbProductToProduct(dbProduct: any): Product {
  // Gebruik categorie uit database, of bepaal op basis van artikelcode
  const categorie = dbProduct.categorie || determineCategory(
    dbProduct.artikelcode || '',
    dbProduct.artikelomschrijving || ''
  );
  
  return {
    artikelcode: dbProduct.artikelcode,
    artikelomschrijving: dbProduct.artikelomschrijving,
    afbeelding: dbProduct.afbeelding,
    potmaat: dbProduct.potmaat,
    verpakkingsinhoud: dbProduct.verpakkingsinhoud,
    wetenschappelijkeNaam: dbProduct.wetenschappelijkenaam || undefined,
    prijs: dbProduct.prijs ? parseFloat(dbProduct.prijs) : undefined,
    voorraad: dbProduct.voorraad !== undefined && dbProduct.voorraad !== null ? parseInt(dbProduct.voorraad) : undefined,
    beschikbaar: dbProduct.beschikbaar !== undefined ? dbProduct.beschikbaar : true,
    categorie: categorie,
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

/**
 * Optimized: Fetch only essential columns for product listing
 * Reduces data transfer by ~60-70% compared to select('*')
 */
export async function getProductsPaginated(
  page: number = 1,
  pageSize: number = 24,
  searchTerm?: string
): Promise<{ products: Product[]; hasMore: boolean; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Only select columns needed for product cards
  let query = supabase
    .from('products')
    .select(
      'artikelcode, artikelomschrijving, afbeelding, potmaat, verpakkingsinhoud, wetenschappelijkenaam, prijs, voorraad, beschikbaar, categorie',
      { count: 'exact' }
    )
    .order('artikelcode')
    .range(from, to);

  // Apply search filter if provided
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.trim();
    query = query.or(
      `artikelcode.ilike.%${term}%,artikelomschrijving.ilike.%${term}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching paginated products:', error);
    return { products: [], hasMore: false, total: 0 };
  }

  const products = (data || []).map(mapDbProductToProduct);
  const total = count || 0;
  const hasMore = to < total - 1;

  return { products, hasMore, total };
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
  
  // Optimized: Only select columns needed for product cards
  const { data, error } = await supabase
    .from('products')
    .select('artikelcode, artikelomschrijving, afbeelding, potmaat, verpakkingsinhoud, wetenschappelijkenaam, prijs, voorraad, beschikbaar, categorie')
    .or(`artikelcode.ilike.%${term}%,artikelomschrijving.ilike.%${term}%`)
    .order('artikelcode')
    .limit(100); // Limit search results to prevent huge queries

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return (data || []).map(mapDbProductToProduct);
}

// CRUD functies voor admin
export async function createProduct(product: Omit<Product, 'createdAt' | 'updatedAt'>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      artikelcode: product.artikelcode.toUpperCase(),
      artikelomschrijving: product.artikelomschrijving,
      afbeelding: product.afbeelding,
      potmaat: product.potmaat,
      verpakkingsinhoud: product.verpakkingsinhoud,
      wetenschappelijkenaam: product.wetenschappelijkeNaam || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data ? mapDbProductToProduct(data) : null;
}

export async function updateProduct(
  artikelcode: string,
  updates: Partial<Omit<Product, 'artikelcode' | 'createdAt' | 'updatedAt'>>
): Promise<Product | null> {
  const updateData: any = {};
  
  if (updates.artikelomschrijving !== undefined) updateData.artikelomschrijving = updates.artikelomschrijving;
  if (updates.afbeelding !== undefined) updateData.afbeelding = updates.afbeelding;
  if (updates.potmaat !== undefined) updateData.potmaat = updates.potmaat;
  if (updates.verpakkingsinhoud !== undefined) updateData.verpakkingsinhoud = updates.verpakkingsinhoud;
  if (updates.wetenschappelijkeNaam !== undefined) {
    updateData.wetenschappelijkenaam = updates.wetenschappelijkeNaam || null;
  }

  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('artikelcode', artikelcode.toUpperCase())
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data ? mapDbProductToProduct(data) : null;
}

export async function deleteProduct(artikelcode: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('artikelcode', artikelcode.toUpperCase());
  
  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }

  return true;
}

export async function deleteProducts(artikelcodes: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .in('artikelcode', artikelcodes.map(code => code.toUpperCase()));

  if (error) {
    console.error('Error deleting products:', error);
    throw error;
  }

  return true;
}

// ============================================
// CUSTOMER FUNCTIES
// ============================================

export interface Customer {
  id: string;
  klantcode?: string;
  email: string;
  naam: string;
  bedrijfsnaam?: string;
  contactpersoon?: string;
  kvk_nummer?: string;
  telefoon?: string;
  telefoon_vast?: string;
  telefoon_mobiel?: string;
  telefoon_fax?: string;
  adres?: any;
  land?: string;
  postcode?: string;
  stad?: string;
  actief?: boolean;
  user_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Helper functie om database data naar Customer type te converteren
function mapDbCustomerToCustomer(dbCustomer: any): Customer {
  // KlantNummer kan zowel klantcode als KlantNummer zijn (afhankelijk van database schema)
  const klantcode = dbCustomer.KlantNummer || dbCustomer.klantcode || undefined;
  
  return {
    id: dbCustomer.id,
    klantcode: klantcode,
    email: dbCustomer.email,
    naam: dbCustomer.naam,
    bedrijfsnaam: dbCustomer.bedrijfsnaam || undefined,
    contactpersoon: dbCustomer.contactpersoon || undefined,
    kvk_nummer: dbCustomer.kvk_nummer || undefined,
    telefoon: dbCustomer.telefoon || undefined,
    telefoon_vast: dbCustomer.telefoon_vast || undefined,
    telefoon_mobiel: dbCustomer.telefoon_mobiel || undefined,
    telefoon_fax: dbCustomer.telefoon_fax || undefined,
    adres: dbCustomer.adres || undefined,
    land: dbCustomer.land || undefined,
    postcode: dbCustomer.postcode || undefined,
    stad: dbCustomer.stad || undefined,
    actief: dbCustomer.actief !== undefined ? dbCustomer.actief : true, // Default true als niet ingesteld
    user_id: dbCustomer.user_id || undefined,
    created_at: dbCustomer.created_at ? new Date(dbCustomer.created_at) : undefined,
    updated_at: dbCustomer.updated_at ? new Date(dbCustomer.updated_at) : undefined,
  };
}

// Haal alle klanten op
export async function getAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('naam');

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return (data || []).map(mapDbCustomerToCustomer);
}

// Haal een enkele klant op op basis van ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return mapDbCustomerToCustomer(data);
}

// Update klant status (actief/inactief)
export async function updateCustomerStatus(id: string, actief: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('customers')
    .update({ 
      actief: actief,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating customer status:', error);
    return false;
  }

  return true;
}

// Zoek klanten
export async function searchCustomers(searchTerm: string): Promise<Customer[]> {
  const term = searchTerm.toLowerCase().trim();
  
  if (!term) {
    return getAllCustomers();
  }
  
  // Zoek op alle relevante velden
  // Let op: PostgreSQL kolomnamen zijn case-sensitive tussen quotes, dus "KlantNummer" moet exact zijn
  // Maar Supabase PostgREST converteert kolomnamen naar lowercase, dus we gebruiken lowercase
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`email.ilike.%${term}%,naam.ilike.%${term}%,bedrijfsnaam.ilike.%${term}%,klantcode.ilike.%${term}%,land.ilike.%${term}%,stad.ilike.%${term}%,postcode.ilike.%${term}%`)
    .order('naam');

  if (error) {
    console.error('Error searching customers:', error);
    // Als de query faalt, probeer dan alle klanten op te halen en lokaal te filteren
    const allCustomers = await getAllCustomers();
    return allCustomers.filter(customer => {
      const searchLower = term.toLowerCase();
      return (
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.naam?.toLowerCase().includes(searchLower) ||
        customer.bedrijfsnaam?.toLowerCase().includes(searchLower) ||
        customer.klantcode?.toLowerCase().includes(searchLower) ||
        customer.land?.toLowerCase().includes(searchLower) ||
        customer.stad?.toLowerCase().includes(searchLower) ||
        customer.postcode?.toLowerCase().includes(searchLower)
      );
    });
  }

  return (data || []).map(mapDbCustomerToCustomer);
}
