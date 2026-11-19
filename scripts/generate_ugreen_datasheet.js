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
    font-size: 8.7px;
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
    border-bottom: 2.5px solid #0da059;
    padding-bottom: 5px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #0da059;
    font-size: 15px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 16px;
    color: #0da059;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .lang-tag {
    display: inline-block;
    background: #0da059;
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
    background: #f4faf6;
    border-left: 3.5px solid #0da059;
    padding: 6px 10px;
    font-size: 8.9px;
  }
  .overview-image {
    width: 145px;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 4px;
  }
  .overview-image img {
    max-width: 137px;
    max-height: 102px;
    object-fit: contain;
  }
  h2 {
    color: #0a7340;
    font-size: 10px;
    border-bottom: 1px solid #c2e8d4;
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
    padding: 2.8px 5px;
    border-bottom: 1px solid #ececec;
    text-align: left;
    font-size: 8.5px;
  }
  th {
    background-color: #f1f8f4;
    color: #08522e;
    font-weight: 600;
    width: 32%;
  }
  td {
    color: #222;
  }
  .highlight-box {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-left: 3.5px solid #0da059;
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
  const imgPath = path.resolve('EDZ/UGREEN/UGREEN.CM664/CM664.png');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');
  const imgSrc = `data:image/png;base64,${imgBase64}`;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>UGREEN CM664 - Karta Techniczna / Technical Datasheet / Produktdatenblatt</title>
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
          <h1><span class="lang-tag">PL</span>UGREEN CM664 (15707)</h1>
          <div class="subtitle">Przełącznik KVM 2-in-1 HDMI 2.0 4K@60Hz + Hub 4x USB 3.0 (5 Gbps)</div>
        </div>
        <div class="brand">UGREEN</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>Przełącznik KVM HDMI 2-w-1 UGREEN CM664:</strong> Profesjonalny dwukomputerowy przełącznik KVM umożliwiający współdzielenie jednego monitora Ultra HD 4K@60Hz oraz czterech urządzeń peryferyjnych USB (3x USB-A 3.0 + 1x USB-C) pomiędzy dwoma niezależnymi komputerami/stacjami roboczymi (PC 1 / PC 2). Urządzenie oferuje błyskawiczne przełączanie za pomocą fizycznego przycisku na obudowie lub przewodowego kontrolera biurkowego (1,5 m).
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="UGREEN CM664" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Główne cechy:</strong> Rozdzielczość 4K@60Hz (HDMI 2.0 / HDCP 2.2) • Transfer USB 3.0 do 5 Gbps • Hub 3x USB-A + 1x USB-C • Podwójne przełączanie (przycisk na obudowie + pilot biurkowy) • Aluminiowa obudowa Space Gray • Zasilanie USB-C DC 5V / 3A • Kompatybilność z Windows, macOS, Linux, Chrome OS.
      </div>

      <h2>Dane podstawowe i identyfikacyjne</h2>
      <table>
        <tr><th>Producent</th><td>Ugreen Group Limited (Shenzhen, Chiny / Repr. UE: Ugreen Group GmbH, Niemcy)</td></tr>
        <tr><th>Model / Typ</th><td>CM664 (Seria Video &amp; KVM Connectivity)</td></tr>
        <tr><th>Numer katalogowy / SKU</th><td>15707 (kod EAN: 6941876217076)</td></tr>
        <tr><th>Identyfikator EPLAN</th><td>UGREEN.CM664</td></tr>
        <tr><th>Klasyfikacja EPLAN</th><td>Nadgrupa: 1 (Elektrotechnika), Grupa: 26 (Sterowniki PLC / Komputery), Podgrupa: 1 (Ogólne)</td></tr>
        <tr><th>Oznaczenie literowe (IEC 81346)</th><td>KF (Przetwarzanie sygnałów / Urządzenie informatyczne)</td></tr>
      </table>

      <h2>Parametry wideo i audio</h2>
      <table>
        <tr><th>Standard wideo / Przepustowość</th><td>HDMI 2.0, wsteczna kompatybilność z HDMI 1.4/1.3, przepustowość do 18 Gbps</td></tr>
        <tr><th>Obsługiwane rozdzielczości</th><td>4K@60Hz (3840x2160), 2K@120Hz (2560x1440), 1080p@240Hz / 120Hz / 60Hz (1920x1080)</td></tr>
        <tr><th>Głębia kolorów i formaty</th><td>24-bit / 30-bit / 36-bit (Deep Color); formaty pikseli: RGB, YCbCr 4:4:4, YCbCr 4:2:2</td></tr>
        <tr><th>Zabezpieczenia i funkcje wideo</th><td>HDCP 2.2 / HDCP 1.4, HDR10, HDR10+, CEC, 3D, VRR</td></tr>
        <tr><th>Formaty audio</th><td>LPCM, DTS, Dolby TrueHD, DSD, audio wielokanałowe 2.0 / 2.1 / 5.1 / 7.1, próbkowanie do 24-bit / 192 kHz</td></tr>
      </table>

      <h2>Interfejsy przyłączeniowe i logika portów</h2>
      <table>
        <tr><th>Wejścia Host PC 1 (tył)</th><td>1x HDMI IN 1 (żeńskie), 1x USB-B 3.0 IN 1 (łącze danych USB do komputera 1)</td></tr>
        <tr><th>Wejścia Host PC 2 (tył)</th><td>1x HDMI IN 2 (żeńskie), 1x USB-B 3.0 IN 2 (łącze danych USB do komputera 2)</td></tr>
        <tr><th>Wyjście monitorowe (tył)</th><td>1x HDMI OUT (żeńskie, do monitora/projektora)</td></tr>
        <tr><th>Zasilanie pomocnicze (tył)</th><td>1x USB-C (żeńskie), DC 5.0 V / 3.0 A Max (opcjonalne, do urządzeń o dużym poborze mocy)</td></tr>
        <tr><th>Wyjścia peryferyjne (przód)</th><td>3x USB-A 3.0 żeńskie (5 Gbps) + 1x USB-C 3.0 żeńskie (5 Gbps) do klawiatury, myszy, dysków USB</td></tr>
        <tr><th>Port sterownika biurkowego (przód)</th><td>1x Mini USB (gniazdo podłączenia przewodowego pilota przełączającego 1,5 m)</td></tr>
        <tr><th>Sygnalizacja stanu</th><td>2 diody LED (niebieskie): wskaźnik aktywnego komputera PC 1 / PC 2</td></tr>
      </table>

      <h2>Wymiary, montaż i warunki pracy</h2>
      <table>
        <tr><th>Wymiary obudowy (Szer. x Wys. x Głęb.)</th><td>143 mm x 22 mm x 64 mm</td></tr>
        <tr><th>Wymagana powierzchnia montażowa</th><td>143 x 22 mm (3 146 mm²)</td></tr>
        <tr><th>Masa własna / Masa zestawu</th><td>0,26 kg (260 g netto) / ok. 0,59 kg (z kablami i kontrolerem)</td></tr>
        <tr><th>Materiał obudowy / Kolor</th><td>Stop aluminium (Space Gray) + tworzywo ABS odporne na zarysowania</td></tr>
        <tr><th>Zakres temperatur i wilgotności</th><td>Praca: 0°C do +40°C, Przechowywanie: -10°C do +70°C, Wilgotność: 10% do 90% RH (bez kondensacji)</td></tr>
        <tr><th>Normy i certyfikaty</th><td>CE, FCC, RoHS, WEEE, UKCA, REACH</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>UGREEN CM664 (15707) • EPLAN Electric P8 Pakiet Wymiany Artykułu (EDZ)</span>
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
          <h1><span class="lang-tag">ENG</span>UGREEN CM664 (15707)</h1>
          <div class="subtitle">2-In-1 Out HDMI 2.0 4K@60Hz KVM Switch + 4-Port USB 3.0 (5 Gbps) Hub</div>
        </div>
        <div class="brand">UGREEN</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>UGREEN CM664 2-In 1-Out HDMI KVM Switch:</strong> Professional dual-computer KVM switcher designed to share a single Ultra HD 4K@60Hz display and four USB peripherals (3x USB-A 3.0 + 1x USB-C) between two host computers/workstations (PC 1 / PC 2). Features rapid source switching via the top-mounted physical push-button or the included 1.5-meter wired desktop remote controller.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="UGREEN CM664" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Key Highlights:</strong> 4K@60Hz video resolution (HDMI 2.0 / HDCP 2.2) • USB 3.0 up to 5 Gbps transfer speed • Integrated 3x USB-A + 1x USB-C hub • Dual switching modes (on-unit button + desktop controller) • Premium Space Gray aluminum alloy enclosure • USB-C 5V / 3A power input • Plug &amp; play on Windows, macOS, Linux, Chrome OS.
      </div>

      <h2>Basic &amp; Identification Data</h2>
      <table>
        <tr><th>Manufacturer</th><td>Ugreen Group Limited (Shenzhen, China / EU Rep: Ugreen Group GmbH, Germany)</td></tr>
        <tr><th>Model / Type</th><td>CM664 (Video &amp; KVM Connectivity Series)</td></tr>
        <tr><th>Part Number / Order No. (SKU)</th><td>15707 (EAN barcode: 6941876217076)</td></tr>
        <tr><th>EPLAN Part Number</th><td>UGREEN.CM664</td></tr>
        <tr><th>EPLAN Classification</th><td>Top Group: 1 (Electrical), Group: 26 (PLC / IPC / Computers), Subgroup: 1 (General)</td></tr>
        <tr><th>Code Letter (IEC 81346)</th><td>KF (Signal processing / Information technology device)</td></tr>
      </table>

      <h2>Video &amp; Audio Specifications</h2>
      <table>
        <tr><th>Video Standard / Bandwidth</th><td>HDMI 2.0, backward compatible with HDMI 1.4/1.3, bandwidth up to 18 Gbps</td></tr>
        <tr><th>Supported Resolutions</th><td>4K@60Hz (3840x2160), 2K@120Hz (2560x1440), 1080p@240Hz / 120Hz / 60Hz (1920x1080)</td></tr>
        <tr><th>Color Depth &amp; Pixel Formats</th><td>24-bit / 30-bit / 36-bit (Deep Color); Pixel formats: RGB, YCbCr 4:4:4, YCbCr 4:2:2</td></tr>
        <tr><th>Content Protection &amp; Features</th><td>HDCP 2.2 / HDCP 1.4, HDR10, HDR10+, CEC, 3D, VRR</td></tr>
        <tr><th>Audio Formats</th><td>LPCM, DTS, Dolby TrueHD, DSD, multi-channel audio 2.0 / 2.1 / 5.1 / 7.1, up to 24-bit / 192 kHz</td></tr>
      </table>

      <h2>Connection Interfaces &amp; Port Topology</h2>
      <table>
        <tr><th>Host PC 1 Inputs (Rear)</th><td>1x HDMI IN 1 (Female), 1x USB-B 3.0 IN 1 (USB data uplink to Computer 1)</td></tr>
        <tr><th>Host PC 2 Inputs (Rear)</th><td>1x HDMI IN 2 (Female), 1x USB-B 3.0 IN 2 (USB data uplink to Computer 2)</td></tr>
        <tr><th>Monitor Output (Rear)</th><td>1x HDMI OUT (Female, connects to monitor/projector)</td></tr>
        <tr><th>Auxiliary Power (Rear)</th><td>1x USB-C (Female), DC 5.0 V / 3.0 A Max (for high-power peripherals/drives)</td></tr>
        <tr><th>Peripheral Hub Ports (Front)</th><td>3x USB-A 3.0 Female (5 Gbps) + 1x USB-C 3.0 Female (5 Gbps) for keyboard, mouse, flash drives</td></tr>
        <tr><th>Desktop Remote Port (Front)</th><td>1x Mini USB (dedicated connection port for 1.5m wired desktop remote button)</td></tr>
        <tr><th>Status Indicators</th><td>2x Blue LEDs indicating active host connection (PC 1 / PC 2)</td></tr>
      </table>

      <h2>Dimensions, Mounting &amp; Environmental Conditions</h2>
      <table>
        <tr><th>Dimensions (W x H x D)</th><td>143 mm x 22 mm x 64 mm (5.63 in x 0.87 in x 2.52 in)</td></tr>
        <tr><th>Required Mounting Area</th><td>143 x 22 mm (3,146 mm²)</td></tr>
        <tr><th>Weight (Net / Package Set)</th><td>0.26 kg (260 g net device) / approx. 0.59 kg (with cables and desktop controller)</td></tr>
        <tr><th>Housing Material / Color</th><td>Space Gray Aluminum Alloy + wear-resistant ABS accent trim</td></tr>
        <tr><th>Operating &amp; Storage Conditions</th><td>Operating: 0°C to +40°C, Storage: -10°C to +70°C, Humidity: 10% to 90% RH (non-condensing)</td></tr>
        <tr><th>Standards &amp; Certifications</th><td>CE, FCC, RoHS, WEEE, UKCA, REACH</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>UGREEN CM664 (15707) • EPLAN Electric P8 Article Exchange Package (EDZ)</span>
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
          <h1><span class="lang-tag">DE</span>UGREEN CM664 (15707)</h1>
          <div class="subtitle">2-in-1 HDMI 2.0 4K@60Hz KVM-Umschalter + 4-Port USB 3.0 (5 Gbit/s) Hub</div>
        </div>
        <div class="brand">UGREEN</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>UGREEN CM664 2-in-1 HDMI KVM-Switch:</strong> Professioneller Zwei-Rechner-KVM-Umschalter zur gemeinsamen Nutzung eines Ultra HD 4K@60Hz Bildschirms und vier USB-Peripheriegeräten (3x USB-A 3.0 + 1x USB-C) zwischen zwei unabhängigen Computern/Workstations (PC 1 / PC 2). Ermöglicht ein schnelles Umschalten über die physische Taste am Gerät oder über den mitgelieferten 1,5 m kabelgebundenen Desktop-Controller.
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="UGREEN CM664" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Wichtigste Merkmale:</strong> 4K@60Hz Videoauflösung (HDMI 2.0 / HDCP 2.2) • USB 3.0 Datenübertragung bis zu 5 Gbit/s • Integrierter 3x USB-A + 1x USB-C Hub • Zwei Umschaltmodi (Gerätetaste + Desktop-Controller) • Hochwertiges Aluminiumgehäuse in Space Gray • USB-C 5V / 3A Stromversorgung • Plug &amp; Play für Windows, macOS, Linux, Chrome OS.
      </div>

      <h2>Basis- und Identifikationsdaten</h2>
      <table>
        <tr><th>Hersteller</th><td>Ugreen Group Limited (Shenzhen, China / EU-Vertr.: Ugreen Group GmbH, Deutschland)</td></tr>
        <tr><th>Modell / Typ</th><td>CM664 (Video &amp; KVM Connectivity Serie)</td></tr>
        <tr><th>Artikelnummer / Bestell-Nr. (SKU)</th><td>15707 (EAN-Barcode: 6941876217076)</td></tr>
        <tr><th>EPLAN Artikelnummer</th><td>UGREEN.CM664</td></tr>
        <tr><th>EPLAN Klassifizierung</th><td>Obergruppe: 1 (Elektrotechnik), Gruppe: 26 (SPS / Industrie-PC), Untergruppe: 1 (Allgemein)</td></tr>
        <tr><th>Kennbuchstabe (IEC 81346)</th><td>KF (Signalverarbeitung / Informationstechnische Einrichtung)</td></tr>
      </table>

      <h2>Video- und Audiospezifikationen</h2>
      <table>
        <tr><th>Videostandard / Bandbreite</th><td>HDMI 2.0, abwärtskompatibel zu HDMI 1.4/1.3, Bandbreite bis zu 18 Gbit/s</td></tr>
        <tr><th>Unterstützte Auflösungen</th><td>4K@60Hz (3840x2160), 2K@120Hz (2560x1440), 1080p@240Hz / 120Hz / 60Hz (1920x1080)</td></tr>
        <tr><th>Farbtiefe &amp; Pixelformate</th><td>24-Bit / 30-Bit / 36-Bit (Deep Color); Pixelformate: RGB, YCbCr 4:4:4, YCbCr 4:2:2</td></tr>
        <tr><th>Kopierschutz &amp; Videofunktionen</th><td>HDCP 2.2 / HDCP 1.4, HDR10, HDR10+, CEC, 3D, VRR</td></tr>
        <tr><th>Audioformate</th><td>LPCM, DTS, Dolby TrueHD, DSD, Mehrkanal-Audio 2.0 / 2.1 / 5.1 / 7.1, bis zu 24-Bit / 192 kHz</td></tr>
      </table>

      <h2>Anschlussschnittstellen und Port-Topologie</h2>
      <table>
        <tr><th>Host PC 1 Eingänge (Rückseite)</th><td>1x HDMI IN 1 (Buchse), 1x USB-B 3.0 IN 1 (USB-Uplink zu Computer 1)</td></tr>
        <tr><th>Host PC 2 Eingänge (Rückseite)</th><td>1x HDMI IN 2 (Buchse), 1x USB-B 3.0 IN 2 (USB-Uplink zu Computer 2)</td></tr>
        <tr><th>Monitorausgang (Rückseite)</th><td>1x HDMI OUT (Buchse, Anschluss an Bildschirm/Beamer)</td></tr>
        <tr><th>Zusatzstromversorgung (Rückseite)</th><td>1x USB-C (Buchse), DC 5,0 V / 3,0 A Max (für stromintensive Peripheriegeräte)</td></tr>
        <tr><th>Peripherie-Hub-Ports (Front)</th><td>3x USB-A 3.0 Buchse (5 Gbit/s) + 1x USB-C 3.0 Buchse (5 Gbit/s) für Tastatur, Maus, USB-Speicher</td></tr>
        <tr><th>Desktop-Controller-Port (Front)</th><td>1x Mini-USB (dedizierter Anschluss für kabelgebundene 1,5 m Desktop-Umschalttaste)</td></tr>
        <tr><th>Statusanzeige</th><td>2x blaue LEDs zur Signalisierung der aktiven Host-Verbindung (PC 1 / PC 2)</td></tr>
      </table>

      <h2>Abmessungen, Montage und Betriebsbedingungen</h2>
      <table>
        <tr><th>Abmessungen (B x H x T)</th><td>143 mm x 22 mm x 64 mm</td></tr>
        <tr><th>Erforderliche Montagefläche</th><td>143 x 22 mm (3.146 mm²)</td></tr>
        <tr><th>Gewicht (Netto / Set)</th><td>0,26 kg (260 g Geräte-Nettogewicht) / ca. 0,59 kg (mit Kabeln und Controller)</td></tr>
        <tr><th>Gehäusematerial / Farbe</th><td>Aluminiumlegierung (Space Gray) + verschleißfestes ABS</td></tr>
        <tr><th>Betriebs- und Lagerbedingungen</th><td>Betrieb: 0°C bis +40°C, Lagerung: -10°C bis +70°C, Luftfeuchtigkeit: 10% bis 90% rF (nicht kondensierend)</td></tr>
        <tr><th>Normen und Zertifizierungen</th><td>CE, FCC, RoHS, WEEE, UKCA, REACH</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>UGREEN CM664 (15707) • EPLAN Electric P8 Artikelaustauschpaket (EDZ)</span>
      <span>Seite 3 von 3 (DE)</span>
    </div>
  </div>

</body>
</html>`;
}

const htmlContent = buildHtml();
const tempHtmlPath = path.resolve('scripts/CM664_datasheet.html');
const outputPdfPath = path.resolve('EDZ/UGREEN/UGREEN.CM664/CM664_datasheet.pdf');

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
