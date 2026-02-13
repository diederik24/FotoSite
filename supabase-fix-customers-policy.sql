-- ============================================
-- FIX CUSTOMERS RLS POLICY VOOR ADMIN ACCESS
-- ============================================
-- Dit script voegt een policy toe zodat admin alle klanten kan zien

-- Voeg policy toe voor admin/public read access
-- Dit is nodig omdat de admin pagina alle klanten moet kunnen zien
DROP POLICY IF EXISTS "Allow admin read access" ON customers;
CREATE POLICY "Allow admin read access" ON customers
  FOR SELECT
  USING (true);

-- Verificatie: Check alle policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'customers'
ORDER BY policyname;
