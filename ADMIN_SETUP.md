# Admin Panel Setup

## Admin Gebruiker Aanmaken

Er zijn twee manieren om een admin gebruiker aan te maken:

### Optie 1: Via Supabase Dashboard (Aanbevolen)

1. Ga naar je **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecteer je project
3. Ga naar **Authentication** → **Users** in het menu
4. Klik op **"Add user"** → **"Create new user"**
5. Vul de gegevens in:
   - **Email**: bijvoorbeeld `admin@straver.nl`
   - **Password**: kies een sterk wachtwoord (minimaal 6 karakters)
   - **Auto Confirm User**: ✅ Aanzetten (voor directe toegang zonder email verificatie)
6. Klik op **"Create user"**

### Optie 2: Via Script

1. Voeg de **Service Role Key** toe aan je `.env.local` bestand:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=je_service_role_key_hier
   ```
   
   Je vindt de Service Role Key in:
   - Supabase Dashboard → **Settings** → **API**
   - Scroll naar beneden naar **"Project API keys"**
   - Kopieer de **"service_role"** key (⚠️ **NIET** de anon key!)

2. Run het script met email en wachtwoord:
   ```bash
   npm run create-admin admin@straver.nl jouwwachtwoord123
   ```
   
   **Let op**: Vervang `admin@straver.nl` en `jouwwachtwoord123` met je eigen gegevens!

## Inloggen op Admin Panel

1. Start je development server (als die nog niet draait):
   ```bash
   npm run dev
   ```

2. Ga naar: **http://localhost:3000/admin/login**

3. Log in met de gegevens die je hebt aangemaakt:
   - **Email**: het email adres dat je hebt gebruikt
   - **Wachtwoord**: het wachtwoord dat je hebt ingesteld

4. Na succesvol inloggen word je automatisch doorgestuurd naar het admin dashboard.

## Belangrijke Notities

- ⚠️ De **Service Role Key** heeft volledige toegang tot je database. **Deel deze NOOIT** publiekelijk!
- ✅ De Service Role Key hoort alleen in `.env.local` (die staat in `.gitignore`)
- 🔒 Zorg voor een sterk wachtwoord voor je admin account
- 👥 Je kunt meerdere admin gebruikers aanmaken

## Troubleshooting

### "Invalid login credentials"
- Controleer of je het juiste email adres en wachtwoord gebruikt
- Controleer of de gebruiker bestaat in Supabase → Authentication → Users

### "Service Role Key ontbreekt"
- Voeg `SUPABASE_SERVICE_ROLE_KEY` toe aan je `.env.local` bestand
- Herstart je development server na het toevoegen

### "Email not confirmed"
- In Supabase Dashboard → Authentication → Users
- Klik op de gebruiker
- Klik op "Confirm email" of zet "Auto Confirm User" aan bij het aanmaken

## Admin Panel Routes

- `/admin/login` - Login pagina
- `/admin` - Dashboard
- `/admin/products` - Productbeheer
- `/admin/orders` - Orderbeheer
- `/admin/customers` - Klantenbeheer
- `/admin/import` - Import functionaliteit
- `/admin/settings` - Instellingen

Alle routes behalve `/admin/login` zijn beschermd en vereisen authenticatie.
