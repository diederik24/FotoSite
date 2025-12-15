-- Supabase Schema voor Products tabel
-- Voer dit uit in je Supabase SQL Editor

-- Maak de products tabel
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

-- Maak een index op artikelcode voor snellere queries
CREATE INDEX IF NOT EXISTS idx_products_artikelcode ON products(artikelcode);

-- Maak een index op artikelomschrijving voor zoeken
CREATE INDEX IF NOT EXISTS idx_products_artikelomschrijving ON products(artikelomschrijving);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Maak een policy zodat iedereen kan lezen (public read)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- Optioneel: Maak een policy voor insert/update alleen voor authenticated users
-- CREATE POLICY "Allow authenticated insert" ON products
--   FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated update" ON products
--   FOR UPDATE
--   USING (auth.role() = 'authenticated');

-- Functie om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger om updated_at automatisch bij te werken
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


