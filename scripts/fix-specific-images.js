const fs = require('fs');
const path = require('path');

// Specifieke mappings voor problematische afbeeldingen
const fixes = {
  'V09664': 'v09664.jpg',
  'V09665': 'v09665.jpg',
  'V09666': 'v09666.jpg',
  'V09667': 'v09667.jpg',
  'V09668': 'v09668.jpg',
  'V09669': 'v09669.jpg',
  'V09770': 'v09770.jpg',
  'V09772': 'v09772.jpg',
};

// Lees products.ts
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let content = fs.readFileSync(productsPath, 'utf-8');

let fixedCount = 0;

// Fix elk probleem
Object.entries(fixes).forEach(([code, fileName]) => {
  // Zoek de regel met deze artikelcode en fix de afbeelding path
  const regex = new RegExp(`("artikelcode":\\s*"${code}"[^}]*"afbeelding":\\s*")/Artikel Fotos/[^"]+"`, 'g');
  const newContent = content.replace(regex, (match) => {
    // Vervang de image path
    const fixed = match.replace(/\/Artikel Fotos\/[^"]+/, `/Artikel Fotos/${fileName}`);
    console.log(`Fixing ${code}: ${match.match(/\/Artikel Fotos\/([^"]+)/)?.[1]} -> ${fileName}`);
    fixedCount++;
    return fixed;
  });
  content = newContent;
});

// Schrijf terug
fs.writeFileSync(productsPath, content, 'utf-8');
console.log(`\nFixed ${fixedCount} image paths!`);

