/**
 * Script om Git te forceren om case-only renames te zien
 * Dit is nodig omdat Windows case-insensitive is maar Linux/Vercel case-sensitive
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/Artikel Fotos');

// Bestanden die hernoemd moeten worden (van kleine 'v' naar hoofdletter 'V')
const filesToRename = [
  'v09601.webp', 'v09601.jpg',
  'v09602.webp', 'v09602.jpg',
  'v09643.webp', 'v09643.jpg',
  'v09645.webp', 'v09645.jpg',
  'v09659.webp', 'v09659.jpg',
  'v09660.webp', 'v09660.jpg',
  'v09661.webp', 'v09661.jpg',
  'v09663.webp', 'v09663.jpg',
  'v09664.webp', 'v09664.jpg',
  'v09665.webp', 'v09665.jpg',
  'v09666.webp', 'v09666.jpg',
  'v09667.webp', 'v09667.jpg',
  'v09668.webp', 'v09668.jpg',
  'v09669.webp', 'v09669.jpg',
  'v09770.webp', 'v09770.jpg',
  'v09772.webp', 'v09772.jpg',
];

console.log('🔄 Force Git rename script\n');
console.log('='.repeat(60));
console.log(`📋 ${filesToRename.length} bestanden om te hernoemen\n`);

// Stap 1: Check welke bestanden in Git zitten
console.log('📌 Stap 1: Controleren welke bestanden in Git zitten...\n');

let filesInGit = [];
try {
  const gitFiles = execSync('git ls-files "public/Artikel Fotos/v*"', { encoding: 'utf8' });
  filesInGit = gitFiles.trim().split('\n').filter(f => f);
  console.log(`✅ ${filesInGit.length} bestanden met kleine 'v' gevonden in Git`);
  filesInGit.forEach(f => console.log(`   - ${f}`));
} catch (error) {
  console.log('⚠️  Geen bestanden met kleine v gevonden in Git (mogelijk al hernoemd)');
}

// Stap 2: Verwijder oude bestanden uit Git (maar niet van disk)
console.log('\n📌 Stap 2: Verwijderen oude bestanden uit Git index...\n');

filesToRename.forEach(file => {
  const oldPath = `public/Artikel Fotos/${file}`;
  const newPath = `public/Artikel Fotos/${file.charAt(0).toUpperCase() + file.slice(1)}`;
  
  try {
    // Verwijder uit Git index (maar behoud op disk)
    execSync(`git rm --cached "${oldPath}"`, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ Verwijderd uit Git: ${oldPath}`);
  } catch (error) {
    // Bestand bestaat mogelijk niet in Git (al verwijderd of nooit toegevoegd)
    console.log(`⚠️  ${oldPath} niet gevonden in Git index`);
  }
});

// Stap 3: Voeg nieuwe bestandsnamen toe
console.log('\n📌 Stap 3: Toevoegen nieuwe bestandsnamen aan Git...\n');

filesToRename.forEach(file => {
  const newFile = file.charAt(0).toUpperCase() + file.slice(1);
  const newPath = `public/Artikel Fotos/${newFile}`;
  const fullPath = path.join(imagesDir, newFile);
  
  if (fs.existsSync(fullPath)) {
    try {
      execSync(`git add "${newPath}"`, { encoding: 'utf8', stdio: 'pipe' });
      console.log(`✅ Toegevoegd aan Git: ${newPath}`);
    } catch (error) {
      console.log(`❌ Fout bij toevoegen ${newPath}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  Bestand bestaat niet: ${fullPath}`);
  }
});

// Stap 4: Check status
console.log('\n📌 Stap 4: Git status checken...\n');

try {
  const status = execSync('git status --short "public/Artikel Fotos/"', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('Git wijzigingen:');
    console.log(status);
  } else {
    console.log('⚠️  Geen wijzigingen gedetecteerd');
  }
} catch (error) {
  console.log('⚠️  Kon status niet ophalen');
}

console.log('\n✅ Script voltooid!');
console.log('\nVolgende stappen:');
console.log('1. Review de wijzigingen: git status');
console.log('2. Commit: git commit -m "Force Git rename: kleine v naar hoofdletter V"');
console.log('3. Push: git push');

