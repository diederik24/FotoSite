# Image Loading Test Scripts

Scripts om te debuggen waarom sommige afbeeldingen niet laden.

## Scripts

### 1. `test-image-loading.js`
Lokaal testen en debug informatie verzamelen.

**Gebruik:**
```bash
npm run test-images
# of
node scripts/test-image-loading.js
```

**Wat het doet:**
- ✅ Controleert of alle bestanden bestaan
- ✅ Controleert of paths correct zijn in `products.ts`
- ✅ Controleert case-sensitivity van bestandsnamen
- ✅ Genereert een HTML test pagina (`public/image-test.html`)

**Test pagina:**
Open `http://localhost:3000/image-test.html` om verschillende laadstrategieën te testen.

### 2. `push-and-test.js`
Pusht naar GitHub, wacht op Vercel deployment en test afbeeldingen.

**Gebruik:**
```bash
npm run push-and-test
# of
node scripts/push-and-test.js
```

**Configuratie:**
Pas de `VERCEL_URL` aan in het script of gebruik een environment variable:
```bash
VERCEL_URL=jouw-site.vercel.app node scripts/push-and-test.js
```

**Wat het doet:**
1. ✅ Git add alle wijzigingen
2. ✅ Git commit met timestamp
3. ✅ Git push naar GitHub
4. ✅ Wacht op Vercel deployment (max 5 minuten)
5. ✅ Test of afbeeldingen bereikbaar zijn
6. ✅ Geeft debug informatie

## Problematische Afbeeldingen

De scripts testen deze afbeeldingen:
- V09772
- V09669
- V09770
- V09664
- V09665
- V09666
- V09667
- V09668

En vergelijken met werkende afbeelding:
- V09990

## Debug Stappen

1. **Lokaal testen:**
   ```bash
   npm run test-images
   npm run dev
   # Open http://localhost:3000/image-test.html
   ```

2. **Check browser console:**
   - Open Developer Tools (F12)
   - Kijk naar errors in Console tab
   - Check Network tab voor failed requests

3. **Test op Vercel:**
   ```bash
   npm run push-and-test
   ```

4. **Handmatig testen:**
   - Open: `https://jouw-site.vercel.app/image-test.html`
   - Check console voor debug info
   - Test verschillende image paths

## Mogelijke Problemen

### Bestand bestaat niet
- Check of bestand in `public/Artikel Fotos/` staat
- Check of bestand is gecommit naar GitHub

### Case-sensitivity
- Windows is case-insensitive, Linux/Vercel niet
- Zorg dat bestandsnamen exact matchen (V vs v)

### Path mismatch
- Check `products.ts` voor correcte paths
- Paths moeten beginnen met `/Artikel Fotos/`

### Deployment issues
- Check Vercel deployment logs
- Check of alle bestanden zijn geüpload
- Wacht tot deployment volledig klaar is

