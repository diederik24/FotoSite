const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/Artikel Fotos');
const productsFile = path.join(__dirname, '../data/products.ts');

async function convertToWebP() {
  // Lees alle JPG bestanden
  const files = fs.readdirSync(imagesDir).filter(file => 
    file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
  );

  console.log(`📸 ${files.length} JPG bestanden gevonden om te converteren...\n`);

  let converted = 0;
  let skipped = 0;
  let errors = 0;

  // Converteer elk bestand
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const outputPath = path.join(imagesDir, file.replace(/\.(jpg|jpeg)$/i, '.webp'));
    
    // Skip als WebP al bestaat
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  ${file} → al geconverteerd, overslaan`);
      skipped++;
      continue;
    }
    
    try {
      await sharp(inputPath)
        .webp({ quality: 85 }) // Goede balans tussen kwaliteit en bestandsgrootte
        .toFile(outputPath);
      
      console.log(`✅ ${file} → ${file.replace(/\.(jpg|jpeg)$/i, '.webp')}`);
      converted++;
    } catch (error) {
      console.error(`❌ Fout bij ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`\n📊 Conversie voltooid:`);
  console.log(`   ✅ Geconverteerd: ${converted}`);
  console.log(`   ⏭️  Overgeslagen: ${skipped}`);
  console.log(`   ❌ Fouten: ${errors}`);

  // Update products.ts paths
  if (converted > 0 || skipped > 0) {
    console.log(`\n🔄 Updaten van paths in products.ts...`);
    
    let content = fs.readFileSync(productsFile, 'utf8');
    
    // Vervang alle .jpg en .jpeg naar .webp in de paths
    const regex = /("afbeelding":\s*"\/Artikel Fotos\/[^"]+)\.(jpg|jpeg)(")/gi;
    let replacements = 0;
    
    content = content.replace(regex, (match, prefix, ext, suffix) => {
      replacements++;
      return `${prefix}.webp${suffix}`;
    });
    
    fs.writeFileSync(productsFile, content, 'utf8');
    console.log(`✅ ${replacements} paths geüpdatet naar .webp`);
  }

  console.log(`\n✨ Klaar! Alle afbeeldingen zijn nu WebP.`);
}

// Run de conversie
convertToWebP().catch(error => {
  console.error('❌ Fout tijdens conversie:', error);
  process.exit(1);
});

