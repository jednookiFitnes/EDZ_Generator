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
    font-size: 8.8px;
    line-height: 1.32;
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
    border-bottom: 2.5px solid #d90000;
    padding-bottom: 5px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #d90000;
    font-size: 15px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 16px;
    color: #d90000;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .lang-tag {
    display: inline-block;
    background: #d90000;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 8.5px;
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
    background: #fafafa;
    border-left: 3.5px solid #d90000;
    padding: 6px 10px;
    font-size: 9px;
  }
  .overview-image {
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1px solid #eee;
    border-radius: 3px;
    padding: 4px;
  }
  .overview-image img {
    max-width: 130px;
    max-height: 130px;
    object-fit: contain;
  }
  h2 {
    color: #b00000;
    font-size: 10.5px;
    border-bottom: 1px solid #ffd1d1;
    padding-bottom: 2px;
    margin-top: 5px;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 5px;
  }
  th, td {
    padding: 3px 5px;
    border-bottom: 1px solid #ececec;
    text-align: left;
    font-size: 8.5px;
  }
  th {
    background-color: #fbf1f1;
    color: #4a0000;
    font-weight: 600;
    width: 30%;
  }
  td {
    color: #222;
  }
  .highlight-box {
    background-color: #fff8e8;
    border: 1px solid #ffe6a3;
    border-left: 3.5px solid #ffb300;
    padding: 4px 7px;
    margin-bottom: 5px;
    font-size: 8.5px;
    border-radius: 2px;
  }
  .footer {
    margin-top: auto;
    padding-top: 4px;
    border-top: 1px solid #ddd;
    font-size: 8px;
    color: #666;
    display: flex;
    justify-content: space-between;
  }
  `;
}

function buildHtml() {
  const imgPath = path.resolve('EDZ/261119/RIT.5840600/5840600.png');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/png;base64,${imgBase64}`;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Rittal VX SE 5840.600 - Karta Techniczna / Datasheet</title>
  <style>
    ${getBaseStyle()}
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- PAGE 1: POLSKI (PL)                        -->
  <!-- ========================================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">PL</span>RITTAL VX SE 5840.600 (5840600)</h1>
          <div class="subtitle">Systemowa szafa pojedyncza wolnostojąca ze stali lakierowanej z płytą montażową</div>
        </div>
        <div class="brand">RITTAL</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>Systemowa szafa pojedyncza Rittal VX SE:</strong> Wolnostojąca szafa z blachy stalowej o wyjątkowo stabilnym korpusie z dwoma zintegrowanymi płaszczyznami montażowymi, przykręcaną ścianą tylną i drzwiami dwuskrzydłowymi. Dach i ścianki boczne wykonane z jednego profilowanego arkusza blachy z anprofilowaną ramą montażową. Pełna kompatybilność z akcesoriami systemowymi Rittal VX25. Brak konieczności osobnego montażu i uszczelniania ścian bocznych zapewnia maksymalną oszczędność czasu i kosztów zabudowy.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="Rittal VX SE 5840.600" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Kluczowe właściwości:</strong> Wymiary 1000 x 1800 x 400 mm • Stopień ochrony IP 55 / NEMA 12 / NEMA 3R • Odporność mechaniczna IK10 • Podwójne drzwi frontowe z zamknięciem dwupiórkowym 3 mm • Płyta montażowa 899 x 1696 mm z blachy 3.0 mm ocynkowana • Kompatybilność z systemem VX25.
      </div>

      <h2>Dane podstawowe i identyfikacyjne</h2>
      <table>
        <tr><th>Producent</th><td>Rittal GmbH & Co. KG (Auf dem Stützelberg, 35745 Herborn, Niemcy)</td></tr>
        <tr><th>Seria i oznaczenie typu</th><td>VX SE / Model SE 5840.600 (Nr artykułu: 5840600)</td></tr>
        <tr><th>Kod EPLAN / Identyfikator</th><td>RIT.5840600</td></tr>
        <tr><th>Kod EAN / Kod taryfy celnej</th><td>4028177959149 / 94032080</td></tr>
        <tr><th>Klasyfikacja EPLAN</th><td>Mechanika &gt; Szafa sterownicza &gt; Ogólne (Top: 3 / Group: 55 / Subgroup: 1)</td></tr>
      </table>

      <h2>Wymiary gabarytowe i konstrukcja mechaniczna</h2>
      <table>
        <tr><th>Wymiary szafy (Szer. x Wys. x Głęb.)</th><td>1000 x 1800 x 400 mm</td></tr>
        <tr><th>Powierzchnia zabudowy / Wymagane miejsce</th><td>1000 x 1800 mm (1 800 000 mm²)</td></tr>
        <tr><th>Wymiary płyty montażowej (Szer. x Wys.)</th><td>899 mm x 1696 mm (powierzchnia montażowa ocynkowana)</td></tr>
        <tr><th>Konstrukcja korpusu szafy</th><td>Blacha stalowa 1,5 mm; dach i boki wykonane jednolicie z wyprofilowaną ramą</td></tr>
        <tr><th>Drzwi frontowe</th><td>Blacha stalowa 2,0 mm, drzwi dwuskrzydłowe z zamknięciem baskwilowym</td></tr>
        <tr><th>Ściana tylna i płyty podłogi</th><td>Ściana tylna odkręcana 1,5 mm; płyty podłogi 1,5 mm dzielone</td></tr>
        <tr><th>Płyta montażowa (grubość / powłoka)</th><td>Blacha stalowa 3,0 mm, ocynkowana galwanicznie</td></tr>
        <tr><th>Masa netto / Masa brutto z opakowaniem</th><td>142,7 kg / 144,4 kg</td></tr>
      </table>

      <h2>Parametry ochrony i wykończenie powierzchni</h2>
      <table>
        <tr><th>Stopień ochrony IP (wg PN-EN 60529)</th><td>IP 55</td></tr>
        <tr><th>Klasa ochrony NEMA / UL Type (UL 508A)</th><td>NEMA 12, NEMA 3R / UL Type 1, 2, 3, 3R, 12 (cULus Listed)</td></tr>
        <tr><th>Odporność na uderzenia mechaniczne</th><td>IK10</td></tr>
        <tr><th>Kolorystyka</th><td>RAL 7035 (jasnoszary)</td></tr>
        <tr><th>Obróbka powierzchni</th><td>Korpus, drzwi, ściana tylna: gruntowane zanurzeniowo, malowane proszkowo lakierem strukturalnym</td></tr>
      </table>

      <h2>Zakres dostawy i wyposażenie standardowe</h2>
      <table>
        <tr><th>Korpus i ściany</th><td>Korpus szafy zintegrowany z dachem i ścianami bocznymi, ściana tylna odkręcana jednoczęściowa</td></tr>
        <tr><th>Drzwi i zamknięcie</th><td>Drzwi podwójne z przodu, zamknięcie prętowe z wkładką dwupiórkową 3 mm (2 zamki)</td></tr>
        <tr><th>Elementy montażowe w zestawie</th><td>Płyta montażowa ocynkowana, blachy podłogowe, 2 systemowe szyny montażowe 18 x 39 mm</td></tr>
        <tr><th>Atesty, normy i zgodność</th><td>cULus Listed (E75350), CE, UKCA, DIN EN 62208, DIN EN 61439-1/-2, RoHS</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>Rittal VX SE 5840.600 • EPLAN Electric P8 &amp; Pro Panel Article Package</span>
      <span>Strona 1 z 3 (PL)</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 2: ENGLISH (ENG)                      -->
  <!-- ========================================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">ENG</span>RITTAL VX SE 5840.600 (5840600)</h1>
          <div class="subtitle">VX SE Free-Standing Enclosure System Sheet Steel with Mounting Plate</div>
        </div>
        <div class="brand">RITTAL</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>Rittal VX SE Free-Standing Enclosure System:</strong> Standalone sheet steel enclosure with a torsionally rigid body, two integral mounting levels, screw-fastened rear panel, and double doors. The roof and side panels are manufactured from a single piece with a roll-formed frame. Fully compatible with VX25 system accessories. Efficiency is significantly enhanced because side panels no longer need to be fitted or sealed, and large enclosure widths replace complex bayed suites.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="Rittal VX SE 5840.600" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Key Highlights:</strong> Dimensions 1000 x 1800 x 400 mm • Protection Category IP 55 / NEMA 12 / NEMA 3R • Impact Resistance IK10 • Double door front configuration with 3 mm double-bit lock • Zinc-plated mounting plate 899 x 1696 mm (3.0 mm sheet steel) • Seamless VX25 accessory compatibility.
      </div>

      <h2>Basic &amp; Ordering Information</h2>
      <table>
        <tr><th>Manufacturer</th><td>Rittal GmbH & Co. KG (Auf dem Stützelberg, 35745 Herborn, Germany)</td></tr>
        <tr><th>Series &amp; Model Designation</th><td>VX SE / Model SE 5840.600 (Item No.: 5840600)</td></tr>
        <tr><th>EPLAN Part Number</th><td>RIT.5840600</td></tr>
        <tr><th>EAN Code / Customs Tariff No.</th><td>4028177959149 / 94032080</td></tr>
        <tr><th>EPLAN Product Classification</th><td>Mechanics &gt; Enclosure &gt; General (Top: 3 / Group: 55 / Subgroup: 1)</td></tr>
      </table>

      <h2>Dimensions &amp; Mechanical Construction</h2>
      <table>
        <tr><th>Enclosure Dimensions (W x H x D)</th><td>1000 x 1800 x 400 mm</td></tr>
        <tr><th>Footprint / Mounting Space Required</th><td>1000 x 1800 mm (1,800,000 mm²)</td></tr>
        <tr><th>Mounting Plate Dimensions (W x H)</th><td>899 mm x 1696 mm (zinc-plated mounting surface)</td></tr>
        <tr><th>Body Construction</th><td>Sheet steel 1.5 mm; roof and sides form a single unit with roll-formed frame</td></tr>
        <tr><th>Front Doors</th><td>Sheet steel 2.0 mm, double-door configuration with rod lock mechanism</td></tr>
        <tr><th>Rear Panel &amp; Gland Plates</th><td>Detachable rear panel 1.5 mm; sheet steel base/gland plates 1.5 mm</td></tr>
        <tr><th>Mounting Plate (Thickness / Finish)</th><td>Sheet steel 3.0 mm, zinc-plated</td></tr>
        <tr><th>Net Weight / Gross Pack Weight</th><td>142.7 kg / 144.4 kg</td></tr>
      </table>

      <h2>Environmental Protection &amp; Surface Finish</h2>
      <table>
        <tr><th>IP Protection Category (IEC/EN 60 529)</th><td>IP 55</td></tr>
        <tr><th>NEMA / UL Type Rating (UL 508A)</th><td>NEMA 12, NEMA 3R / UL Type 1, 2, 3, 3R, 12 (cULus Listed)</td></tr>
        <tr><th>Mechanical Impact Resistance</th><td>IK10</td></tr>
        <tr><th>Color Code</th><td>RAL 7035 (Light grey)</td></tr>
        <tr><th>Surface Finish</th><td>Enclosure, door, rear panel: dipcoat-primed, powder-coated with textured paint; zinc-plated mounting plate</td></tr>
      </table>

      <h2>Scope of Supply &amp; Standards Compliance</h2>
      <table>
        <tr><th>Enclosure Body &amp; Panels</th><td>Body closed at top and sides, detachable one-piece screw-fastened rear panel</td></tr>
        <tr><th>Doors &amp; Locking System</th><td>Double doors at the front, rod lock system with 3 mm double-bit lock insert (2 locks)</td></tr>
        <tr><th>Included Accessories</th><td>Zinc-plated mounting plate, gland plates, 2 punched rails / mounting sections 18 x 39 mm</td></tr>
        <tr><th>Approvals, Standards &amp; Declarations</th><td>cULus Listed (E75350), CE, UKCA, DIN EN 62208, DIN EN 61439-1/-2, RoHS</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>Rittal VX SE 5840.600 • EPLAN Electric P8 &amp; Pro Panel Article Package</span>
      <span>Page 2 of 3 (ENG)</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- PAGE 3: DEUTSCH (DE)                       -->
  <!-- ========================================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">DE</span>RITTAL VX SE 5840.600 (5840600)</h1>
          <div class="subtitle">VX SE System-Einzelschrank Stahlblech mit Montageplatte</div>
        </div>
        <div class="brand">RITTAL</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>Rittal VX SE System-Einzelschrank:</strong> Freistehender Einzelschrank aus Stahlblech mit stabilem Schrankkorpus, zwei integrierten Montageebenen, verschraubter Rückwand und Fronttüren. Dach und Seiten bestehen aus einem Stück mit anprofiliertem Rahmen. Vollständig systemkompatibel mit dem Zubehör des Schaltschranksystems VX25 ausbaubar. Effizienzsteigernd, da Seitenwände nicht montiert oder abgedichtet werden müssen und große Schrankbreiten kleine Anreih-Kombinationen ersetzen.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="Rittal VX SE 5840.600" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Wichtigste Merkmale:</strong> Abmessungen 1000 x 1800 x 400 mm • Schutzart IP 55 / NEMA 12 / NEMA 3R • Stoßfestigkeit IK10 • Zweitürig an Frontseite mit 3 mm Doppelbart-Verschluss • Verzinkte Montageplatte 899 x 1696 mm (3,0 mm Stahlblech) • Volle VX25-Zubehörkompatibilität.
      </div>

      <h2>Basis- und Bestelldaten</h2>
      <table>
        <tr><th>Hersteller</th><td>Rittal GmbH & Co. KG (Auf dem Stützelberg, 35745 Herborn, Deutschland)</td></tr>
        <tr><th>Serie und Typenbezeichnung</th><td>VX SE / Modell SE 5840.600 (Artikel-Nr.: 5840600)</td></tr>
        <tr><th>EPLAN Artikelnummer</th><td>RIT.5840600</td></tr>
        <tr><th>EAN-Code / Zolltarifnummer</th><td>4028177959149 / 94032080</td></tr>
        <tr><th>EPLAN Produktklassifizierung</th><td>Mechanik &gt; Szafa sterownicza (Schaltschrank) &gt; Allgemein (Top: 3 / Gruppe: 55 / Untergruppe: 1)</td></tr>
      </table>

      <h2>Abmessungen und mechanische Konstruktion</h2>
      <table>
        <tr><th>Schrankabmessungen (B x H x T)</th><td>1000 x 1800 x 400 mm</td></tr>
        <tr><th>Montagefläche / Platzbedarf</th><td>1000 x 1800 mm (1.800.000 mm²)</td></tr>
        <tr><th>Abmessungen Montageplatte (B x H)</th><td>899 mm x 1696 mm (verzinkte Montagefläche)</td></tr>
        <tr><th>Schrankkorpus</th><td>Stahlblech 1,5 mm; Dach und Seiten aus einem Stück mit anprofiliertem Rahmen</td></tr>
        <tr><th>Fronttüren</th><td>Stahlblech 2,0 mm, zweitürige Ausführung mit Stangenverschluss</td></tr>
        <tr><th>Rückwand und Bodenbleche</th><td>Verschraubte Rückwand 1,5 mm; geteilte Bodenbleche Stahlblech 1,5 mm</td></tr>
        <tr><th>Montageplatte (Material / Stärke)</th><td>Stahlblech 3,0 mm, verzinkt</td></tr>
        <tr><th>Nettogewicht / Gesamtgewicht (Packung)</th><td>142,7 kg / 144,4 kg</td></tr>
      </table>

      <h2>Schutzart und Oberflächenbeschaffenheit</h2>
      <table>
        <tr><th>Schutzart IP (nach DIN EN 60529)</th><td>IP 55</td></tr>
        <tr><th>Schutzart NEMA / UL Type (UL 508A)</th><td>NEMA 12, NEMA 3R / UL Type 1, 2, 3, 3R, 12 (cULus Listed)</td></tr>
        <tr><th>Schlagfestigkeit (IK-Code)</th><td>IK10</td></tr>
        <tr><th>Farbton</th><td>RAL 7035 (Lichtgrau)</td></tr>
        <tr><th>Oberflächenbehandlung</th><td>Gehäuse, Tür und Rückwand: tauchgrundiert, außen pulverbeschichtet, Strukturlack; Montageplatte und Bodenbleche verzinkt</td></tr>
      </table>

      <h2>Lieferumfang und Normenkonformität</h2>
      <table>
        <tr><th>Schrankkorpus und Wandelemente</th><td>Schrankkorpus oben und seitlich geschlossen, einteilige verschraubte Rückwand</td></tr>
        <tr><th>Türen und Schließsystem</th><td>Zwei Türen an der Frontseite, Stangenverschluss mit Doppelbart-Einsatz 3 mm (2 Schlösser)</td></tr>
        <tr><th>Mitgeliefertes Zubehör</th><td>Verzinkte Montageplatte, Bodenbleche, 2 System-Lochleisten / Montageschienen 18 x 39 mm</td></tr>
        <tr><th>Zulassungen und Richtlinien</th><td>cULus Listed (E75350), CE, UKCA, DIN EN 62208, DIN EN 61439-1/-2, RoHS</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>Rittal VX SE 5840.600 • EPLAN Electric P8 &amp; Pro Panel Artikelpaket</span>
      <span>Seite 3 von 3 (DE)</span>
    </div>
  </div>

</body>
</html>`;
}

const htmlContent = buildHtml();
const tempHtmlPath = path.resolve('scripts/5840600_datasheet.html');
const outputPdfPath = path.resolve('EDZ/261119/RIT.5840600/5840600_datasheet.pdf');

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');
console.log('HTML written to:', tempHtmlPath);

// Render PDF using html_to_pdf.js
const cmd = `node "${path.resolve('scripts/html_to_pdf.js')}" "${tempHtmlPath}" "${outputPdfPath}"`;
console.log('Rendering PDF via:', cmd);
cp.execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(outputPdfPath) && fs.statSync(outputPdfPath).size > 0) {
  console.log('Datasheet PDF successfully created at:', outputPdfPath, fs.statSync(outputPdfPath).size, 'bytes');
  // Remove temp HTML
  fs.unlinkSync(tempHtmlPath);
  console.log('Cleaned up temporary HTML file.');
} else {
  console.error('Failed to generate PDF!');
  process.exit(1);
}
