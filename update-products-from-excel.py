import json
import re
import openpyxl
from pathlib import Path

# Pad naar Excel bestand (relatief vanaf workspace root)
workspace_root = Path(__file__).parent.parent.parent
excel_path = workspace_root / "straver-website" / "mosters  vergeldt bouten (version 1).xlsx"

# Als het bestand niet bestaat, probeer het absolute pad
if not excel_path.exists():
    excel_path = Path(r"C:\Users\diede\Downloads\Fruit foto\straver-website\mosters  vergeldt bouten (version 1).xlsx")

# Pad naar products.ts
products_ts_path = Path(__file__).parent / "data" / "products.ts"

print(f"Lezen van Excel: {excel_path}")
print(f"Updaten van: {products_ts_path}")

# Lees Excel bestand
try:
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    ws = wb.active
    
    # Maak dictionary van Excel data (artikelcode -> {omschrijving, potmaat})
    excel_data = {}
    
    # Skip header row en lees data
    for row in ws.iter_rows(min_row=2, values_only=True):
        artikelcode = str(row[0]).strip() if row[0] else ""  # Kolom A
        artikelomschrijving = str(row[1]).strip() if row[1] else ""  # Kolom B
        potmaat = str(row[5]).strip() if len(row) > 5 and row[5] else ""  # Kolom F (index 5)
        
        if artikelcode:
            # Maak artikelcode lowercase voor matching (niet hoofdlettergevoelig)
            excel_data[artikelcode.lower()] = {
                "artikelcode": artikelcode,
                "artikelomschrijving": artikelomschrijving,
                "potmaat": potmaat
            }
    
    print(f"✅ {len(excel_data)} artikelen gelezen uit Excel")
    
except Exception as e:
    print(f"❌ Fout bij lezen Excel: {e}")
    exit(1)

# Lees products.ts bestand
try:
    with open(products_ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract de JSON array uit het TypeScript bestand
    # Zoek naar de array tussen de vierkante haken
    match = re.search(r'export const plantenData: Product\[\] = (\[.*?\]);', content, re.DOTALL)
    
    if not match:
        print("❌ Kon plantenData array niet vinden in products.ts")
        exit(1)
    
    # Parse de JSON array
    products_json = match.group(1)
    products = json.loads(products_json)
    
    print(f"✅ {len(products)} producten gelezen uit products.ts")
    
    # Update producten met Excel data
    updated_omschrijving_count = 0
    updated_potmaat_count = 0
    for product in products:
        artikelcode_lower = product['artikelcode'].lower()
        
        if artikelcode_lower in excel_data:
            excel_item = excel_data[artikelcode_lower]
            
            # Update alleen als er data is
            if excel_item['artikelomschrijving']:
                product['artikelomschrijving'] = excel_item['artikelomschrijving']
                updated_omschrijving_count += 1
            
            if excel_item['potmaat']:
                product['potmaat'] = excel_item['potmaat']
                updated_potmaat_count += 1
    
    print(f"✅ {updated_omschrijving_count} producten geüpdatet met artikelomschrijving")
    print(f"✅ {updated_potmaat_count} producten geüpdatet met potmaat")
    
    # Genereer nieuwe TypeScript content
    products_json_str = json.dumps(products, indent=2, ensure_ascii=False)
    
    new_content = f"""import {{ Product }} from '@/lib/types';

export const plantenData: Product[] = {products_json_str};

export function getProductByCode(artikelcode: string): Product | undefined {{
  return plantenData.find(p => p.artikelcode.toLowerCase() === artikelcode.toLowerCase());
}}
"""
    
    # Schrijf terug naar bestand
    with open(products_ts_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ products.ts succesvol geüpdatet!")
    print(f"📊 Totaal producten: {len(products)}")
    print(f"📝 Geüpdatet met Excel data: {updated_omschrijving_count} artikelomschrijvingen, {updated_potmaat_count} potmaten")
    
except Exception as e:
    print(f"❌ Fout bij verwerken products.ts: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

