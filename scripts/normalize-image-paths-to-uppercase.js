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

let fixedCount = 0;
const fixes = [];

// Vervang alle image paths - converteer naar hoofdletters zoals V09990
const fixedContent = content.replace(
  /"afbeelding":\s*"\/Artikel Fotos\/([^"]+)"/g,
  (match, imageName) => {
    const lowerName = imageName.toLowerCase();
    const actualFile = fileMap.get(lowerName);
    
    if (actualFile) {
      // Converteer naar hoofdletters (zoals V09990)
      const upperCaseName = imageName.toUpperCase();
      const upperCaseActual = actualFile.toUpperCase();
      
      // Check of het bestand bestaat met hoofdletters
      const upperCaseFile = fileMap.get(upperCaseName.toLowerCase());
      
      if (upperCaseFile && upperCaseFile.toUpperCase() === upperCaseName) {
        // Bestand bestaat, gebruik hoofdletter versie
        if (actualFile !== upperCaseName) {
          console.log(`Converting to uppercase: ${imageName} -> ${upperCaseName}`);
          fixes.push({ from: imageName, to: upperCaseName });
          fixedCount++;
          return `"afbeelding": "/Artikel Fotos/${upperCaseName}"`;
        }
      } else {
        // Gebruik werkelijke bestandsnaam
        if (actualFile !== imageName) {
          console.log(`Using actual filename: ${imageName} -> ${actualFile}`);
          fixes.push({ from: imageName, to: actualFile });
          fixedCount++;
          return `"afbeelding": "/Artikel Fotos/${actualFile}"`;
        }
      }
    }
    return match;
  }
);

fs.writeFileSync(productsPath, fixedContent, 'utf-8');
console.log(`\nFixed ${fixedCount} image paths!`);
if (fixes.length > 0) {
  console.log('\nFirst 10 fixes:');
  fixes.slice(0, 10).forEach(({ from, to }) => {
    console.log(`  ${from} -> ${to}`);
  });
}

