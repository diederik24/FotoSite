-- ============================================
-- QUICK SETUP - Kopieer en plak in SQL Editor
-- ============================================

-- Maak products tabel
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artikelcode TEXT NOT NULL UNIQUE,
  artikelomschrijving TEXT NOT NULL,
  afbeelding TEXT NOT NULL,
  potmaat TEXT NOT NULL,
  verpakkingsinhoud TEXT NOT NULL,
  wetenschappelijkeNaam TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexen voor snelle queries
CREATE INDEX IF NOT EXISTS idx_products_artikelcode ON products(artikelcode);
CREATE INDEX IF NOT EXISTS idx_products_artikelomschrijving ON products(artikelomschrijving);

-- Row Level Security aanzetten
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: iedereen kan lezen
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

