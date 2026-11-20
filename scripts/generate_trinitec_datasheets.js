const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function toBase64(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const buf = fs.readFileSync(filePath);
  return 'data:image/png;base64,' + buf.toString('base64');
}

const scratchDir = 'C:/Users/pswie/.gemini/antigravity/brain/403ba6a2-be9f-4b86-bc28-b28e3466e999/scratch';
const imgP3Render = toBase64(path.join(scratchDir, 'MNT-2XP3TINY.png'));
const imgP3SingleRender = toBase64(path.join(scratchDir, 'MNT-P3TINY.png'));
const imgP3Side = toBase64(path.join(scratchDir, 'p3tiny_side.png'));
const imgP3Front = toBase64(path.join(scratchDir, 'p3tiny_front.png'));
const imgP3FrontSingle = toBase64(path.join(scratchDir, 'p3tiny_front_single.png'));
const imgP3Drill = toBase64(path.join(scratchDir, 'p3tiny_drill_template.png'));
const imgP3DrillSingle = toBase64(path.join(scratchDir, 'p3tiny_drill_single.png'));

const imgKvmRender = toBase64(path.join(scratchDir, 'MNT-KVM-CM664.png'));
const imgKvmSide = toBase64(path.join(scratchDir, 'kvm_side.png'));

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
    color: #1e293b;
    margin: 0;
    padding: 0;
    font-size: 8.5px;
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
    border-bottom: 2.5px solid #003366;
    padding-bottom: 5px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #003366;
    font-size: 14.5px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 15px;
    color: #003366;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .header .brand span {
    color: #e65100;
  }
  .lang-tag {
    display: inline-block;
    background: #003366;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 8.5px;
    font-weight: 700;
    margin-right: 6px;
    vertical-align: middle;
  }
  .subtitle {
    font-size: 9.8px;
    color: #475569;
    margin-top: 2px;
    font-weight: 500;
  }
  .overview-container {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
    align-items: center;
  }
  .overview-box {
    flex: 1;
    background: #f8fafc;
    border-left: 3.5px solid #003366;
    padding: 6px 10px;
    font-size: 8.7px;
  }
  .overview-image {
    width: 155px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 4px;
  }
  .overview-image img {
    max-width: 147px;
    max-height: 112px;
    object-fit: contain;
  }
  h2 {
    color: #003366;
    font-size: 9.8px;
    border-bottom: 1px solid #94a3b8;
    padding-bottom: 2px;
    margin-top: 5px;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
  }
  th, td {
    padding: 2.8px 5px;
    border-bottom: 1px solid #e2e8f0;
    text-align: left;
    font-size: 8.4px;
  }
  th {
    background: #f1f5f9;
    font-weight: 600;
    color: #1e293b;
    width: 35%;
  }
  .highlight-th {
    background: #e0f2fe;
    color: #0369a1;
    font-weight: 700;
  }
  .highlight-val {
    font-weight: 700;
    color: #0f172a;
  }
  .drawings-grid {
    display: flex;
    gap: 8px;
    margin-top: 4px;
    margin-bottom: 6px;
    align-items: stretch;
  }
  .drawing-card {
    flex: 1;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 4px;
    background: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .drawing-card img {
    max-width: 100%;
    max-height: 105px;
    object-fit: contain;
    margin: 0 auto;
    display: block;
  }
  .drawing-title {
    font-size: 7.8px;
    font-weight: 600;
    color: #475569;
    margin-top: 3px;
  }
  .footer {
    border-top: 1px solid #cbd5e1;
    padding-top: 4px;
    font-size: 7.6px;
    color: #64748b;
    display: flex;
    justify-content: space-between;
  }
  `;
}

function generateP3TinySingleHtml() {
  const css = getBaseStyle();

  const secPL = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">PL</span>KARTA KATALOGOWA / DTR</h1>
          <div class="subtitle">Uchwyt 1× Lenovo ThinkStation P3 Tiny Gen 2 – montaż płasko na płycie</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Automatyka Przemysłowa</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>Nr artykułu EPLAN:</strong> TRN.MNT-P3TINY<br>
          <strong>Oznaczenie typu:</strong> MNT-P3TINY-REVB (wersja pojedyncza, rev B)<br>
          <strong>Kod producenta:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Technologia / Materiał:</strong> Druk 3D FDM / PETG odporny termicznie i mechanicznie<br>
          <strong>Opis funkcjonalny:</strong> Zestaw uchwytu montażowego przeznaczony do bezpiecznego zamocowania pojedynczej stacji roboczej Lenovo ThinkStation P3 Tiny Gen 2 płasko na płycie montażowej szafy sterowniczej lub pulpitu operatorskiego. Konstrukcja z 2 szynami montażowymi i 2 dociskami od czoła umożliwia błyskawiczny montaż i demontaż komputera z przodu (4 śruby M4x45). Zintegrowana szczelina wentylacyjna 15 mm za komputerem gwarantuje swobodny przepływ powietrza i optymalne chłodzenie.
        </div>
        <div class="overview-image">
          <img src="${imgP3SingleRender}" alt="Uchwyt 1x Lenovo ThinkStation P3 Tiny">
        </div>
      </div>

      <h2>Wymiary montażowe i parametry zabudowy (Zgodnie z szablonem 1:1)</h2>
      <table>
        <tr><th class="highlight-th">Pole zajęte na płycie (W × H)</th><td class="highlight-val">182.0 × 199.8 mm (szerokość × wysokość pojedynczej sekcji)</td></tr>
        <tr><th class="highlight-th">Wysięg od płyty montażowej (Głębokość D)</th><td class="highlight-val">56.8 mm (grubość komputera 37.0 mm + szczelina wentylacyjna 15.0 mm + docisk)</td></tr>
        <tr><th class="highlight-th">Rozstaw osiowy szyn montażowych</th><td class="highlight-val">122.0 mm (szerokość szyny: 40.0 mm)</td></tr>
        <tr><th class="highlight-th">Punkty mocowania do płyty (Szablon wiercenia)</th><td class="highlight-val">4 otwory M5 (Ø4,2 mm pod gwint M5 lub pod nitonakrętki M5)</td></tr>
        <tr><th>Współrzędne 4 otworów montażowych</th><td>Dolne: (30.0; 30.0) mm i (152.0; 30.0) mm | Górne: (30.0; 149.0) mm i (152.0; 149.0) mm (rozstaw pionowy 119.0 mm)</td></tr>
        <tr><th>Szczelina powietrzna za komputerem</th><td>15.0 mm – swobodny przepływ powietrza i chłodzenie stacji roboczej</td></tr>
        <tr><th>Wymagany minimalny luz do drzwi / monitora</th><td>≥ 65.0 mm przy zamkniętych drzwiach szafki pulpitowej</td></tr>
        <tr><th>Wymagana wolna wysokość sekcji montażowej</th><td>≥ ~200.0 mm (+ przestrzeń na zewnętrzny zasilacz 170/230W)</td></tr>
        <tr><th>Skok podniesienia przy montażu / demontażu</th><td>~7.0 mm (uniesienie, wsunięcie dolnej krawędzi za wargi i dociśnięcie czołowe)</td></tr>
      </table>

      <h2>Zestawienie elementów i parametry wykonania</h2>
      <table>
        <tr><th>Części drukowane (PETG)</th><td>2× szyna montażowa (szyna_x4.stl), 2× docisk czołowy (docisk_x4.stl), uchwyt zasilacza</td></tr>
        <tr><th>Elementy złączne w zestawie</th><td>4× śruba M5×16 DIN 912 (mocowanie szyn), 4× wtopka mosiężna gwintowana M4 (Ø5,6×8 mm), 4× śruba M4×45 DIN 912</td></tr>
        <tr><th>Parametry druku FDM</th><td>Warstwa 0,2 mm, 4 obrysy, 4 warstwy góra/dół, wypełnienie 30–40% gyroid, wtopki wprasowywane ~230 °C</td></tr>
        <tr><th>Masa zestawu uchwytu</th><td>ok. 0.18 kg (bez komputera i zasilacza)</td></tr>
        <tr><th>Maksymalna temperatura otoczenia</th><td>≤ 35 °C w szafce (zgodnie z limitem termicznym Lenovo ThinkStation P3 Tiny Gen 2)</td></tr>
      </table>

      <h2>Rysunki techniczne, przekrój i szablon otworów montażowych</h2>
      <div class="drawings-grid">
        <div class="drawing-card">
          <img src="${imgP3FrontSingle}" alt="Widok z przodu">
          <div class="drawing-title">Widok sekcji pojedynczej (rozstaw 122 mm, szerokość 182 mm)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Side}" alt="Przekrój boczny">
          <div class="drawing-title">Przekrój boczny (wysięg 56.8 mm, szczelina 15 mm)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3DrillSingle}" alt="Szablon wiercenia">
          <div class="drawing-title">Szablon wiercenia 4× M5 (rozstaw 122 × 119 mm)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikołów · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Strona 1 z 3 (PL) · Artykuł EPLAN: TRN.MNT-P3TINY</div>
    </div>
  </div>
  `;

  const secENG = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">ENG</span>TECHNICAL DATASHEET / MANUAL</h1>
          <div class="subtitle">Mounting Bracket 1× Lenovo ThinkStation P3 Tiny Gen 2 – Flat Backplate Mount</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Industrial Automation</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>EPLAN Part Number:</strong> TRN.MNT-P3TINY<br>
          <strong>Type Designation:</strong> MNT-P3TINY-REVB (Single Unit, rev B)<br>
          <strong>Manufacturer Code:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Manufacturing / Material:</strong> FDM 3D Printing / High-durability PETG thermoplastic<br>
          <strong>Functional Description:</strong> Precision mounting bracket kit designed for securing a single Lenovo ThinkStation P3 Tiny Gen 2 workstation flat against an enclosure backplate or console interior. Dual-rail configuration with two front-accessible clamps permits rapid front extraction (4x M4x45 screws) without needing clearance above or below. 15 mm integrated rear standoff provides uninterrupted airflow for peak compute reliability.
        </div>
        <div class="overview-image">
          <img src="${imgP3SingleRender}" alt="1x ThinkStation P3 Tiny mount assembly">
        </div>
      </div>

      <h2>Installation Dimensions & Cabinet Clearances (Acc. to 1:1 Template)</h2>
      <table>
        <tr><th class="highlight-th">Backplate Footprint (W × H)</th><td class="highlight-val">182.0 × 199.8 mm (Single section width × height)</td></tr>
        <tr><th class="highlight-th">Projection from Mounting Plate (Depth D)</th><td class="highlight-val">56.8 mm (PC chassis 37.0 mm + 15.0 mm airflow gap + front clamp lips)</td></tr>
        <tr><th class="highlight-th">Rail Center-to-Center Distance</th><td class="highlight-val">122.0 mm (Rail width: 40.0 mm)</td></tr>
        <tr><th class="highlight-th">Fixing Points to Plate (Drilling Pattern)</th><td class="highlight-val">4× M5 holes (Ø4.2 mm for M5 tap or M5 blind rivet nuts)</td></tr>
        <tr><th>Hole Coordinates (4× M5 Pattern)</th><td>Bottom: (30.0; 30.0) mm & (152.0; 30.0) mm | Top: (30.0; 149.0) mm & (152.0; 149.0) mm (vertical pitch 119.0 mm)</td></tr>
        <tr><th>Rear Airflow Ventilation Gap</th><td>15.0 mm – unhindered thermal convection for workstation reliability</td></tr>
        <tr><th>Required Front Clearance to Door / Monitor</th><td>≥ 65.0 mm with desk console doors fully closed</td></tr>
        <tr><th>Required Vertical Section Clearance</th><td>≥ ~200.0 mm (+ adequate clearance for external power brick 170/230W)</td></tr>
        <tr><th>Vertical Insertion / Removal Lift</th><td>~7.0 mm (lift upwards, engage lower flange into bottom lip, lock front clamp)</td></tr>
      </table>

      <h2>Bill of Materials & Fabrication Specifications</h2>
      <table>
        <tr><th>3D Printed Components (PETG)</th><td>2× mounting rail (szyna_x4.stl), 2× front clamp bracket (docisk_x4.stl), PSU holder</td></tr>
        <tr><th>Fasteners & Hardware Included</th><td>4× M5×16 DIN 912 cap screws (rails), 4× M4 brass heat-set inserts (Ø5.6×8 mm), 4× M4×45 DIN 912 screws</td></tr>
        <tr><th>FDM Print Settings</th><td>0.2 mm layer height, 4 perimeters, 4 top/bottom solid layers, 30–40% gyroid infill, insert heat ~230 °C</td></tr>
        <tr><th>Net Bracket Weight</th><td>approx. 0.18 kg (excluding computer and power supply)</td></tr>
        <tr><th>Maximum Ambient Operating Temperature</th><td>≤ 35 °C inside enclosure (operating ceiling for Lenovo ThinkStation P3 Tiny Gen 2)</td></tr>
      </table>

      <h2>Technical Drawings, Side Cross-Section & Drilling Pattern</h2>
      <div class="drawings-grid">
        <div class="drawing-card">
          <img src="${imgP3FrontSingle}" alt="Front view">
          <div class="drawing-title">Single Section Front View (122 mm rail pitch, 182 mm width)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Side}" alt="Side cross-section">
          <div class="drawing-title">Side Cross-Section (56.8 mm projection, 15 mm air gap)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3DrillSingle}" alt="Drilling pattern">
          <div class="drawing-title">Drilling Pattern 4× M5 (122 × 119 mm hole pitch)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikolow, Poland · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Page 2 of 3 (ENG) · EPLAN Article: TRN.MNT-P3TINY</div>
    </div>
  </div>
  `;

  const secDE = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">DE</span>TECHNISCHES DATENBLATT / DTR</h1>
          <div class="subtitle">Montagehalterung 1× Lenovo ThinkStation P3 Tiny Gen 2 – Flachmontage Montageplatte</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Industrieautomation</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>EPLAN Artikelnummer:</strong> TRN.MNT-P3TINY<br>
          <strong>Typenbezeichnung:</strong> MNT-P3TINY-REVB (Einzelversion, Rev B)<br>
          <strong>Herstellercode:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Fertigung / Werkstoff:</strong> FDM 3D-Druck / Hochbelastbares PETG Thermoplast<br>
          <strong>Funktionsbeschreibung:</strong> Halterungsset zur Flachmontage einer einzelnen Lenovo ThinkStation P3 Tiny Gen 2 Workstation auf der Montageplatte von Pult- und Schaltschränken. Die Ausführung mit zwei Tragschienen und frontseitigen Klemmen ermöglicht ein schnelles Einsetzen und Herausnehmen von vorne (4x M4x45 Schrauben). Ein 15 mm Hinterlüftungsspalt sichert die erforderliche Kühlung.
        </div>
        <div class="overview-image">
          <img src="${imgP3SingleRender}" alt="1x ThinkStation P3 Tiny Baugruppe">
        </div>
      </div>

      <h2>Montageabmessungen und Einbaurichtlinien (Gemäß Bohrbild 1:1)</h2>
      <table>
        <tr><th class="highlight-th">Montageflächenbedarf auf Platte (B × H)</th><td class="highlight-val">182.0 × 199.8 mm (Breite × Höhe der Einzelsektion)</td></tr>
        <tr><th class="highlight-th">Ausladung von Montageplatte (Tiefe T)</th><td class="highlight-val">56.8 mm (PC-Gehäuse 37.0 mm + 15.0 mm Luftspalt + Frontklemmen)</td></tr>
        <tr><th class="highlight-th">Schienenmittenabstand (horizontal)</th><td class="highlight-val">122.0 mm (Schienenbreite: 40.0 mm)</td></tr>
        <tr><th class="highlight-th">Befestigungspunkte Montageplatte (Bohrbild)</th><td class="highlight-val">4× M5 Bohrungen (Ø4,2 mm für M5 Gewinde oder Blindnietmuttern)</td></tr>
        <tr><th>Bohrkoordinaten (4× M5 Bohrraster)</th><td>Unten: (30.0; 30.0) mm & (152.0; 30.0) mm | Oben: (30.0; 149.0) mm & (152.0; 149.0) mm (Vertikalabstand 119.0 mm)</td></tr>
        <tr><th>Hinterlüftungs-Luftspalt</th><td>15.0 mm – freie Luftzirkulation zur thermischen Entlastung</td></tr>
        <tr><th>Erforderlicher Freiraum zu Schranktür / Monitor</th><td>≥ 65.0 mm bei geschlossenen Pulttüren</td></tr>
        <tr><th>Erforderliche lichte Einbauhöhe</th><td>≥ ~200.0 mm (+ Bauraum für externes Tischnetzteil 170/230W)</td></tr>
        <tr><th>Hubweg für Entnahme / Einsetzen</th><td>~7.0 mm (Anheben, Einstecken in untere Hakenlippe, Festziehen der Frontklemme)</td></tr>
      </table>

      <h2>Stückliste und Fertigungsparameter</h2>
      <table>
        <tr><th>3D-Druckteile (PETG)</th><td>2× Montageschiene (szyna_x4.stl), 2× Frontklemme (docisk_x4.stl), Netzteilhalter</td></tr>
        <tr><th>Verbindungselemente im Lieferumfang</th><td>4× Zylinderschraube M5×16 DIN 912, 4× Messing-Gewindeeinsatz M4 (Ø5,6×8 mm), 4× Schraube M4×45 DIN 912</td></tr>
        <tr><th>FDM Druckparameter</th><td>Schichthöhe 0,2 mm, 4 Wandlinien, 4 Decken-/Bodenschichten, 30–40% Gyroid-Füllung, Einschmelztemperatur ~230 °C</td></tr>
        <tr><th>Nettogewicht Halterungsset</th><td>ca. 0.18 kg (ohne Computer und Netzteil)</td></tr>
        <tr><th>Maximale Schrank-Innentemperatur</th><td>≤ 35 °C (Herstellerspezifisches Temperaturlimit Lenovo ThinkStation P3 Tiny Gen 2)</td></tr>
      </table>

      <h2>Technische Zeichnungen, Querschnitt und Bohrschablone</h2>
      <div class="drawings-grid">
        <div class="drawing-card">
          <img src="${imgP3FrontSingle}" alt="Frontansicht">
          <div class="drawing-title">Frontansicht Einzelsektion (122 mm Schienenabstand, 182 mm Breite)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Side}" alt="Seitenquerschnitt">
          <div class="drawing-title">Seitenquerschnitt (56.8 mm Ausladung, 15 mm Hinterlüftung)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3DrillSingle}" alt="Bohrschablone">
          <div class="drawing-title">Bohrschablone 4× M5 (Bohrraster 122 × 119 mm)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikolow, Polen · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Seite 3 von 3 (DE) · EPLAN Artikel: TRN.MNT-P3TINY</div>
    </div>
  </div>
  `;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>TRN.MNT-P3TINY Datasheet</title>
<style>${css}</style>
</head>
<body>
${secPL}
${secENG}
${secDE}
</body>
</html>`;
}

function main() {
  const target = process.argv[2];

  if (!target || target === 'TRN.MNT-P3TINY') {
    const singleHtml = generateP3TinySingleHtml();
    const singleHtmlPath = path.join(__dirname, 'MNT-P3TINY_datasheet.html');
    const singlePdfPath = path.resolve('EDZ/TRN/TRN.MNT-P3TINY/MNT-P3TINY_datasheet.pdf');
    fs.writeFileSync(singleHtmlPath, singleHtml, 'utf8');

    console.log('Rendering Single P3 Tiny PDF...');
    cp.execSync(`node scripts/html_to_pdf.js "${singleHtmlPath}" "${singlePdfPath}"`);
    if (fs.existsSync(singleHtmlPath)) fs.unlinkSync(singleHtmlPath);
    console.log('Single P3 Tiny datasheet generated successfully.');
  }
}

main();
