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

function generate71330HTML() {
  const imgPath = path.resolve('EDZ/261119/WIE.71.330.2435.1/71.330.2435.1.png');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/png;base64,${imgBase64}`;

  const partNr = 'WIE.71.330.2435.1';
  const orderNr = '71.330.2435.1';
  const typeNr = 'BAS GUT GL 24 M25 A1';

  const params_pl = [
    ['Seria produktu', 'revos BASIC'],
    ['Typ obudowy', 'Obudowa cokołowa (podstawa gniazda z dnem / Sockelgehäuse)'],
    ['Wielkość obudowy (Size)', 'Wielkość 24 (do wkładek zestykowych 24-biegunowych)'],
    ['Konstrukcja wysokościowa', 'Niska budowa (low version / niedrige Bauform)'],
    ['Wprowadzenia kablowe', '2 boczne wprowadzenia kablowe (lewe i prawe)'],
    ['Gwinty wprowadzeń kablowych', '2 × M25 (kołnierze gwintowane pod dławnice kablowe M25)'],
    ['Wykonanie dławików / pokrywy', 'Wersja A1: bez zamontowanych dławnic kablowych, bez pokrywy ochronnej'],
    ['System ryglowania', 'Pojedyncza dźwignia ryglująca wzdłużna (Längsbügel)'],
    ['Stopień ochrony', 'IP54 (zaryglowana) / IP65 (z odpowiednimi dławnicami szczelnymi)'],
    ['Zakres temperatur pracy', '-40 °C do +120 °C'],
  ];

  const mech_pl = [
    ['Materiał korpusu obudowy', 'Odlew ciśnieniowy ze stopu aluminium (Aluminiumdruckguss)'],
    ['Wykończenie powierzchni', 'Malowanie proszkowe (kolor szary RAL 7037)'],
    ['Materiał dźwigni ryglującej', 'Ramię: stal nierdzewna V2A / uchwyt: poliamid UL94-V0'],
    ['Materiał uszczelnienia', 'Guma nitrylowa (NBR), odporna na oleje i starzenie'],
    ['Sposób montażu', 'Montaż powierzchniowy / cokołowy (4 otwory montażowe na śruby M5)'],
    ['Rozstaw otworów montażowych', 'Długość: 132.0 mm / Szerokość: 45.0 mm'],
    ['Kompatybilne wkładki stykowe', 'revos BASIC 24 (śrubowe, sprężynowe, zaciskane, Push-In)'],
    ['Zastosowanie przemysłowe', 'Budowa maszyn, automatyka przemysłowa, szafy sterownicze i rozdzielnice'],
  ];

  const dim_pl = [
    ['Wymiary gabarytowe (Długość × Szerokość × Wysokość)', '144.0 mm × 57.0 mm × 57.0 mm'],
    ['Powierzchnia zabudowy / montażowa', '8208 mm² (144 mm × 57 mm)'],
    ['Masa netto artykułu', '0.216 kg (216 g)'],
    ['Kod EAN / GTIN', '4015573620896'],
    ['Klasyfikacja ETIM / eClass', 'ETIM 8.0/9.0: EC000437 / eClass 11: 27440202'],
    ['Normy i certyfikaty bezpieczeństwa', 'DIN EN 61984, DIN EN 60529, RoHS, REACH'],
  ];

  const params_en = [
    ['Product Series', 'revos BASIC'],
    ['Housing Type', 'Surface-mounted housing base (closed-bottom base / Sockelgehäuse)'],
    ['Housing Size', 'Size 24 (for 24-pole contact inserts)'],
    ['Height Profile', 'Low profile version (niedrige Bauform)'],
    ['Cable Entries', '2 lateral cable entries (left and right sides)'],
    ['Threaded Cable Connection', '2 × M25 (threaded collars for M25 cable glands)'],
    ['Cable Gland / Cover Option', 'Version A1: plain threaded collars without pre-mounted glands, without cover'],
    ['Locking System', 'Single longitudinal locking lever (Längsbügel)'],
    ['Degree of Protection', 'IP54 (latched) / IP65 (with appropriate sealed cable glands)'],
    ['Operating Temperature Range', '-40 °C to +120 °C'],
  ];

  const mech_en = [
    ['Housing Material', 'Die-cast aluminum alloy'],
    ['Surface Coating', 'Powder-coated (grey RAL 7037)'],
    ['Locking Lever Material', 'Lever arm: stainless steel V2A / handle: polyamide UL94-V0'],
    ['Gasket Material', 'Nitrile butadiene rubber (NBR), oil and ozone resistant'],
    ['Mounting Method', 'Surface / base mounting (4 mounting holes for M5 screws)'],
    ['Mounting Hole Distance', 'Length: 132.0 mm / Width: 45.0 mm'],
    ['Compatible Inserts', 'revos BASIC size 24 (screw, tension spring, crimp, Push-In)'],
    ['Industrial Applications', 'Machinery, factory automation, control cabinets and distribution boards'],
  ];

  const dim_en = [
    ['Dimensions (Length × Width × Height)', '144.0 mm × 57.0 mm × 57.0 mm'],
    ['Mounting Footprint Area', '8208 mm² (144 mm × 57 mm)'],
    ['Net Weight', '0.216 kg (216 g)'],
    ['EAN / GTIN Code', '4015573620896'],
    ['ETIM / eClass Classification', 'ETIM 8.0/9.0: EC000437 / eClass 11: 27440202'],
    ['Standards & Approvals', 'DIN EN 61984, DIN EN 60529, RoHS, REACH'],
  ];

  const params_de = [
    ['Produktserie', 'revos BASIC'],
    ['Gehäusetyp', 'Sockelgehäuse (Gehäuseunterteil geschlossene Form mit Boden)'],
    ['Baugröße', 'Baugröße 24 (für 24-polige Kontakteinsätze)'],
    ['Bauformhöhe', 'Niedrige Bauform'],
    ['Leitungseinführungen', '2 seitliche Leitungseinführungen (links und rechts)'],
    ['Gewindeanschlüsse', '2 × M25 (Gewindestutzen für M25 Kabelverschraubungen)'],
    ['Verschraubung / Deckel', 'Ausführung A1: Gewindestutzen ohne vormontierte Verschraubungen, ohne Deckel'],
    ['Verriegelungssystem', 'Längsbügel (Einhandverriegelung)'],
    ['Schutzart', 'IP54 (verriegelt) / IP65 (mit entsprechenden dichten Verschraubungen)'],
    ['Betriebstemperaturbereich', '-40 °C bis +120 °C'],
  ];

  const mech_de = [
    ['Gehäusewerkstoff', 'Aluminiumdruckguss-Legierung'],
    ['Oberflächenbeschichtung', 'Pulverbeschichtet (grau RAL 7037)'],
    ['Werkstoff Längsbügel', 'Bügel: Edelstahl V2A / Rastgriff: Polyamid UL94-V0'],
    ['Dichtungswerkstoff', 'Acrylnitril-Butadien-Kautschuk (NBR), ölbeständig'],
    ['Montageart', 'Aufputz- / Sockelmontage (4 Befestigungslöcher für M5 Schrauben)'],
    ['Befestigungslochabstand', 'Länge: 132,0 mm / Breite: 45,0 mm'],
    ['Passende Kontakteinsätze', 'revos BASIC Größe 24 (Schraub-, Zugfeder-, Crimp-, Push-In-Technik)'],
    ['Anwendungsbereiche', 'Maschinenbau, Automatisierungsanlagen, Schaltschränke und Energieverteiler'],
  ];

  const dim_de = [
    ['Abmessungen (Länge × Breite × Höhe)', '144,0 mm × 57,0 mm × 57,0 mm'],
    ['Platzbedarf Montagefläche', '8208 mm² (144 mm × 57 mm)'],
    ['Nettogewicht', '0,216 kg (216 g)'],
    ['EAN / GTIN-Nummer', '4015573620896'],
    ['ETIM / eClass Klassifizierung', 'ETIM 8.0/9.0: EC000437 / eClass 11: 27440202'],
    ['Normen und Zulassungen', 'DIN EN 61984, DIN EN 60529, RoHS, REACH'],
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
          <h1><span class="lang-tag">PL</span>Karta katalogowa / DTR: Obudowa cokołowa revos 24</h1>
          <div class="subtitle">revos BASIC obudowa dolna, 2x M25 gwint boczny, 1 dźwignia, niska | Nr art.: <strong>${orderNr}</strong> | Typ: <strong>${typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">revos BASIC</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          Wielostykowe złącze przemysłowe heavy-duty serii revos BASIC. Obudowa cokołowa (podstawa gniazda) niska (wielkość 24 / 24-biegunowa) z odlewu aluminiowego, malowana proszkowo (szary). Wyposażona w pojedynczą dźwignię ryglującą wzdłużną (stal nierdzewna V2A / poliamid UL94-V0) oraz uszczelnienie NBR. Dwa boczne wprowadzenia kablowe M25 z kołnierzami gwintowanymi (bez fabrycznych dławnic, wersja A1). Stopień ochrony: IP54 (IP65 przy zastosowaniu odpowiednich dławnic szczelnych). Zakres temperatur pracy: od -40 °C do +120 °C. Zastosowanie: aplikacje przemysłowe, budowa maszyn i szaf sterowniczych.
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
      <span>Wieland Electric GmbH &bull; revos BASIC &bull; Karta katalogowa DTR</span>
      <span>Strona 1 z 3 (PL)</span>
    </div>
  </div>

  <!-- ==================== STRONA 2: ANGIELSKI (ENG) ==================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">ENG</span>Technical Datasheet: Surface-Mounted Base Housing revos 24</h1>
          <div class="subtitle">revos BASIC bottom housing, 2x M25 side thread, 1 locking lever, low | Part No.: <strong>${orderNr}</strong> | Type: <strong>${typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">revos BASIC</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          Heavy-duty industrial multipole connector revos BASIC series. Surface-mounted housing base low profile design (size 24 / 24-pole) made of die-cast aluminum alloy, powder-coated (grey). Equipped with single longitudinal locking lever (stainless steel V2A / polyamide UL94-V0) and NBR gasket. Two lateral M25 cable entries with threaded collars (plain threads without pre-installed cable glands, version A1). Degree of protection: IP54 (IP65 with appropriate sealed cable glands). Operating temperature range: -40 °C to +120 °C. Application: industrial machinery, automation systems and control cabinets.
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
      <span>Wieland Electric GmbH &bull; revos BASIC &bull; Technical Product Datasheet</span>
      <span>Page 2 of 3 (ENG)</span>
    </div>
  </div>

  <!-- ==================== STRONA 3: NIEMIECKI (DE) ==================== -->
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">DE</span>Technisches Datenblatt: Sockelgehäuse revos 24</h1>
          <div class="subtitle">revos BASIC Gehäuseunterteil, 2x M25 Gewinde seitlich, 1 Längsbügel, niedrig | Art.-Nr.: <strong>${orderNr}</strong> | Typ: <strong>${typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">revos BASIC</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          Schwerer Industriesteckverbinder der revos BASIC Serie. Sockelgehäuse niedrige Bauform (Größe 24 / 24-polig) aus Aluminiumdruckguss, pulverbeschichtet (grau). Ausgestattet mit Längsbügel (Edelstahl V2A / Polyamid UL94-V0) und NBR-Dichtung. Zwei seitliche M25 Leitungseinführungen mit Gewindestutzen (ohne vormontierte Verschraubungen, Ausführung A1). Schutzart: IP54 (IP65 mit entsprechenden dichten Verschraubungen). Temperaturbereich: -40 °C bis +120 °C. Einsatzbereich: Industriemaschinen, Automatisierungsanlagen und Schaltschränke.
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
      <span>Wieland Electric GmbH &bull; revos BASIC &bull; Technisches Datenblatt</span>
      <span>Seite 3 von 3 (DE)</span>
    </div>
  </div>

</body>
</html>`;
}

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  
  // 1. Render 71.330.2435.1
  const html71 = generate71330HTML();
  const tempHtml71 = path.resolve('scripts/71_330_2435_1_datasheet.html');
  const targetPdf71 = path.resolve('EDZ/261119/WIE.71.330.2435.1/71.330.2435.1_datasheet.pdf');
  
  fs.writeFileSync(tempHtml71, html71, 'utf8');
  console.log('Rendering 71.330.2435.1 PDF...');
  const cmd71 = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${targetPdf71}" "file:///${tempHtml71.replace(/\\/g, '/')}"`;
  cp.execSync(cmd71, { stdio: 'inherit' });
  if (fs.existsSync(targetPdf71) && fs.statSync(targetPdf71).size > 0) {
    console.log(`Success: Generated PDF ${targetPdf71} (${fs.statSync(targetPdf71).size} bytes)`);
    fs.unlinkSync(tempHtml71);
  }

  // 2. Re-render 83.040.1281.0 with cropped image
  console.log('Re-rendering 83.040.1281.0 PDF with cropped image...');
  cp.execSync('node scripts/build_83_040_1281_0_pdf.js', { stdio: 'inherit' });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
