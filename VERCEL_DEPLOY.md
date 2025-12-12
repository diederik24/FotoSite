# Vercel Deployment Instructies

## Stap 1: Maak een Vercel Account

1. Ga naar [vercel.com](https://vercel.com)
2. Klik op **Sign Up**
3. Kies **Continue with GitHub** (aanbevolen, dan is je repository automatisch gekoppeld)

## Stap 2: Import je Project

1. Na het inloggen klik op **Add New...** → **Project**
2. Kies je GitHub repository: **diederik24/FotoSite**
3. Vercel detecteert automatisch dat het een Next.js project is

## Stap 3: Configureer Environment Variables

**BELANGRIJK:** Voeg je Supabase credentials toe:

1. In het deployment scherm, klik op **Environment Variables**
2. Voeg deze toe:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://wpgaspsylimithekizvp.supabase.co`
   - **Environment:** Production, Preview, Development (alle drie aanvinken)
   
3. Voeg nog een toe:
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZ2FzcHN5bGltaXRoZWtpenZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MjYxNTUsImV4cCI6MjA4MTEwMjE1NX0.exwXK8USKxXc4fJGlu__8Y7DBtq4vUtxVpRv4HRDcqY`
   - **Environment:** Production, Preview, Development (alle drie aanvinken)

## Stap 4: Deploy

1. Klik op **Deploy**
2. Wacht tot de build klaar is (ongeveer 2-3 minuten)
3. Je krijgt een URL zoals: `https://foto-site.vercel.app`

## Stap 5: Automatische Deployments

Vanaf nu wordt elke push naar GitHub automatisch gedeployed!

## Belangrijke Notities

- **Static Export:** Vercel ondersteunt Next.js server-side rendering standaard. Als je static export wilt, moet je `STATIC_EXPORT=true` toevoegen aan environment variables.
- **Database:** Zorg dat je Supabase RLS policies correct zijn ingesteld zodat de site kan lezen.
- **Images:** Alle afbeeldingen in `/public` zijn automatisch beschikbaar.

## Troubleshooting

Als de site niet werkt:
1. Check de deployment logs in Vercel dashboard
2. Controleer of environment variables correct zijn ingesteld
3. Check of Supabase RLS policies "Allow public read access" hebben

