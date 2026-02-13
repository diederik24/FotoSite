# Environment Variabelen Setup

## Stap 1: Maak .env.local bestand aan

Maak een nieuw bestand aan genaamd `.env.local` in de `straver-website` folder.

## Stap 2: Kopieer deze template

```env
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://jouw-project-id.supabase.co

# Supabase Anon/Public Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.voorbeeld-key-vul-hier-je-eigen-key-in

# Development mode
NODE_ENV=development
```

## Stap 3: Vul je Supabase credentials in

### Hoe krijg je je Supabase credentials?

1. **Ga naar https://supabase.com**
2. **Maak een account aan** (gratis)
3. **Klik op "New Project"**
4. **Kies een naam en wachtwoord** voor je database
5. **Wacht tot het project klaar is** (~2 minuten)

### Project URL ophalen:

1. Ga naar je project dashboard
2. Klik op **"Settings"** (tandwiel icoon linksonder)
3. Klik op **"API"** in het menu
4. Kopieer de **"Project URL"** (bijvoorbeeld: `https://abcdefghijklmnop.supabase.co`)

### Anon Key ophalen:

1. In hetzelfde **"API"** scherm
2. Kopieer de **"anon public"** key
3. Dit is een lange string die begint met `eyJ...`

## Stap 4: Vul de waarden in

Vervang in je `.env.local` bestand:
- `https://jouw-project-id.supabase.co` met je echte Project URL
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.voorbeeld-key...` met je echte anon key

## Voorbeeld .env.local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk4ODgwMCwiZXhwIjoxOTYxNTY0ODAwfQ.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
NODE_ENV=development
```

## Stap 5: Herstart je development server

Na het aanmaken of bewerken van `.env.local`:

```bash
# Stop je server (Ctrl+C)
# Start opnieuw
npm run dev
```

## Belangrijk:

- ✅ `.env.local` staat al in `.gitignore` - je credentials zijn veilig
- ✅ De `anon key` is veilig om publiek te maken (bedoeld voor client-side)
- ✅ Gebruik NOOIT de `service_role` key in client-side code
- ✅ Herstart altijd je server na het aanmaken/bewerken van `.env.local`

## Troubleshooting:

### "Supabase credentials niet gevonden"
- Controleer of `.env.local` bestaat in de `straver-website` folder
- Controleer of de variabelen beginnen met `NEXT_PUBLIC_`
- Herstart je development server

### "Invalid API key"
- Controleer of je de juiste key hebt gekopieerd (anon key, niet service role)
- Controleer of er geen extra spaties zijn
- Controleer of de URL correct is (moet eindigen op `.supabase.co`)
