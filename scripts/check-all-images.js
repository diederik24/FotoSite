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
  fileMap.set(file.toLowerCase(), file);
  fileMap.set(file, file); // Ook exacte match
});

// Extract alle image paths
const imagePathRegex = /"afbeelding":\s*"\/Artikel Fotos\/([^"]+)"/g;
const missingImages = [];
const fixedImages = [];

let match;
while ((match = imagePathRegex.exec(content)) !== null) {
  const imageName = match[1];
  const lowerName = imageName.toLowerCase();
  const actualFile = fileMap.get(lowerName);
  
  if (!actualFile) {
    missingImages.push(imageName);
  } else if (actualFile !== imageName) {
    fixedImages.push({ from: imageName, to: actualFile });
  }
}

console.log(`\n=== Image Check Results ===`);
console.log(`Total images in data: ${(content.match(imagePathRegex) || []).length}`);
console.log(`Missing images: ${missingImages.length}`);
if (missingImages.length > 0) {
  console.log('\nMissing images:');
  missingImages.forEach(img => console.log(`  - ${img}`));
}

console.log(`\nImages that need fixing: ${fixedImages.length}`);
if (fixedImages.length > 0) {
  console.log('\nImages to fix:');
  fixedImages.forEach(({ from, to }) => console.log(`  ${from} -> ${to}`));
}

