-- ============================================
-- SET ALL PRODUCT STOCK TO 1000
-- ============================================
-- Dit script zet alle producten op voorraad 1000 stuks
-- Voer dit uit in je Supabase SQL Editor

-- Update alle producten naar voorraad 1000
UPDATE products
SET voorraad = 1000
WHERE voorraad IS NULL OR voorraad != 1000;

-- Verifieer het resultaat
SELECT 
  COUNT(*) as total_products,
  COUNT(voorraad) as products_with_stock,
  AVG(voorraad) as average_stock,
  MIN(voorraad) as min_stock,
  MAX(voorraad) as max_stock
FROM products;
