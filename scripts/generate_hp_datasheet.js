const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function getBaseStyle() {
  return `
  @page {
    size: A4 portrait;
    margin: 14mm 15mm 14mm 15mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    font-size: 10.5px;
    line-height: 1.4;
  }
  .page {
    page-break-after: always;
    break-after: page;
    min-height: 260mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }
  .header {
    border-bottom: 3px solid #005080;
    padding-bottom: 10px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #005080;
    font-size: 18.5px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 18px;
    color: #005080;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .lang-tag {
    display: inline-block;
    background: #005080;
    color: #fff;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 9.5px;
    font-weight: 700;
    margin-right: 6px;
    vertical-align: middle;
  }
  .subtitle {
    font-size: 11.5px;
    color: #555;
    margin-top: 4px;
    font-weight: 500;
  }
  .overview-container {
    display: flex;
    gap: 16px;
    margin-bottom: 14px;
    align-items: center;
  }
  .overview-box {
    flex: 1;
    background: #f4f8fb;
    border-left: 4px solid #005080;
    padding: 9px 12px;
    font-size: 10.5px;
  }
  .overview-image {
    width: 145px;
    text-align: center;
  }
  .overview-image img {
    max-width: 140px;
    max-height: 90px;
    object-fit: contain;
  }
  h2 {
    color: #005080;
    font-size: 11.5px;
    border-bottom: 1px solid #c8d6e2;
    padding-bottom: 2px;
    margin-top: 10px;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
  }
  th, td {
    padding: 4px 7px;
    border-bottom: 1px solid #e1e7ec;
    text-align: left;
    font-size: 10px;
  }
  th {
    background-color: #eaf1f7;
    color: #1a334d;
    font-weight: 600;
    width: 38%;
  }
  td {
    color: #222;
  }
  .highlight-box {
    background-color: #fff8e6;
    border: 1px solid #ffe082;
    border-left: 4px solid #ffb300;
    padding: 6px 10px;
    margin-bottom: 8px;
    font-size: 10px;
    border-radius: 2px;
  }
  .footer {
    margin-top: auto;
    padding-top: 6px;
    border-top: 1px solid #ccc;
    font-size: 9px;
    color: #666;
    display: flex;
    justify-content: space-between;
  }
  `;
}

function generateHp9ubHtml() {
  const imgUrl = 'file:///g:/M%C3%B3j%20dysk/Projekty%20Antigravity/Eplan%20EDZ%20generator/EDZ/HP/HP.9UB87AA/9UB87AA.png';
  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>HP - Dual VESA Mount Bracket for HP Thin Client - 9UB87AA</title>
<style>${getBaseStyle()}</style>
</head>
<body>

<!-- SECTION 1: POLISH -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">PL</span>9UB87AA &bull; Podwójny uchwyt montażowy HP Dual VESA Mount Bracket</h1>
        <div class="subtitle">Zestaw montażowy VESA 100x100 mm do terminali HP Thin Client i monitorów &bull; Nr art. HP.9UB87AA</div>
      </div>
      <div class="brand">HP Inc.</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Opis produktu:</strong> Wytrzymały, dwustronny zestaw montażowy HP Dual VESA Mount Bracket (kod producenta: 9UB87AA / 9UB87AA#ABB) renomowanej marki HP Inc. Umożliwia jednoczesną, zwartą instalację terminala HP Thin Client oraz monitora o przekątnej do 32" i masie do 10,5 kg (23,15 lbs) na pojedynczym ramieniu nośnym VESA 100x100 mm, ścianie, wózku mobilnym lub w szafie sterowniczej.
        <br><br>
        <strong>Kluczowe właściwości:</strong> Mechanizm Quick Release ze śrubami radełkowanymi (thumb screws) do szybkiej wymiany terminala bez demontażu monitora, dedykowany koszyk montażowy na zasilacz sieciowy oraz zintegrowane prowadzenie okablowania.
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="HP 9UB87AA">
      </div>
    </div>

    <h2>Dane handlowe i identyfikacyjne</h2>
    <table>
      <tr><th>Oznaczenie typu:</th><td>9UB87AA (Dual VESA Mount Bracket for HP Thin Client)</td></tr>
      <tr><th>Numer artykułu (PartNr):</th><td>HP.9UB87AA</td></tr>
      <tr><th>Kod zamówieniowy (OrderNr):</th><td>9UB87AA / 9UB87AA#ABB</td></tr>
      <tr><th>Kod GTIN / EAN:</th><td>0194850785189</td></tr>
      <tr><th>Producent:</th><td>HP Inc. (HP)</td></tr>
      <tr><th>Klasyfikacja EPLAN:</th><td>Mechanika &gt; Akcesoria obudowy, rozbudowa zewnętrzna &gt; Ogólne (Top: 3, Grp: 50, Sub: 1)</td></tr>
      <tr><th>Oznaczenie literowe (IEC 81346):</th><td>W (Prowadnica / element mechaniczny rozbudowy)</td></tr>
    </table>

    <h2>Wymiary gabarytowe i dane mechaniczne</h2>
    <table>
      <tr><th>Wymiary zewnętrzne (W &times; H &times; D):</th><td>166,0 mm &times; 275,2 mm &times; 62,5 mm (6.34" &times; 10.83" &times; 2.46")</td></tr>
      <tr><th>Wymagane miejsce zabudowy:</th><td>45683,2 mm&sup2;</td></tr>
      <tr><th>Ciężar własny zestawu:</th><td>0,725 kg (725 g / 1,59 lbs)</td></tr>
      <tr><th>Standard montażowy:</th><td>VESA MIS-D 100&times;100 mm (rozstaw otworów 100 mm &times; 100 mm)</td></tr>
      <tr><th>Maksymalne obciążenie wyświetlacza:</th><td>10,5 kg (23,15 lbs)</td></tr>
      <tr><th>Obsługiwane przekątne monitorów:</th><td>Do 32 cali</td></tr>
      <tr><th>Materiał konstrukcyjny:</th><td>Tłoczona stal konstrukcyjna o wysokiej sztywności</td></tr>
      <tr><th>Kolor i wykończenie:</th><td>Czarny matowy (Jet Black)</td></tr>
    </table>

    <h2>Kompatybilność sprzętowa</h2>
    <table>
      <tr><th>Obsługiwane terminale HP Thin Client:</th><td>HP t640, HP t540, HP t430, HP t240, HP Pro t550, HP Elite t655</td></tr>
      <tr><th>Obsługiwane standardy mocowania:</th><td>Ramiona monitorowe VESA 100x100, uchwyty ścienne, wózki medyczne, panele szaf</td></tr>
      <tr><th>Mocowanie zasilacza:</th><td>Zintegrowana klatka montażowa Power Supply Holder do zasilaczy HP</td></tr>
    </table>

    <h2>Zawartość zestawu i warunki eksploatacji</h2>
    <table>
      <tr><th>Zawartość zestawu montażowego:</th><td>Uchwyt główny Dual VESA, adapter Quick Release, uchwyt zasilacza, 3 komplety śrub montażowych dedykowanych do modeli, zestaw śrub radełkowanych, instrukcja</td></tr>
      <tr><th>Maksymalna temperatura otoczenia:</th><td>35 &deg;C (dla optymalnej wydajności termicznej terminala zalecane połączenie RJ-45)</td></tr>
      <tr><th>Gwarancja producenta:</th><td>1 rok ograniczonej gwarancji HP</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Dokumentacja Techniczno-Ruchowa (DTR) &bull; HP Inc. &bull; 9UB87AA (Dual VESA Mount Bracket)</div>
    <div>Strona 1 z 3 (PL) &bull; Artykuł EPLAN Pro Panel / Mechanics</div>
  </div>
</div>

<!-- SECTION 2: ENGLISH -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">ENG</span>9UB87AA &bull; Dual VESA Mount Bracket for HP Thin Client</h1>
        <div class="subtitle">VESA 100x100 mm mounting bracket kit for HP Thin Clients and Displays &bull; Part No. HP.9UB87AA</div>
      </div>
      <div class="brand">HP Inc.</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Product Overview:</strong> Robust dual-sided mounting bracket solution HP Dual VESA Mount Bracket (HP Part Number: 9UB87AA / 9UB87AA#ABB) manufactured by HP Inc. Enables simultaneous, compact mounting of an HP Thin Client and a display up to 32" and 10.5 kg (23.15 lbs) on a single VESA 100x100 mm monitor arm, wall mount, mobile cart, or automation control cabinet.
        <br><br>
        <strong>Key Features:</strong> Features a built-in Quick Release mechanism with thumb screws for rapid thin client swap-out without dismantling the display, an integrated Power Supply Holder compartment, and clean cable management.
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="HP 9UB87AA">
      </div>
    </div>

    <h2>Commercial & Identification Data</h2>
    <table>
      <tr><th>Type Designation:</th><td>9UB87AA (Dual VESA Mount Bracket for HP Thin Client)</td></tr>
      <tr><th>Part Number (PartNr):</th><td>HP.9UB87AA</td></tr>
      <tr><th>Order Number (OrderNr):</th><td>9UB87AA / 9UB87AA#ABB</td></tr>
      <tr><th>GTIN / EAN Code:</th><td>0194850785189</td></tr>
      <tr><th>Manufacturer:</th><td>HP Inc. (HP)</td></tr>
      <tr><th>EPLAN Classification:</th><td>Mechanics &gt; Housing accessories external &gt; General (Top: 3, Grp: 50, Sub: 1)</td></tr>
      <tr><th>Letter Code (IEC 81346):</th><td>W (Guide / mechanical expansion component)</td></tr>
    </table>

    <h2>Physical Dimensions & Mechanical Data</h2>
    <table>
      <tr><th>External Dimensions (W &times; H &times; D):</th><td>166.0 mm &times; 275.2 mm &times; 62.5 mm (6.34" &times; 10.83" &times; 2.46")</td></tr>
      <tr><th>Mounting Space Footprint:</th><td>45683.2 mm&sup2;</td></tr>
      <tr><th>Net Weight:</th><td>0.725 kg (725 g / 1.59 lbs)</td></tr>
      <tr><th>Mounting Interface:</th><td>VESA MIS-D 100&times;100 mm (hole spacing 100 mm &times; 100 mm)</td></tr>
      <tr><th>Maximum Display Weight Capacity:</th><td>10.5 kg (23.15 lbs)</td></tr>
      <tr><th>Supported Display Sizes:</th><td>Up to 32 inches</td></tr>
      <tr><th>Construction Material:</th><td>Heavy-duty stamped sheet steel</td></tr>
      <tr><th>Color / Finish:</th><td>Matte Black (Jet Black)</td></tr>
    </table>

    <h2>Hardware Compatibility</h2>
    <table>
      <tr><th>Supported HP Thin Client Models:</th><td>HP t640, HP t540, HP t430, HP t240, HP Pro t550, HP Elite t655</td></tr>
      <tr><th>Supported Mounting Interfaces:</th><td>VESA 100x100 monitor arms, wall mounts, medical carts, control enclosure panels</td></tr>
      <tr><th>Power Brick Accommodation:</th><td>Integrated Power Supply Holder bracket for HP external AC adapters</td></tr>
    </table>

    <h2>Kit Contents & Operating Environment</h2>
    <table>
      <tr><th>Package Contents:</th><td>1x Dual VESA Mount bracket, 1x Quick Release Thin Client bracket, 1x Power Supply Holder, 3 sets of model bracket screws, 1 set of thumb screws, installation guide</td></tr>
      <tr><th>Maximum Operating Temperature:</th><td>35 &deg;C (for optimal thermal performance under heavy load, wired RJ-45 is recommended)</td></tr>
      <tr><th>Warranty:</th><td>One-year HP limited warranty</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Technical Datasheet &bull; HP Inc. &bull; 9UB87AA (Dual VESA Mount Bracket)</div>
    <div>Page 2 of 3 (ENG) &bull; EPLAN Pro Panel Master Data</div>
  </div>
</div>

<!-- SECTION 3: GERMAN -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">DE</span>9UB87AA &bull; Dual-VESA-Montagehalterung für HP Thin Clients</h1>
        <div class="subtitle">VESA 100x100 mm Montagekit für HP Thin Clients und Monitore &bull; Art.-Nr. HP.9UB87AA</div>
      </div>
      <div class="brand">HP Inc.</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Produktbeschreibung:</strong> Robuste zweiseitige Montagehalterung HP Dual VESA Mount Bracket (HP Artikel-Nr.: 9UB87AA / 9UB87AA#ABB) des Herstellers HP Inc. Ermöglicht die gleichzeitige, platzsparende Montage eines HP Thin Clients und eines Monitors bis zu 32 Zoll und 10,5 kg (23,15 lbs) an einem VESA 100x100 mm Monitor-Tragarm, einer Wand, einem mobilen Gerätewagen oder im Schaltschrank.
        <br><br>
        <strong>Besondere Merkmale:</strong> Integrierter Quick-Release-Mechanismus mit Rändelschrauben (Thumb Screws) für schnellen Gerätetausch ohne Monitordemontage, separates Aufnahmefach für das Netzteil (Power Supply Holder) und saubere Kabelführung.
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="HP 9UB87AA">
      </div>
    </div>

    <h2>Handels- und Identifikationsdaten</h2>
    <table>
      <tr><th>Typenbezeichnung:</th><td>9UB87AA (Dual VESA Mount Bracket for HP Thin Client)</td></tr>
      <tr><th>Artikelnummer (PartNr):</th><td>HP.9UB87AA</td></tr>
      <tr><th>Bestellnummer (OrderNr):</th><td>9UB87AA / 9UB87AA#ABB</td></tr>
      <tr><th>GTIN / EAN-Code:</th><td>0194850785189</td></tr>
      <tr><th>Hersteller:</th><td>HP Inc. (HP)</td></tr>
      <tr><th>EPLAN Produktgruppierung:</th><td>Mechanik &gt; Gehäusezubehör, extern &gt; Allgemein (Top: 3, Grp: 50, Sub: 1)</td></tr>
      <tr><th>Kennbuchstabe (IEC 81346):</th><td>W (Führungsschiene / mechanisches Ausbauteil)</td></tr>
    </table>

    <h2>Abmessungen und mechanische Daten</h2>
    <table>
      <tr><th>Außenabmessungen (B &times; H &times; T):</th><td>166,0 mm &times; 275,2 mm &times; 62,5 mm (6.34" &times; 10.83" &times; 2.46")</td></tr>
      <tr><th>Erforderlicher Montageplatz:</th><td>45683,2 mm&sup2;</td></tr>
      <tr><th>Nettogewicht:</th><td>0,725 kg (725 g / 1,59 lbs)</td></tr>
      <tr><th>Montageschnittstelle:</th><td>VESA MIS-D 100&times;100 mm (Lochabstand 100 mm &times; 100 mm)</td></tr>
      <tr><th>Maximale Display-Traglast:</th><td>10,5 kg (23,15 lbs)</td></tr>
      <tr><th>Unterstützte Displaydiagonalen:</th><td>Bis zu 32 Zoll</td></tr>
      <tr><th>Konstruktionsmaterial:</th><td>Hochfester Stahlblechkörper, pulverbeschichtet</td></tr>
      <tr><th>Farbe:</th><td>Mattschwarz (Jet Black)</td></tr>
    </table>

    <h2>Hardware-Kompatibilität</h2>
    <table>
      <tr><th>Unterstützte HP Thin Client Modelle:</th><td>HP t640, HP t540, HP t430, HP t240, HP Pro t550, HP Elite t655</td></tr>
      <tr><th>Montageschnittstellen:</th><td>VESA 100x100 Tragarme, Wandhalterungen, Visitenwagen, Schaltschrankfronten</td></tr>
      <tr><th>Netzteilaufnahme:</th><td>Integrierter Halterungsbügel Power Supply Holder für HP Netzteile</td></tr>
    </table>

    <h2>Lieferumfang und Umgebungsbedingungen</h2>
    <table>
      <tr><th>Lieferumfang:</th><td>1x Dual VESA Mount Halterung, 1x Quick Release Halterung, 1x Netzteilhalter, 3x Schraubensätze modellspezifisch, 1x Rändelschraubensatz, Installationsanleitung</td></tr>
      <tr><th>Maximale Betriebstemperatur:</th><td>35 &deg;C (für optimale thermische Bedingungen wird kabelgebundenes RJ-45 LAN empfohlen)</td></tr>
      <tr><th>Garantie:</th><td>1 Jahr eingeschränkte HP Herstellergarantie</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Technisches Datenblatt &bull; HP Inc. &bull; 9UB87AA (Dual VESA Mount Bracket)</div>
    <div>Seite 3 von 3 (DE) &bull; EPLAN Pro Panel Stammdaten</div>
  </div>
</div>

</body>
</html>`;
}

fs.writeFileSync('scripts/9UB87AA_datasheet.html', generateHp9ubHtml(), 'utf8');
console.log('Created scripts/9UB87AA_datasheet.html');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlResolved = path.resolve('scripts/9UB87AA_datasheet.html');
const pdfResolved = path.resolve('EDZ/HP/HP.9UB87AA/9UB87AA_datasheet.pdf');
const cmd = `"${edge}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfResolved}" --no-pdf-header-footer "${htmlResolved}"`;
cp.execSync(cmd);
console.log('Rendered PDF:', pdfResolved, fs.statSync(pdfResolved).size, 'bytes');

fs.unlinkSync('scripts/9UB87AA_datasheet.html');
console.log('Cleaned up scripts/9UB87AA_datasheet.html');
