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
    border-bottom: 2.5px solid #e30613;
    padding-bottom: 5px;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #e30613;
    font-size: 15px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 16px;
    color: #e30613;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .lang-tag {
    display: inline-block;
    background: #e30613;
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
    background: #fdf5f5;
    border-left: 3.5px solid #e30613;
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
    color: #b0050f;
    font-size: 10px;
    border-bottom: 1px solid #ffd1d4;
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
    background-color: #fbf1f1;
    color: #5a0005;
    font-weight: 600;
    width: 32%;
  }
  td {
    color: #222;
  }
  .highlight-box {
    background-color: #fff8f8;
    border: 1px solid #fed7d7;
    border-left: 3.5px solid #e30613;
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

// Definition of 4 ILME items
const ITEMS = [
  {
    id: 'CNEM 24 T',
    partNr: 'ILME.CNEM 24 T',
    typeNr: 'CNEM 24 T',
    orderNr: 'CNEM 24 T',
    ean: '8015747033305',
    categoryPl: 'Wkładka męska złącza przemysłowego (HDC) z zaciskami śrubowymi',
    categoryEn: 'Male insert for heavy-duty industrial connectors (HDC) with screw terminals',
    categoryDe: 'Stifteinsatz für schwere Industriesteckverbinder (HDC) mit Schraubanschluss',
    imgPath: path.resolve('EDZ/ILME/ILME.CNEM 24 T/CNEM 24 T.png'),
    pdfPath: path.resolve('EDZ/ILME/ILME.CNEM 24 T/CNEM 24 T_datasheet.pdf'),
    specs: {
      poles: '24P + PE (Protective Earth)',
      current: '16 A',
      voltageIec: '500 V (EN 61984), 400/690 V (Stopień zanieczyszczenia 2)',
      voltageUl: '600 V (cURus, CSA)',
      impulseVoltage: '6 kV',
      pollutionDegree: '3',
      wireRange: '0.5 - 2.5 mm² (drut/linka z tulejką) / do 4.0 mm² (linka bez tulejki z blaszką ochronną), AWG 20-12',
      stripping: '7.0 mm',
      torque: '0.5 Nm (wkrętak PH0 lub 0.8 x 4.0 mm)',
      contacts: 'Stop miedzi, toczone, pokrycie galwaniczne srebrem (Ag)',
      contactResistance: '≤ 1 mΩ',
      insulationResistance: '≥ 10 GΩ',
      material: 'Poliwęglan (PC), samogasnący, RAL 7032 (szary), UL 94 V-0',
      temperature: '-40 °C ... +125 °C',
      matingCycles: '≥ 500 cykli',
      size: 'Rozmiar 104.27 (rozstaw śrub mocujących 104 x 27 mm, obudowy wielkości 24B)',
      dimensions: '111 mm x 35 mm x 34 mm',
      weight: '0.111 kg (111 g netto)',
      protection: 'IP20 bez obudowy, do IP65/IP66/IP69K w kompatybilnej obudowie ILME',
      standards: 'EN 61984:2009, IEC 60512, IEC 60664-1, cURus, CSA, DNV-GL, BV, EAC, CE, RoHS',
    },
    overviewPl: 'Wielostykowa wkładka męska serii CNE przeznaczona do ciężkich warunków przemysłowych. Wyposażona w 24 styki robocze 16A/500V oraz styk ochronny PE. Zaciski śrubowe z fabryczną blaszką ochronną (wire protection plate) zapobiegają przecinaniu żył elastycznych bez konieczności stosowania tulejek. Standardowy rozmiar 104.27 kompatybilny ze wszystkimi obudowami wielkości 24 (24B) ILME.',
    overviewEn: 'Multipole male insert from the CNE series designed for heavy-duty industrial applications. Features 24 power/signal contacts rated at 16A/500V plus a leading PE protective earth contact. Screw terminals with an integral wire protection plate safeguard flexible stranded conductors without mandatory ferrule crimping. Standard 104.27 footprint compatible with all size 24 (24B) ILME enclosures.',
    overviewDe: 'Vielpoliger Stifteinsatz der CNE-Serie für raue Industrieumgebungen. Ausgestattet mit 24 Leistungskontakten (16A/500V) und voreilendem Schutzerdungskontakt (PE). Schraubklemmen mit integriertem Drahtschutzblech verhindern das Abscheren feindrähtiger Leiter auch ohne Aderendhülsen. Standard-Baugröße 104.27 passend für alle ILME-Gehäuse der Größe 24 (24B).',
  },
  {
    id: 'CNEF 24 T',
    partNr: 'ILME.CNEF 24 T',
    typeNr: 'CNEF 24 T',
    orderNr: 'CNEF 24 T',
    ean: '8015747033107',
    categoryPl: 'Wkładka żeńska złącza przemysłowego (HDC) z zaciskami śrubowymi',
    categoryEn: 'Female insert for heavy-duty industrial connectors (HDC) with screw terminals',
    categoryDe: 'Buchseneinsatz für schwere Industriesteckverbinder (HDC) mit Schraubanschluss',
    imgPath: path.resolve('EDZ/ILME/ILME.CNEF 24 T/CNEF 24 T.png'),
    pdfPath: path.resolve('EDZ/ILME/ILME.CNEF 24 T/CNEF 24 T_datasheet.pdf'),
    specs: {
      poles: '24P + PE (Protective Earth)',
      current: '16 A',
      voltageIec: '500 V (EN 61984), 400/690 V (Stopień zanieczyszczenia 2)',
      voltageUl: '600 V (cURus, CSA)',
      impulseVoltage: '6 kV',
      pollutionDegree: '3',
      wireRange: '0.5 - 2.5 mm² (drut/linka z tulejką) / do 4.0 mm² (linka bez tulejki z blaszką ochronną), AWG 20-12',
      stripping: '7.0 mm',
      torque: '0.5 Nm (wkrętak PH0 lub 0.8 x 4.0 mm)',
      contacts: 'Stop miedzi, toczone, pokrycie galwaniczne srebrem (Ag)',
      contactResistance: '≤ 1 mΩ',
      insulationResistance: '≥ 10 GΩ',
      material: 'Poliwęglan (PC), samogasnący, RAL 7032 (szary), UL 94 V-0',
      temperature: '-40 °C ... +125 °C',
      matingCycles: '≥ 500 cykli',
      size: 'Rozmiar 104.27 (rozstaw śrub mocujących 104 x 27 mm, obudowy wielkości 24B)',
      dimensions: '111 mm x 35 mm x 34 mm',
      weight: '0.120 kg (120 g netto)',
      protection: 'IP20 bez obudowy, do IP65/IP66/IP69K w kompatybilnej obudowie ILME',
      standards: 'EN 61984:2009, IEC 60512, IEC 60664-1, cURus, CSA, DNV-GL, BV, EAC, CE, RoHS',
    },
    overviewPl: 'Wielostykowa wkładka żeńska (gniazdo) serii CNE przeznaczona do złączy przemysłowych heavy-duty. 24 bieguny robocze 16A/500V oraz styk ochronny PE. Zaciski śrubowe z płytką ochronną zabezpieczającą przed uszkodzeniem żył przewodów elastycznych (0.5 – 2.5/4.0 mm²). Przeznaczona do montażu w obudowach cokołowych, naściennych lub pulpitowych rozmiaru 104.27 (wielkość 24B).',
    overviewEn: 'Multipole female socket insert from the CNE series for heavy-duty industrial connectors. 24 power/signal poles rated at 16A/500V plus PE earth contact. Screw terminals with protective leaf spring safeguarding stranded conductors (0.5 – 2.5/4.0 mm²). Designed for installation inside surface, bulkhead, or hood enclosures of size 104.27 (size 24B).',
    overviewDe: 'Vielpoliger Buchseneinsatz der CNE-Serie für schwere Industriesteckverbinder. 24 Leistungskontakte (16A/500V) und Schutzerde (PE). Schraubklemmen mit Drahtschutzfeder gegen Leiterbeschädigung bei flexiblen Leitern (0,5 – 2,5/4,0 mm²). Konzipiert für den Einbau in Sockel-, Anbau- oder Tüllengehäuse der Baugröße 104.27 (Größe 24B).',
  },
  {
    id: 'MAP 24.232',
    partNr: 'ILME.MAP 24.232',
    typeNr: 'MAP 24.232',
    orderNr: 'MAP 24.232',
    ean: '8015747051903',
    categoryPl: 'Obudowa cokołowa naścienna wysoka (HC), 2x M32, 2 klamry ryglowe',
    categoryEn: 'Surface mounting housing high construction (HC), 2x M32, 2 locking levers',
    categoryDe: 'Sockelgehäuse hohe Bauform (HC), 2x M32, 2 Querbügel',
    imgPath: path.resolve('EDZ/ILME/ILME.MAP 24.232/MAP 24.232.png'),
    pdfPath: path.resolve('EDZ/ILME/ILME.MAP 24.232/MAP 24.232_datasheet.pdf'),
    specs: {
      housingType: 'Obudowa cokołowa / naścienna (Surface mounting housing)',
      series: 'C-Type (Seria standardowa o podwyższonej wytrzymałości)',
      size: 'Rozmiar 104.27 (Wielkość 24 / 24B)',
      construction: 'Wysoka konstrukcja (High Construction, wysokość 81 mm) – zwiększona przestrzeń montażowa na przewody',
      cableEntries: '2x boczne wejścia gwintowane M32 (z dwóch stron, przelotowe)',
      locking: '2 klamry ryglowe (podwójny rygiel) ze stali nierdzewnej z rolkami z tworzywa termoplastycznego',
      material: 'Odlew ciśnieniowy ze stopu aluminium (Die-cast aluminium alloy)',
      surface: 'Malowanie proszkowe żywicą epoksydowo-poliestrową, kolor szary RAL 7040',
      gasket: 'Uszczelka profilowa NBR (guma nitrylowa odporna na oleje i starzenie)',
      temperature: '-40 °C ... +125 °C',
      protection: 'IP65, IP66, IP69 / IP69K (wg DIN 40050-9, mycie wysokociśnieniowe i parowe)',
      dimensions: '144 mm (długość podstawy) x 81 mm (wysokość) x 57 mm (szerokość korpusu, z klamrami ok. 98 mm)',
      mountingHoles: '4 otwory montażowe Ø 5.5 mm o rozstawie 132 mm x 45 mm',
      weight: '0.430 kg (430 g netto)',
      standards: 'EN 61984:2009, DIN 43652, cURus, DNV-GL, BV, CE, RoHS',
    },
    overviewPl: 'Ciężka obudowa cokołowa naścienna serii C-Type rozmiaru 104.27 (wielkość 24B). Wersja wysoka (81 mm) zapewniająca optymalny promień gięcia kabli o dużych przekrojach. Dwa boczne wejścia kablowe z gwintem metrycznym M32. Dwie klamry ryglujące ze stali nierdzewnej z rolkami zapewniają trwały i gazoszczelny docisk uszczelki NBR, gwarantując stopień ochrony IP66 / IP69K.',
    overviewEn: 'Heavy-duty surface mounting housing of C-Type series, size 104.27 (size 24B). High construction variant (81 mm) providing ample space and optimal bending radius for thick multi-core industrial cables. Two side entry M32 metric threaded cable ports. Dual stainless steel locking levers with low-friction rollers ensure durable sealing and IP66 / IP69K ingress protection.',
    overviewDe: 'Schweres Sockelgehäuse der C-Type-Serie in der Baugröße 104.27 (Größe 24B). Hohe Bauform (81 mm) für großzügigen Verdrahtungsraum und optimale Biegeradien starker Industriekabel. Zwei seitliche metrische Kabeleinführungen M32. Zwei Edelstahl-Querbügel mit Rollen gewährleisten dauerhaften Anpressdruck und Schutzart IP66 / IP69K.',
  },
  {
    id: 'MAO 24.32',
    partNr: 'ILME.MAO 24.32',
    typeNr: 'MAO 24.32',
    orderNr: 'MAO 24.32',
    ean: '8015747051415',
    categoryPl: 'Obudowa górna wtykowa wysoka (HC), wyjście boczne M32, 4 sworznie',
    categoryEn: 'Hood high construction (HC), side cable entry M32, 4 pegs',
    categoryDe: 'Tüllengehäuse hohe Bauform (HC), seitlicher Kabelausgang M32, 4 Bolzen',
    imgPath: path.resolve('EDZ/ILME/ILME.MAO 24.32/MAO 24.32.png'),
    pdfPath: path.resolve('EDZ/ILME/ILME.MAO 24.32/MAO 24.32_datasheet.pdf'),
    specs: {
      housingType: 'Obudowa górna wtykowa / Tuleja wtyku (Hood / Plug housing)',
      series: 'C-Type (Wykonanie standardowe do zastosowań przemysłowych)',
      size: 'Rozmiar 104.27 (Wielkość 24 / 24B)',
      construction: 'Wysoka konstrukcja (High Construction, wysokość 76 mm) – ułatwiony montaż dławika M32 i zginanie kabla',
      cableEntries: '1x boczne wejście kablowe z gwintem metrycznym M32',
      locking: '4 sworznie ryglujące (4 pegs) do współpracy z 2 klamrami obudowy dolnej / cokołowej',
      material: 'Odlew ciśnieniowy ze stopu aluminium (Die-cast aluminium alloy)',
      surface: 'Powłoka epoksydowo-poliestrowa, kolor szary RAL 7040',
      temperature: '-40 °C ... +125 °C',
      protection: 'IP65, IP66, IP69 / IP69K (zgodnie z DIN 40050-9 w stanie zaryglowanym)',
      dimensions: '120 mm (długość) x 76 mm (wysokość) x 43 mm (szerokość korpusu, z sworzniami ok. 57 mm)',
      weight: '0.270 kg (270 g netto)',
      standards: 'EN 61984:2009, DIN 43652, cURus, DNV-GL, BV, CE, RoHS',
    },
    overviewPl: 'Aluminiowa obudowa wtykowa górna (hood) serii C-Type rozmiaru 104.27 (wielkość 24B) z bocznym wyprowadzeniem kablowym M32. Wersja o podwyższonej wysokości (76 mm) zapobiegająca nadmiernym naprężeniom przewodów zasilających i sterowniczych. Cztery sworznie współpracujące z podwójnym ryglem klamrowym obudowy cokołowej gwarantują szczelność IP66 / IP69K.',
    overviewEn: 'Die-cast aluminum hood of C-Type series, size 104.27 (size 24B) with side M32 cable entry. High construction design (76 mm) eliminates conductor strain and allows comfortable cable gland installation. Four locking pegs designed for secure engagement with double-lever base enclosures, ensuring IP66 / IP69K protection.',
    overviewDe: 'Aluminiumdruckguss-Tüllengehäuse der C-Type-Serie in Baugröße 104.27 (Größe 24B) mit seitlichem Kabelausgang M32. Hohe Ausführung (76 mm) für spannungsfreie Leitungsführung und komfortable M32-Verschraubungsmontage. Vier Verriegelungsbolzen für das sichere Verrasten mit den Querbügeln des Sockelgehäuses, Schutzart IP66 / IP69K.',
  },
];

function buildHtmlForItem(item) {
  const imgBase64 = fs.readFileSync(item.imgPath).toString('base64');
  const imgSrc = `data:image/png;base64,${imgBase64}`;

  const isInsert = item.id.includes('CNE');

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>ILME ${item.typeNr} - Karta Techniczna / Technical Datasheet / Produktdatenblatt</title>
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
          <h1><span class="lang-tag">PL</span>ILME ${item.typeNr}</h1>
          <div class="subtitle">${item.categoryPl}</div>
        </div>
        <div class="brand">ILME</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>${item.typeNr}:</strong> ${item.overviewPl}
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="ILME ${item.typeNr}" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Kluczowe właściwości:</strong> Rozmiar 104.27 (Wielkość 24B) • Zakres temperatur: -40 °C ... +125 °C • Stopień ochrony w zespole: IP65 / IP66 / IP69K • Zgodność z normą EN 61984 • Zastosowanie w wymagających instalacjach automatyki i rozdzielnicach przemysłowych.
      </div>

      <h2>Dane podstawowe i identyfikacyjne</h2>
      <table>
        <tr><th>Producent</th><td>I.L.M.E. SpA (Via Marco Antonio Colonna 9, 20149 Milano, Włochy)</td></tr>
        <tr><th>Seria i oznaczenie typu</th><td>${isInsert ? 'Seria CNE' : 'Seria C-Type'} / Model: ${item.typeNr}</td></tr>
        <tr><th>Numer katalogowy / Symbol</th><td>${item.orderNr} (Kod EAN: ${item.ean})</td></tr>
        <tr><th>Identyfikator EPLAN</th><td>${item.partNr}</td></tr>
        <tr><th>Klasyfikacja EPLAN</th><td>Nadgrupa: 1 (Elektrotechnika) / Grupa: 4 (Wtyki) / Podgrupa: ${isInsert ? '1 (Ogólne)' : '15 (Obudowa wtyku)'}</td></tr>
        <tr><th>Oznaczenie literowe (IEC 81346)</th><td>X (Złącze / Element przyłączeniowy)</td></tr>
      </table>

      <h2>Parametry techniczne i konstrukcyjne</h2>
      <table>
        ${isInsert ? `
        <tr><th>Liczba biegunów</th><td>${item.specs.poles}</td></tr>
        <tr><th>Prąd znamionowy</th><td>${item.specs.current}</td></tr>
        <tr><th>Napięcie znamionowe (IEC / UL)</th><td>${item.specs.voltageIec} / ${item.specs.voltageUl}</td></tr>
        <tr><th>Napięcie udarowe / Zanieczyszczenie</th><td>${item.specs.impulseVoltage} / Stopień ${item.specs.pollutionDegree}</td></tr>
        <tr><th>Przyłącze elektryczne</th><td>${item.specs.wireRange}</td></tr>
        <tr><th>Długość odizolowania / Moment dokręcania</th><td>${item.specs.stripping} / ${item.specs.torque}</td></tr>
        <tr><th>Materiał styków i pokrycie</th><td>${item.specs.contacts}</td></tr>
        <tr><th>Rezystancja przejścia / izolacji</th><td>${item.specs.contactResistance} / ${item.specs.insulationResistance}</td></tr>
        ` : `
        <tr><th>Typ obudowy i konstrukcja</th><td>${item.specs.housingType} (${item.specs.construction})</td></tr>
        <tr><th>Wejścia / dławiki kablowe</th><td>${item.specs.cableEntries}</td></tr>
        <tr><th>System ryglowania</th><td>${item.specs.locking}</td></tr>
        <tr><th>Materiał korpusu / Powłoka</th><td>${item.specs.material} / ${item.specs.surface}</td></tr>
        ${item.specs.gasket ? `<tr><th>Uszczelnienie</th><td>${item.specs.gasket}</td></tr>` : ''}
        ${item.specs.mountingHoles ? `<tr><th>Otwory montażowe</th><td>${item.specs.mountingHoles}</td></tr>` : ''}
        `}
        <tr><th>Stopień ochrony IP</th><td>${item.specs.protection}</td></tr>
        <tr><th>Wymiary gabarytowe</th><td>${item.specs.dimensions}</td></tr>
        <tr><th>Masa artykułu</th><td>${item.specs.weight}</td></tr>
        <tr><th>Normy i certyfikaty</th><td>${item.specs.standards}</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>ILME ${item.typeNr} • EPLAN Electric P8 Pakiet Wymiany Artykułu (EDZ)</span>
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
          <h1><span class="lang-tag">ENG</span>ILME ${item.typeNr}</h1>
          <div class="subtitle">${item.categoryEn}</div>
        </div>
        <div class="brand">ILME</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>${item.typeNr}:</strong> ${item.overviewEn}
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="ILME ${item.typeNr}" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Key Features:</strong> Size 104.27 (Size 24B) • Temperature range: -40 °C ... +125 °C • Ingress Protection assembled: IP65 / IP66 / IP69K • Compliant with EN 61984 • Heavy-duty industrial connectivity.
      </div>

      <h2>Basic &amp; Identification Data</h2>
      <table>
        <tr><th>Manufacturer</th><td>I.L.M.E. SpA (Via Marco Antonio Colonna 9, 20149 Milano, Italy)</td></tr>
        <tr><th>Series &amp; Type Designation</th><td>${isInsert ? 'CNE Series' : 'C-Type Series'} / Model: ${item.typeNr}</td></tr>
        <tr><th>Part Number / Catalog Code</th><td>${item.orderNr} (EAN barcode: ${item.ean})</td></tr>
        <tr><th>EPLAN Part Number</th><td>${item.partNr}</td></tr>
        <tr><th>EPLAN Classification</th><td>Top Group: 1 (Electrical) / Group: 4 (Plugs) / Subgroup: ${isInsert ? '1 (General)' : '15 (Plug housing)'}</td></tr>
        <tr><th>Letter Code (IEC 81346)</th><td>X (Connector / Terminating element)</td></tr>
      </table>

      <h2>Technical Specifications &amp; Design</h2>
      <table>
        ${isInsert ? `
        <tr><th>Number of Poles</th><td>${item.specs.poles}</td></tr>
        <tr><th>Rated Current</th><td>${item.specs.current}</td></tr>
        <tr><th>Rated Voltage (IEC / UL)</th><td>${item.specs.voltageIec} / ${item.specs.voltageUl}</td></tr>
        <tr><th>Impulse Withstand / Pollution</th><td>${item.specs.impulseVoltage} / Degree ${item.specs.pollutionDegree}</td></tr>
        <tr><th>Wire Termination Cross-Section</th><td>${item.specs.wireRange}</td></tr>
        <tr><th>Stripping Length / Tightening Torque</th><td>${item.specs.stripping} / ${item.specs.torque}</td></tr>
        <tr><th>Contact Material &amp; Plating</th><td>${item.specs.contacts}</td></tr>
        <tr><th>Contact / Insulation Resistance</th><td>${item.specs.contactResistance} / ${item.specs.insulationResistance}</td></tr>
        ` : `
        <tr><th>Housing Type &amp; Profile</th><td>${item.specs.housingType} (${item.specs.construction})</td></tr>
        <tr><th>Cable Entries / Gland Ports</th><td>${item.specs.cableEntries}</td></tr>
        <tr><th>Locking Mechanism</th><td>${item.specs.locking}</td></tr>
        <tr><th>Housing Material &amp; Finish</th><td>${item.specs.material} / ${item.specs.surface}</td></tr>
        ${item.specs.gasket ? `<tr><th>Gasket Sealing</th><td>${item.specs.gasket}</td></tr>` : ''}
        ${item.specs.mountingHoles ? `<tr><th>Mounting Pitch / Holes</th><td>${item.specs.mountingHoles}</td></tr>` : ''}
        `}
        <tr><th>Ingress Protection (IP)</th><td>${item.specs.protection}</td></tr>
        <tr><th>Physical Dimensions</th><td>${item.specs.dimensions}</td></tr>
        <tr><th>Net Weight</th><td>${item.specs.weight}</td></tr>
        <tr><th>Compliance &amp; Approvals</th><td>${item.specs.standards}</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>ILME ${item.typeNr} • EPLAN Electric P8 Article Exchange Package (EDZ)</span>
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
          <h1><span class="lang-tag">DE</span>ILME ${item.typeNr}</h1>
          <div class="subtitle">${item.categoryDe}</div>
        </div>
        <div class="brand">ILME</div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          <strong>${item.typeNr}:</strong> ${item.overviewDe}
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="ILME ${item.typeNr}" />
        </div>
      </div>

      <div class="highlight-box">
        <strong>Wichtigste Merkmale:</strong> Baugröße 104.27 (Größe 24B) • Temperaturbereich: -40 °C ... +125 °C • Schutzart im gesteckten Zustand: IP65 / IP66 / IP69K • Konform nach DIN EN 61984 • Robuster Industrie-Standard.
      </div>

      <h2>Basis- und Identifikationsdaten</h2>
      <table>
        <tr><th>Hersteller</th><td>I.L.M.E. SpA (Via Marco Antonio Colonna 9, 20149 Milano, Italien)</td></tr>
        <tr><th>Serie und Typenbezeichnung</th><td>${isInsert ? 'CNE Serie' : 'C-Type Serie'} / Modell: ${item.typeNr}</td></tr>
        <tr><th>Artikelnummer / Bestellcode</th><td>${item.orderNr} (EAN-Barcode: ${item.ean})</td></tr>
        <tr><th>EPLAN Artikelnummer</th><td>${item.partNr}</td></tr>
        <tr><th>EPLAN Klassifizierung</th><td>Obergruppe: 1 (Elektrotechnik) / Gruppe: 4 (Stecker) / Untergruppe: ${isInsert ? '1 (Allgemein)' : '15 (Steckergehäuse)'}</td></tr>
        <tr><th>Kennbuchstabe (IEC 81346)</th><td>X (Steckverbinder / Verbindungselement)</td></tr>
      </table>

      <h2>Technische Daten und Konstruktionsmerkmale</h2>
      <table>
        ${isInsert ? `
        <tr><th>Polzahl</th><td>${item.specs.poles}</td></tr>
        <tr><th>Bemessungsstrom</th><td>${item.specs.current}</td></tr>
        <tr><th>Bemessungsspannung (IEC / UL)</th><td>${item.specs.voltageIec} / ${item.specs.voltageUl}</td></tr>
        <tr><th>Bemessungsstoßspannung / Verschmutzung</th><td>${item.specs.impulseVoltage} / Grad ${item.specs.pollutionDegree}</td></tr>
        <tr><th>Anschlussquerschnitt</th><td>${item.specs.wireRange}</td></tr>
        <tr><th>Abisolierlänge / Anzugsdrehmoment</th><td>${item.specs.stripping} / ${item.specs.torque}</td></tr>
        <tr><th>Kontaktmaterial und Oberfläche</th><td>${item.specs.contacts}</td></tr>
        <tr><th>Durchgangs- / Isolationswiderstand</th><td>${item.specs.contactResistance} / ${item.specs.insulationResistance}</td></tr>
        ` : `
        <tr><th>Gehäusetyp und Bauform</th><td>${item.specs.housingType} (${item.specs.construction})</td></tr>
        <tr><th>Kabeleinführungen</th><td>${item.specs.cableEntries}</td></tr>
        <tr><th>Verriegelungssystem</th><td>${item.specs.locking}</td></tr>
        <tr><th>Gehäusewerkstoff / Oberfläche</th><td>${item.specs.material} / ${item.specs.surface}</td></tr>
        ${item.specs.gasket ? `<tr><th>Dichtung</th><td>${item.specs.gasket}</td></tr>` : ''}
        ${item.specs.mountingHoles ? `<tr><th>Befestigungsmaße</th><td>${item.specs.mountingHoles}</td></tr>` : ''}
        `}
        <tr><th>Schutzart (IP)</th><td>${item.specs.protection}</td></tr>
        <tr><th>Abmessungen</th><td>${item.specs.dimensions}</td></tr>
        <tr><th>Nettogewicht</th><td>${item.specs.weight}</td></tr>
        <tr><th>Normen und Zulassungen</th><td>${item.specs.standards}</td></tr>
      </table>
    </div>

    <div class="footer">
      <span>ILME ${item.typeNr} • EPLAN Electric P8 Artikelaustauschpaket (EDZ)</span>
      <span>Seite 3 von 3 (DE)</span>
    </div>
  </div>

</body>
</html>`;
}

// Generate all 4 PDFs
for (const item of ITEMS) {
  console.log(`\n========================================`);
  console.log(`Processing datasheet for ${item.id}...`);
  const htmlContent = buildHtmlForItem(item);
  const tempHtmlPath = path.resolve(`scripts/${item.id.replace(/\s+/g, '_')}_datasheet.html`);

  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');
  console.log(`Temporary HTML written to: ${tempHtmlPath}`);

  const cmd = `node "${path.resolve('scripts/html_to_pdf.js')}" "${tempHtmlPath}" "${item.pdfPath}"`;
  console.log(`Rendering PDF via: ${cmd}`);
  cp.execSync(cmd, { stdio: 'inherit' });

  if (fs.existsSync(item.pdfPath) && fs.statSync(item.pdfPath).size > 0) {
    console.log(`Datasheet PDF successfully created: ${item.pdfPath} (${fs.statSync(item.pdfPath).size} bytes)`);
    fs.unlinkSync(tempHtmlPath);
    console.log(`Cleaned up temporary HTML file.`);
  } else {
    console.error(`Failed to generate PDF for ${item.id}`);
    process.exit(1);
  }
}

console.log('\nAll 4 ILME datasheets successfully generated!');
