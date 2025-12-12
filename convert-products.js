const fs = require('fs');
const path = require('path');

// Lees het product-data.js bestand
const productDataPath = path.join(__dirname, '..', 'product-data.js');
const content = fs.readFileSync(productDataPath, 'utf-8');

// Extract de array data
const arrayMatch = content.match(/const plantenData = \[([\s\S]*?)\];/);
if (!arrayMatch) {
  console.error('Kon plantenData array niet vinden');
  process.exit(1);
}

// Parse de JavaScript array naar een JavaScript object
const arrayContent = arrayMatch[1];
const products = [];

// Extract individuele producten met regex
const productPattern = /\{\s*artikelcode:\s*'([^']*)',\s*artikelomschrijving:\s*'([^']*)',\s*afbeelding:\s*'([^']*)',\s*potmaat:\s*'([^']*)',\s*verpakkingsinhoud:\s*'([^']*)'\s*\}/g;

let match;
while ((match = productPattern.exec(arrayContent)) !== null) {
  const [, artikelcode, artikelomschrijving, afbeelding, potmaat, verpakkingsinhoud] = match;
  
  // Converteer afbeelding pad naar Next.js public pad
  const imagePath = afbeelding.replace('Artikel Fotos/', '/Artikel Fotos/');
  
  products.push({
    artikelcode,
    artikelomschrijving,
    afbeelding: imagePath,
    potmaat,
    verpakkingsinhoud
  });
}

// Genereer TypeScript bestand
const tsContent = `import { Product } from './types';

export const plantenData: Product[] = ${JSON.stringify(products, null, 2)};

export function getProductByCode(artikelcode: string): Product | undefined {
  return plantenData.find(p => p.artikelcode === artikelcode);
}
`;

// Schrijf naar data/products.ts
const outputPath = path.join(__dirname, 'data', 'products.ts');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`✅ ${products.length} producten geconverteerd naar ${outputPath}`);

