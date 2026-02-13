-- ============================================
-- COMPLEET SUPABASE SCHEMA VOOR WEBSHOP
-- ============================================
-- Voer dit uit in je Supabase SQL Editor
-- Kopieer alles en plak het in de SQL Editor, klik dan op "Run" (of druk F5)

-- ============================================
-- 1. PRODUCTS TABEL (uitgebreid)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artikelcode TEXT NOT NULL UNIQUE,
  artikelomschrijving TEXT NOT NULL,
  afbeelding TEXT NOT NULL,
  potmaat TEXT NOT NULL,
  verpakkingsinhoud TEXT NOT NULL,
  wetenschappelijkeNaam TEXT,
  -- Nieuwe velden voor webshop
  prijs DECIMAL(10,2),
  voorraad INTEGER DEFAULT 0,
  categorie TEXT,
  beschikbaar BOOLEAN DEFAULT true,
  -- SEO velden
  meta_title TEXT,
  meta_description TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexen voor performance (belangrijk voor 10.000 producten!)
CREATE INDEX IF NOT EXISTS idx_products_artikelcode ON products(artikelcode);
CREATE INDEX IF NOT EXISTS idx_products_artikelomschrijving ON products(artikelomschrijving);
CREATE INDEX IF NOT EXISTS idx_products_categorie ON products(categorie);
CREATE INDEX IF NOT EXISTS idx_products_beschikbaar ON products(beschikbaar);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Full-text search index voor snelle zoekopdrachten
CREATE INDEX IF NOT EXISTS idx_products_search 
ON products USING gin(to_tsvector('dutch', 
  COALESCE(artikelomschrijving, '') || ' ' || 
  COALESCE(wetenschappelijkenaam, '') || ' ' ||
  COALESCE(artikelcode, '')
));

-- ============================================
-- 2. CUSTOMERS TABEL
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  bedrijfsnaam TEXT,
  kvk_nummer TEXT,
  telefoon TEXT,
  -- Adres informatie (JSONB voor flexibiliteit)
  adres JSONB,
  -- Auth relatie (optioneel, als je Supabase Auth gebruikt)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);

-- ============================================
-- 3. ORDERS TABEL
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_nummer TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  -- Order status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  -- Prijzen
  subtotaal DECIMAL(10,2) NOT NULL DEFAULT 0,
  btw DECIMAL(10,2) NOT NULL DEFAULT 0,
  verzendkosten DECIMAL(10,2) NOT NULL DEFAULT 0,
  totaal DECIMAL(10,2) NOT NULL DEFAULT 0,
  -- Verzend informatie
  verzendadres JSONB NOT NULL,
  factuuradres JSONB,
  -- Opmerkingen
  opmerkingen TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  verzenddatum TIMESTAMP WITH TIME ZONE,
  leverdatum TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_nummer ON orders(order_nummer);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 4. ORDER ITEMS TABEL
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  artikelcode TEXT NOT NULL,
  artikelomschrijving TEXT NOT NULL,
  hoeveelheid INTEGER NOT NULL CHECK (hoeveelheid > 0),
  eenheidsprijs DECIMAL(10,2) NOT NULL,
  totaalprijs DECIMAL(10,2) NOT NULL,
  -- Extra info (voor als product wordt verwijderd)
  product_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_artikelcode ON order_items(artikelcode);

-- ============================================
-- 5. CART ITEMS TABEL (voor persistent winkelwagentje)
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  artikelcode TEXT NOT NULL,
  hoeveelheid INTEGER NOT NULL DEFAULT 1 CHECK (hoeveelheid > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, artikelcode),
  UNIQUE(customer_id, artikelcode)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_artikelcode ON cart_items(artikelcode);

-- ============================================
-- 6. CATEGORIES TABEL (optioneel)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  beschrijving TEXT,
  afbeelding TEXT,
  volgorde INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Products: iedereen kan lezen
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access" ON products
  FOR SELECT
  USING (true);

-- Customers: alleen eigen data lezen
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own customer data" ON customers;
CREATE POLICY "Users can view own customer data" ON customers
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert own customer data" ON customers;
CREATE POLICY "Users can insert own customer data" ON customers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Orders: alleen eigen orders lezen
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = orders.customer_id 
      AND customers.user_id = auth.uid()
    ) OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Users can create own orders" ON orders;
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = orders.customer_id 
      AND customers.user_id = auth.uid()
    )
  );

-- Order items: alleen lezen via orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id
      AND EXISTS (
        SELECT 1 FROM customers 
        WHERE customers.id = orders.customer_id 
        AND customers.user_id = auth.uid()
      )
    ) OR auth.role() = 'service_role'
  );

-- Cart items: alleen eigen cart lezen
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cart" ON cart_items;
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Categories: iedereen kan lezen
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON categories;
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT
  USING (true);

-- ============================================
-- 8. FUNCTIES EN TRIGGERS
-- ============================================

-- Functie om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers voor updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at 
  BEFORE UPDATE ON cart_items
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Functie om order_nummer te genereren
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Genereer order nummer: ORD-YYYYMMDD-HHMMSS-RANDOM
    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                  TO_CHAR(NOW(), 'HH24MISS') || '-' || 
                  SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
    
    -- Check of het nummer al bestaat
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_nummer = new_number) INTO exists_check;
    
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger om automatisch order_nummer te genereren
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_nummer IS NULL OR NEW.order_nummer = '' THEN
    NEW.order_nummer := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Functie om totaal van order te berekenen
CREATE OR REPLACE FUNCTION calculate_order_total(order_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(totaalprijs), 0) INTO total
  FROM order_items
  WHERE order_id = order_uuid;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 9. VIEWS VOOR RAPPORTAGES
-- ============================================

-- View voor order overzicht met customer info
CREATE OR REPLACE VIEW order_overview AS
SELECT 
  o.id,
  o.order_nummer,
  o.status,
  o.totaal,
  o.created_at,
  c.naam AS customer_naam,
  c.email AS customer_email,
  c.bedrijfsnaam,
  COUNT(oi.id) AS aantal_items
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, c.id;

-- View voor product statistieken
CREATE OR REPLACE VIEW product_stats AS
SELECT 
  p.id,
  p.artikelcode,
  p.artikelomschrijving,
  p.voorraad,
  COUNT(oi.id) AS aantal_verkocht,
  SUM(oi.hoeveelheid) AS totale_hoeveelheid_verkocht,
  SUM(oi.totaalprijs) AS totale_omzet
FROM products p
LEFT JOIN order_items oi ON p.artikelcode = oi.artikelcode
GROUP BY p.id, p.artikelcode, p.artikelomschrijving, p.voorraad;

-- ============================================
-- VERIFICATIE QUERIES
-- ============================================

-- Check alle tabellen
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check alle indexen
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
