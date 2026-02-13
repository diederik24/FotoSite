-- ============================================
-- SET ALL PRODUCT PRICES TO €1.00
-- ============================================
-- Dit script zet alle producten op €1.00
-- Voer dit uit in je Supabase SQL Editor

-- Update alle producten naar prijs 1.00
UPDATE products
SET prijs = 1.00
WHERE prijs IS NULL OR prijs != 1.00;

-- Verifieer het resultaat
SELECT 
  COUNT(*) as total_products,
  COUNT(prijs) as products_with_price,
  AVG(prijs) as average_price,
  MIN(prijs) as min_price,
  MAX(prijs) as max_price
FROM products;
