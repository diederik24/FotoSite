const fs = require('fs');
const path = require('path');

// Lees products.ts
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
let content = fs.readFileSync(productsPath, 'utf-8');

// Lees alle bestanden in public/Artikel Fotos
const imagesDir = path.join(__dirname, '..', 'public', 'Artikel Fotos');
const actualFiles = fs.readdirSync(imagesDir);

// Maak een map van lowercase naam -> werkelijke naam
const fileMap = new Map();
actualFiles.forEach(file => {
  fileMap.set(file.toLowerCase(), file);
});

console.log(`Found ${actualFiles.length} image files`);
console.log(`Sample mappings:`);
Array.from(fileMap.entries()).slice(0, 10).forEach(([lower, actual]) => {
  if (lower !== actual) {
    console.log(`  ${lower} -> ${actual}`);
  }
});

let fixedCount = 0;

// Vervang alle image paths
const fixedContent = content.replace(
  /"afbeelding":\s*"\/Artikel Fotos\/([^"]+)"/g,
  (match, imageName) => {
    const lowerName = imageName.toLowerCase();
    const actualFile = fileMap.get(lowerName);
    
    if (actualFile && actualFile !== imageName) {
      console.log(`Fixing: ${imageName} -> ${actualFile}`);
      fixedCount++;
      return `"afbeelding": "/Artikel Fotos/${actualFile}"`;
    }
    return match;
  }
);

fs.writeFileSync(productsPath, fixedContent, 'utf-8');
console.log(`\nFixed ${fixedCount} image paths!`);

