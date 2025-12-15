/**
 * Script om te pushen naar GitHub en te wachten op Vercel deployment
 * Test daarna of afbeeldingen laden
 */

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

// Configuratie
const GITHUB_REPO = 'diederik24/FotoSite';
const VERCEL_URL = process.env.VERCEL_URL || 'jouw-site.vercel.app'; // Vervang met je echte Vercel URL
const TEST_IMAGES = [
  'V09772',
  'V09669',
  'V09770',
  'V09990', // Werkende voor vergelijking
];

console.log('🚀 Push and Test Script\n');
console.log('='.repeat(60));

// Functie om command uit te voeren
function runCommand(command, description) {
  console.log(`\n📌 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`✅ ${description} voltooid`);
    if (output) {
      console.log(output.trim());
    }
    return true;
  } catch (error) {
    console.error(`❌ Fout bij ${description}:`);
    console.error(error.message);
    return false;
  }
}

// Functie om te wachten
function wait(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Functie om HTTP request te doen
function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          success: res.statusCode === 200,
          data: data.substring(0, 500), // Eerste 500 chars
        });
      });
    }).on('error', (err) => {
      resolve({
        status: 0,
        success: false,
        error: err.message,
      });
    });
  });
}

// Functie om deployment status te checken
async function checkDeployment(maxWaitMinutes = 5) {
  console.log(`\n⏳ Wachten op Vercel deployment (max ${maxWaitMinutes} minuten)...`);
  
  const startTime = Date.now();
  const maxWait = maxWaitMinutes * 60 * 1000;
  const checkInterval = 30 * 1000; // Check elke 30 seconden
  
  while (Date.now() - startTime < maxWait) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    console.log(`   Wachten... (${elapsed}s)`);
    
    // Check of de site bereikbaar is
    const result = await checkUrl(`https://${VERCEL_URL}`);
    
    if (result.success) {
      console.log(`✅ Site is online!`);
      return true;
    }
    
    await wait(30);
  }
  
  console.log(`⏰ Timeout bereikt na ${maxWaitMinutes} minuten`);
  return false;
}

// Functie om afbeeldingen te testen
async function testImages() {
  console.log('\n🧪 Testen van afbeeldingen...');
  console.log('-'.repeat(60));
  
  const results = [];
  
  for (const imageCode of TEST_IMAGES) {
    const webpUrl = `https://${VERCEL_URL}/Artikel%20Fotos/${imageCode}.webp`;
    const jpgUrl = `https://${VERCEL_URL}/Artikel%20Fotos/${imageCode}.jpg`;
    
    console.log(`\n📸 Testen ${imageCode}:`);
    
    // Test WebP
    const webpResult = await checkUrl(webpUrl);
    console.log(`   WebP: ${webpResult.success ? '✅' : '❌'} (Status: ${webpResult.status})`);
    
    // Test JPG als fallback
    const jpgResult = await checkUrl(jpgUrl);
    console.log(`   JPG:  ${jpgResult.success ? '✅' : '❌'} (Status: ${jpgResult.status})`);
    
    results.push({
      imageCode,
      webp: webpResult,
      jpg: jpgResult,
    });
  }
  
  // Samenvatting
  console.log('\n\n📊 Test Resultaten:');
  console.log('-'.repeat(60));
  
  results.forEach(result => {
    const status = result.webp.success ? '✅' : '❌';
    console.log(`${status} ${result.imageCode}: WebP=${result.webp.success ? 'OK' : 'FAIL'}, JPG=${result.jpg.success ? 'OK' : 'FAIL'}`);
  });
  
  const allWorking = results.every(r => r.webp.success || r.jpg.success);
  const allWebPWorking = results.every(r => r.webp.success);
  
  console.log(`\n✅ Alle afbeeldingen werken: ${allWorking ? 'JA' : 'NEE'}`);
  console.log(`✅ Alle WebP werken: ${allWebPWorking ? 'JA' : 'NEE'}`);
  
  return results;
}

// Main functie
async function main() {
  console.log('Configuratie:');
  console.log(`  GitHub Repo: ${GITHUB_REPO}`);
  console.log(`  Vercel URL: ${VERCEL_URL}`);
  console.log(`  Test Images: ${TEST_IMAGES.join(', ')}`);
  
  // Stap 1: Git add
  if (!runCommand('git add -A', 'Git add')) {
    console.error('❌ Git add gefaald');
    process.exit(1);
  }
  
  // Stap 2: Git commit
  const commitMessage = `Test image loading - ${new Date().toISOString()}`;
  if (!runCommand(`git commit -m "${commitMessage}"`, 'Git commit')) {
    console.log('⚠️  Geen wijzigingen om te committen');
  }
  
  // Stap 3: Git push
  if (!runCommand('git push', 'Git push')) {
    console.error('❌ Git push gefaald');
    process.exit(1);
  }
  
  console.log('\n✅ Code gepusht naar GitHub');
  console.log('   Vercel zal automatisch deployen...');
  
  // Stap 4: Wachten op deployment
  const deployed = await checkDeployment(5);
  
  if (!deployed) {
    console.log('\n⚠️  Deployment timeout - test handmatig op Vercel dashboard');
    console.log(`   URL: https://${VERCEL_URL}`);
    return;
  }
  
  // Stap 5: Test afbeeldingen
  await wait(10); // Extra wachttijd voor deployment om volledig klaar te zijn
  const results = await testImages();
  
  // Stap 6: Debug informatie
  console.log('\n\n🔍 Debug Informatie:');
  console.log('-'.repeat(60));
  
  results.forEach(result => {
    if (!result.webp.success) {
      console.log(`\n❌ ${result.imageCode}.webp faalt:`);
      console.log(`   Status: ${result.webp.status}`);
      console.log(`   Error: ${result.webp.error || 'Onbekend'}`);
      console.log(`   URL: https://${VERCEL_URL}/Artikel%20Fotos/${result.imageCode}.webp`);
      
      // Suggesties
      console.log(`\n   💡 Mogelijke oplossingen:`);
      console.log(`   1. Check of bestand bestaat op GitHub`);
      console.log(`   2. Check case-sensitivity (V vs v)`);
      console.log(`   3. Check Vercel deployment logs`);
      console.log(`   4. Test handmatig: curl https://${VERCEL_URL}/Artikel%20Fotos/${result.imageCode}.webp`);
    }
  });
  
  console.log('\n✅ Script voltooid!');
}

// Run
main().catch(console.error);

