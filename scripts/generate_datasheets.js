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
    font-size: 19px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 17px;
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
    width: 135px;
    text-align: center;
  }
  .overview-image img {
    max-width: 125px;
    max-height: 85px;
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

// 1. Generate PHG.ADMITTO-D HTML
function generateAdmittoHtml() {
  const imgUrl = 'file:///g:/M%C3%B3j%20dysk/Projekty%20Antigravity/Eplan%20EDZ%20generator/EDZ/PHG/PHG.ADMITTO-D/ADMITTO-D.png';
  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>phg - ADMITTO-D RFID Reader (PoE) - DTR / Datasheet</title>
<style>${getBaseStyle()}</style>
</head>
<body>

<!-- SECTION 1: POLISH -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">PL</span>ADMITTO-D &bull; Czytnik RFID OEM (Ethernet / PoE)</h1>
        <div class="subtitle">Wieloczęstotliwościowy czytnik kart zbliżeniowych OEM do kontroli dostępu &bull; Nr art. PHG.ADMITTO-D</div>
      </div>
      <div class="brand">phg Peter Hengstler</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Opis urządzenia:</strong> Profesjonalny modułowy czytnik transponderów RFID serii ADMITTO-D niemieckiego producenta phg Peter Hengstler GmbH + Co. KG. Wariant wyposażony w zintegrowany interfejs Ethernet (TCP/IP) z bezpośrednim zasilaniem Power over Ethernet (PoE, Class 0) poprzez złącze RJ45. Przeznaczony do zabudowy w szafach sterowniczych, panelach operatorskich, terminalach info i kołowrotach kontroli dostępu.
        <br><br>
        <strong>Obsługiwane technologie RFID:</strong> Multi-ISO 13,56 MHz (LEGIC prime/advant, MIFARE Classic/DESFire EV1-EV3, ISO 14443A/B, ISO 15693, Sony FeliCa, Inside Secure) oraz 125 kHz (EM4102, Hitag).
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="PHG ADMITTO-D">
      </div>
    </div>

    <h2>Dane identyfikacyjne i handlowe</h2>
    <table>
      <tr><th>Oznaczenie typu:</th><td>ADMITTO-D (wariant Ethernet z PoE)</td></tr>
      <tr><th>Numer artykułu (PartNr):</th><td>PHG.ADMITTO-D</td></tr>
      <tr><th>Kod zamówieniowy (OrderNr):</th><td>ADMITTO-D</td></tr>
      <tr><th>Producent:</th><td>phg Peter Hengstler GmbH + Co. KG (PHG)</td></tr>
      <tr><th>Klasyfikacja EPLAN:</th><td>Elektrotechnika &gt; Czujniki, łączniki, przyciski &gt; Ogólne (Top: 1, Grp: 12, Sub: 1)</td></tr>
      <tr><th>Oznaczenie literowe (IEC 81346):</th><td>B (Przetwornik / czujnik identyfikacji)</td></tr>
    </table>

    <h2>Parametry elektryczne i interfejsy</h2>
    <table>
      <tr><th>Interfejs komunikacyjny:</th><td>Ethernet 10/100 Mbps (TCP/IP), gniazdo RJ45</td></tr>
      <tr><th>Zasilanie:</th><td>Power over Ethernet (PoE) wg IEEE 802.3af, Class 0</td></tr>
      <tr><th>Pobór mocy:</th><td>Maksymalnie 2,2 W</td></tr>
      <tr><th>Protokoły programowe:</th><td>phg_crypt (funkcje odczytu/zapisu), OSDP, Aktiv Senden</td></tr>
      <tr><th>Elementy sygnalizacyjne:</th><td>3 diody LED na płycie czołowej (zielona, żółta, czerwona)</td></tr>
    </table>

    <h2>Wymiary gabarytowe i wzorzec wycięcia (Cut-Out Pattern)</h2>
    <div class="highlight-box">
      <strong>Wzorzec wycięcia panelowego (Cut-out Pattern):</strong> Zgodnie ze specyfikacją montażu wpuszczanego w płytę czołową szafy/terminala, wymagane jest prostokątne okno montażowe o wymiarach <strong>110,0 mm &times; 62,0 mm</strong> (głębokość zabudowy 24,0 mm).
    </div>
    <table>
      <tr><th>Szerokość &times; Wysokość &times; Głębokość:</th><td>110,0 mm &times; 62,0 mm &times; 24,0 mm</td></tr>
      <tr><th>Wymagane miejsce zabudowy:</th><td>6820,0 mm&sup2;</td></tr>
      <tr><th>Ciężar urządzenia:</th><td>0,18 kg (180 g)</td></tr>
      <tr><th>Wycięcie w płycie czołowej (okno):</th><td>110,0 mm &times; 62,0 mm (montaż wpuszczany)</td></tr>
      <tr><th>Odstępy serwisowe / wentylacyjne:</th><td>Góra: 0 mm, Dół: 0 mm, Lewo: 0 mm, Prawo: 0 mm</td></tr>
    </table>

    <h2>Warunki środowiskowe i normy</h2>
    <table>
      <tr><th>Stopień ochrony:</th><td>IP40 (wariant Ethernet RJ45)</td></tr>
      <tr><th>Temperatura pracy:</th><td>0 &deg;C ... +50 &deg;C</td></tr>
      <tr><th>Zgodność z dyrektywami UE:</th><td>RED 2014/53/EU, RoHS 2011/65/EU</td></tr>
      <tr><th>Normy zharmonizowane:</th><td>EN 62368-1, EN 50364, EN 301 489-1/-3, EN 300 330, EN 55032</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Dokumentacja Techniczno-Ruchowa (DTR) &bull; phg Peter Hengstler GmbH + Co. KG &bull; ADMITTO-D</div>
    <div>Strona 1 z 3 (PL) &bull; Artykuł EPLAN Pro Panel</div>
  </div>
</div>

<!-- SECTION 2: ENGLISH -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">ENG</span>ADMITTO-D &bull; OEM RFID Reader (Ethernet / PoE)</h1>
        <div class="subtitle">Multi-frequency OEM proximity RFID reader module for access control &bull; Part No. PHG.ADMITTO-D</div>
      </div>
      <div class="brand">phg Peter Hengstler</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Device Overview:</strong> Professional modular OEM RFID reader series ADMITTO-D engineered by phg Peter Hengstler GmbH + Co. KG (Germany). Featuring an integrated Ethernet TCP/IP interface with Power over Ethernet (PoE, Class 0) supply directly via an RJ45 jack. Perfectly suited for flush installation into control cabinets, HMI panels, info terminals, turnstiles, and access control systems.
        <br><br>
        <strong>Supported RFID Technologies:</strong> Multi-ISO 13.56 MHz (LEGIC prime/advant, MIFARE Classic/DESFire EV1-EV3, ISO 14443A/B, ISO 15693, Sony FeliCa, Inside Secure) and 125 kHz (EM4102, Hitag).
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="PHG ADMITTO-D">
      </div>
    </div>

    <h2>Commercial & Identification Data</h2>
    <table>
      <tr><th>Type Designation:</th><td>ADMITTO-D (Ethernet PoE variant)</td></tr>
      <tr><th>Part Number (PartNr):</th><td>PHG.ADMITTO-D</td></tr>
      <tr><th>Order Number (OrderNr):</th><td>ADMITTO-D</td></tr>
      <tr><th>Manufacturer:</th><td>phg Peter Hengstler GmbH + Co. KG (PHG)</td></tr>
      <tr><th>EPLAN Classification:</th><td>Electrical engineering &gt; Sensors, switches, pushbuttons &gt; General (Top: 1, Grp: 12, Sub: 1)</td></tr>
      <tr><th>Letter Code (IEC 81346):</th><td>B (Transducer / identification sensor)</td></tr>
    </table>

    <h2>Electrical Characteristics & Interfaces</h2>
    <table>
      <tr><th>Communication Interface:</th><td>Ethernet 10/100 Mbps (TCP/IP), RJ45 jack</td></tr>
      <tr><th>Power Supply:</th><td>Power over Ethernet (PoE) acc. to IEEE 802.3af, Class 0</td></tr>
      <tr><th>Power Consumption:</th><td>Max. 2.2 W</td></tr>
      <tr><th>Software Protocols:</th><td>phg_crypt (read/write functions), OSDP, Active Transmission</td></tr>
      <tr><th>Signaling Elements:</th><td>3 front LEDs (green, yellow, red)</td></tr>
    </table>

    <h2>Physical Dimensions & Cut-Out Pattern</h2>
    <div class="highlight-box">
      <strong>Panel Cut-out Pattern:</strong> Designed for flush front panel mounting into enclosure cut-outs. Required rectangular cut-out aperture: <strong>110.0 mm &times; 62.0 mm</strong> (installation depth: 24.0 mm).
    </div>
    <table>
      <tr><th>Width &times; Height &times; Depth:</th><td>110.0 mm &times; 62.0 mm &times; 24.0 mm</td></tr>
      <tr><th>Mounting Space Footprint:</th><td>6820.0 mm&sup2;</td></tr>
      <tr><th>Weight:</th><td>0.18 kg (180 g)</td></tr>
      <tr><th>Front Panel Cutout Dimension:</th><td>110.0 mm &times; 62.0 mm (flush integration)</td></tr>
      <tr><th>Service Clearances:</th><td>Top: 0 mm, Bottom: 0 mm, Left: 0 mm, Right: 0 mm</td></tr>
    </table>

    <h2>Environmental Conditions & Standards</h2>
    <table>
      <tr><th>Degree of Protection:</th><td>IP40 (Ethernet RJ45 execution)</td></tr>
      <tr><th>Operating Temperature:</th><td>0 &deg;C ... +50 &deg;C</td></tr>
      <tr><th>EU Directive Conformity:</th><td>RED 2014/53/EU, RoHS 2011/65/EU</td></tr>
      <tr><th>Harmonized Standards:</th><td>EN 62368-1, EN 50364, EN 301 489-1/-3, EN 300 330, EN 55032</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Technical Datasheet &bull; phg Peter Hengstler GmbH + Co. KG &bull; ADMITTO-D</div>
    <div>Page 2 of 3 (ENG) &bull; EPLAN Pro Panel Master Data</div>
  </div>
</div>

<!-- SECTION 3: GERMAN -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">DE</span>ADMITTO-D &bull; OEM-RFID-Leser (Ethernet / PoE)</h1>
        <div class="subtitle">Multifrequenz OEM-RFID-Modul zur Zugangskontrolle &bull; Art.-Nr. PHG.ADMITTO-D</div>
      </div>
      <div class="brand">phg Peter Hengstler</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Produktbeschreibung:</strong> Hochwertiger modularer OEM-RFID-Leser der Modellreihe ADMITTO-D von phg Peter Hengstler GmbH + Co. KG (Deutschland). Ausgestattet mit Ethernet-Schnittstelle (TCP/IP) und direkter Stromversorgung über Power over Ethernet (PoE, Class 0) mittels RJ45-Buchse. Optimal geeignet für den bündigen Paneleinbau in Schaltschränke, Bedienfronten, Info-Terminals und Zutrittskontrollsysteme.
        <br><br>
        <strong>Unterstützte RFID-Standards:</strong> Multi-ISO 13,56 MHz (LEGIC prime/advant, MIFARE Classic/DESFire EV1-EV3, ISO 14443A/B, ISO 15693, Sony FeliCa, Inside Secure) sowie 125 kHz (EM4102, Hitag).
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="PHG ADMITTO-D">
      </div>
    </div>

    <h2>Handels- und Identifikationsdaten</h2>
    <table>
      <tr><th>Typenbezeichnung:</th><td>ADMITTO-D (Ethernet PoE Ausführung)</td></tr>
      <tr><th>Artikelnummer (PartNr):</th><td>PHG.ADMITTO-D</td></tr>
      <tr><th>Bestellnummer (OrderNr):</th><td>ADMITTO-D</td></tr>
      <tr><th>Hersteller:</th><td>phg Peter Hengstler GmbH + Co. KG (PHG)</td></tr>
      <tr><th>EPLAN Produktgruppierung:</th><td>Elektrotechnik &gt; Sensoren, Schalter, Taster &gt; Allgemein (Top: 1, Grp: 12, Sub: 1)</td></tr>
      <tr><th>Kennbuchstabe (IEC 81346):</th><td>B (Messumformer / RFID-Erfassungssensor)</td></tr>
    </table>

    <h2>Elektrische Kenndaten und Schnittstellen</h2>
    <table>
      <tr><th>Schnittstelle:</th><td>Ethernet 10/100 Mbit/s (TCP/IP), RJ45-Buchse</td></tr>
      <tr><th>Spannungsversorgung:</th><td>Power over Ethernet (PoE) gemäß IEEE 802.3af, Class 0</td></tr>
      <tr><th>Leistungsaufnahme:</th><td>Max. 2,2 W</td></tr>
      <tr><th>Softwareprotokolle:</th><td>phg_crypt (Schreib-/Lesefunktionen), OSDP, Aktiv Senden</td></tr>
      <tr><th>Signalelemente:</th><td>3 Front-LEDs (grün / gelb / rot)</td></tr>
    </table>

    <h2>Abmessungen und Paneelausschnitt (Cut-Out Pattern)</h2>
    <div class="highlight-box">
      <strong>Bohrbild / Einbauausschnitt (Cut-out Pattern):</strong> Für den flächenbündigen Einbau in Frontplatten, Schaltschranktüren oder Gehäuseausschnitte ist ein rechteckiger Montageausschnitt von <strong>110,0 mm &times; 62,0 mm</strong> erforderlich (Einbautiefe: 24,0 mm).
    </div>
    <table>
      <tr><th>Breite &times; Höhe &times; Tiefe:</th><td>110,0 mm &times; 62,0 mm &times; 24,0 mm</td></tr>
      <tr><th>Erforderlicher Montageplatz:</th><td>6820,0 mm&sup2;</td></tr>
      <tr><th>Gewicht:</th><td>0,18 kg (180 g)</td></tr>
      <tr><th>Montageausschnitt Frontplatte:</th><td>110,0 mm &times; 62,0 mm (Paneleinbau)</td></tr>
      <tr><th>Sicherheitsabstände:</th><td>Oben: 0 mm, Unten: 0 mm, Links: 0 mm, Rechts: 0 mm</td></tr>
    </table>

    <h2>Umgebungsbedingungen und Normen</h2>
    <table>
      <tr><th>Schutzart:</th><td>IP40 (Ethernet RJ45 Ausführung)</td></tr>
      <tr><th>Betriebstemperatur:</th><td>0 &deg;C ... +50 &deg;C</td></tr>
      <tr><th>EU-Richtlinienkonformität:</th><td>RED 2014/53/EU, RoHS 2011/65/EU</td></tr>
      <tr><th>Harmonisierte Normen:</th><td>EN 62368-1, EN 50364, EN 301 489-1/-3, EN 300 330, EN 55032</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Technisches Datenblatt &bull; phg Peter Hengstler GmbH + Co. KG &bull; ADMITTO-D</div>
    <div>Seite 3 von 3 (DE) &bull; EPLAN Pro Panel Stammdaten</div>
  </div>
</div>

</body>
</html>`;
}

// 2. Generate TPL.TL-POE150S HTML
function generateTplHtml() {
  const imgUrl = 'file:///g:/M%C3%B3j%20dysk/Projekty%20Antigravity/Eplan%20EDZ%20generator/EDZ/TPL/TPL.TL-POE150S/TL-POE150S.png';
  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>TP-Link - TL-POE150S Gigabit PoE Injector - DTR / Datasheet</title>
<style>${getBaseStyle()}</style>
</head>
<body>

<!-- SECTION 1: POLISH -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">PL</span>TL-POE150S &bull; Gigabitowy Injektor PoE (IEEE 802.3af)</h1>
        <div class="subtitle">Injektor Power over Ethernet do zasilania urządzeń sieciowych &bull; Nr art. TPL.TL-POE150S</div>
      </div>
      <div class="brand">TP-LINK</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Opis urządzenia:</strong> Gigabitowy injektor Power over Ethernet (PoE) TL-POE150S renomowanej marki TP-Link Technologies Co., Ltd. Umożliwia jednoczesne przesyłanie danych sieciowych oraz energii zasilającej (48V DC, max 15,4 W) za pośrednictwem pojedynczego kabla Ethernet (Cat5e / Cat6) na odległość do 100 metrów. W pełni zgodny ze standardem IEEE 802.3af.
        <br><br>
        <strong>Zastosowanie:</strong> Zasilanie przemysłowych czytników RFID (np. PHG ADMITTO-D), punktów dostępowych Wi-Fi, kamer monitoringu IP oraz telefonów VoIP bezpośrednio w szafach teleinformatycznych i automatyki.
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="TP-Link TL-POE150S">
      </div>
    </div>

    <h2>Dane identyfikacyjne i handlowe</h2>
    <table>
      <tr><th>Oznaczenie typu:</th><td>TL-POE150S</td></tr>
      <tr><th>Numer artykułu (PartNr):</th><td>TPL.TL-POE150S</td></tr>
      <tr><th>Kod zamówieniowy (OrderNr):</th><td>TL-POE150S</td></tr>
      <tr><th>Producent:</th><td>TP-Link Technologies Co., Ltd. (TPL)</td></tr>
      <tr><th>Klasyfikacja EPLAN:</th><td>Elektrotechnika &gt; Zasilacze i przetwornice &gt; Ogólne (Top: 1, Grp: 30, Sub: 1)</td></tr>
      <tr><th>Oznaczenie literowe (IEC 81346):</th><td>G (Zasilacz / źródło zasilania PoE)</td></tr>
    </table>

    <h2>Właściwości elektryczne i zasilanie</h2>
    <table>
      <tr><th>Standardy sieciowe:</th><td>IEEE 802.3, IEEE 802.3u, IEEE 802.3ab, IEEE 802.3af</td></tr>
      <tr><th>Zasilanie wejściowe (DC IN):</th><td>48 V DC (zewnętrzny zasilacz sieciowy w komplecie)</td></tr>
      <tr><th>Moc wyjściowa PoE:</th><td>Automatyczne dostosowanie do odbiornika PD, maks. 15,4 W (48 V DC)</td></tr>
      <tr><th>Algorytm wykrywania:</th><td>Auto-Sensing Algorithm (automatyczne zasilanie wyłącznie urządzeń 802.3af PD)</td></tr>
      <tr><th>Zabezpieczenia:</th><td>Zabezpieczenie przeciwzwarciowe (Short Circuit Protection)</td></tr>
      <tr><th>Sygnalizacja stanu:</th><td>Dioda LED PWR (ciągła: zasilanie prawidłowe, migająca: błąd/brak PD)</td></tr>
    </table>

    <h2>Porty przyłączeniowe i okablowanie</h2>
    <table>
      <tr><th>Port wejściowy danych (LAN IN):</th><td>1&times; 10/100/1000 Mbps RJ45 Auto-Negotiation</td></tr>
      <tr><th>Port wyjściowy PoE (DATA + PWR OUT):</th><td>1&times; 10/100/1000 Mbps RJ45 Auto-Negotiation PoE</td></tr>
      <tr><th>Gniazdo zasilania:</th><td>1&times; DC Power Jack (48 V DC)</td></tr>
      <tr><th>Maksymalna odległość transmisji:</th><td>Do 100 m (kabel UTP/STP Cat5, Cat5e, Cat6)</td></tr>
    </table>

    <h2>Wymiary gabarytowe i dane mechaniczne</h2>
    <table>
      <tr><th>Szerokość &times; Wysokość &times; Głębokość:</th><td>80,8 mm &times; 54,0 mm &times; 24,0 mm</td></tr>
      <tr><th>Wymagane miejsce zabudowy:</th><td>4363,2 mm&sup2;</td></tr>
      <tr><th>Ciężar urządzenia:</th><td>0,10 kg (jednostka injektora w szafie)</td></tr>
      <tr><th>Montaż:</th><td>Montaż wolnostojący / w półce szafy / na uchwycie DIN</td></tr>
      <tr><th>Kolor obudowy:</th><td>Czarny matowy (Jet Black)</td></tr>
    </table>

    <h2>Warunki środowiskowe i certyfikaty</h2>
    <table>
      <tr><th>Temperatura pracy:</th><td>0 &deg;C ... +40 &deg;C</td></tr>
      <tr><th>Temperatura składowania:</th><td>-40 &deg;C ... +70 &deg;C</td></tr>
      <tr><th>Wilgotność pracy:</th><td>10% ... 90% RH (bez kondensacji)</td></tr>
      <tr><th>Certyfikaty zgodności:</th><td>FCC, CE, RoHS</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Dokumentacja Techniczno-Ruchowa (DTR) &bull; TP-Link Technologies Co., Ltd. &bull; TL-POE150S</div>
    <div>Strona 1 z 3 (PL) &bull; Artykuł EPLAN Electric P8 / Pro Panel</div>
  </div>
</div>

<!-- SECTION 2: ENGLISH -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">ENG</span>TL-POE150S &bull; Gigabit PoE Injector (IEEE 802.3af)</h1>
        <div class="subtitle">Power over Ethernet injector for network powered devices &bull; Part No. TPL.TL-POE150S</div>
      </div>
      <div class="brand">TP-LINK</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Device Overview:</strong> Gigabit Power over Ethernet (PoE) Injector TL-POE150S by TP-Link Technologies Co., Ltd. Delivers power and high-speed data simultaneously over a single Ethernet cable (Cat5e / Cat6) up to 100 meters (328 ft) without requiring separate power cabling. Fully compliant with the IEEE 802.3af international PoE standard.
        <br><br>
        <strong>Applications:</strong> Supplying PoE power to industrial RFID readers (such as PHG ADMITTO-D), wireless access points, IP surveillance cameras, and VoIP phones inside automation enclosures.
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="TP-Link TL-POE150S">
      </div>
    </div>

    <h2>Commercial & Identification Data</h2>
    <table>
      <tr><th>Type Designation:</th><td>TL-POE150S</td></tr>
      <tr><th>Part Number (PartNr):</th><td>TPL.TL-POE150S</td></tr>
      <tr><th>Order Number (OrderNr):</th><td>TL-POE150S</td></tr>
      <tr><th>Manufacturer:</th><td>TP-Link Technologies Co., Ltd. (TPL)</td></tr>
      <tr><th>EPLAN Classification:</th><td>Electrical engineering &gt; Power supply plants &gt; General (Top: 1, Grp: 30, Sub: 1)</td></tr>
      <tr><th>Letter Code (IEC 81346):</th><td>G (Power supply / PoE source)</td></tr>
    </table>

    <h2>Electrical Characteristics & Power Output</h2>
    <table>
      <tr><th>Network Standards:</th><td>IEEE 802.3, IEEE 802.3u, IEEE 802.3ab, IEEE 802.3af</td></tr>
      <tr><th>Input Power Supply (DC IN):</th><td>48 V DC (external AC/DC power adapter included)</td></tr>
      <tr><th>PoE Output Power:</th><td>Auto-determines necessary power requirements, max. 15.4 W (48 V DC)</td></tr>
      <tr><th>Auto-Sensing Technology:</th><td>Auto-Sensing Algorithm enables providing safe power to 802.3af PDs only</td></tr>
      <tr><th>Protective Functions:</th><td>Short Circuit Protection</td></tr>
      <tr><th>Status Indication:</th><td>PWR LED (Solid: normal operation, Flashing: abnormal power / no PD)</td></tr>
    </table>

    <h2>Port Configuration & Cabling</h2>
    <table>
      <tr><th>Data Input Port (LAN IN):</th><td>1&times; 10/100/1000 Mbps Auto-Negotiation RJ45</td></tr>
      <tr><th>PoE Output Port (DATA + PWR OUT):</th><td>1&times; 10/100/1000 Mbps Auto-Negotiation RJ45 PoE</td></tr>
      <tr><th>Power Socket:</th><td>1&times; 48 V DC input jack</td></tr>
      <tr><th>Maximum Distance:</th><td>Up to 100 meters (Cat5, Cat5e, Cat6 UTP/STP cable)</td></tr>
    </table>

    <h2>Physical Dimensions & Mechanical Data</h2>
    <table>
      <tr><th>Width &times; Height &times; Depth:</th><td>80.8 mm &times; 54.0 mm &times; 24.0 mm</td></tr>
      <tr><th>Mounting Space Footprint:</th><td>4363.2 mm&sup2;</td></tr>
      <tr><th>Unit Weight:</th><td>0.10 kg (standalone unit inside enclosure)</td></tr>
      <tr><th>Mounting Options:</th><td>Desktop / rack shelf / DIN rail adapter bracket</td></tr>
      <tr><th>Enclosure Color:</th><td>Matte Black (Jet Black)</td></tr>
    </table>

    <h2>Environmental Conditions & Certifications</h2>
    <table>
      <tr><th>Operating Temperature:</th><td>0 &deg;C ... +40 &deg;C (32 &deg;F ... 104 &deg;F)</td></tr>
      <tr><th>Storage Temperature:</th><td>-40 &deg;C ... +70 &deg;C (-40 &deg;F ... 158 &deg;F)</td></tr>
      <tr><th>Operating Humidity:</th><td>10% ... 90% RH non-condensing</td></tr>
      <tr><th>Certifications:</th><td>FCC, CE, RoHS</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Technical Datasheet &bull; TP-Link Technologies Co., Ltd. &bull; TL-POE150S</div>
    <div>Page 2 of 3 (ENG) &bull; EPLAN Electric P8 Master Data</div>
  </div>
</div>

<!-- SECTION 3: GERMAN -->
<div class="page">
  <div>
    <div class="header">
      <div>
        <h1><span class="lang-tag">DE</span>TL-POE150S &bull; Gigabit-PoE-Injektor (IEEE 802.3af)</h1>
        <div class="subtitle">Power-over-Ethernet-Injektor zur Strom- und Datenversorgung &bull; Art.-Nr. TPL.TL-POE150S</div>
      </div>
      <div class="brand">TP-LINK</div>
    </div>

    <div class="overview-container">
      <div class="overview-box">
        <strong>Produktbeschreibung:</strong> Gigabit-PoE-Injektor TL-POE150S des Herstellers TP-Link Technologies Co., Ltd. Ermöglicht die gleichzeitige Übertragung von Gigabit-Ethernet-Daten und elektrischer Betriebsspannung (48 V DC, max. 15,4 W) über ein einziges Netzwerkkabel (Cat5e / Cat6) bis zu 100 Meter Reichweite. Vollständig kompatibel zum internationalen IEEE 802.3af PoE-Standard.
        <br><br>
        <strong>Einsatzbereiche:</strong> Zuverlässige PoE-Versorgung von industriellen RFID-Lesemodulen (z.B. PHG ADMITTO-D), Wireless Access Points, IP-Kameras und VoIP-Telefonen in Schaltschränken und Netzwerkverteilern.
      </div>
      <div class="overview-image">
        <img src="${imgUrl}" alt="TP-Link TL-POE150S">
      </div>
    </div>

    <h2>Handels- und Identifikationsdaten</h2>
    <table>
      <tr><th>Typenbezeichnung:</th><td>TL-POE150S</td></tr>
      <tr><th>Artikelnummer (PartNr):</th><td>TPL.TL-POE150S</td></tr>
      <tr><th>Bestellnummer (OrderNr):</th><td>TL-POE150S</td></tr>
      <tr><th>Hersteller:</th><td>TP-Link Technologies Co., Ltd. (TPL)</td></tr>
      <tr><th>EPLAN Produktgruppierung:</th><td>Elektrotechnik &gt; Stromversorgungsanlagen &gt; Allgemein (Top: 1, Grp: 30, Sub: 1)</td></tr>
      <tr><th>Kennbuchstabe (IEC 81346):</th><td>G (Stromversorgungseinheit / PoE-Quelle)</td></tr>
    </table>

    <h2>Elektrische Eigenschaften und Ausgangsleistung</h2>
    <table>
      <tr><th>Netzwerkstandards:</th><td>IEEE 802.3, IEEE 802.3u, IEEE 802.3ab, IEEE 802.3af</td></tr>
      <tr><th>Eingangsspannung (DC IN):</th><td>48 V DC (über beiliegendes externes Netzteil)</td></tr>
      <tr><th>PoE-Ausgangsleistung:</th><td>Automatische Leistungsanpassung an PD-Endgerät, max. 15,4 W (48 V DC)</td></tr>
      <tr><th>Erkennungslogik:</th><td>Auto-Sensing Algorithmus (ausschließliche Bestromung von 802.3af-konformen PDs)</td></tr>
      <tr><th>Schutzfunktionen:</th><td>Kurzschlussschutz (Short Circuit Protection)</td></tr>
      <tr><th>Statusanzeige:</th><td>PWR-LED (Dauerlicht: regulärer Betrieb, Blinkend: Störung / kein PD)</td></tr>
    </table>

    <h2>Anschlüsse und Verkabelung</h2>
    <table>
      <tr><th>Dateneingang (LAN IN):</th><td>1&times; 10/100/1000 Mbit/s Auto-Negotiation RJ45</td></tr>
      <tr><th>PoE-Ausgang (DATA + PWR OUT):</th><td>1&times; 10/100/1000 Mbit/s Auto-Negotiation RJ45 PoE</td></tr>
      <tr><th>Stromeingangsbuchse:</th><td>1&times; DC-Hohlsteckerbuchse (48 V DC)</td></tr>
      <tr><th>Maximale Leitungslänge:</th><td>Bis zu 100 m (Cat5, Cat5e, Cat6 UTP/STP-Kabel)</td></tr>
    </table>

    <h2>Abmessungen und mechanische Daten</h2>
    <table>
      <tr><th>Breite &times; Höhe &times; Tiefe:</th><td>80,8 mm &times; 54,0 mm &times; 24,0 mm</td></tr>
      <tr><th>Erforderlicher Montageplatz:</th><td>4363,2 mm&sup2;</td></tr>
      <tr><th>Gerätegewicht:</th><td>0,10 kg (Injektor-Modul im Schaltschrank)</td></tr>
      <tr><th>Montagemöglichkeiten:</th><td>Tischmontage / Fachboden / Hutschiene mittels Adapter</td></tr>
      <tr><th>Gehäusefarbe:</th><td>Mattschwarz (Jet Black)</td></tr>
    </table>

    <h2>Umgebungsbedingungen und Zertifizierungen</h2>
    <table>
      <tr><th>Betriebstemperatur:</th><td>0 &deg;C ... +40 &deg;C</td></tr>
      <tr><th>Lagertemperatur:</th><td>-40 &deg;C ... +70 &deg;C</td></tr>
      <tr><th>Betriebsfeuchtigkeit:</th><td>10% ... 90% rel. Luftfeuchte (nicht kondensierend)</td></tr>
      <tr><th>Zertifikate:</th><td>FCC, CE, RoHS</td></tr>
    </table>
  </div>

  <div class="footer">
    <div>Technisches Datenblatt &bull; TP-Link Technologies Co., Ltd. &bull; TL-POE150S</div>
    <div>Seite 3 von 3 (DE) &bull; EPLAN Electric P8 Stammdaten</div>
  </div>
</div>

</body>
</html>`;
}

// Generate files and render PDFs
fs.writeFileSync('scripts/ADMITTO-D_datasheet.html', generateAdmittoHtml(), 'utf8');
console.log('Created scripts/ADMITTO-D_datasheet.html');

fs.writeFileSync('scripts/TL-POE150S_datasheet.html', generateTplHtml(), 'utf8');
console.log('Created scripts/TL-POE150S_datasheet.html');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function renderPdf(htmlPath, pdfPath) {
  const htmlResolved = path.resolve(htmlPath);
  const pdfResolved = path.resolve(pdfPath);
  const cmd = `"${edge}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfResolved}" --no-pdf-header-footer "${htmlResolved}"`;
  cp.execSync(cmd);
  console.log('Rendered PDF:', pdfResolved, fs.statSync(pdfResolved).size, 'bytes');
}

renderPdf('scripts/ADMITTO-D_datasheet.html', 'EDZ/PHG/PHG.ADMITTO-D/ADMITTO-D_datasheet.pdf');
renderPdf('scripts/TL-POE150S_datasheet.html', 'EDZ/TPL/TPL.TL-POE150S/TL-POE150S_datasheet.pdf');
console.log('Datasheet generation complete.');
