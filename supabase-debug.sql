-- ============================================
-- SUPABASE DEBUG QUERIES
-- Kopieer en plak deze queries in Supabase SQL Editor
-- ============================================

-- 1. Check of de products tabel bestaat
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'products'
) AS table_exists;

-- 2. Check de structuur van de products tabel
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- 3. Check hoeveel producten er in de tabel zitten
SELECT COUNT(*) AS total_products FROM products;

-- 4. Check de eerste 5 producten (als ze er zijn)
SELECT * FROM products LIMIT 5;

-- 5. Check of er indexen zijn
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'products';

-- 6. Check of RLS (Row Level Security) is enabled
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- 7. Check de RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products';

-- 8. Test een INSERT query (om te zien of er een policy probleem is)
-- Let op: Dit zal waarschijnlijk falen als RLS policies niet goed zijn ingesteld
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

-- 9. Verwijder test product (als het is aangemaakt)
DELETE FROM products WHERE artikelcode = 'TEST001';

-- 10. Check of er constraints zijn die problemen kunnen veroorzaken
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    tc.constraint_type
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'products';

