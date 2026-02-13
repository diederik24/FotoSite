/**
 * Script om alle product prijzen op €1.00 te zetten
 * 
 * Gebruik: npx tsx scripts/set-all-prices-to-1.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Laad .env.local bestand
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials niet gevonden!');
  console.error('Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY zijn ingesteld in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setAllPricesTo1() {
  console.log('🚀 Start updaten van alle product prijzen naar €1.00...\n');

  try {
    // Haal eerst alle producten op om te zien hoeveel er zijn
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('artikelcode, prijs');

    if (fetchError) {
      throw fetchError;
    }

    if (!products || products.length === 0) {
      console.log('⚠️  Geen producten gevonden in database.');
      return;
    }

    console.log(`📦 Gevonden: ${products.length} producten\n`);

    // Update alle producten naar prijs 1.00
    const { data, error } = await supabase
      .from('products')
      .update({ prijs: 1.00 })
      .neq('prijs', 1.00)
      .select('artikelcode');

    if (error) {
      throw error;
    }

    const updatedCount = data?.length || 0;
    console.log(`✅ ${updatedCount} producten geüpdatet naar €1.00\n`);

    // Verifieer het resultaat
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('prijs')
      .eq('prijs', 1.00);

    if (verifyError) {
      console.error('⚠️  Fout bij verifiëren:', verifyError.message);
    } else {
      console.log(`✅ Verificatie: ${verifyData?.length || 0} producten hebben nu prijs €1.00`);
    }

    console.log('\n✨ Klaar! Alle producten hebben nu prijs €1.00');

  } catch (error: any) {
    console.error('\n❌ Fout bij updaten van prijzen:');
    console.error(error.message);
    process.exit(1);
  }
}

setAllPricesTo1();
