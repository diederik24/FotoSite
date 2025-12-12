-- ============================================
-- CHECK HUIDIGE POLICIES
-- ============================================

-- Check welke policies er zijn
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products';

-- Test INSERT zonder DELETE
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
    artikelomschrijving = EXCLUDED.artikelomschrijving,
    afbeelding = EXCLUDED.afbeelding,
    potmaat = EXCLUDED.potmaat,
    verpakkingsinhoud = EXCLUDED.verpakkingsinhoud
RETURNING *;

-- Check of het werkt
SELECT * FROM products WHERE artikelcode = 'TEST001';

