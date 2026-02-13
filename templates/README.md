# Email Templates

Deze HTML email templates zijn ontworpen voor conversie en werken goed in alle email clients.

## Templates

### 1. `email-welcome-with-login.html`
**Doel:** Welkom email met inloggegevens voor nieuwe klanten

**Variabelen:**
- `{{klantnaam}}` - Naam van de klant
- `{{email}}` - Email adres
- `{{wachtwoord}}` - Tijdelijk wachtwoord
- `{{login_url}}` - URL naar login pagina
- `{{categorie1_foto}}` t/m `{{categorie4_foto}}` - Foto URLs van categorieën
- `{{categorie1_url}}` t/m `{{categorie4_url}}` - URLs naar categorieën
- `{{unsubscribe_url}}` - Uitschrijf link

**Features:**
- Duidelijke inloggegevens box
- 4 categorie foto's met links
- Grote call-to-action knoppen
- Responsive design
- Werkt in alle email clients

### 2. `email-offer-campaign.html`
**Doel:** Aanbiedingen email met producten

**Variabelen:**
- `{{klantnaam}}` - Naam van de klant
- `{{aanbieding_titel}}` - Titel van de aanbieding
- `{{aanbieding_subtitel}}` - Subtitel
- `{{persoonlijke_boodschap}}` - Persoonlijke tekst
- `{{product1_foto}}` t/m `{{product2_foto}}` - Product foto URLs
- `{{product1_naam}}` t/m `{{product2_naam}}` - Product namen
- `{{product1_code}}` t/m `{{product2_code}}` - Artikelcodes
- `{{product1_prijs}}` t/m `{{product2_prijs}}` - Prijzen
- `{{product1_oude_prijs}}` t/m `{{product2_oude_prijs}}` - Oude prijzen (voor korting)
- `{{product1_url}}` t/m `{{product2_url}}` - Product URLs
- `{{categorie1_naam}}` t/m `{{categorie4_naam}}` - Categorie namen
- `{{categorie1_url}}` t/m `{{categorie4_url}}` - Categorie URLs
- `{{cta_titel}}` - Call-to-action titel
- `{{cta_tekst}}` - Call-to-action tekst
- `{{bestel_url}}` - URL naar webshop
- `{{login_url}}` - URL naar login
- `{{deadline_titel}}` - Deadline titel
- `{{deadline_tekst}}` - Deadline tekst
- `{{webshop_url}}` - Webshop URL
- `{{preferences_url}}` - Email voorkeuren URL

**Features:**
- Opvallende aanbieding badge
- Product highlights met foto's
- Duidelijke prijsweergave (oude vs nieuwe prijs)
- Urgency section (deadline)
- Meerdere call-to-action knoppen

### 3. `email-add-to-order.html`
**Doel:** Email om producten toe te voegen aan bestaande bestelling

**Variabelen:**
- `{{klantnaam}}` - Naam van de klant
- `{{order_nummer}}` - Ordernummer
- `{{leverdatum}}` - Leverdatum
- `{{deadline_datum}}` - Deadline voor toevoegen
- `{{product1_foto}}` t/m `{{product4_foto}}` - Product foto URLs
- `{{product1_naam}}` t/m `{{product4_naam}}` - Product namen
- `{{product1_code}}` t/m `{{product4_code}}` - Artikelcodes
- `{{product1_prijs}}` t/m `{{product4_prijs}}` - Prijzen
- `{{product1_add_url}}` t/m `{{product4_add_url}}` - URLs om product toe te voegen
- `{{add_to_order_url}}` - URL om toe te voegen aan bestelling
- `{{new_order_url}}` - URL voor nieuwe bestelling
- `{{view_order_url}}` - URL om bestelling te bekijken

**Features:**
- Order informatie prominent weergegeven
- 4 producten in grid layout
- Twee opties: toevoegen aan bestaande of nieuwe bestelling
- Duidelijke voordelen van toevoegen
- Link naar bestaande bestelling

## Gebruik

1. **Variabelen vervangen:** Vervang alle `{{variabele}}` plaatshouders met echte data
2. **Foto's:** Zorg dat alle foto URLs werken (gebruik absolute URLs)
3. **Links:** Test alle links voordat je de email verstuurt
4. **Preview:** Test de email in verschillende email clients (Gmail, Outlook, Apple Mail)

## Best Practices

- **Foto's:** Gebruik absolute URLs (https://jouwwebsite.nl/foto.jpg)
- **Links:** Gebruik tracking URLs om clicks te meten
- **Personalization:** Gebruik altijd de klantnaam
- **Mobile:** Test op mobiel - templates zijn responsive
- **Spam:** Vermijd te veel CAPS en !!! tekens

## Conversie Tips

1. **Duidelijke CTA's:** Grote, opvallende knoppen
2. **Urgency:** Gebruik deadlines en beperkte tijd
3. **Voordelen:** Benadruk waarom online bestellen beter is
4. **Eenvoud:** Maak het zo makkelijk mogelijk om te bestellen
5. **Vertrouwen:** Toon ordernummer, leverdatum, etc.

## Email Service Integratie

Deze templates kunnen gebruikt worden met:
- SendGrid
- Mailchimp
- Resend
- Postmark
- Of elke andere email service die HTML ondersteunt
