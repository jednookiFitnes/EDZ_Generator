const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function getBaseStyle() {
  return `
  @page {
    size: A4 portrait;
    margin: 10mm 12mm 10mm 12mm;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    font-size: 9.2px;
    line-height: 1.35;
  }
  .page {
    page-break-after: always;
    break-after: page;
    height: 277mm;
    max-height: 277mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  .page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }
  .header {
    border-bottom: 2.5px solid #006837;
    padding-bottom: 5px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #006837;
    font-size: 15px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 15px;
    color: #006837;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-align: right;
  }
  .lang-tag {
    display: inline-block;
    background: #006837;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 700;
    margin-right: 6px;
    vertical-align: middle;
  }
  .subtitle {
    font-size: 10px;
    color: #555;
    margin-top: 2px;
    font-weight: 500;
  }
  .overview-container {
    display: flex;
    gap: 12px;
    margin-bottom: 6px;
    align-items: center;
  }
  .overview-box {
    flex: 1;
    background: #f4f8f5;
    border-left: 3.5px solid #006837;
    padding: 6px 10px;
    font-size: 9.2px;
    line-height: 1.35;
  }
  .overview-image {
    width: 120px;
    text-align: center;
    flex-shrink: 0;
  }
  .overview-image img {
    max-width: 115px;
    max-height: 80px;
    object-fit: contain;
  }
  h2 {
    color: #006837;
    font-size: 10px;
    margin: 6px 0 3px 0;
    border-bottom: 1px solid #d0dfd5;
    padding-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 5px;
  }
  th, td {
    padding: 3.5px 6px;
    border: 1px solid #dcdcdc;
    text-align: left;
    font-size: 8.8px;
  }
  th {
    background: #eaf2ed;
    color: #006837;
    font-weight: 600;
    width: 38%;
  }
  .footer {
    border-top: 1px solid #ccc;
    padding-top: 4px;
    font-size: 7.8px;
    color: #777;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  `;
}

function generateDatasheetHTML() {
  const imgPath = path.resolve('EDZ/261119/WIE.83.040.1281.0/83.040.1281.0.png');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/png;base64,${imgBase64}`;

  const partNr = 'WIE.83.040.1281.0';
  const orderNr = '83.040.1281.0';
  const typeNr = 'WIENET UMS 8-C (UMS 8-C SLIM)';

  const params_pl = [
    ['Producent / Seria produktowa', 'Wieland Electric GmbH / wienet UMS'],
    ['Liczba i typ portów sieciowych', '8 × RJ45 (ekranowane), 10/100 Mbit/s (Fast Ethernet)'],
    ['Standardy sieciowe IEEE', 'IEEE 802.3 10Base-T, IEEE 802.3u 100Base-TX, IEEE 802.3x Flow Control'],
    ['Automatyczna detekcja portu', 'Auto-Negotiation (szybkość 10/100 Mbps / duplex), Auto-MDI/MDI-X'],
    ['Architektura i buforowanie', 'Store-and-Forward, tablica MAC: 2048 adresów, bufor pakietów: 448 Kbit'],
    ['Napięcie zasilania', '12 – 48 V DC (redundantne podwójne wejście zasilania PWR1 / PWR2)'],
    ['Pobór mocy', 'Maks. < 4.7 W (typ. 2.5 W)'],
    ['Wskaźniki stanu LED', 'Zasilanie (PWR1, PWR2 zielone), Alarm zasilania (P-Fail czerwona), Link/Act portów 1-8'],
    ['Wyjście przekaźnikowe alarmu (Fault)', 'Bezpotencjałowy styk alarmu braku zasilania: 1 A @ 24 V DC'],
    ['Zabezpieczenie przed odwrotną polaryzacją', 'Zintegrowane elektroniczne zabezpieczenie przed zamianą biegunów'],
  ];

  const mech_pl = [
    ['Złącze zasilania i alarmu', 'Odłączalna listwa śrubowa 6-pinowa (P1+, P1-, P2+, P2-, Fault, Fault)'],
    ['Przekrój przewodów przyłączeniowych', '0.25 – 2.5 mm² (AWG 26–12), długość odizolowania 8 mm'],
    ['Sposób montażu', 'Szyna DIN TS 35 (EN 60715) ze zintegrowanym klipsem metalowym'],
    ['Materiał obudowy', 'Wytrzymała przemysłowa obudowa metalowa (IP30)'],
    ['Chłodzenie', 'Konwekcja swobodna (chłodzenie bezwentylatorowe pasywne)'],
    ['Temperatura pracy otoczenia', '-10 °C do +60 °C'],
    ['Temperatura składowania', '-40 °C do +85 °C / wilgotność 10 – 95% RH (bez kondensacji)'],
    ['Odporność na wibracje i udary', 'Zgodność z IEC 60068-2-6 (wibracje) oraz IEC 60068-2-27 (udary mechaniczne)'],
  ];

  const dim_pl = [
    ['Wymiary gabarytowe (Szer. × Wys. × Głęb.)', '30 mm × 140 mm × 95 mm (wersja wąska SLIM)'],
    ['Powierzchnia zabudowy', '4200 mm² (30 mm × 140 mm)'],
    ['Masa netto artykułu', '0.450 kg (450 g) / masa transportowa brutto: 0.750 kg'],
    ['Kod EAN / GTIN', '4049088600982'],
    ['Klasyfikacja ETIM / eClass', 'ETIM 8.0/9.0: EC000734 / eClass 11: 19170130'],
    ['Normy i certyfikaty kompatybilności', 'CE, cULus (UL 61010-1 / UL 61010-2-201), RoHS, REACH, FCC Part 15 Class A, EN 61000-6-2/4'],
  ];

  const params_en = [
    ['Manufacturer / Product Series', 'Wieland Electric GmbH / wienet UMS'],
    ['Network Ports & Interface', '8 × RJ45 (shielded), 10/100 Mbps (Fast Ethernet)'],
    ['IEEE Networking Standards', 'IEEE 802.3 10Base-T, IEEE 802.3u 100Base-TX, IEEE 802.3x Flow Control'],
    ['Auto-Detection Features', 'Auto-Negotiation (speed / duplex mode), Auto-MDI/MDI-X crossover'],
    ['Switching Architecture & Buffer', 'Store-and-Forward, MAC table: 2048 addresses, packet buffer: 448 Kbit'],
    ['Supply Voltage', '12 – 48 V DC (redundant dual power inputs PWR1 / PWR2)'],
    ['Power Consumption', 'Max. < 4.7 W (typ. 2.5 W)'],
    ['Diagnostic LED Indicators', 'Power (PWR1, PWR2 green), Power alarm (P-Fail red), Link/Activity per port 1-8'],
    ['Relay Alarm Output (Fault)', 'Dry alarm contact for power supply failure: 1 A @ 24 V DC'],
    ['Reverse Polarity Protection', 'Integrated electronic reverse voltage polarity protection'],
  ];

  const mech_en = [
    ['Power & Alarm Terminal Block', 'Pluggable 6-pin screw terminal block (P1+, P1-, P2+, P2-, Fault, Fault)'],
    ['Conductor Cross-Section', '0.25 – 2.5 mm² (AWG 26–12), stripping length 8 mm'],
    ['Mounting Method', 'DIN rail TS 35 (EN 60715) with heavy-duty metal clip'],
    ['Housing Material', 'Robust industrial metal housing (IP30 protection degree)'],
    ['Cooling Method', 'Natural free air convection (fanless passive design)'],
    ['Operating Temperature Range', '-10 °C to +60 °C'],
    ['Storage Temperature Range', '-40 °C to +85 °C / relative humidity 10 – 95% RH (non-condensing)'],
    ['Vibration & Shock Resistance', 'Compliant with IEC 60068-2-6 (vibration) and IEC 60068-2-27 (shock)'],
  ];

  const dim_en = [
    ['Dimensions (W × H × D)', '30 mm × 140 mm × 95 mm (SLIM compact form factor)'],
    ['Mounting Footprint', '4200 mm² (30 mm × 140 mm)'],
    ['Net Weight', '0.450 kg (450 g) / packaged gross weight: 0.750 kg'],
    ['EAN / GTIN Code', '4049088600982'],
    ['ETIM / eClass Classification', 'ETIM 8.0/9.0: EC000734 / eClass 11: 19170130'],
    ['Standards & Certifications', 'CE, cULus (UL 61010-1 / UL 61010-2-201), RoHS, REACH, FCC Part 15 Class A, EN 61000-6-2/4'],
  ];

  const params_de = [
    ['Hersteller / Produktserie', 'Wieland Electric GmbH / wienet UMS'],
    ['Netzwerkports & Schnittstelle', '8 × RJ45 (geschirmt), 10/100 Mbit/s (Fast Ethernet)'],
    ['IEEE-Netzwerkstandards', 'IEEE 802.3 10Base-T, IEEE 802.3u 100Base-TX, IEEE 802.3x Flow Control'],
    ['Automatische Erkennung', 'Auto-Negotiation (Geschwindigkeit / Duplex), Auto-MDI/MDI-X'],
    ['Switching-Architektur & Puffer', 'Store-and-Forward, MAC-Tabelle: 2048 Einträge, Paketpuffer: 448 Kbit'],
    ['Versorgungsspannung', '12 – 48 V DC (redundante zweifache Stromeinspeisung PWR1 / PWR2)'],
    ['Leistungsaufnahme', 'Max. < 4,7 W (typisch 2,5 W)'],
    ['LED-Statusanzeigen', 'Spannungsversorgung (PWR1, PWR2 grün), Alarm (P-Fail rot), Link/Act pro Port 1-8'],
    ['Relais-Meldeausgang (Fault)', 'Potentialfreier Meldekontakt bei Spannungsausfall: 1 A @ 24 V DC'],
    ['Verpolungsschutz', 'Integrierter elektronischer Verpolungsschutz'],
  ];

  const mech_de = [
    ['Spannungs- und Alarmanschluss', 'Steckbare 6-polige Schraubklemme (P1+, P1-, P2+, P2-, Fault, Fault)'],
    ['Leiterquerschnitt', '0,25 – 2,5 mm² (AWG 26–12), Abisolierlänge 8 mm'],
    ['Montageart', 'Tragschiene TS 35 (EN 60715) mit integriertem Metall-Rastfuß'],
    ['Gehäusewerkstoff', 'Robustes Industrie-Metallgehäuse (Schutzart IP30)'],
    ['Kühlung', 'Freie Konvektion (lüfterloser langlebiger Betrieb)'],
    ['Betriebstemperaturbereich', '-10 °C bis +60 °C'],
    ['Lagertemperaturbereich', '-40 °C bis +85 °C / relative Luftfeuchte 10 – 95 % (nicht kondensierend)'],
    ['Vibrations- und Schockfestigkeit', 'Entspricht IEC 60068-2-6 (Vibration) und IEC 60068-2-27 (Schock)'],
  ];

  const dim_de = [
    ['Abmessungen (B × H × T)', '30 mm × 140 mm × 95 mm (SLIM-Schmalbauform)'],
    ['Platzbedarf Montage', '4200 mm² (30 mm × 140 mm)'],
    ['Nettogewicht', '0,450 kg (450 g) / Bruttogewicht inkl. Verpackung: 0,750 kg'],
    ['EAN / GTIN-Nummer', '4049088600982'],
    ['ETIM / eClass Klassifizierung', 'ETIM 8.0/9.0: EC000734 / eClass 11: 19170130'],
    ['Normen und Zulassungen', 'CE, cULus (UL 61010-1 / UL 61010-2-201), RoHS, REACH, FCC Part 15 Class A, EN 61000-6-2/4'],
  ];

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>${partNr} - Datasheet</title>
  <style>
    ${getBaseStyle()}
  </style>
</head>
<body>

  <!-- ==================== STRONA 1: POLSKI (PL) ==================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">PL</span>Karta katalogowa / DTR: Switch przemysłowy 8x RJ45 Fast Ethernet</h1>
          <div class="subtitle">wienet UMS 8-C SLIM, niezarządzalny switch Ethernet, 12-48V DC, szyna DIN | Nr art.: <strong>${orderNr}</strong> | Typ: <strong>${typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">wienet</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          Przemysłowy, niezarządzalny przełącznik sieciowy Ethernet (switch) serii wienet UMS 8-C SLIM dedykowany do montażu na szynie DIN w szafach automatyki. Charakteryzuje się wyjątkowo smukłą obudową metalową (szerokość zaledwie 30 mm), 8 ekranowanymi portami RJ45 10/100 Mbps (Auto-Negotiation, Auto-MDI/MDI-X) oraz redundantnym wejściem zasilania 12 – 48 V DC. Zapewnia wysoką odporność na zakłócenia elektromagnetyczne (EMC) oraz bezawaryjną pracę w trudnych warunkach przemysłowych.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="${partNr}">
        </div>
      </div>

      <h2>Główne parametry techniczne</h2>
      <table>
        <tbody>
          ${params_pl.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Cechy konstrukcyjne i materiałowe</h2>
      <table>
        <tbody>
          ${mech_pl.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Wymiary gabarytowe i montażowe</h2>
      <table>
        <tbody>
          ${dim_pl.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>Wieland Electric GmbH &bull; wienet UMS &bull; Karta katalogowa DTR</span>
      <span>Strona 1 z 3 (PL)</span>
    </div>
  </div>

  <!-- ==================== STRONA 2: ANGIELSKI (ENG) ==================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">ENG</span>Technical Datasheet: Industrial Ethernet Switch 8x RJ45 Fast Ethernet</h1>
          <div class="subtitle">wienet UMS 8-C SLIM, unmanaged Ethernet switch, 12-48V DC, DIN rail | Part No.: <strong>${orderNr}</strong> | Type: <strong>${typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">wienet</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          Industrial unmanaged Ethernet switch of the wienet UMS 8-C SLIM series designed for space-saving DIN rail installation in control cabinets. Characterized by an ultra-slim metal housing (only 30 mm width), 8 shielded RJ45 ports 10/100 Mbps (Auto-Negotiation, Auto-MDI/MDI-X), and redundant 12 to 48 V DC power supply inputs. Offers superior electromagnetic compatibility (EMC) and robust reliable operation in harsh industrial automation environments.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="${partNr}">
        </div>
      </div>

      <h2>Key Technical Specifications</h2>
      <table>
        <tbody>
          ${params_en.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Mechanical & Material Specifications</h2>
      <table>
        <tbody>
          ${mech_en.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Dimensions & Mounting Data</h2>
      <table>
        <tbody>
          ${dim_en.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>Wieland Electric GmbH &bull; wienet UMS &bull; Technical Product Datasheet</span>
      <span>Page 2 of 3 (ENG)</span>
    </div>
  </div>

  <!-- ==================== STRONA 3: NIEMIECKI (DE) ==================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">DE</span>Technisches Datenblatt: Industrie-Ethernet-Switch 8x RJ45 Fast Ethernet</h1>
          <div class="subtitle">wienet UMS 8-C SLIM, unmanaged Ethernet-Switch, 12-48V DC, Tragschiene | Art.-Nr.: <strong>${orderNr}</strong> | Typ: <strong>${typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">wienet</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          Industrieller unmanaged Ethernet-Switch der wienet UMS 8-C SLIM Serie für die platzsparende Tragschienenmontage in Schaltschränken. Ausgestattet mit einem ultraschmalen Metallgehäuse (nur 30 mm Breite), 8 geschirmten RJ45-Ports 10/100 Mbit/s (Auto-Negotiation, Auto-MDI/MDI-X) sowie redundanter 12 – 48 V DC Spannungsversorgung. Bietet höchste elektromagnetische Verträglichkeit (EMV) und ausfallsicheren Dauerbetrieb unter anspruchsvollen industriellen Umgebungsbedingungen.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="${partNr}">
        </div>
      </div>

      <h2>Wichtigste technische Daten</h2>
      <table>
        <tbody>
          ${params_de.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Mechanische & Werkstoffdaten</h2>
      <table>
        <tbody>
          ${mech_de.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Abmessungen und Montagedaten</h2>
      <table>
        <tbody>
          ${dim_de.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <span>Wieland Electric GmbH &bull; wienet UMS &bull; Technisches Datenblatt</span>
      <span>Seite 3 von 3 (DE)</span>
    </div>
  </div>

</body>
</html>`;
}

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const html = generateDatasheetHTML();
  const tempHtmlPath = path.resolve('scripts/83_040_1281_0_datasheet.html');
  const targetPdfPath = path.resolve('EDZ/261119/WIE.83.040.1281.0/83.040.1281.0_datasheet.pdf');

  fs.writeFileSync(tempHtmlPath, html, 'utf8');
  console.log('Saved HTML to:', tempHtmlPath);

  const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${targetPdfPath}" "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;
  cp.execSync(cmd, { stdio: 'inherit' });

  if (fs.existsSync(targetPdfPath) && fs.statSync(targetPdfPath).size > 0) {
    console.log(`Success: Generated PDF ${targetPdfPath} (${fs.statSync(targetPdfPath).size} bytes)`);
    fs.unlinkSync(tempHtmlPath);
    console.log('Cleaned up temp HTML.');
  } else {
    throw new Error('PDF generation failed or file is empty.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
