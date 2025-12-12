-- ============================================
-- SUPABASE SETUP SCRIPT VOOR PRODUCTS TABEL
-- ============================================
-- Kopieer dit hele bestand en plak het in de Supabase SQL Editor
-- Klik dan op "Run" (of druk F5)

-- Stap 1: Verwijder tabel als deze al bestaat (optioneel, alleen voor reset)
-- DROP TABLE IF EXISTS products CASCADE;

-- Stap 2: Maak de products tabel
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artikelcode TEXT NOT NULL UNIQUE,
  artikelomschrijving TEXT NOT NULL,
  afbeelding TEXT NOT NULL,
  potmaat TEXT NOT NULL,
  verpakkingsinhoud TEXT NOT NULL,
  wetenschappelijkeNaam TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Stap 3: Maak indexen voor snellere queries
CREATE INDEX IF NOT EXISTS idx_products_artikelcode ON products(artikelcode);
CREATE INDEX IF NOT EXISTS idx_products_artikelomschrijving ON products(artikelomschrijving);

-- Stap 4: Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Stap 5: Maak policy voor publieke lees toegang (iedereen kan producten lezen)
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- Stap 6: Functie om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Stap 7: Trigger om updated_at automatisch bij te werken bij updates
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATIE
-- ============================================
-- Controleer of de tabel is aangemaakt:
-- SELECT * FROM products LIMIT 5;

-- Controleer of de indexen bestaan:
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'products';

-- Controleer of RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'products';

