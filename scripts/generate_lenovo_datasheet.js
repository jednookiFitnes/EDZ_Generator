const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function getBaseStyle() {
  return `
  @page {
    size: A4 portrait;
    margin: 12mm 14mm 12mm 14mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    font-size: 10px;
    line-height: 1.35;
  }
  .page {
    page-break-after: always;
    break-after: page;
    min-height: 270mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }
  .header {
    border-bottom: 3px solid #e2231a;
    padding-bottom: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #e2231a;
    font-size: 17px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 17px;
    color: #e2231a;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .lang-tag {
    display: inline-block;
    background: #e2231a;
    color: #fff;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 700;
    margin-right: 6px;
    vertical-align: middle;
  }
  .subtitle {
    font-size: 11px;
    color: #555;
    margin-top: 3px;
    font-weight: 500;
  }
  .overview-container {
    display: flex;
    gap: 14px;
    margin-bottom: 10px;
    align-items: center;
  }
  .overview-box {
    flex: 1;
    background: #fdf5f5;
    border-left: 4px solid #e2231a;
    padding: 8px 11px;
    font-size: 10px;
  }
  .overview-image {
    width: 170px;
    text-align: center;
  }
  .overview-image img {
    max-width: 165px;
    max-height: 75px;
    object-fit: contain;
  }
  h2 {
    color: #b01810;
    font-size: 11px;
    border-bottom: 1px solid #f0c4c2;
    padding-bottom: 2px;
    margin-top: 7px;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 6px;
  }
  th, td {
    padding: 3.5px 6px;
    border-bottom: 1px solid #e8e8e8;
    text-align: left;
    font-size: 9.5px;
  }
  th {
    background-color: #fbf0f0;
    color: #4a1010;
    font-weight: 600;
    width: 32%;
  }
  td {
    color: #222;
  }
  .highlight-box {
    background-color: #fff9e6;
    border: 1px solid #ffe082;
    border-left: 4px solid #ffb300;
    padding: 5px 8px;
    margin-bottom: 6px;
    font-size: 9.5px;
    border-radius: 2px;
  }
  .footer {
    margin-top: auto;
    padding-top: 5px;
    border-top: 1px solid #ddd;
    font-size: 8.5px;
    color: #666;
    display: flex;
    justify-content: space-between;
  }
  `;
}

function buildHtml() {
  const imgPath = path.resolve('EDZ/261119/LEN.30K5CTO1WW/30K5CTO1WW.png');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/png;base64,${imgBase64}`;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>Lenovo ThinkStation P3 Tiny Gen 2 - 30K5CTO1WW</title>
<style>${getBaseStyle()}</style>
</head>
<body>

<!-- ========================================== -->
<!-- SEKCJA 1: JĘZYK POLSKI (PL)               -->
<!-- ========================================== -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">PL</span>KARTA KATALOGOWA / DTR</h1>
        <div class="subtitle">Lenovo ThinkStation P3 Tiny Gen 2 &bull; Kompaktowa Stacja Robocza IPC (1L)</div>
      </div>
      <div class="brand">Lenovo</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Lenovo ThinkStation P3 Tiny Gen 2 (Typ: 30K5 / CTO: 30K5CTO1WW)</strong><br>
        Ultrakompaktowa stacja robocza klasy przemysłowej i inżynierskiej o pojemności zaledwie 1 litra. Wyposażona w 10-rdzeniowy procesor Intel Core Ultra 5 225 z wbudowaną jednostką NPU Intel AI Boost (do 13 TOPS), szybką pamięć RAM 16 GB DDR5, dysk 512 GB SSD PCIe 4.0 NVMe Opal 2.0 oraz układ graficzny Intel Graphics. Dedykowana do szaf sterowniczych, pulpitów operatorskich, systemów SCADA, CAD i zaawansowanego przetwarzania brzegowego (Edge Computing).
      </div>
      <div class="overview-image">
        <img src="${imgSrc}" alt="Lenovo ThinkStation P3 Tiny Gen 2">
      </div>
    </div>

    <div class="highlight-box">
      <strong>Najważniejsze parametry:</strong> Intel Core Ultra 5 225 (10R, 14W, do 4.9 GHz, NPU AI Boost) &bull; 16 GB DDR5 SO-DIMM &bull; 512 GB SSD M.2 PCIe 4.0 NVMe &bull; Intel Graphics &bull; 1x GbE LAN &bull; USB-C 20Gbps &bull; DP 1.4 + HDMI 2.1 &bull; Win 11 Pro 64 &bull; 3 lata gwarancji Premier Onsite
    </div>

    <h2>1. Dane identyfikacyjne i klasyfikacja EPLAN</h2>
    <table>
      <tr><th>Producent</th><td>Lenovo Group Limited (Kod: LEN)</td></tr>
      <tr><th>Numer artykułu (Part Nr)</th><td>LEN.30K5CTO1WW</td></tr>
      <tr><th>Oznaczenie typu (Type Nr)</th><td>ThinkStation P3 Tiny Gen 2 (Machine Type: 30K5)</td></tr>
      <tr><th>Numer zamówieniowy (Order Nr)</th><td>30K5CTO1WW</td></tr>
      <tr><th>Klasyfikacja EPLAN</th><td>TopGroup: 1 (Elektrotechnika) &bull; Group: 26 (PLC, IPC, HMI) &bull; SubGroup: 1 (Ogólne)</td></tr>
      <tr><th>Oznaczenie aparatowe (Kod lit.)</th><td>KF (Przetwarzanie danych / komputer przemysłowy)</td></tr>
    </table>

    <h2>2. Procesor i jednostka sztucznej inteligencji (NPU)</h2>
    <table>
      <tr><th>Model procesora</th><td>Intel Core Ultra 5 225 (architektura Arrow Lake / Socket LGA1851)</td></tr>
      <tr><th>Liczba rdzeni / wątków</th><td>10 rdzeni (6 Performance-cores + 4 Efficient-cores) / 14 wątków</td></tr>
      <tr><th>Częstotliwość taktowania</th><td>P-core: 3.3 GHz bazowa, do 4.9 GHz Turbo &bull; E-core: 2.7 GHz bazowa, do 3.9 GHz Turbo</td></tr>
      <tr><th>Pamięć podręczna cache</th><td>20 MB Intel Smart Cache (L3) + 20 MB L2</td></tr>
      <tr><th>Jednostka NPU (AI Boost)</th><td>Zintegrowany procesor neuronowy Intel AI Boost o wydajności do 13 TOPS</td></tr>
    </table>

    <h2>3. Pamięć RAM, pamięć masowa i grafika</h2>
    <table>
      <tr><th>Pamięć operacyjna RAM</th><td>16 GB DDR5 SO-DIMM (obsługa do 128 GB DDR5-6400, 2 sloty SO-DIMM dual-channel)</td></tr>
      <tr><th>Pamięć masowa SSD</th><td>512 GB SSD M.2 2280 PCIe 4.0x4 Performance NVMe Opal 2.0 (obsługa do 2 dysków M.2 SSD)</td></tr>
      <tr><th>Układ graficzny</th><td>Zintegrowana grafika Intel Graphics (architektura Intel Xe, obsługa do 4 monitorów)</td></tr>
      <tr><th>Kodek audio</th><td>Realtek ALC233VB-CG, zintegrowany głośnik wewnętrzny 1W x 1</td></tr>
    </table>

    <h2>4. Interfejsy komunikacyjne i złącza</h2>
    <table>
      <tr><th>Porty przednie</th><td>1x USB-C (USB 20Gbps / 3.2 Gen 2x2 z ładowaniem 15W), 2x USB-A (10Gbps / 3.2 Gen 2, w tym 1x Always On), 1x combo jack audio 3.5mm, przycisk zasilania</td></tr>
      <tr><th>Porty tylne</th><td>1x HDMI 2.1 TMDS, 1x DisplayPort 1.4, 2x USB-A (10Gbps / 3.2 Gen 2), 2x USB-A (5Gbps / 3.2 Gen 1), 1x RJ-45 GbE LAN, 1x DC-in Slim Tip</td></tr>
      <tr><th>Interfejs sieciowy (LAN)</th><td>1x Gigabit Ethernet (10/100/1000 Mbit/s) RJ-45 (Intel I219-LM)</td></tr>
    </table>

    <h2>5. Zasilanie, parametry mechaniczne i środowiskowe</h2>
    <table>
      <tr><th>Zasilanie / Zasilacz</th><td>Zewnętrzny zasilacz sieciowy 170W Slim Tip, 100–240 V AC, 50/60 Hz, sprawność 89%</td></tr>
      <tr><th>Wymiary (szer. x wys. x głęb.)</th><td>179.0 x 37.0 x 182.9 mm (format 1 litr Tiny) &bull; Powierzchnia zabudowy: 6623 mm²</td></tr>
      <tr><th>Masa urządzenia</th><td>1.40 kg</td></tr>
      <tr><th>Certyfikaty i normy</th><td>MIL-STD-810H, ENERGY STAR 8.0, EPEAT Gold, RoHS, TCO Certified 9.0</td></tr>
      <tr><th>System operacyjny / Gwarancja</th><td>Microsoft Windows 11 Pro 64-bit &bull; 3 lata gwarancji Lenovo Premier Support (Onsite)</td></tr>
    </table>
  </div>
  <div class="footer">
    <span>EPLAN Data Standard Package &bull; Artykuł: LEN.30K5CTO1WW</span>
    <span>Strona 1 z 3 (PL)</span>
  </div>
</div>

<!-- ========================================== -->
<!-- SECTION 2: ENGLISH (ENG)                  -->
<!-- ========================================== -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">EN</span>TECHNICAL DATASHEET</h1>
        <div class="subtitle">Lenovo ThinkStation P3 Tiny Gen 2 &bull; Compact Industrial Workstation (1L)</div>
      </div>
      <div class="brand">Lenovo</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Lenovo ThinkStation P3 Tiny Gen 2 (Type: 30K5 / CTO: 30K5CTO1WW)</strong><br>
        Ultra-compact enterprise and industrial-grade workstation with a 1-liter chassis volume. Powered by the 10-core Intel Core Ultra 5 225 processor featuring dedicated Intel AI Boost NPU (up to 13 TOPS), high-speed 16 GB DDR5 RAM, 512 GB PCIe 4.0 NVMe Opal 2.0 SSD, and integrated Intel Graphics. Engineered for control cabinets, operator stations, SCADA environments, CAD/BIM applications, and edge processing.
      </div>
      <div class="overview-image">
        <img src="${imgSrc}" alt="Lenovo ThinkStation P3 Tiny Gen 2">
      </div>
    </div>

    <div class="highlight-box">
      <strong>Key Features:</strong> Intel Core Ultra 5 225 (10C, 14T, up to 4.9 GHz, AI Boost NPU) &bull; 16 GB DDR5 SO-DIMM &bull; 512 GB SSD M.2 PCIe 4.0 NVMe &bull; Intel Graphics &bull; 1x GbE LAN &bull; USB-C 20Gbps &bull; DP 1.4 + HDMI 2.1 &bull; Win 11 Pro 64 &bull; 3-Year Premier Onsite Warranty
    </div>

    <h2>1. Identification & EPLAN Classification</h2>
    <table>
      <tr><th>Manufacturer</th><td>Lenovo Group Limited (Code: LEN)</td></tr>
      <tr><th>Part Number</th><td>LEN.30K5CTO1WW</td></tr>
      <tr><th>Type Number</th><td>ThinkStation P3 Tiny Gen 2 (Machine Type: 30K5)</td></tr>
      <tr><th>Order Number</th><td>30K5CTO1WW</td></tr>
      <tr><th>EPLAN Classification</th><td>TopGroup: 1 (Electrical engineering) &bull; Group: 26 (PLC, IPC, HMI) &bull; SubGroup: 1 (General)</td></tr>
      <tr><th>Device Code Letter</th><td>KF (Control / Data processing / Industrial PC)</td></tr>
    </table>

    <h2>2. Processor & Neural Processing Unit (NPU)</h2>
    <table>
      <tr><th>Processor Model</th><td>Intel Core Ultra 5 225 (Arrow Lake architecture / Socket LGA1851)</td></tr>
      <tr><th>Core / Thread Count</th><td>10 Cores (6 Performance-cores + 4 Efficient-cores) / 14 Threads</td></tr>
      <tr><th>Clock Speeds</th><td>P-core: 3.3 GHz base, up to 4.9 GHz Turbo &bull; E-core: 2.7 GHz base, up to 3.9 GHz Turbo</td></tr>
      <tr><th>Cache</th><td>20 MB Intel Smart Cache (L3) + 20 MB L2</td></tr>
      <tr><th>NPU (Intel AI Boost)</th><td>Integrated neural processing unit delivering up to 13 TOPS AI performance</td></tr>
    </table>

    <h2>3. RAM, Storage & Graphics</h2>
    <table>
      <tr><th>System Memory (RAM)</th><td>16 GB DDR5 SO-DIMM (supports up to 128 GB DDR5-6400, 2x SO-DIMM dual-channel slots)</td></tr>
      <tr><th>Storage Drive</th><td>512 GB SSD M.2 2280 PCIe 4.0x4 Performance NVMe Opal 2.0 (supports up to 2x M.2 SSDs)</td></tr>
      <tr><th>Graphics Architecture</th><td>Integrated Intel Graphics (Intel Xe architecture, supports up to 4 independent displays)</td></tr>
      <tr><th>Audio Codec</th><td>Realtek ALC233VB-CG, integrated internal mono speaker 1W x 1</td></tr>
    </table>

    <h2>4. Connectivity & I/O Ports</h2>
    <table>
      <tr><th>Front I/O</th><td>1x USB-C (USB 20Gbps / 3.2 Gen 2x2 with 15W charging), 2x USB-A (10Gbps / 3.2 Gen 2, 1x Always On), 1x 3.5mm combo audio jack, power button</td></tr>
      <tr><th>Rear I/O</th><td>1x HDMI 2.1 TMDS, 1x DisplayPort 1.4, 2x USB-A (10Gbps / 3.2 Gen 2), 2x USB-A (5Gbps / 3.2 Gen 1), 1x RJ-45 GbE LAN, 1x Slim Tip DC-in</td></tr>
      <tr><th>Network Interface</th><td>1x Gigabit Ethernet (10/100/1000 Mbit/s) RJ-45 (Intel I219-LM)</td></tr>
    </table>

    <h2>5. Power, Mechanical & Environmental</h2>
    <table>
      <tr><th>Power Supply Unit</th><td>External 170W Slim Tip AC adapter, 100–240 V AC, 50/60 Hz, 89% efficiency</td></tr>
      <tr><th>Dimensions (W x H x D)</th><td>179.0 x 37.0 x 182.9 mm (1-liter Tiny form factor) &bull; Mounting footprint: 6623 mm²</td></tr>
      <tr><th>Weight</th><td>1.40 kg</td></tr>
      <tr><th>Compliance & Certifications</th><td>MIL-STD-810H military durability, ENERGY STAR 8.0, EPEAT Gold, RoHS, TCO Certified 9.0</td></tr>
      <tr><th>Operating System / Warranty</th><td>Microsoft Windows 11 Pro 64-bit &bull; 3-Year Lenovo Premier Support (Onsite)</td></tr>
    </table>
  </div>
  <div class="footer">
    <span>EPLAN Data Standard Package &bull; Part: LEN.30K5CTO1WW</span>
    <span>Page 2 of 3 (ENG)</span>
  </div>
</div>

<!-- ========================================== -->
<!-- ABSCHNITT 3: DEUTSCH (DE)                 -->
<!-- ========================================== -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">DE</span>TECHNISCHES DATENBLATT</h1>
        <div class="subtitle">Lenovo ThinkStation P3 Tiny Gen 2 &bull; Kompakte Industrie-Workstation (1L)</div>
      </div>
      <div class="brand">Lenovo</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Lenovo ThinkStation P3 Tiny Gen 2 (Typ: 30K5 / CTO: 30K5CTO1WW)</strong><br>
        Ultrakompakte Workstation für Industrie- und Unternehmensanwendungen mit nur 1 Liter Gehäusevolumen. Angetrieben von einem Intel Core Ultra 5 225 10-Kern-Prozessor mit integrierter Intel AI Boost NPU (bis zu 13 TOPS), 16 GB schnellem DDR5-Arbeitsspeicher, 512 GB M.2 PCIe 4.0 NVMe Opal 2.0 SSD und integrierter Intel Graphics. Ideal für Schaltschränke, Bedienstationen, SCADA-Leitsysteme, CAD-Arbeitsplätze und Edge-Computing.
      </div>
      <div class="overview-image">
        <img src="${imgSrc}" alt="Lenovo ThinkStation P3 Tiny Gen 2">
      </div>
    </div>

    <div class="highlight-box">
      <strong>Hauptmerkmale:</strong> Intel Core Ultra 5 225 (10 Kerne, bis zu 4,9 GHz, AI Boost NPU) &bull; 16 GB DDR5 SO-DIMM &bull; 512 GB SSD M.2 PCIe 4.0 NVMe &bull; Intel Graphics &bull; 1x GbE LAN &bull; USB-C 20Gbps &bull; DP 1.4 + HDMI 2.1 &bull; Win 11 Pro 64 &bull; 3 Jahre Premier Onsite-Garantie
    </div>

    <h2>1. Identifikationsdaten und EPLAN-Klassifizierung</h2>
    <table>
      <tr><th>Hersteller</th><td>Lenovo Group Limited (Kürzel: LEN)</td></tr>
      <tr><th>Artikelnummer (Part Nr)</th><td>LEN.30K5CTO1WW</td></tr>
      <tr><th>Typnummer (Type Nr)</th><td>ThinkStation P3 Tiny Gen 2 (Maschinentyp: 30K5)</td></tr>
      <tr><th>Bestellnummer (Order Nr)</th><td>30K5CTO1WW</td></tr>
      <tr><th>EPLAN-Klassifizierung</th><td>TopGroup: 1 (Elektrotechnik) &bull; Group: 26 (SPS, IPC, HMI) &bull; SubGroup: 1 (Allgemein)</td></tr>
      <tr><th>Betriebsmittelkennzeichen</th><td>KF (Steuerung / Datenverarbeitung / Industrie-PC)</td></tr>
    </table>

    <h2>2. Prozessor und neuronale Recheneinheit (NPU)</h2>
    <table>
      <tr><th>Prozessormodell</th><td>Intel Core Ultra 5 225 (Arrow Lake Architektur / Sockel LGA1851)</td></tr>
      <tr><th>Kerne / Threads</th><td>10 Kerne (6 Performance-Kerne + 4 Efficient-Kerne) / 14 Threads</td></tr>
      <tr><th>Taktraten</th><td>P-Kern: 3,3 GHz Basis, bis 4,9 GHz Turbo &bull; E-Kern: 2,7 GHz Basis, bis 3,9 GHz Turbo</td></tr>
      <tr><th>Cache-Speicher</th><td>20 MB Intel Smart Cache (L3) + 20 MB L2</td></tr>
      <tr><th>NPU (Intel AI Boost)</th><td>Integrierte neuronale NPU mit bis zu 13 TOPS KI-Rechenleistung</td></tr>
    </table>

    <h2>3. Arbeitsspeicher, Massenspeicher und Grafik</h2>
    <table>
      <tr><th>Arbeitsspeicher (RAM)</th><td>16 GB DDR5 SO-DIMM (erweiterbar bis 128 GB DDR5-6400, 2x SO-DIMM Dual-Channel)</td></tr>
      <tr><th>Massenspeicher (SSD)</th><td>512 GB SSD M.2 2280 PCIe 4.0x4 Performance NVMe Opal 2.0 (bis zu 2x M.2 SSDs)</td></tr>
      <tr><th>Grafikeinheit</th><td>Integrierte Intel Graphics (Intel Xe Architektur, bis zu 4 unabhängige Monitore)</td></tr>
      <tr><th>Audiocodec</th><td>Realtek ALC233VB-CG, integrierter interner Lautsprecher 1W x 1</td></tr>
    </table>

    <h2>4. Schnittstellen und Anschlüsse</h2>
    <table>
      <tr><th>Frontanschlüsse</th><td>1x USB-C (USB 20Gbps / 3.2 Gen 2x2 mit 15W Ladefunktion), 2x USB-A (10Gbps / 3.2 Gen 2, 1x Always On), 1x 3,5 mm Audio-Kombibuchse, Netzschalter</td></tr>
      <tr><th>Rückseitige Anschlüsse</th><td>1x HDMI 2.1 TMDS, 1x DisplayPort 1.4, 2x USB-A (10Gbps / 3.2 Gen 2), 2x USB-A (5Gbps / 3.2 Gen 1), 1x RJ-45 GbE LAN, 1x Slim Tip Netzanschluss</td></tr>
      <tr><th>Netzwerkschnittstelle</th><td>1x Gigabit Ethernet (10/100/1000 Mbit/s) RJ-45 (Intel I219-LM)</td></tr>
    </table>

    <h2>5. Spannungsversorgung, Mechanik und Umwelt</h2>
    <table>
      <tr><th>Netzteil / Versorgung</th><td>Externes 170W Slim Tip Netzteil, 100–240 V AC, 50/60 Hz, 89% Wirkungsgrad</td></tr>
      <tr><th>Abmessungen (B x H x T)</th><td>179,0 x 37,0 x 182,9 mm (1-Liter Tiny-Gehäuse) &bull; Montagefläche: 6623 mm²</td></tr>
      <tr><th>Gewicht</th><td>1,40 kg</td></tr>
      <tr><th>Zertifizierungen und Normen</th><td>MIL-STD-810H Militärstandard, ENERGY STAR 8.0, EPEAT Gold, RoHS, TCO Certified 9.0</td></tr>
      <tr><th>Betriebssystem / Garantie</th><td>Microsoft Windows 11 Pro 64-Bit &bull; 3 Jahre Lenovo Premier Support (Vor-Ort-Service)</td></tr>
    </table>
  </div>
  <div class="footer">
    <span>EPLAN Data Standard Package &bull; Artikel: LEN.30K5CTO1WW</span>
    <span>Seite 3 von 3 (DE)</span>
  </div>
</div>

</body>
</html>`;
}

function main() {
  const htmlPath = path.resolve('scripts/30K5CTO1WW_datasheet.html');
  const pdfPath = path.resolve('EDZ/261119/LEN.30K5CTO1WW/30K5CTO1WW_datasheet.pdf');

  console.log('Generating HTML...');
  fs.writeFileSync(htmlPath, buildHtml(), 'utf8');

  console.log('Converting HTML to PDF via headless Edge...');
  const res = cp.spawnSync('node', ['scripts/html_to_pdf.js', htmlPath, pdfPath], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error('Failed to convert HTML to PDF');
    process.exit(1);
  }

  const stat = fs.statSync(pdfPath);
  console.log(`Success! PDF generated: ${pdfPath} (${stat.size} bytes)`);

  // Clean up html
  if (fs.existsSync(htmlPath)) {
    fs.unlinkSync(htmlPath);
    console.log('Cleaned up temporary HTML');
  }
}

main();
