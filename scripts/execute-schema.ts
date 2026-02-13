/**
 * Script om het complete Supabase schema uit te voeren
 * 
 * Gebruik: npm run execute-schema
 * of: tsx scripts/execute-schema.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Fout: SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY moeten ingesteld zijn in .env.local');
  console.error('');
  console.error('Zorg ervoor dat je .env.local hebt met:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=https://jouw-project.supabase.co');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=eyJ...');
  process.exit(1);
}

// Maak Supabase client met service role key (voor admin operaties)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSchema() {
  console.log('🚀 Start schema uitvoeren...\n');

  // Lees het SQL bestand
  const sqlFilePath = path.join(process.cwd(), 'supabase-complete-schema.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`❌ Fout: SQL bestand niet gevonden: ${sqlFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFilePath, 'utf-8');
  
  // Split SQL in individuele statements (gescheiden door ;)
  // We moeten voorzichtig zijn met triggers en functies die meerdere statements bevatten
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 ${statements.length} SQL statements gevonden\n`);

  let successCount = 0;
  let errorCount = 0;

  // Voer elk statement uit
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    
    // Skip lege statements en comments
    if (!statement || statement.startsWith('--')) {
      continue;
    }

    try {
      // Voer het statement uit via RPC (we gebruiken een workaround omdat Supabase geen directe SQL execution heeft)
      // We moeten dit via de REST API doen
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({ sql: statement })
      });

      // Als RPC niet werkt, proberen we direct via PostgREST
      // Helaas heeft Supabase geen directe SQL execution API
      // We moeten dit handmatig doen via de SQL Editor
      
      console.log(`⚠️  Supabase heeft geen directe SQL execution API.`);
      console.log(`📋 Gebruik de volgende stappen:\n`);
      console.log(`1. Ga naar je Supabase dashboard`);
      console.log(`2. Klik op "SQL Editor" in het menu`);
      console.log(`3. Klik op "New Query"`);
      console.log(`4. Open het bestand: supabase-complete-schema.sql`);
      console.log(`5. Kopieer de hele inhoud en plak het in de SQL Editor`);
      console.log(`6. Klik op "Run" (of druk F5)\n`);
      
      break;
    } catch (error: any) {
      errorCount++;
      console.error(`❌ Fout bij statement ${i + 1}:`, error.message);
    }
  }

  if (errorCount === 0 && successCount > 0) {
    console.log(`\n✅ Schema succesvol uitgevoerd! ${successCount} statements uitgevoerd.`);
  } else {
    console.log(`\n⚠️  Gebruik de handmatige methode hierboven.`);
  }
}

// Alternatieve methode: gebruik Supabase CLI of directe database connectie
async function executeSchemaAlternative() {
  console.log('📋 HANDMATIGE METHODE (Aanbevolen):\n');
  console.log('1. Ga naar: https://supabase.com/dashboard');
  console.log('2. Selecteer je project');
  console.log('3. Klik op "SQL Editor" in het menu links');
  console.log('4. Klik op "New Query"');
  console.log('5. Open het bestand: supabase-complete-schema.sql');
  console.log('6. Kopieer ALLE inhoud (Ctrl+A, Ctrl+C)');
  console.log('7. Plak het in de SQL Editor (Ctrl+V)');
  console.log('8. Klik op "Run" of druk F5');
  console.log('9. Wacht tot het script klaar is\n');
  console.log('✅ Na het uitvoeren worden alle tabellen aangemaakt!\n');
}

// Run de alternatieve methode (omdat Supabase geen directe SQL API heeft)
executeSchemaAlternative();
