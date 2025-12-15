-- ============================================
-- FIX: Voeg INSERT policy toe zodat import werkt
-- ============================================
-- Kopieer en plak dit in Supabase SQL Editor en klik Run

-- Voeg policy toe voor INSERT (zodat je producten kunt importeren)
CREATE POLICY "Allow public insert" ON products
  FOR INSERT
  WITH CHECK (true);

-- Optioneel: Voeg ook UPDATE policy toe (voor upsert)
CREATE POLICY "Allow public update" ON products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Test of INSERT nu werkt
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
) ON CONFLICT (artikelcode) DO NOTHING
RETURNING *;

-- Check of het test product is toegevoegd
SELECT COUNT(*) FROM products;

-- Verwijder test product
DELETE FROM products WHERE artikelcode = 'TEST001';


