-- Test query om TEST001 op te halen
SELECT * FROM products WHERE artikelcode = 'TEST001';

-- Of case-insensitive
SELECT * FROM products WHERE UPPER(artikelcode) = 'TEST001';

-- Check alle artikelcodes die beginnen met TEST
SELECT artikelcode, artikelomschrijving FROM products WHERE artikelcode LIKE 'TEST%';

