-- ============================================
-- FIX ALL POLICIES - Voer dit uit als INSERT niet werkt
-- ============================================

-- Verwijder alle bestaande policies
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public insert" ON products;
DROP POLICY IF EXISTS "Allow public update" ON products;
DROP POLICY IF EXISTS "Allow anon insert" ON products;
DROP POLICY IF EXISTS "Allow anon update" ON products;

-- Maak nieuwe policies aan
-- 1. SELECT: iedereen kan lezen
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- 2. INSERT: iedereen kan toevoegen (voor import)
CREATE POLICY "Allow public insert" ON products
  FOR INSERT
  WITH CHECK (true);

-- 3. UPDATE: iedereen kan updaten (voor upsert)
CREATE POLICY "Allow public update" ON products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Test INSERT
INSERT INTO products (
    artikelcode, 
    artikelomschrijving, 
    afbeelding, 
    potmaat, 
    verpakkingsinhoud
) VALUES (
    'TEST001',
    'Test Product',
    '/test.jpg',
    'Test Pot',
    '1'
) ON CONFLICT (artikelcode) DO UPDATE SET
    artikelomschrijving = EXCLUDED.artikelomschrijving
RETURNING *;

-- Check resultaat
SELECT COUNT(*) AS total_products FROM products;

