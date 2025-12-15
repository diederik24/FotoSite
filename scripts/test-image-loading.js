/**
 * Script om verschillende image loading strategieën te testen
 * en te debuggen waarom sommige afbeeldingen niet laden
 */

const fs = require('fs');
const path = require('path');

// Problematische afbeeldingen (die niet laden)
const problematicImages = [
  'V09772',
  'V09669',
  'V09770',
  'V09664',
  'V09665',
  'V09666',
  'V09667',
  'V09668',
];

// Werkende afbeelding (ter vergelijking)
const workingImage = 'V09990';

const imagesDir = path.join(__dirname, '../public/Artikel Fotos');
const productsFile = path.join(__dirname, '../data/products.ts');

console.log('🔍 Image Loading Debug Script\n');
console.log('=' .repeat(60));

// Functie om bestand te checken
function checkFileExists(filename) {
  const webpPath = path.join(imagesDir, `${filename}.webp`);
  const jpgPath = path.join(imagesDir, `${filename}.jpg`);
  
  return {
    filename,
    webpExists: fs.existsSync(webpPath),
    jpgExists: fs.existsSync(jpgPath),
    webpPath: webpPath,
    jpgPath: jpgPath,
    webpSize: fs.existsSync(webpPath) ? fs.statSync(webpPath).size : 0,
    jpgSize: fs.existsSync(jpgPath) ? fs.statSync(jpgPath).size : 0,
  };
}

// Functie om path in products.ts te checken
function checkPathInProducts(filename) {
  const content = fs.readFileSync(productsFile, 'utf8');
  const regex = new RegExp(`"afbeelding":\\s*"/Artikel Fotos/${filename}\\.webp"`, 'i');
  const match = content.match(regex);
  
  return {
    found: !!match,
    exactMatch: match ? match[0] : null,
    caseMatch: content.includes(`/${filename}.webp`) || content.includes(`/${filename.toLowerCase()}.webp`) || content.includes(`/${filename.toUpperCase()}.webp`),
  };
}

// Functie om bestandsnaam case te checken
function checkActualFilename(filename) {
  const files = fs.readdirSync(imagesDir);
  const exactMatch = files.find(f => f === `${filename}.webp`);
  const caseInsensitiveMatch = files.find(f => f.toLowerCase() === `${filename.toLowerCase()}.webp`);
  
  return {
    exactMatch: exactMatch || null,
    caseInsensitiveMatch: caseInsensitiveMatch || null,
    actualFilename: caseInsensitiveMatch || null,
  };
}

console.log('\n📋 Stap 1: Bestandscontrole\n');
console.log('-'.repeat(60));

// Check werkende afbeelding eerst
console.log(`\n✅ Werkende afbeelding (${workingImage}):`);
const workingCheck = checkFileExists(workingImage);
console.log(`   WebP bestaat: ${workingCheck.webpExists ? '✅' : '❌'}`);
console.log(`   JPG bestaat: ${workingCheck.jpgExists ? '✅' : '❌'}`);
console.log(`   WebP grootte: ${workingCheck.webpSize} bytes`);
const workingPathCheck = checkPathInProducts(workingImage);
console.log(`   Path in products.ts: ${workingPathCheck.found ? '✅' : '❌'}`);
if (workingPathCheck.exactMatch) {
  console.log(`   Exact path: ${workingPathCheck.exactMatch}`);
}

// Check problematische afbeeldingen
console.log(`\n❌ Problematische afbeeldingen:`);
const problematicChecks = problematicImages.map(img => {
  const fileCheck = checkFileExists(img);
  const pathCheck = checkPathInProducts(img);
  const filenameCheck = checkActualFilename(img);
  
  console.log(`\n   ${img}:`);
  console.log(`   WebP bestaat: ${fileCheck.webpExists ? '✅' : '❌'}`);
  console.log(`   JPG bestaat: ${fileCheck.jpgExists ? '✅' : '❌'}`);
  console.log(`   WebP grootte: ${fileCheck.webpSize} bytes`);
  console.log(`   Path in products.ts: ${pathCheck.found ? '✅' : '❌'}`);
  if (pathCheck.exactMatch) {
    console.log(`   Exact path: ${pathCheck.exactMatch}`);
  }
  console.log(`   Bestandsnaam exact match: ${filenameCheck.exactMatch ? '✅' : '❌'}`);
  if (filenameCheck.actualFilename && filenameCheck.actualFilename !== `${img}.webp`) {
    console.log(`   ⚠️  Bestandsnaam mismatch: ${filenameCheck.actualFilename} (verwacht: ${img}.webp)`);
  }
  
  return {
    filename: img,
    fileCheck,
    pathCheck,
    filenameCheck,
  };
});

// Samenvatting
console.log('\n\n📊 Samenvatting:\n');
console.log('-'.repeat(60));

const allFilesExist = problematicChecks.every(check => check.fileCheck.webpExists);
const allPathsCorrect = problematicChecks.every(check => check.pathCheck.found);
const allFilenamesMatch = problematicChecks.every(check => 
  check.filenameCheck.exactMatch === `${check.filename}.webp`
);

console.log(`✅ Alle bestanden bestaan: ${allFilesExist ? 'JA' : 'NEE'}`);
console.log(`✅ Alle paths correct: ${allPathsCorrect ? 'JA' : 'NEE'}`);
console.log(`✅ Alle bestandsnamen matchen: ${allFilenamesMatch ? 'JA' : 'NEE'}`);

// Genereer HTML test pagina
console.log('\n\n🌐 Stap 2: Genereren test HTML pagina\n');
console.log('-'.repeat(60));

const testHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Loading Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
        }
        .test-section {
            background: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .test-section h2 {
            margin-top: 0;
            color: #333;
        }
        .image-container {
            display: inline-block;
            margin: 10px;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            vertical-align: top;
        }
        .image-container img {
            display: block;
            max-width: 200px;
            max-height: 200px;
        }
        .status {
            margin-top: 10px;
            padding: 5px;
            border-radius: 4px;
            font-size: 12px;
        }
        .status.loading { background: #fff3cd; color: #856404; }
        .status.success { background: #d4edda; color: #155724; }
        .status.error { background: #f8d7da; color: #721c24; }
        .info {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <h1>🔍 Image Loading Test</h1>
    <p>Test verschillende manieren om afbeeldingen te laden</p>
    
    <div class="test-section">
        <h2>✅ Werkende afbeelding (${workingImage})</h2>
        <div class="image-container">
            <img id="working-img" src="/Artikel Fotos/${workingImage}.webp" alt="Working" />
            <div id="working-status" class="status loading">Laden...</div>
            <div id="working-info" class="info"></div>
        </div>
    </div>
    
    <div class="test-section">
        <h2>❌ Problematische afbeeldingen</h2>
        ${problematicImages.map(img => `
        <div class="image-container">
            <h3>${img}</h3>
            <div>
                <strong>Methode 1: Direct WebP</strong><br>
                <img id="${img}-1" src="/Artikel Fotos/${img}.webp" alt="${img}" />
                <div id="${img}-1-status" class="status loading">Laden...</div>
            </div>
            <div style="margin-top: 10px;">
                <strong>Methode 2: JPG fallback</strong><br>
                <img id="${img}-2" src="/Artikel Fotos/${img}.jpg" alt="${img}" />
                <div id="${img}-2-status" class="status loading">Laden...</div>
            </div>
            <div id="${img}-info" class="info"></div>
        </div>
        `).join('')}
    </div>
    
    <div class="test-section">
        <h2>🔧 Debug Info</h2>
        <pre id="debug-info"></pre>
    </div>
    
    <script>
        const debugInfo = [];
        
        function logDebug(message) {
            debugInfo.push(\`[\${new Date().toLocaleTimeString()}] \${message}\`);
            document.getElementById('debug-info').textContent = debugInfo.join('\\n');
        }
        
        function testImage(imgId, src, statusId) {
            const img = document.getElementById(imgId);
            const status = document.getElementById(statusId);
            
            logDebug(\`Testen: \${imgId} met src: \${src}\`);
            
            img.onload = function() {
                status.textContent = '✅ Geladen';
                status.className = 'status success';
                logDebug(\`✅ \${imgId} geladen succesvol\`);
            };
            
            img.onerror = function(e) {
                status.textContent = '❌ Fout';
                status.className = 'status error';
                logDebug(\`❌ \${imgId} fout: \${src}\`);
                
                // Probeer alternatieve paths
                const altPaths = [
                    src.replace('.webp', '.jpg'),
                    src.replace('V', 'v'),
                    src.replace('V', 'v').replace('.webp', '.jpg'),
                ];
                
                logDebug(\`Proberen alternatieve paths voor \${imgId}...\`);
                altPaths.forEach((altPath, idx) => {
                    const testImg = new Image();
                    testImg.onload = () => logDebug(\`✅ Alternatief \${idx + 1} werkt: \${altPath}\`);
                    testImg.onerror = () => logDebug(\`❌ Alternatief \${idx + 1} faalt: \${altPath}\`);
                    testImg.src = altPath;
                });
            };
            
            // Check of image al geladen is
            if (img.complete) {
                if (img.naturalHeight !== 0) {
                    status.textContent = '✅ Al geladen';
                    status.className = 'status success';
                } else {
                    status.textContent = '❌ Fout (complete maar geen height)';
                    status.className = 'status error';
                }
            }
        }
        
        // Test werkende afbeelding
        testImage('working-img', '/Artikel Fotos/${workingImage}.webp', 'working-status');
        
        // Test problematische afbeeldingen
        ${problematicImages.map(img => `
        testImage('${img}-1', '/Artikel Fotos/${img}.webp', '${img}-1-status');
        testImage('${img}-2', '/Artikel Fotos/${img}.jpg', '${img}-2-status');
        `).join('')}
        
        logDebug('Script geladen, tests gestart');
    </script>
</body>
</html>`;

const testHtmlPath = path.join(__dirname, '../public/image-test.html');
fs.writeFileSync(testHtmlPath, testHtml, 'utf8');
console.log(`✅ Test HTML pagina gegenereerd: ${testHtmlPath}`);
console.log(`   Open: http://localhost:3000/image-test.html (lokaal)`);
console.log(`   Of: https://jouw-site.vercel.app/image-test.html (productie)`);

console.log('\n\n📝 Stap 3: Aanbevelingen\n');
console.log('-'.repeat(60));

if (!allFilesExist) {
  console.log('❌ Sommige bestanden bestaan niet - controleer of alle WebP bestanden zijn geconverteerd');
}

if (!allPathsCorrect) {
  console.log('❌ Sommige paths zijn incorrect - update products.ts');
}

if (!allFilenamesMatch) {
  console.log('⚠️  Bestandsnaam case-sensitivity problemen gevonden');
  problematicChecks.forEach(check => {
    if (check.filenameCheck.actualFilename && check.filenameCheck.actualFilename !== `${check.filename}.webp`) {
      console.log(`   ${check.filename}: verwacht ${check.filename}.webp, gevonden ${check.filenameCheck.actualFilename}`);
    }
  });
}

console.log('\n✅ Script voltooid!');
console.log('\nVolgende stappen:');
console.log('1. Open de test HTML pagina in je browser');
console.log('2. Check de console voor debug informatie');
console.log('3. Check de Network tab voor failed requests');
console.log('4. Push naar GitHub en test op Vercel');

