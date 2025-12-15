const fs = require('fs');
const path = require('path');

// Lees products.ts
const productsPath = path.join(__dirname, '..', 'data', 'products.ts');
const content = fs.readFileSync(productsPath, 'utf-8');

// Lees alle bestanden in public/Artikel Fotos
const imagesDir = path.join(__dirname, '..', 'public', 'Artikel Fotos');
const actualFiles = fs.readdirSync(imagesDir);
const fileMap = new Map();
actualFiles.forEach(file => {
  // Maak een case-insensitive map
  fileMap.set(file.toLowerCase(), file);
});

// Vervang image paths in products.ts
let fixedContent = content.replace(
  /"afbeelding":\s*"\/Artikel Fotos\/([^"]+)"/g,
  (match, imageName) => {
    // Zoek de werkelijke bestandsnaam (case-insensitive)
    const lowerName = imageName.toLowerCase();
    const actualFile = fileMap.get(lowerName);
    
    if (actualFile && actualFile !== imageName) {
      console.log(`Fixing: ${imageName} -> ${actualFile}`);
      return `"afbeelding": "/Artikel Fotos/${actualFile}"`;
    }
    return match;
  }
);

// Schrijf terug
fs.writeFileSync(productsPath, fixedContent, 'utf-8');
console.log('Image paths fixed!');

