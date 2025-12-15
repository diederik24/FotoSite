const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '../data/products.ts');

// Lees het bestand
let content = fs.readFileSync(productsFile, 'utf8');

// Vervang alle kleine 'v' in paths naar hoofdletter 'V'
// Alleen voor paths die beginnen met "/Artikel Fotos/v"
const regex = /("afbeelding":\s*"\/Artikel Fotos\/)v([0-9]+\.jpg")/g;

let replacements = 0;
content = content.replace(regex, (match, prefix, rest) => {
  replacements++;
  return `${prefix}V${rest}`;
});

// Schrijf terug
fs.writeFileSync(productsFile, content, 'utf8');

console.log(`✅ ${replacements} image paths geüpdatet naar hoofdletter V`);
console.log('Voorbeelden van gewijzigde paths:');
console.log('  /Artikel Fotos/v09659.jpg → /Artikel Fotos/V09659.jpg');
console.log('  /Artikel Fotos/v09664.jpg → /Artikel Fotos/V09664.jpg');

