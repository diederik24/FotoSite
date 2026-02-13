-- ============================================
-- CUSTOMERS ACCOUNTS SETUP
-- ============================================
-- Dit script maakt het mogelijk voor klanten om accounts aan te maken
-- Voer dit uit NA het complete schema (supabase-complete-schema.sql)

-- ============================================
-- 1. VERWIJDER OUDE POLICIES (als ze bestaan)
-- ============================================
DROP POLICY IF EXISTS "Users can view own customer data" ON customers;
DROP POLICY IF EXISTS "Users can insert own customer data" ON customers;
DROP POLICY IF EXISTS "Users can update own customer data" ON customers;
DROP POLICY IF EXISTS "Public can create customer" ON customers;
DROP POLICY IF EXISTS "Service role can manage all customers" ON customers;

-- ============================================
-- 2. POLICIES VOOR CUSTOMERS TABEL
-- ============================================

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Iedereen kan een customer account aanmaken (zonder authenticatie)
-- Dit is handig voor guest checkout of registratie
CREATE POLICY "Public can create customer" ON customers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Gebruikers kunnen hun eigen customer data lezen
CREATE POLICY "Users can view own customer data" ON customers
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.role() = 'service_role'
  );

-- Policy: Gebruikers kunnen hun eigen customer data updaten
CREATE POLICY "Users can update own customer data" ON customers
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role kan alles (voor admin operaties)
CREATE POLICY "Service role can manage all customers" ON customers
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 3. FUNCTIE OM CUSTOMER TE MAKEN MET AUTH USER
-- ============================================
-- Deze functie maakt automatisch een customer aan wanneer een gebruiker zich registreert

CREATE OR REPLACE FUNCTION create_customer_from_auth()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (
    email,
    naam,
    user_id
  )
  VALUES (
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'naam', NEW.email),
    NEW.id
  )
  ON CONFLICT (email) DO UPDATE
  SET user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger om automatisch customer aan te maken bij user registratie
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_customer_from_auth();

-- ============================================
-- 4. FUNCTIE OM CUSTOMER HANDMATIG AAN TE MAKEN
-- ============================================
-- Deze functie kan worden aangeroepen vanuit je applicatie

CREATE OR REPLACE FUNCTION create_customer(
  p_email TEXT,
  p_naam TEXT,
  p_bedrijfsnaam TEXT DEFAULT NULL,
  p_kvk_nummer TEXT DEFAULT NULL,
  p_telefoon TEXT DEFAULT NULL,
  p_adres JSONB DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_customer_id UUID;
BEGIN
  INSERT INTO customers (
    email,
    naam,
    bedrijfsnaam,
    kvk_nummer,
    telefoon,
    adres,
    user_id
  )
  VALUES (
    p_email,
    p_naam,
    p_bedrijfsnaam,
    p_kvk_nummer,
    p_telefoon,
    p_adres,
    p_user_id
  )
  ON CONFLICT (email) DO UPDATE
  SET 
    naam = EXCLUDED.naam,
    bedrijfsnaam = EXCLUDED.bedrijfsnaam,
    kvk_nummer = EXCLUDED.kvk_nummer,
    telefoon = EXCLUDED.telefoon,
    adres = EXCLUDED.adres,
    user_id = COALESCE(EXCLUDED.user_id, customers.user_id),
    updated_at = NOW()
  RETURNING id INTO v_customer_id;
  
  RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. FUNCTIE OM CUSTOMER TE UPDATEN
-- ============================================

CREATE OR REPLACE FUNCTION update_customer(
  p_customer_id UUID,
  p_naam TEXT DEFAULT NULL,
  p_bedrijfsnaam TEXT DEFAULT NULL,
  p_kvk_nummer TEXT DEFAULT NULL,
  p_telefoon TEXT DEFAULT NULL,
  p_adres JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE customers
  SET 
    naam = COALESCE(p_naam, naam),
    bedrijfsnaam = COALESCE(p_bedrijfsnaam, bedrijfsnaam),
    kvk_nummer = COALESCE(p_kvk_nummer, kvk_nummer),
    telefoon = COALESCE(p_telefoon, telefoon),
    adres = COALESCE(p_adres, adres),
    updated_at = NOW()
  WHERE id = p_customer_id
    AND (auth.uid() = user_id OR auth.role() = 'service_role');
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. FUNCTIE OM CUSTOMER TE ZOEKEN OP EMAIL
-- ============================================

CREATE OR REPLACE FUNCTION get_customer_by_email(p_email TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  naam TEXT,
  bedrijfsnaam TEXT,
  kvk_nummer TEXT,
  telefoon TEXT,
  adres JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.email,
    c.naam,
    c.bedrijfsnaam,
    c.kvk_nummer,
    c.telefoon,
    c.adres,
    c.user_id,
    c.created_at,
    c.updated_at
  FROM customers c
  WHERE c.email = p_email
    AND (
      auth.uid() = c.user_id 
      OR auth.role() = 'service_role'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. VOORBEELD QUERIES
-- ============================================

-- Voorbeeld 1: Maak een customer aan zonder authenticatie (guest)
-- SELECT create_customer(
--   'klant@voorbeeld.nl',
--   'Jan Jansen',
--   'Jansen BV',
--   '12345678',
--   '0612345678',
--   '{"straat": "Voorbeeldstraat 1", "postcode": "1234AB", "stad": "Amsterdam", "land": "Nederland"}'::jsonb
-- );

-- Voorbeeld 2: Maak een customer aan met user_id (na authenticatie)
-- SELECT create_customer(
--   'klant@voorbeeld.nl',
--   'Jan Jansen',
--   'Jansen BV',
--   '12345678',
--   '0612345678',
--   '{"straat": "Voorbeeldstraat 1", "postcode": "1234AB", "stad": "Amsterdam", "land": "Nederland"}'::jsonb,
--   auth.uid() -- huidige gebruiker
-- );

-- Voorbeeld 3: Update customer gegevens
-- SELECT update_customer(
--   'customer-uuid-hier',
--   'Jan Jansen Updated',
--   'Jansen BV Updated',
--   '87654321',
--   '0687654321',
--   '{"straat": "Nieuwe Straat 2", "postcode": "5678CD", "stad": "Rotterdam", "land": "Nederland"}'::jsonb
-- );

-- Voorbeeld 4: Zoek customer op email
-- SELECT * FROM get_customer_by_email('klant@voorbeeld.nl');

-- ============================================
-- 8. VERIFICATIE
-- ============================================

-- Check of de functies zijn aangemaakt
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'create_customer_from_auth',
    'create_customer',
    'update_customer',
    'get_customer_by_email'
  )
ORDER BY routine_name;

-- Check of de policies correct zijn ingesteld
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'customers'
ORDER BY policyname;

-- ============================================
-- KLAAR!
-- ============================================
-- Na het uitvoeren van dit script kunnen klanten:
-- ✅ Zichzelf aanmelden via Supabase Auth
-- ✅ Automatisch een customer record krijgen
-- ✅ Hun eigen gegevens bekijken en updaten
-- ✅ Handmatig een account aanmaken (zonder auth)
-- ✅ Via functies customer accounts beheren
