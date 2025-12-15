const fs = require('fs');
const path = require('path');

// Lees products.ts
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let content = fs.readFileSync(productsPath, 'utf-8');

// Lees alle bestanden in public/Artikel Fotos
const imagesDir = path.join(__dirname, '..', 'public', 'Artikel Fotos');
const actualFiles = fs.readdirSync(imagesDir);

// Maak een map van artikelcode -> werkelijke bestandsnaam
const codeToFileMap = new Map();
actualFiles.forEach(file => {
  // Extract artikelcode uit bestandsnaam (bijv. V09664.jpg -> V09664)
  const match = file.match(/^([vV]\d+)\.jpg$/i);
  if (match) {
    const code = match[1].toUpperCase(); // Normaliseer naar hoofdletters
    codeToFileMap.set(code, file); // Bewaar originele bestandsnaam
  }
});

console.log(`Found ${codeToFileMap.size} image files`);
console.log(`Sample mappings:`);
Array.from(codeToFileMap.entries()).slice(0, 5).forEach(([code, file]) => {
  console.log(`  ${code} -> ${file}`);
});

// Vervang image paths op basis van artikelcode
let fixedCount = 0;
const fixedContent = content.replace(
  /\{\s*"artikelcode":\s*"([^"]+)",\s*"artikelomschrijving":\s*"[^"]*",\s*"afbeelding":\s*"\/Artikel Fotos\/([^"]+)"/g,
  (match, artikelcode, currentImageName) => {
    // Zoek de werkelijke bestandsnaam op basis van artikelcode
    const code = artikelcode.toUpperCase();
    const actualFile = codeToFileMap.get(code);
    
    if (actualFile && actualFile !== currentImageName) {
      console.log(`Fixing ${artikelcode}: ${currentImageName} -> ${actualFile}`);
      fixedCount++;
      return match.replace(`"afbeelding": "/Artikel Fotos/${currentImageName}"`, `"afbeelding": "/Artikel Fotos/${actualFile}"`);
    }
    return match;
  }
);

// Schrijf terug
fs.writeFileSync(productsPath, fixedContent, 'utf-8');
console.log(`\nFixed ${fixedCount} image paths!`);

