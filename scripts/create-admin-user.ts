import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Fout: SUPABASE_SERVICE_ROLE_KEY ontbreekt in .env.local');
  console.log('\n📝 Voeg dit toe aan je .env.local bestand:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=je_service_role_key_hier');
  console.log('\nJe vindt de Service Role Key in Supabase Dashboard → Settings → API');
  console.log('⚠️  Let op: Gebruik de SERVICE_ROLE key, niet de anon key!');
  process.exit(1);
}

// Gebruik service role key voor admin operaties
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  // Haal email en password uit command line arguments
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log('\n🔐 Admin Gebruiker Aanmaken\n');
    console.log('Gebruik: npm run create-admin <email> <wachtwoord>\n');
    console.log('Voorbeeld:');
    console.log('  npm run create-admin admin@straver.nl mijnwachtwoord123\n');
    console.log('⚠️  Let op: Gebruik een sterk wachtwoord (minimaal 6 karakters)');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('\n❌ Wachtwoord moet minimaal 6 karakters lang zijn!');
    process.exit(1);
  }

  console.log('\n⏳ Gebruiker aanmaken...');
  console.log('📧 Email:', email);

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      console.error('\n❌ Fout bij aanmaken gebruiker:', error.message);
      if (error.message.includes('already registered')) {
        console.log('\n💡 Deze gebruiker bestaat al. Gebruik een ander email adres.');
      }
      process.exit(1);
    }

    console.log('\n✅ Admin gebruiker succesvol aangemaakt!');
    console.log('\n📧 Email:', email);
    console.log('\n🔗 Je kunt nu inloggen op: http://localhost:3000/admin/login');
    console.log('\n💡 Gebruik deze gegevens om in te loggen:');
    console.log('   Email:', email);
    console.log('   Wachtwoord:', '*'.repeat(password.length));
    
  } catch (error: any) {
    console.error('\n❌ Onverwachte fout:', error.message);
    process.exit(1);
  }
}

main();
