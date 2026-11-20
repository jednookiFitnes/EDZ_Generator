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
const imgP3Side = toBase64(path.join(scratchDir, 'p3tiny_side.png'));
const imgP3Front = toBase64(path.join(scratchDir, 'p3tiny_front.png'));
const imgP3Drill = toBase64(path.join(scratchDir, 'p3tiny_drill_template.png'));

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

function generateP3TinyHtml() {
  const css = getBaseStyle();

  const secPL = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">PL</span>KARTA KATALOGOWA / DTR</h1>
          <div class="subtitle">Uchwyt 2× Lenovo ThinkStation P3 Tiny Gen 2 – montaż płasko na płycie</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Automatyka Przemysłowa</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>Nr artykułu EPLAN:</strong> TRN.MNT-2XP3TINY<br>
          <strong>Oznaczenie typu:</strong> MNT-2XP3TINY-REVB (wariant 2, rev B)<br>
          <strong>Kod producenta:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Technologia / Materiał:</strong> Druk 3D FDM / PETG odporny termicznie i mechanicznie<br>
          <strong>Opis funkcjonalny:</strong> Zestaw uchwytów montażowych do szafek pulpitowych i szaf sterowniczych umożliwiający stabilne zamocowanie dwóch stacji roboczych Lenovo ThinkStation P3 Tiny Gen 2 płasko na płycie montażowej. Konstrukcja z dociskiem od frontu pozwala na całkowicie niezależny montaż i demontaż dowolnego komputera (także dolnego) bez ruszania drugiej jednostki. Zintegrowana szczelina wentylacyjna 15 mm za komputerami zapewnia optymalną cyrkulację powietrza.
        </div>
        <div class="overview-image">
          <img src="${imgP3Render}" alt="Złożenie uchwytu 2x ThinkStation P3 Tiny">
        </div>
      </div>

      <h2>Wymiary montażowe i parametry zabudowy (Zgodnie z szablonem 1:1)</h2>
      <table>
        <tr><th class="highlight-th">Całkowite pole zajęte na płycie (W × H)</th><td class="highlight-val">182.0 × 398.0 mm (wysokość sekcji pojedynczej: 199.8 mm)</td></tr>
        <tr><th class="highlight-th">Wysięg od płyty montażowej (Głębokość D)</th><td class="highlight-val">56.8 mm (grubość komputera 37.0 mm + szczelina wentylacyjna 15.0 mm + wargi docisku)</td></tr>
        <tr><th class="highlight-th">Rozstaw osiowy szyn montażowych</th><td class="highlight-val">122.0 mm (szerokość szyny: 40.0 mm)</td></tr>
        <tr><th class="highlight-th">Punkty mocowania do płyty (Szablon wiercenia)</th><td class="highlight-val">8 otworów M5 (Ø4,2 mm pod gwint M5 lub pod nitonakrętki M5)</td></tr>
        <tr><th>Współrzędne otworów – Sekcja dolna (Komputer 1)</th><td>Dolne: (30.0; 30.0) mm i (152.0; 30.0) mm | Górne: (30.0; 149.0) mm i (152.0; 149.0) mm (rozstaw pionowy 119 mm)</td></tr>
        <tr><th>Współrzędne otworów – Sekcja górna (Komputer 2)</th><td>Dolne: (30.0; 229.8) mm i (152.0; 229.8) mm | Górne: (30.0; 348.8) mm i (152.0; 348.8) mm (rozstaw pionowy 119 mm)</td></tr>
        <tr><th>Szczelina powietrzna za komputerem</th><td>15.0 mm – swobodny przepływ powietrza i chłodzenie stacji roboczej</td></tr>
        <tr><th>Wymagany minimalny luz do drzwi / monitora</th><td>≥ 65.0 mm przy zamkniętych drzwiach szafki pulpitowej</td></tr>
        <tr><th>Wymagana wolna wysokość sekcji montażowej</th><td>≥ ~400.0 mm (+ przestrzeń na zewnętrzne zasilacze 170/230W)</td></tr>
        <tr><th>Skok podniesienia przy montażu / demontażu</th><td>~7.0 mm (uniesienie, wsunięcie dolnej krawędzi za wargi i dociśnięcie czołowe)</td></tr>
      </table>

      <h2>Zestawienie elementów i parametry wykonania</h2>
      <table>
        <tr><th>Części drukowane (PETG)</th><td>4× szyna montażowa (szyna_x4.stl, ~90 cm³/szt.), 4× docisk czołowy (docisk_x4.stl), uchwyty zasilacza</td></tr>
        <tr><th>Elementy złączne w zestawie</th><td>8× śruba M5×16 DIN 912 (mocowanie szyn), 8× wtopka mosiężna gwintowana M4 (Ø5,6×8 mm), 8× śruba M4×45 DIN 912</td></tr>
        <tr><th>Parametry druku FDM</th><td>Warstwa 0,2 mm, 4 obrysy, 4 warstwy góra/dół, wypełnienie 30–40% gyroid, wtopki wprasowywane ~230 °C</td></tr>
        <tr><th>Masa zestawu uchwytu</th><td>ok. 0.35 kg (bez komputerów i zasilaczy)</td></tr>
        <tr><th>Maksymalna temperatura otoczenia</th><td>≤ 35 °C w szafce (zgodnie z limitem termicznym Lenovo ThinkStation P3 Tiny Gen 2)</td></tr>
      </table>

      <h2>Rysunki techniczne, przekrój i szablon otworów montażowych</h2>
      <div class="drawings-grid">
        <div class="drawing-card">
          <img src="${imgP3Front}" alt="Widok z przodu">
          <div class="drawing-title">Widok z przodu (rozstaw 122 mm, szerokość 182 mm)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Side}" alt="Przekrój boczny">
          <div class="drawing-title">Przekrój boczny (wysięg 56.8 mm, szczelina 15 mm)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Drill}" alt="Szablon wiercenia">
          <div class="drawing-title">Szablon wiercenia 8× M5 (współrzędne X: 30/152 mm)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikołów · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Strona 1 z 3 (PL) · Artykuł EPLAN: TRN.MNT-2XP3TINY</div>
    </div>
  </div>
  `;

  const secENG = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">ENG</span>TECHNICAL DATASHEET / MANUAL</h1>
          <div class="subtitle">Mounting Bracket 2× Lenovo ThinkStation P3 Tiny Gen 2 – Flat Backplate Mount</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Industrial Automation</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>EPLAN Part Number:</strong> TRN.MNT-2XP3TINY<br>
          <strong>Type Designation:</strong> MNT-2XP3TINY-REVB (Variant 2, rev B)<br>
          <strong>Manufacturer Code:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Manufacturing / Material:</strong> FDM 3D Printing / High-durability PETG thermoplastic<br>
          <strong>Functional Description:</strong> Modular mounting bracket assembly engineered for operator desk consoles and industrial control cabinets, facilitating rigid flat mounting of two Lenovo ThinkStation P3 Tiny Gen 2 workstations directly onto the enclosure backplate. Front-clamping architecture enables fully independent installation and extraction of either computer (including the bottom unit) without disturbing the second workstation. Integrated 15 mm ventilation standoff maintains uninterrupted cooling airflow.
        </div>
        <div class="overview-image">
          <img src="${imgP3Render}" alt="2x ThinkStation P3 Tiny mount assembly">
        </div>
      </div>

      <h2>Installation Dimensions & Cabinet Clearances (Acc. to 1:1 Template)</h2>
      <table>
        <tr><th class="highlight-th">Total Backplate Footprint (W × H)</th><td class="highlight-val">182.0 × 398.0 mm (Single section height: 199.8 mm)</td></tr>
        <tr><th class="highlight-th">Projection from Mounting Plate (Depth D)</th><td class="highlight-val">56.8 mm (PC chassis 37.0 mm + 15.0 mm airflow gap + front clamp lips)</td></tr>
        <tr><th class="highlight-th">Rail Center-to-Center Distance</th><td class="highlight-val">122.0 mm (Rail width: 40.0 mm)</td></tr>
        <tr><th class="highlight-th">Fixing Points to Plate (Drilling Pattern)</th><td class="highlight-val">8× M5 holes (Ø4.2 mm for M5 tap or M5 blind rivet nuts)</td></tr>
        <tr><th>Hole Coordinates – Lower Section (PC 1)</th><td>Bottom: (30.0; 30.0) mm & (152.0; 30.0) mm | Top: (30.0; 149.0) mm & (152.0; 149.0) mm (vertical pitch 119 mm)</td></tr>
        <tr><th>Hole Coordinates – Upper Section (PC 2)</th><td>Bottom: (30.0; 229.8) mm & (152.0; 229.8) mm | Top: (30.0; 348.8) mm & (152.0; 348.8) mm (vertical pitch 119 mm)</td></tr>
        <tr><th>Rear Airflow Ventilation Gap</th><td>15.0 mm – unhindered thermal convection for workstation reliability</td></tr>
        <tr><th>Required Front Clearance to Door / Monitor</th><td>≥ 65.0 mm with desk console doors fully closed</td></tr>
        <tr><th>Required Vertical Section Clearance</th><td>≥ ~400.0 mm (+ adequate clearance for external power bricks 170/230W)</td></tr>
        <tr><th>Vertical Insertion / Removal Lift</th><td>~7.0 mm (lift upwards, engage lower flange into bottom lip, lock front clamp)</td></tr>
      </table>

      <h2>Bill of Materials & Fabrication Specifications</h2>
      <table>
        <tr><th>3D Printed Components (PETG)</th><td>4× mounting rail (szyna_x4.stl, ~90 cm³/pc), 4× front clamp bracket (docisk_x4.stl), PSU holders</td></tr>
        <tr><th>Fasteners & Hardware Included</th><td>8× M5×16 DIN 912 cap screws (rails), 8× M4 brass heat-set inserts (Ø5.6×8 mm), 8× M4×45 DIN 912 screws</td></tr>
        <tr><th>FDM Print Settings</th><td>0.2 mm layer height, 4 perimeters, 4 top/bottom solid layers, 30–40% gyroid infill, insert heat ~230 °C</td></tr>
        <tr><th>Net Bracket Weight</th><td>approx. 0.35 kg (excluding computers and power supplies)</td></tr>
        <tr><th>Maximum Ambient Operating Temperature</th><td>≤ 35 °C inside enclosure (operating ceiling for Lenovo ThinkStation P3 Tiny Gen 2)</td></tr>
      </table>

      <h2>Technical Drawings, Side Cross-Section & Drilling Pattern</h2>
      <div class="drawings-grid">
        <div class="drawing-card">
          <img src="${imgP3Front}" alt="Front view">
          <div class="drawing-title">Front View (122 mm rail pitch, 182 mm width)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Side}" alt="Side cross-section">
          <div class="drawing-title">Side Cross-Section (56.8 mm projection, 15 mm gap)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Drill}" alt="Drilling pattern">
          <div class="drawing-title">Drilling Pattern 8× M5 (X pitch: 30/152 mm)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikolow, Poland · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Page 2 of 3 (ENG) · EPLAN Article: TRN.MNT-2XP3TINY</div>
    </div>
  </div>
  `;

  const secDE = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">DE</span>TECHNISCHES DATENBLATT / DTR</h1>
          <div class="subtitle">Montagehalterung 2× Lenovo ThinkStation P3 Tiny Gen 2 – Flachmontage Montageplatte</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Industrieautomation</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>EPLAN Artikelnummer:</strong> TRN.MNT-2XP3TINY<br>
          <strong>Typenbezeichnung:</strong> MNT-2XP3TINY-REVB (Variante 2, Rev B)<br>
          <strong>Herstellercode:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Fertigung / Werkstoff:</strong> FDM 3D-Druck / Hochbelastbares PETG Thermoplast<br>
          <strong>Funktionsbeschreibung:</strong> Modulares Halterungsset für Steuerpulte und Schaltschränke zur stabilen Flachmontage von zwei Lenovo ThinkStation P3 Tiny Gen 2 Workstations direkt auf der Montageplatte. Das frontseitige Verriegelungssystem ermöglicht die vollkommen unabhängige Entnahme und Montage jedes Rechners (auch des unteren) ohne Demontage der benachbarten Einheit. Ein integrierter 15 mm Hinterlüftungsabstand gewährleistet optimale Konvektion.
        </div>
        <div class="overview-image">
          <img src="${imgP3Render}" alt="2x ThinkStation P3 Tiny Baugruppe">
        </div>
      </div>

      <h2>Montageabmessungen und Einbaurichtlinien (Gemäß Bohrbild 1:1)</h2>
      <table>
        <tr><th class="highlight-th">Montageflächenbedarf auf Platte (B × H)</th><td class="highlight-val">182.0 × 398.0 mm (Höhe Einzelsektion: 199.8 mm)</td></tr>
        <tr><th class="highlight-th">Ausladung von Montageplatte (Tiefe T)</th><td class="highlight-val">56.8 mm (PC-Gehäuse 37.0 mm + 15.0 mm Luftspalt + Frontklemmen)</td></tr>
        <tr><th class="highlight-th">Schienenmittenabstand (horizontal)</th><td class="highlight-val">122.0 mm (Schienenbreite: 40.0 mm)</td></tr>
        <tr><th class="highlight-th">Befestigungspunkte Montageplatte (Bohrbild)</th><td class="highlight-val">8× M5 Bohrungen (Ø4,2 mm für M5 Gewinde oder Blindnietmuttern)</td></tr>
        <tr><th>Bohrkoordinaten – Untere Sektion (PC 1)</th><td>Unten: (30.0; 30.0) mm & (152.0; 30.0) mm | Oben: (30.0; 149.0) mm & (152.0; 149.0) mm (Vertikalabstand 119 mm)</td></tr>
        <tr><th>Bohrkoordinaten – Obere Sektion (PC 2)</th><td>Unten: (30.0; 229.8) mm & (152.0; 229.8) mm | Oben: (30.0; 348.8) mm & (152.0; 348.8) mm (Vertikalabstand 119 mm)</td></tr>
        <tr><th>Hinterlüftungs-Luftspalt</th><td>15.0 mm – freie Luftzirkulation zur thermischen Entlastung</td></tr>
        <tr><th>Erforderlicher Freiraum zu Schranktür / Monitor</th><td>≥ 65.0 mm bei geschlossenen Pulttüren</td></tr>
        <tr><th>Erforderliche lichte Einbauhöhe</th><td>≥ ~400.0 mm (+ Bauraum für externe Tischnetzteile 170/230W)</td></tr>
        <tr><th>Hubweg für Entnahme / Einsetzen</th><td>~7.0 mm (Anheben, Einstecken in untere Hakenlippe, Festziehen der Frontklemme)</td></tr>
      </table>

      <h2>Stückliste und Fertigungsparameter</h2>
      <table>
        <tr><th>3D-Druckteile (PETG)</th><td>4× Montageschiene (szyna_x4.stl, ~90 cm³/Stk.), 4× Frontklemme (docisk_x4.stl), Netzteilhalter</td></tr>
        <tr><th>Verbindungselemente im Lieferumfang</th><td>8× Zylinderschraube M5×16 DIN 912, 8× Messing-Gewindeeinsatz M4 (Ø5,6×8 mm), 8× Schraube M4×45 DIN 912</td></tr>
        <tr><th>FDM Druckparameter</th><td>Schichthöhe 0,2 mm, 4 Wandlinien, 4 Decken-/Bodenschichten, 30–40% Gyroid-Füllung, Einschmelztemperatur ~230 °C</td></tr>
        <tr><th>Nettogewicht Halterungsset</th><td>ca. 0.35 kg (ohne Computer und Netzteile)</td></tr>
        <tr><th>Maximale Schrank-Innentemperatur</th><td>≤ 35 °C (Herstellerspezifisches Temperaturlimit Lenovo ThinkStation P3 Tiny Gen 2)</td></tr>
      </table>

      <h2>Technische Zeichnungen, Querschnitt und Bohrschablone</h2>
      <div class="drawings-grid">
        <div class="drawing-card">
          <img src="${imgP3Front}" alt="Frontansicht">
          <div class="drawing-title">Frontansicht (122 mm Schienenabstand, 182 mm Breite)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Side}" alt="Seitenquerschnitt">
          <div class="drawing-title">Seitenquerschnitt (56.8 mm Ausladung, 15 mm Spalt)</div>
        </div>
        <div class="drawing-card">
          <img src="${imgP3Drill}" alt="Bohrschablone">
          <div class="drawing-title">Bohrschablone 8× M5 (X-Koordinaten: 30/152 mm)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikolow, Polen · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Seite 3 von 3 (DE) · EPLAN Artikel: TRN.MNT-2XP3TINY</div>
    </div>
  </div>
  `;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>TRN.MNT-2XP3TINY Datasheet</title>
<style>${css}</style>
</head>
<body>
${secPL}
${secENG}
${secDE}
</body>
</html>`;
}

function generateKvmHtml() {
  const css = getBaseStyle();

  const secPL = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">PL</span>KARTA KATALOGOWA / DTR</h1>
          <div class="subtitle">Uchwyt przełącznika KVM UGREEN CM664 (HDMI 2 in 1 out) – montaż na płycie</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Automatyka Przemysłowa</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>Nr artykułu EPLAN:</strong> TRN.MNT-KVM-CM664<br>
          <strong>Oznaczenie typu:</strong> MNT-KVM-CM664-REVB (wersja rev B)<br>
          <strong>Kod producenta:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Technologia / Materiał:</strong> Druk 3D FDM / PETG (podstawa pełna 10 mm + docisk czołowy)<br>
          <strong>Opis funkcjonalny:</strong> Dedykowany uchwyt montażowy rewizji B przeznaczony do pewnego i bezpiecznego mocowania przełącznika KVM UGREEN CM664 (2x HDMI / 2x USB wejście, 1x HDMI wyjście) na płycie montażowej szafy lub pulpitu sterowniczego. Wyposażony w pełną podstawę o grubości 10 mm, wzmocniony hak dolny 6 mm oraz docisk czołowy skręcany dwoma śrubami M4×30 do wprasowanych wtopków gwintowanych M4. Zapewnia błyskawiczny montaż i demontaż urządzenia (podniesienie o ~6 mm i wyjęcie w przód) przy zachowaniu podstawy zamocowanej na płycie. Złącza na bocznych krawędziach pozostają w 100% dostępne.
        </div>
        <div class="overview-image">
          <img src="${imgKvmRender}" alt="Złożenie uchwytu KVM UGREEN CM664">
        </div>
      </div>

      <h2>Wymiary montażowe i parametry zabudowy</h2>
      <table>
        <tr><th class="highlight-th">Całkowite pole zajęte na płycie (W × H)</th><td class="highlight-val">64.0 × 198.0 mm (pełna szerokość 64 mm odpowiadająca obudowie KVM)</td></tr>
        <tr><th class="highlight-th">Wysięg od płyty montażowej (Głębokość D)</th><td class="highlight-val">36.6 mm (grubość podstawy 10 mm + urządzenie KVM 22 mm + docisk czołowy)</td></tr>
        <tr><th class="highlight-th">Rozstaw otworów montażowych M5</th><td class="highlight-val">180.0 mm w pionie × 36.0 mm w poziomie (układ 4 otworów M5)</td></tr>
        <tr><th class="highlight-th">Współrzędne 4 otworów M5 na płycie</th><td class="highlight-val">Dolne: (14.0; 9.0) mm i (50.0; 9.0) mm | Górne: (14.0; 189.0) mm i (50.0; 189.0) mm</td></tr>
        <tr><th>Zalecany zapas boczny na przewody</th><td>≥ 50.0 mm z lewej i prawej strony na bezpieczne podłączenie wtyków HDMI / USB</td></tr>
        <tr><th>Wymiary gniazda na urządzenie KVM</th><td>144.0 × 64.0 × 22.0 mm (dedykowane pod UGREEN CM664: 143 × 64 × 22 mm + luz 1 mm)</td></tr>
        <tr><th>Skok podniesienia przy wyjmowaniu KVM</th><td>~6.0 mm (po odkręceniu 2 śrub docisku M4×30 z czoła, wyjęcie w przód)</td></tr>
        <tr><th>Opcjonalne zabezpieczenie okablowania</th><td>Uchwyt pod opaskę kablową o szerokości do 4,8 mm w podstawie</td></tr>
      </table>

      <h2>Specyfikacja wykonania i elementy złączne</h2>
      <table>
        <tr><th>Części drukowane (PETG)</th><td>1× podstawa montażowa (KVM_podstawa_x1.stl), 1× docisk czołowy (KVM_docisk_x1.stl)</td></tr>
        <tr><th>Elementy złączne w zestawie</th><td>4× śruba M5×12 DIN 912 (podstawa do płyty), 2× wtopka gwintowana M4 (Ø5,6×8 mm), 2× śruba M4×30 DIN 912</td></tr>
        <tr><th>Udoskonalenia rewizji B</th><td>Zwiększona szerokość do 64 mm, grubość podstawy 10 mm (zamiast ażurowej 6 mm), 4 otwory M5 zamiast 2</td></tr>
        <tr><th>Parametry druku FDM</th><td>0,2 mm warstwa, 4 obrysy, wypełnienie 30% gyroid, orientacja na boku bez podpór, wtopki wprasowywane ~230 °C</td></tr>
        <tr><th>Masa uchwytu</th><td>ok. 0.12 kg (bez przełącznika KVM i kabli)</td></tr>
      </table>

      <h2>Rysunki techniczne, przekrój boczny i wymiary</h2>
      <div class="drawings-grid">
        <div class="drawing-card" style="flex: 1.4;">
          <img src="${imgKvmRender}" alt="Złożenie i podstawa">
          <div class="drawing-title">Widok złożenia oraz rozsunięta podstawa z dociskiem czołowym</div>
        </div>
        <div class="drawing-card" style="flex: 1;">
          <img src="${imgKvmSide}" alt="Przekrój boczny KVM">
          <div class="drawing-title">Przekrój boczny (wysięg 36.6 mm, rozstaw otworów M5: 180 mm)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikołów · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Strona 1 z 3 (PL) · Artykuł EPLAN: TRN.MNT-KVM-CM664</div>
    </div>
  </div>
  `;

  const secENG = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">ENG</span>TECHNICAL DATASHEET / MANUAL</h1>
          <div class="subtitle">Mounting Bracket for UGREEN CM664 KVM Switch (HDMI 2 in 1 out) – Plate Mount</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Industrial Automation</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>EPLAN Part Number:</strong> TRN.MNT-KVM-CM664<br>
          <strong>Type Designation:</strong> MNT-KVM-CM664-REVB (Revision B)<br>
          <strong>Manufacturer Code:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Manufacturing / Material:</strong> FDM 3D Printing / Heavy-duty PETG (solid 10 mm base + front clamp)<br>
          <strong>Functional Description:</strong> Dedicated revision B mounting bracket tailored for robust backplate installation of the UGREEN CM664 KVM switch (2x HDMI / 2x USB inputs, 1x HDMI output) inside electrical cabinets and desk consoles. Incorporates a solid 10 mm thick base with weight-relief pockets, heavy-duty 6 mm lower shelf hook, and front-accessible clamp bolted with 2x M4×30 socket screws into heat-set brass threaded inserts. Enables effortless insertion and removal (~6 mm upward lift and front slide) without loosening the backplate base fixture. Lateral HDMI/USB ports remain fully accessible.
        </div>
        <div class="overview-image">
          <img src="${imgKvmRender}" alt="UGREEN CM664 KVM mount assembly">
        </div>
      </div>

      <h2>Installation Dimensions & Cabinet Clearances</h2>
      <table>
        <tr><th class="highlight-th">Total Backplate Footprint (W × H)</th><td class="highlight-val">64.0 × 198.0 mm (full 64 mm width matching KVM housing)</td></tr>
        <tr><th class="highlight-th">Projection from Mounting Plate (Depth D)</th><td class="highlight-val">36.6 mm (10 mm solid base + 22 mm KVM unit + front clamp screw head)</td></tr>
        <tr><th class="highlight-th">M5 Mounting Hole Pitch</th><td class="highlight-val">180.0 mm vertical × 36.0 mm horizontal (4× M5 fixing pattern)</td></tr>
        <tr><th class="highlight-th">Hole Coordinates on Backplate</th><td class="highlight-val">Bottom: (14.0; 9.0) mm & (50.0; 9.0) mm | Top: (14.0; 189.0) mm & (50.0; 189.0) mm</td></tr>
        <tr><th>Recommended Lateral Cable Clearance</th><td>≥ 50.0 mm left and right for seamless strain relief and connector insertion</td></tr>
        <tr><th>KVM Pocket Envelope Dimensions</th><td>144.0 × 64.0 × 22.0 mm (precision fit for UGREEN CM664: 143 × 64 × 22 mm + 1 mm play)</td></tr>
        <tr><th>Vertical Removal Clearance Stroke</th><td>~6.0 mm lift required after loosening 2x M4×30 front clamp screws</td></tr>
        <tr><th>Integrated Cable Tie Slot</th><td>Accommodates standard 4.8 mm nylon cable zip ties on base</td></tr>
      </table>

      <h2>Fabrication Specifications & Fasteners</h2>
      <table>
        <tr><th>3D Printed Components (PETG)</th><td>1× mounting base (KVM_podstawa_x1.stl), 1× front retaining clamp (KVM_docisk_x1.stl)</td></tr>
        <tr><th>Fasteners Included</th><td>4× M5×12 DIN 912 screws (base to plate), 2× M4 threaded brass inserts (Ø5.6×8 mm), 2× M4×30 DIN 912 screws</td></tr>
        <tr><th>Revision B Enhancements</th><td>Full 64 mm width, reinforced 10 mm solid base (replacing open 6 mm lattice), 4x M5 holes instead of 2</td></tr>
        <tr><th>FDM Print Settings</th><td>0.2 mm layer height, 4 perimeters, 30% gyroid infill, side orientation (no supports), insert heat ~230 °C</td></tr>
        <tr><th>Net Bracket Weight</th><td>approx. 0.12 kg (excluding KVM unit and cables)</td></tr>
      </table>

      <h2>Technical Drawings, Side Cross-Section & Dimensions</h2>
      <div class="drawings-grid">
        <div class="drawing-card" style="flex: 1.4;">
          <img src="${imgKvmRender}" alt="Assembly and exploded base">
          <div class="drawing-title">Assembly View and Exploded Base with Front Retaining Clamp</div>
        </div>
        <div class="drawing-card" style="flex: 1;">
          <img src="${imgKvmSide}" alt="Side cross-section">
          <div class="drawing-title">Side Cross-Section (36.6 mm projection, 180 mm M5 pitch)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikolow, Poland · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Page 2 of 3 (ENG) · EPLAN Article: TRN.MNT-KVM-CM664</div>
    </div>
  </div>
  `;

  const secDE = `
  <div class="page">
    <div>
      <div class="header">
        <div>
          <h1><span class="lang-tag">DE</span>TECHNISCHES DATENBLATT / DTR</h1>
          <div class="subtitle">Montagehalterung für UGREEN CM664 KVM-Umschalter (HDMI 2 in 1 out) – Montageplatte</div>
        </div>
        <div class="brand">TRIN<span>ITEC</span><br><span style="font-size: 8.5px; color: #64748b; font-weight: normal;">Industrieautomation</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>EPLAN Artikelnummer:</strong> TRN.MNT-KVM-CM664<br>
          <strong>Typenbezeichnung:</strong> MNT-KVM-CM664-REVB (Revision B)<br>
          <strong>Herstellercode:</strong> TRN (Trinitec Sp. z o.o.)<br>
          <strong>Fertigung / Werkstoff:</strong> FDM 3D-Druck / Robustes PETG (10 mm Vollmaterial-Grundplatte + Frontklemme)<br>
          <strong>Funktionsbeschreibung:</strong> Spezifische Halterung der Revision B zur vibrationsfesten Befestigung des UGREEN CM664 KVM-Umschalters (2x HDMI / 2x USB Eingänge, 1x HDMI Ausgang) auf der Montageplatte von Schaltschränken und Bedienpulten. Ausgestattet mit massiver 10 mm Grundplatte, verstärktem 6 mm Rasthaken unten und frontseitiger Klemmschraubverbindung mit 2x M4×30 Zylinderschrauben in Messing-Gewindeeinsätzen. Ermöglicht schnelle Entnahme des Geräts (~6 mm Anheben und nach vorne herausziehen), während die Grundplatte fest verschraubt bleibt. Alle seitlichen HDMI- und USB-Anschlüsse bleiben voll zugänglich.
        </div>
        <div class="overview-image">
          <img src="${imgKvmRender}" alt="UGREEN CM664 KVM Halterung Baugruppe">
        </div>
      </div>

      <h2>Montageabmessungen und Einbauparameter</h2>
      <table>
        <tr><th class="highlight-th">Montageflächenbedarf auf Platte (B × H)</th><td class="highlight-val">64.0 × 198.0 mm (volle 64 mm Breite entsprechend dem KVM-Gehäuse)</td></tr>
        <tr><th class="highlight-th">Ausladung von Montageplatte (Tiefe T)</th><td class="highlight-val">36.6 mm (10 mm Grundplatte + 22 mm KVM-Gerät + Frontklemmen-Schraubenkopf)</td></tr>
        <tr><th class="highlight-th">M5 Befestigungs-Lochabstand</th><td class="highlight-val">180.0 mm vertikal × 36.0 mm horizontal (4× M5 Bohrbild)</td></tr>
        <tr><th class="highlight-th">Bohrkoordinaten auf Montageplatte</th><td class="highlight-val">Unten: (14.0; 9.0) mm & (50.0; 9.0) mm | Oben: (14.0; 189.0) mm & (50.0; 189.0) mm</td></tr>
        <tr><th>Empfohlener seitlicher Freiraum für Kabel</th><td>≥ 50.0 mm links und rechts für knickfreie Verlegung der HDMI- und USB-Kabel</td></tr>
        <tr><th>Geräteaufnahme-Innenabmessungen</th><td>144.0 × 64.0 × 22.0 mm (passgenau für UGREEN CM664: 143 × 64 × 22 mm + 1 mm Spiel)</td></tr>
        <tr><th>Erforderlicher Entnahme-Hubweg</th><td>~6.0 mm nach Lösen der 2x M4×30 Klemmschrauben von der Front</td></tr>
        <tr><th>Integrierte Kabelbinderaufnahme</th><td>Schlitz für Kabelbinder bis 4,8 mm Breite in der Grundplatte integriert</td></tr>
      </table>

      <h2>Fertigungsspezifikation und Verbindungselemente</h2>
      <table>
        <tr><th>3D-Druckteile (PETG)</th><td>1× Montage-Grundplatte (KVM_podstawa_x1.stl), 1× Front-Halteklemme (KVM_docisk_x1.stl)</td></tr>
        <tr><th>Verbindungselemente im Lieferumfang</th><td>4× Zylinderschraube M5×12 DIN 912, 2× Messing-Gewindeeinsatz M4 (Ø5,6×8 mm), 2× Schraube M4×30 DIN 912</td></tr>
        <tr><th>Verbesserungen Revision B</th><td>Volle 64 mm Gehäusebreite, massive 10 mm Grundplatte (statt 6 mm Gitter), 4x M5 Bohrungen statt 2</td></tr>
        <tr><th>FDM Druckparameter</th><td>0,2 mm Schichthöhe, 4 Wandlinien, 30% Gyroid-Füllung, Seitenlage (stützfrei), Einschmelztemperatur ~230 °C</td></tr>
        <tr><th>Nettogewicht Halterung</th><td>ca. 0.12 kg (ohne KVM-Umschalter und Anschlusskabel)</td></tr>
      </table>

      <h2>Technische Zeichnungen, Seitenquerschnitt und Abmessungen</h2>
      <div class="drawings-grid">
        <div class="drawing-card" style="flex: 1.4;">
          <img src="${imgKvmRender}" alt="Baugruppe und Grundplatte">
          <div class="drawing-title">Gesamtansicht und Grundplatte mit Front-Halteklemme</div>
        </div>
        <div class="drawing-card" style="flex: 1;">
          <img src="${imgKvmSide}" alt="Seitenquerschnitt KVM">
          <div class="drawing-title">Seitenquerschnitt (36.6 mm Ausladung, 180 mm M5 Raster)</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Trinitec Sp. z o.o. · ul. Wyzwolenia 26, 43-190 Mikolow, Polen · biuro@trinitec.pl · www.trinitec.pl</div>
      <div>Seite 3 von 3 (DE) · EPLAN Artikel: TRN.MNT-KVM-CM664</div>
    </div>
  </div>
  `;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>TRN.MNT-KVM-CM664 Datasheet</title>
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
  const p3Html = generateP3TinyHtml();
  const p3HtmlPath = path.join(__dirname, 'MNT-2XP3TINY_datasheet.html');
  const p3PdfPath = path.resolve('EDZ/TRN/TRN.MNT-2XP3TINY/MNT-2XP3TINY_datasheet.pdf');
  fs.writeFileSync(p3HtmlPath, p3Html, 'utf8');

  console.log('Rendering P3 Tiny PDF...');
  cp.execSync(`node scripts/html_to_pdf.js "${p3HtmlPath}" "${p3PdfPath}"`);
  if (fs.existsSync(p3HtmlPath)) fs.unlinkSync(p3HtmlPath);

  const kvmHtml = generateKvmHtml();
  const kvmHtmlPath = path.join(__dirname, 'MNT-KVM-CM664_datasheet.html');
  const kvmPdfPath = path.resolve('EDZ/TRN/TRN.MNT-KVM-CM664/MNT-KVM-CM664_datasheet.pdf');
  fs.writeFileSync(kvmHtmlPath, kvmHtml, 'utf8');

  console.log('Rendering KVM PDF...');
  cp.execSync(`node scripts/html_to_pdf.js "${kvmHtmlPath}" "${kvmPdfPath}"`);
  if (fs.existsSync(kvmHtmlPath)) fs.unlinkSync(kvmHtmlPath);

  console.log('Both Trinitec datasheets generated successfully.');
}

main();
