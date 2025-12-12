# Supabase Setup Instructies

## Stap 1: Supabase Project Aanmaken

1. Ga naar https://supabase.com
2. Maak een account aan (gratis)
3. Klik op "New Project"
4. Kies een naam en wachtwoord voor je database
5. Wacht tot het project klaar is (duurt ~2 minuten)

## Stap 2: Supabase Credentials Ophalen

1. Ga naar je project dashboard
2. Klik op "Settings" (tandwiel icoon linksonder)
3. Ga naar "API" in het menu
4. Kopieer de volgende waarden:
   - **Project URL** (bijv. `https://xxxxx.supabase.co`)
   - **anon public key** (lange string die begint met `eyJ...`)

## Stap 3: Environment Variabelen Instellen

Maak een `.env.local` bestand aan in de `straver-website` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jouw-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...jouw-anon-key...
```

**Belangrijk**: Vervang de waarden met jouw eigen Supabase credentials!

## Stap 4: Database Schema Aanmaken

1. Ga naar je Supabase dashboard
2. Klik op "SQL Editor" in het menu links
3. Klik op "New Query"
4. Open het bestand `supabase-schema.sql` uit dit project
5. Kopieer de hele inhoud en plak het in de SQL Editor
6. Klik op "Run" (of druk F5)
7. Controleer of de tabel `products` is aangemaakt (ga naar "Table Editor")

## Stap 5: Producten Importeren

### Optie A: Via Script (Aanbevolen)

1. Installeer tsx (als je het nog niet hebt):
   ```bash
   npm install -D tsx
   ```

2. Voeg dit script toe aan `package.json`:
   ```json
   "scripts": {
     "import-supabase": "tsx scripts/import-to-supabase.ts"
   }
   ```

3. Run het import script:
   ```bash
   npm run import-supabase
   ```

### Optie B: Via Supabase Dashboard

1. Ga naar "Table Editor" in je Supabase dashboard
2. Klik op "Insert" > "Import data from CSV"
3. Exporteer eerst je data uit `data/products.ts` naar CSV formaat
4. Upload het CSV bestand

## Stap 6: Testen

1. Start je development server:
   ```bash
   npm run dev
   ```

2. Ga naar http://localhost:3000
3. De producten zouden nu uit Supabase moeten komen!

## Troubleshooting

### "Supabase credentials niet gevonden"
- Controleer of `.env.local` bestaat en de juiste waarden bevat
- Herstart je development server na het aanmaken/bewerken van `.env.local`

### "relation 'products' does not exist"
- Zorg ervoor dat je het SQL schema hebt uitgevoerd in de SQL Editor
- Controleer of de tabel bestaat in "Table Editor"

### "new row violates row-level security policy"
- Controleer of je de RLS policies correct hebt ingesteld
- Zie het `supabase-schema.sql` bestand voor de juiste policies

## Belangrijke Notities

- De `anon key` is veilig om publiek te maken (het is bedoeld voor client-side gebruik)
- Row Level Security (RLS) zorgt ervoor dat alleen lezen is toegestaan voor iedereen
- Voor producten toevoegen/wijzigen moet je authenticated zijn (of de policies aanpassen)

## Volgende Stappen

Na setup kun je:
- Producten toevoegen/wijzigen via Supabase dashboard
- Real-time updates implementeren (als je dat wilt)
- Authenticatie toevoegen voor admin functionaliteit

