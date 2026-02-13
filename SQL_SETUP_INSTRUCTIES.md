# SQL Schema Uitvoeren - Stap voor Stap

## Methode: Handmatig via Supabase Dashboard (Aanbevolen)

### Stap 1: Open Supabase Dashboard
1. Ga naar: https://supabase.com/dashboard
2. Log in met je account
3. Selecteer je project: **pgcrmxnoepynxvvhraxl**

### Stap 2: Open SQL Editor
1. Klik op **"SQL Editor"** in het menu links
2. Klik op **"New Query"** (of gebruik de knop bovenaan)

### Stap 3: Kopieer het SQL Schema
1. Open het bestand: `supabase-complete-schema.sql` in je project
2. Selecteer **ALLES** (Ctrl+A)
3. Kopieer het (Ctrl+C)

### Stap 4: Plak en Voer Uit
1. Plak de SQL code in de SQL Editor (Ctrl+V)
2. Controleer of alle code erin staat
3. Klik op **"Run"** (of druk **F5**)
4. Wacht tot het script klaar is (kan 10-30 seconden duren)

### Stap 5: Verificatie
Na het uitvoeren zie je onderaan:
- Een lijst van alle tabellen die zijn aangemaakt
- Een lijst van alle indexen die zijn aangemaakt

**Verwachte tabellen:**
- ✅ products
- ✅ customers
- ✅ orders
- ✅ order_items
- ✅ cart_items
- ✅ categories

## Wat wordt aangemaakt?

Het schema maakt aan:
- ✅ **6 tabellen** (products, customers, orders, order_items, cart_items, categories)
- ✅ **Indexen** voor snelle queries (belangrijk voor 10.000+ producten!)
- ✅ **RLS Policies** voor security
- ✅ **Triggers** voor automatische updates
- ✅ **Functies** voor order nummers en berekeningen
- ✅ **Views** voor rapportages

## Troubleshooting

### Fout: "relation already exists"
- Dit betekent dat sommige tabellen al bestaan
- Het script gebruikt `CREATE TABLE IF NOT EXISTS`, dus dit is geen probleem
- Je kunt doorgaan

### Fout: "permission denied"
- Controleer of je de juiste project hebt geselecteerd
- Zorg dat je ingelogd bent met een account dat admin rechten heeft

### Fout: "syntax error"
- Controleer of je de hele SQL code hebt gekopieerd
- Zorg dat er geen tekst is verwijderd of toegevoegd

## Na het uitvoeren

Na succesvol uitvoeren:
1. Ga naar **"Table Editor"** in het menu
2. Je zou nu alle tabellen moeten zien
3. Klik op **"products"** om te zien of de tabel bestaat
4. Je kunt nu producten gaan importeren!

## Volgende Stap

Na het schema uitvoeren:
- ✅ Producten importeren via `npm run import-supabase`
- ✅ Of handmatig producten toevoegen via Table Editor
