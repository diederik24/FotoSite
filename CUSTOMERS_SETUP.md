# Klanten Accounts Setup

## Overzicht

Dit script maakt het mogelijk voor klanten om accounts aan te maken en te beheren in je webshop.

## Wat wordt aangemaakt?

- ✅ **Policies** voor klanten om zichzelf aan te maken
- ✅ **Automatische trigger** die een customer aanmaakt bij user registratie
- ✅ **Functies** voor het aanmaken en updaten van klanten
- ✅ **Zoekfunctie** om klanten op te zoeken

## Stap 1: Voer het SQL Script Uit

1. Ga naar je Supabase dashboard
2. Klik op **"SQL Editor"**
3. Klik op **"New Query"**
4. Open het bestand: `supabase-customers-setup.sql`
5. Kopieer alles (Ctrl+A, Ctrl+C)
6. Plak het in de SQL Editor (Ctrl+V)
7. Klik op **"Run"** (of druk F5)

## Stap 2: Test de Setup

Na het uitvoeren kun je testen met deze queries:

### Test 1: Maak een klant aan (zonder authenticatie)

```sql
SELECT create_customer(
  'test@voorbeeld.nl',
  'Test Klant',
  'Test Bedrijf BV',
  '12345678',
  '0612345678',
  '{"straat": "Teststraat 1", "postcode": "1234AB", "stad": "Amsterdam", "land": "Nederland"}'::jsonb
);
```

### Test 2: Zoek een klant

```sql
SELECT * FROM get_customer_by_email('test@voorbeeld.nl');
```

## Gebruik in je Applicatie

### TypeScript/JavaScript Voorbeeld

```typescript
import { supabase } from '@/lib/supabase';

// Maak een klant aan
async function createCustomer(customerData: {
  email: string;
  naam: string;
  bedrijfsnaam?: string;
  kvk_nummer?: string;
  telefoon?: string;
  adres?: any;
}) {
  const { data, error } = await supabase.rpc('create_customer', {
    p_email: customerData.email,
    p_naam: customerData.naam,
    p_bedrijfsnaam: customerData.bedrijfsnaam || null,
    p_kvk_nummer: customerData.kvk_nummer || null,
    p_telefoon: customerData.telefoon || null,
    p_adres: customerData.adres || null,
    p_user_id: null // of auth.uid() als gebruiker is ingelogd
  });

  if (error) {
    console.error('Error creating customer:', error);
    return null;
  }

  return data;
}

// Update een klant
async function updateCustomer(customerId: string, updates: {
  naam?: string;
  bedrijfsnaam?: string;
  kvk_nummer?: string;
  telefoon?: string;
  adres?: any;
}) {
  const { data, error } = await supabase.rpc('update_customer', {
    p_customer_id: customerId,
    p_naam: updates.naam || null,
    p_bedrijfsnaam: updates.bedrijfsnaam || null,
    p_kvk_nummer: updates.kvk_nummer || null,
    p_telefoon: updates.telefoon || null,
    p_adres: updates.adres || null
  });

  if (error) {
    console.error('Error updating customer:', error);
    return false;
  }

  return data;
}
```

## Automatische Customer Aanmaak

Wanneer een gebruiker zich registreert via Supabase Auth, wordt automatisch een customer record aangemaakt via de trigger `on_auth_user_created`.

Dit gebeurt automatisch - je hoeft niets extra te doen!

## Security

- ✅ Klanten kunnen alleen hun eigen gegevens bekijken en updaten
- ✅ Service role kan alle klanten beheren (voor admin)
- ✅ Iedereen kan een customer account aanmaken (voor registratie)
- ✅ Email is uniek (geen dubbele accounts)

## Volgende Stappen

Na het uitvoeren van dit script:
1. ✅ Klanten kunnen accounts aanmaken
2. ✅ Klanten kunnen zich registreren via Supabase Auth
3. ✅ Je kunt klanten beheren via de applicatie
4. ✅ Klanten kunnen orders plaatsen (via de orders tabel)
