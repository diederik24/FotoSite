/**
 * Script om producten uit data/products.ts te importeren naar Supabase
 * 
 * Gebruik: npx tsx scripts/import-to-supabase.ts
 * of: npm run import-supabase (als je het script toevoegt aan package.json)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { plantenData } from '../data/products';

// Laad .env.local bestand (relatief vanaf script locatie)
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials niet gevonden!');
  console.error('Zorg ervoor dat NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY zijn ingesteld in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importProducts() {
  console.log(`🚀 Start importeren van ${plantenData.length} producten naar Supabase...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < plantenData.length; i++) {
    const product = plantenData[i];
    
    const productData: any = {
      artikelcode: product.artikelcode.toUpperCase(),
      artikelomschrijving: product.artikelomschrijving,
      afbeelding: product.afbeelding,
      potmaat: product.potmaat,
      verpakkingsinhoud: product.verpakkingsinhoud,
    };
    
    // Voeg wetenschappelijkenaam toe (database kolomnaam is lowercase)
    if (product.wetenschappelijkeNaam) {
      productData.wetenschappelijkenaam = product.wetenschappelijkeNaam;
    }

    try {
      const { error } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'artikelcode' });

      if (error) {
        console.error(`❌ Fout bij ${product.artikelcode}:`, error.message);
        errorCount++;
      } else {
        successCount++;
        if ((i + 1) % 50 === 0) {
          console.log(`✓ ${i + 1}/${plantenData.length} producten geïmporteerd...`);
        }
      }
    } catch (err) {
      console.error(`❌ Fout bij ${product.artikelcode}:`, err);
      errorCount++;
    }
  }

  console.log(`\n✅ Import voltooid!`);
  console.log(`   Succesvol: ${successCount}`);
  console.log(`   Fouten: ${errorCount}`);
  console.log(`   Totaal: ${plantenData.length}`);
}

importProducts().catch(console.error);

