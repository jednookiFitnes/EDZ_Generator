const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { generateDatasheetHTML } = require('./generate_batch3_datasheets');

const articles = [
  // 1. WIE.81.000.1110.1 - wipos PSU1 24-10 P
  {
    partNr: 'WIE.81.000.1110.1',
    orderNr: '81.000.1110.1',
    typeNr: 'WIPOS PSU1 24-10 P',
    imgPath: 'EDZ/WIE/WIE.81.000.1110.1/81.000.1110.1.png',
    pdfPath: 'EDZ/WIE/WIE.81.000.1110.1/81.000.1110.1_datasheet.pdf',

    title_pl: 'Karta katalogowa / DTR: Zasilacz impulsowy 24V / 10A (240W)',
    subtitle_pl: 'wipos PSU1 24-10 P, 1-fazowy zasilacz na szynę DIN, Push-In, styk DC OK',
    desc_pl: 'Kompaktowy, wysoce efektywny 1-fazowy zasilacz impulsowy serii wipos PSU1 przeznaczony do montażu na szynie DIN (TS 35). Wyposażony w szybkie bezśrubowe zaciski sprężynowe typu Push-In, układ aktywnej korekcji współczynnika mocy (PFC) oraz funkcję Power Boost (do 130% mocy znamionowej przez 10 s). Zapewnia stabilizowane napięcie wyjściowe 24 V DC (regulowane potencjometrem w zakresie 22.5 – 29 V DC), wysoką sprawność 94.4% oraz bezpotencjałowy styk przekaźnikowy sygnalizacji stanu DC OK.',
    params_pl: [
      ['Producent / Seria', 'Wieland Electric GmbH / wipos PSU1'],
      ['Napięcie wejściowe AC', '90 – 264 V AC (znamionowe 100 – 240 V AC), 47 – 63 Hz'],
      ['Napięcie wejściowe DC', '93 – 300 V DC'],
      ['Napięcie wyjściowe znamionowe', '24 V DC (stabilizowane, regulowane 22.5 – 29 V DC)'],
      ['Znamionowy prąd wyjściowy', '10.0 A (moc ciągła: 240 W)'],
      ['Funkcja rezerwy mocy (Power Boost)', '312 W (130% prądu znamionowego przez 10 s)'],
      ['Sprawność energetyczna / Tętnienia', '94.4 % / niski poziom szumów i tętnień'],
      ['Korekcja współczynnika mocy (PFC)', 'Aktywny filtr PFC (Power Factor Correction)'],
      ['Sygnalizacja stanu pracy', 'Dioda LED DC OK (zielona) + bezpotencjałowy styk przekaźnika (NO: 13, 14)'],
    ],
    mech_pl: [
      ['Technologia przyłącza przewodów', 'Push-In (szybkozłącza sprężynowe bezśrubowe)'],
      ['Przekrój przewodów przyłączeniowych', '0.2 – 2.5 mm² (drut / linka z tulejką)'],
      ['Sposób montażu', 'Szyna DIN TS 35 (EN 60715) w szafie sterowniczej'],
      ['Chłodzenie', 'Konwekcja swobodna (naturalne chłodzenie powietrzem)'],
      ['Materiał obudowy', 'Odlew / profil aluminiowy, wysoka odporność termiczna i EMC'],
      ['Stopień ochrony obudowy', 'IP20 (zgodnie z IEC/EN 60529)'],
      ['Temperatura pracy otoczenia', '-25 °C do +70 °C (derating powyżej 60 °C)'],
      ['Temperatura składowania', '-40 °C do +85 °C'],
    ],
    dim_pl: [
      ['Wymiary gabarytowe (Szer. × Wys. × Głęb.)', '44 mm × 125 mm × 127 mm'],
      ['Masa netto artykułu', '0.615 kg (615 g) / masa transportowa brutto: 0.730 kg'],
      ['Kod EAN / GTIN', '4049088715167'],
      ['Klasyfikacja ETIM / eClass', 'ETIM 8.0/9.0: EC002540 / eClass 11: 27040701'],
      ['Normy i certyfikaty bezpieczeństwa', 'CE, cULus (UL 508), RoHS, REACH, IEC/EN 61010-1, IEC/EN 61204-3'],
    ],

    title_en: 'Technical Datasheet: Switch-Mode Power Supply 24V / 10A (240W)',
    subtitle_en: 'wipos PSU1 24-10 P, 1-phase DIN rail power supply, Push-In, DC OK contact',
    desc_en: 'Compact, high-efficiency single-phase primary switched-mode power supply unit of the wipos PSU1 series designed for DIN rail mounting (TS 35). Features toolless vibration-proof Push-In spring connection terminals, active Power Factor Correction (PFC), and Power Boost capability (up to 130% rated power for 10 s). Provides stabilized 24 V DC output (adjustable from 22.5 to 29 V DC), an outstanding 94.4% energy efficiency, and an integrated dry relay contact for DC OK status monitoring.',
    params_en: [
      ['Manufacturer / Series', 'Wieland Electric GmbH / wipos PSU1'],
      ['Input Voltage AC', '90 – 264 V AC (nominal 100 – 240 V AC), 47 – 63 Hz'],
      ['Input Voltage DC', '93 – 300 V DC'],
      ['Output Voltage Nominal', '24 V DC (stabilized, adjustable range: 22.5 – 29 V DC)'],
      ['Rated Output Current', '10.0 A (continuous power: 240 W)'],
      ['Power Boost Capability', '312 W (130% rated load for 10 seconds)'],
      ['Efficiency / Residual Ripple', '94.4 % / low ripple and noise'],
      ['Power Factor Correction (PFC)', 'Active PFC filter integrated'],
      ['Status Indication & Monitoring', 'Green DC OK LED + volt-free relay contact (NO: 13, 14)'],
    ],
    mech_en: [
      ['Connection Technology', 'Push-In spring-cage connection (toolless)'],
      ['Conductor Cross-Section', '0.2 – 2.5 mm² (solid / stranded with ferrule)'],
      ['Mounting Type', 'DIN rail TS 35 (EN 60715) horizontal mounting'],
      ['Cooling Method', 'Natural free air convection'],
      ['Housing Material', 'Robust aluminum housing with high thermal conductivity'],
      ['Degree of Protection', 'IP20 (compliant with IEC/EN 60529)'],
      ['Operating Temperature Range', '-25 °C to +70 °C (derating above 60 °C)'],
      ['Storage Temperature Range', '-40 °C to +85 °C'],
    ],
    dim_en: [
      ['Dimensions (W × H × D)', '44 mm × 125 mm × 127 mm'],
      ['Net Weight', '0.615 kg (615 g) / packaged gross weight: 0.730 kg'],
      ['EAN / GTIN Code', '4049088715167'],
      ['ETIM / eClass Classification', 'ETIM 8.0/9.0: EC002540 / eClass 11: 27040701'],
      ['Standards & Approvals', 'CE, cULus (UL 508), RoHS, REACH, IEC/EN 61010-1, IEC/EN 61204-3'],
    ],

    title_de: 'Technisches Datenblatt: Schaltnetzteil 24V / 10A (240W)',
    subtitle_de: 'wipos PSU1 24-10 P, 1-phasige Stromversorgung für Tragschiene, Push-In, DC-OK',
    desc_de: 'Kompaktes, hocheffizientes 1-phasiges primär getaktetes Schaltnetzteil der wipos PSU1 Serie für die Montage auf Tragschiene (TS 35). Ausgestattet mit werkzeugloser Push-In-Federkraftanschlusstechnik, aktiver Leistungsfaktorkorrektur (PFC) und Power-Boost-Funktion (bis zu 130 % Nennleistung für 10 s). Bietet eine geregelte 24 V DC Ausgangsspannung (einstellbar 22,5 – 29 V DC), einen Wirkungsgrad von 94,4 % und einen potentialfreien Meldekontakt zur DC-OK-Statusüberwachung.',
    params_de: [
      ['Hersteller / Serie', 'Wieland Electric GmbH / wipos PSU1'],
      ['Eingangsspannung AC', '90 – 264 V AC (Nennspannung 100 – 240 V AC), 47 – 63 Hz'],
      ['Eingangsspannung DC', '93 – 300 V DC'],
      ['Ausgangsspannung Nennwert', '24 V DC (stabilisiert, einstellbar 22,5 – 29 V DC)'],
      ['Ausgangsnennstrom', '10,0 A (Dauerleistung: 240 W)'],
      ['Power-Boost Leistungsreserve', '312 W (130 % Nennstrom für 10 Sekunden)'],
      ['Wirkungsgrad / Restwelligkeit', '94,4 % / minimale Restwelligkeit'],
      ['Leistungsfaktorkorrektur (PFC)', 'Aktiver PFC-Filter integriert'],
      ['Statusanzeige und Überwachung', 'Grüne DC-OK LED + potentialfreier Relaiskontakt (Schließer: 13, 14)'],
    ],
    mech_de: [
      ['Anschlusstechnik', 'Push-In Federkraftklemmen (werkzeuglos)'],
      ['Leiterquerschnitt', '0,2 – 2,5 mm² (starr / feindrähtig mit Aderendhülse)'],
      ['Montageart', 'Tragschiene TS 35 (EN 60715) im Schaltschrank'],
      ['Kühlung', 'Freie Konvektion (natürliche Luftzirkulation)'],
      ['Gehäusewerkstoff', 'Aluminium-Strangpressprofil mit hoher Wärmeableitung'],
      ['Schutzart', 'IP20 (gemäß IEC/EN 60529)'],
      ['Betriebstemperaturbereich', '-25 °C bis +70 °C (Derating ab 60 °C)'],
      ['Lagertemperaturbereich', '-40 °C bis +85 °C'],
    ],
    dim_de: [
      ['Abmessungen (B × H × T)', '44 mm × 125 mm × 127 mm'],
      ['Nettogewicht', '0,615 kg (615 g) / Bruttogewicht inkl. Verpackung: 0,730 kg'],
      ['EAN / GTIN-Nummer', '4049088715167'],
      ['ETIM / eClass Klassifizierung', 'ETIM 8.0/9.0: EC002540 / eClass 11: 27040701'],
      ['Normen und Zulassungen', 'CE, cULus (UL 508), RoHS, REACH, IEC/EN 61010-1, IEC/EN 61204-3'],
    ],
  },

  // 2. WIE.81.000.1120.1 - wipos PSU1 24-20 P
  {
    partNr: 'WIE.81.000.1120.1',
    orderNr: '81.000.1120.1',
    typeNr: 'WIPOS PSU1 24-20 P',
    imgPath: 'EDZ/WIE/WIE.81.000.1120.1/81.000.1120.1.png',
    pdfPath: 'EDZ/WIE/WIE.81.000.1120.1/81.000.1120.1_datasheet.pdf',

    title_pl: 'Karta katalogowa / DTR: Zasilacz impulsowy 24V / 20A (480W)',
    subtitle_pl: 'wipos PSU1 24-20 P, 1-fazowy zasilacz na szynę DIN, Push-In, styk DC OK',
    desc_pl: 'Wysokowydajny 1-fazowy zasilacz impulsowy serii wipos PSU1 o mocy ciągłej 480 W montowany na szynę DIN (TS 35). Charakteryzuje się bardzo wąską obudową (zaledwie 60 mm szerokości), technologią szybkiego montażu przewodów Push-In, aktywnym filtrem PFC oraz funkcją Power Boost (do 552 W przez 200 s). Zapewnia stabilizowane napięcie 24 V DC (regulowane 22.5 – 29 V DC), znakomitą sprawność energetyczną 95.1% oraz przekaźnikowy styk sygnalizacji stanu DC OK.',
    params_pl: [
      ['Producent / Seria', 'Wieland Electric GmbH / wipos PSU1'],
      ['Napięcie wejściowe AC', '90 – 264 V AC (znamionowe 100 – 240 V AC), 47 – 63 Hz'],
      ['Napięcie wejściowe DC', '93 – 300 V DC'],
      ['Napięcie wyjściowe znamionowe', '24 V DC (stabilizowane, regulowane 22.5 – 29 V DC)'],
      ['Znamionowy prąd wyjściowy', '20.0 A (moc ciągła: 480 W)'],
      ['Funkcja rezerwy mocy (Power Boost)', '552 W (115% obciążenia ciągłego przez 200 s)'],
      ['Sprawność energetyczna / Tętnienia', '95.1 % / bardzo niskie straty cieplne'],
      ['Korekcja współczynnika mocy (PFC)', 'Aktywny filtr PFC (Power Factor Correction)'],
      ['Sygnalizacja stanu pracy', 'Dioda LED DC OK (zielona) + bezpotencjałowy styk przekaźnika (NO: 13, 14)'],
    ],
    mech_pl: [
      ['Technologia przyłącza przewodów', 'Push-In (szybkozłącza sprężynowe bezśrubowe)'],
      ['Przekrój przewodów przyłączeniowych', '0.2 – 2.5 mm² (drut / linka z tulejką)'],
      ['Sposób montażu', 'Szyna DIN TS 35 (EN 60715) w szafie sterowniczej'],
      ['Chłodzenie', 'Konwekcja swobodna (naturalne chłodzenie powietrzem)'],
      ['Materiał obudowy', 'Odlew / profil aluminiowy, wysoka odporność termiczna i EMC'],
      ['Stopień ochrony obudowy', 'IP20 (zgodnie z IEC/EN 60529)'],
      ['Temperatura pracy otoczenia', '-25 °C do +70 °C (derating powyżej 60 °C)'],
      ['Temperatura składowania', '-40 °C do +85 °C'],
    ],
    dim_pl: [
      ['Wymiary gabarytowe (Szer. × Wys. × Głęb.)', '60 mm × 125 mm × 129 mm'],
      ['Masa netto artykułu', '0.900 kg (900 g) / masa transportowa brutto: 1.030 kg'],
      ['Kod EAN / GTIN', '4049088715198'],
      ['Klasyfikacja ETIM / eClass', 'ETIM 8.0/9.0: EC002540 / eClass 11: 27040701'],
      ['Normy i certyfikaty bezpieczeństwa', 'CE, cULus (UL 508), RoHS, REACH, IEC/EN 61010-1, IEC/EN 61204-3'],
    ],

    title_en: 'Technical Datasheet: Switch-Mode Power Supply 24V / 20A (480W)',
    subtitle_en: 'wipos PSU1 24-20 P, 1-phase DIN rail power supply, Push-In, DC OK contact',
    desc_en: 'High-performance single-phase primary switched-mode power supply unit of the wipos PSU1 series with 480 W continuous power output for DIN rail mounting (TS 35). Features a slim 60 mm aluminum enclosure, toolless Push-In connection terminals, active Power Factor Correction (PFC), and Power Boost capability (up to 552 W for 200 s). Delivers stabilized 24 V DC (adjustable 22.5 to 29 V DC), an outstanding 95.1% energy efficiency, and a dry relay contact for DC OK status signaling.',
    params_en: [
      ['Manufacturer / Series', 'Wieland Electric GmbH / wipos PSU1'],
      ['Input Voltage AC', '90 – 264 V AC (nominal 100 – 240 V AC), 47 – 63 Hz'],
      ['Input Voltage DC', '93 – 300 V DC'],
      ['Output Voltage Nominal', '24 V DC (stabilized, adjustable range: 22.5 – 29 V DC)'],
      ['Rated Output Current', '20.0 A (continuous power: 480 W)'],
      ['Power Boost Capability', '552 W (115% rated load for 200 seconds)'],
      ['Efficiency / Residual Ripple', '95.1 % / ultra-low heat dissipation'],
      ['Power Factor Correction (PFC)', 'Active PFC filter integrated'],
      ['Status Indication & Monitoring', 'Green DC OK LED + volt-free relay contact (NO: 13, 14)'],
    ],
    mech_en: [
      ['Connection Technology', 'Push-In spring-cage connection (toolless)'],
      ['Conductor Cross-Section', '0.2 – 2.5 mm² (solid / stranded with ferrule)'],
      ['Mounting Type', 'DIN rail TS 35 (EN 60715) horizontal mounting'],
      ['Cooling Method', 'Natural free air convection'],
      ['Housing Material', 'Robust aluminum housing with high thermal conductivity'],
      ['Degree of Protection', 'IP20 (compliant with IEC/EN 60529)'],
      ['Operating Temperature Range', '-25 °C to +70 °C (derating above 60 °C)'],
      ['Storage Temperature Range', '-40 °C to +85 °C'],
    ],
    dim_en: [
      ['Dimensions (W × H × D)', '60 mm × 125 mm × 129 mm'],
      ['Net Weight', '0.900 kg (900 g) / packaged gross weight: 1.030 kg'],
      ['EAN / GTIN Code', '4049088715198'],
      ['ETIM / eClass Classification', 'ETIM 8.0/9.0: EC002540 / eClass 11: 27040701'],
      ['Standards & Approvals', 'CE, cULus (UL 508), RoHS, REACH, IEC/EN 61010-1, IEC/EN 61204-3'],
    ],

    title_de: 'Technisches Datenblatt: Schaltnetzteil 24V / 20A (480W)',
    subtitle_de: 'wipos PSU1 24-20 P, 1-phasige Stromversorgung für Tragschiene, Push-In, DC-OK',
    desc_de: 'Hochleistungsfähiges 1-phasiges primär getaktetes Schaltnetzteil der wipos PSU1 Serie mit 480 W Dauerleistung für die Montage auf Tragschiene (TS 35). Zeichnet sich durch eine schmale Bauform (nur 60 mm Breite), Push-In-Federkraftanschlusstechnik, aktive Leistungsfaktorkorrektur (PFC) und Power-Boost (bis zu 552 W für 200 s) aus. Bietet eine geregelte 24 V DC Ausgangsspannung (einstellbar 22,5 – 29 V DC), einen Spitzenwirkungsgrad von 95,1 % sowie einen potentialfreien Relaiskontakt zur DC-OK-Überwachung.',
    params_de: [
      ['Hersteller / Serie', 'Wieland Electric GmbH / wipos PSU1'],
      ['Eingangsspannung AC', '90 – 264 V AC (Nennspannung 100 – 240 V AC), 47 – 63 Hz'],
      ['Eingangsspannung DC', '93 – 300 V DC'],
      ['Ausgangsspannung Nennwert', '24 V DC (stabilisiert, einstellbar 22,5 – 29 V DC)'],
      ['Ausgangsnennstrom', '20,0 A (Dauerleistung: 480 W)'],
      ['Power-Boost Leistungsreserve', '552 W (115 % Nennlast für 200 Sekunden)'],
      ['Wirkungsgrad / Restwelligkeit', '95,1 % / extrem geringe Verlustwärme'],
      ['Leistungsfaktorkorrektur (PFC)', 'Aktiver PFC-Filter integriert'],
      ['Statusanzeige und Überwachung', 'Grüne DC-OK LED + potentialfreier Relaiskontakt (Schließer: 13, 14)'],
    ],
    mech_de: [
      ['Anschlusstechnik', 'Push-In Federkraftklemmen (werkzeuglos)'],
      ['Leiterquerschnitt', '0,2 – 2,5 mm² (starr / feindrähtig mit Aderendhülse)'],
      ['Montageart', 'Tragschiene TS 35 (EN 60715) im Schaltschrank'],
      ['Kühlung', 'Freie Konvektion (natürliche Luftzirkulation)'],
      ['Gehäusewerkstoff', 'Aluminium-Strangpressprofil mit hoher Wärmeableitung'],
      ['Schutzart', 'IP20 (gemäß IEC/EN 60529)'],
      ['Betriebstemperaturbereich', '-25 °C bis +70 °C (Derating ab 60 °C)'],
      ['Lagertemperaturbereich', '-40 °C bis +85 °C'],
    ],
    dim_de: [
      ['Abmessungen (B × H × T)', '60 mm × 125 mm × 129 mm'],
      ['Nettogewicht', '0,900 kg (900 g) / Bruttogewicht inkl. Verpackung: 1,030 kg'],
      ['EAN / GTIN-Nummer', '4049088715198'],
      ['ETIM / eClass Klassifizierung', 'ETIM 8.0/9.0: EC002540 / eClass 11: 27040701'],
      ['Normen und Zulassungen', 'CE, cULus (UL 508), RoHS, REACH, IEC/EN 61010-1, IEC/EN 61204-3'],
    ],
  },

  // 3. WIE.PL.040.1281.0 - wienet UMS 8-C SLIM
  {
    partNr: 'WIE.PL.040.1281.0',
    orderNr: 'PL.040.1281.0',
    typeNr: 'WIENET IP SWITCH UMS 8-C SLIM',
    imgPath: 'EDZ/WIE/WIE.PL.040.1281.0/PL.040.1281.0.png',
    pdfPath: 'EDZ/WIE/WIE.PL.040.1281.0/PL.040.1281.0_datasheet.pdf',

    title_pl: 'Karta katalogowa / DTR: Switch przemysłowy 8x RJ45 Fast Ethernet',
    subtitle_pl: 'wienet UMS 8-C SLIM, niezarządzalny switch Ethernet, 12-48V DC, szyna DIN',
    desc_pl: 'Przemysłowy, niezarządzalny przełącznik sieciowy Ethernet (switch) serii wienet UMS 8-C SLIM dedykowany do montażu na szynie DIN w szafach automatyki. Charakteryzuje się wyjątkowo smukłą obudową metalową (szerokość zaledwie 30 mm), 8 ekranowanymi portami RJ45 10/100 Mbps (Auto-Negotiation, Auto-MDI/MDI-X) oraz redundantnym wejściem zasilania 12 – 48 V DC. Zapewnia wysoką odporność na zakłócenia elektromagnetyczne (EMC) oraz bezawaryjną pracę w trudnych warunkach przemysłowych.',
    params_pl: [
      ['Producent / Seria', 'Wieland Electric GmbH / wienet UMS'],
      ['Liczba i typ portów sieciowych', '8 × RJ45 (ekranowane), 10/100 Mbit/s (Fast Ethernet)'],
      ['Standardy sieciowe IEEE', 'IEEE 802.3 10Base-T, IEEE 802.3u 100Base-TX, IEEE 802.3x Flow Control'],
      ['Automatyczna detekcja portu', 'Auto-Negotiation (szybkość / duplex), Auto-MDI/MDI-X'],
      ['Napięcie zasilania', '12 – 48 V DC (redundantne podwójne wejście zasilania PWR1 / PWR2)'],
      ['Pobór mocy', 'Maks. < 4.7 W (typ. 2.5 W)'],
      ['Wskaźniki stanu LED', 'Zasilanie (PWR1, PWR2), Alarm zasilania (P-Fail), Link/Act dla każdego portu'],
      ['Zabezpieczenie przed odwrotną polaryzacją', 'Zintegrowane zabezpieczenie elektroniczne'],
    ],
    mech_pl: [
      ['Złącze zasilania i alarmu', 'Odłączalna listwa śrubowa 6-pinowa (0.25 – 2.5 mm² / AWG 26–12)'],
      ['Długość odizolowania przewodu', '8 mm'],
      ['Sposób montażu', 'Szyna DIN TS 35 (EN 60715) ze zintegrowanym klipsem metalowym'],
      ['Materiał obudowy', 'Wytrzymała obudowa metalowa (blacha stalowa / aluminium)'],
      ['Stopień ochrony obudowy', 'IP30 (odporność na wnikanie ciał stałych)'],
      ['Temperatura pracy otoczenia', '-10 °C do +60 °C'],
      ['Temperatura składowania', '-40 °C do +85 °C / wilgotność 10 – 95% RH (bez kondensacji)'],
    ],
    dim_pl: [
      ['Wymiary gabarytowe (Szer. × Wys. × Głęb.)', '30 mm × 140 mm × 95 mm (wersja wąska SLIM)'],
      ['Masa netto artykułu', '0.450 kg (450 g) / masa transportowa brutto: 0.750 kg'],
      ['Kod EAN / GTIN', '4049088600982'],
      ['Alternatywny numer katalogowy Wieland', '83.040.1281.0 (kod handlowy: PL.040.1281.0)'],
      ['Klasyfikacja ETIM / eClass', 'ETIM 8.0/9.0: EC000734 / eClass 11: 19170130'],
      ['Normy i certyfikaty kompatybilności', 'CE, cULus (UL 61010), RoHS, REACH, FCC Part 15 Class A, EN 61000-6-2/4'],
    ],

    title_en: 'Technical Datasheet: Industrial Ethernet Switch 8x RJ45 Fast Ethernet',
    subtitle_en: 'wienet UMS 8-C SLIM, unmanaged Ethernet switch, 12-48V DC, DIN rail',
    desc_en: 'Industrial unmanaged Ethernet switch of the wienet UMS 8-C SLIM series designed for space-saving DIN rail installation in control cabinets. Characterized by an ultra-slim metal housing (only 30 mm width), 8 shielded RJ45 ports 10/100 Mbps (Auto-Negotiation, Auto-MDI/MDI-X), and redundant 12 to 48 V DC power supply inputs. Offers superior electromagnetic compatibility (EMC) and robust reliable operation in harsh industrial automation environments.',
    params_en: [
      ['Manufacturer / Series', 'Wieland Electric GmbH / wienet UMS'],
      ['Ethernet Ports & Type', '8 × RJ45 (shielded), 10/100 Mbps (Fast Ethernet)'],
      ['IEEE Standards Compliance', 'IEEE 802.3 10Base-T, IEEE 802.3u 100Base-TX, IEEE 802.3x Flow Control'],
      ['Auto-Detection Features', 'Auto-Negotiation (speed / duplex), Auto-MDI/MDI-X cross-over'],
      ['Supply Voltage', '12 – 48 V DC (redundant dual power inputs PWR1 / PWR2)'],
      ['Power Consumption', 'Max. < 4.7 W (typ. 2.5 W)'],
      ['Diagnostic LEDs', 'Power (PWR1, PWR2), Power alarm (P-Fail), Link/Activity per port'],
      ['Reverse Polarity Protection', 'Built-in electronic reverse voltage protection'],
    ],
    mech_en: [
      ['Power & Alarm Connection', 'Pluggable 6-pin screw terminal block (0.25 – 2.5 mm² / AWG 26–12)'],
      ['Wire Stripping Length', '8 mm'],
      ['Mounting Method', 'DIN rail TS 35 (EN 60715) with heavy-duty metal clip'],
      ['Housing Material', 'Robust industrial metal housing (sheet steel / aluminum)'],
      ['Degree of Protection', 'IP30 (solid particle protection)'],
      ['Operating Temperature Range', '-10 °C to +60 °C'],
      ['Storage Temperature Range', '-40 °C to +85 °C / relative humidity 10 – 95% (non-condensing)'],
    ],
    dim_en: [
      ['Dimensions (W × H × D)', '30 mm × 140 mm × 95 mm (SLIM compact form factor)'],
      ['Net Weight', '0.450 kg (450 g) / packaged gross weight: 0.750 kg'],
      ['EAN / GTIN Code', '4049088600982'],
      ['Alternative Wieland Part Number', '83.040.1281.0 (ordering code: PL.040.1281.0)'],
      ['ETIM / eClass Classification', 'ETIM 8.0/9.0: EC000734 / eClass 11: 19170130'],
      ['Standards & Certifications', 'CE, cULus (UL 61010), RoHS, REACH, FCC Part 15 Class A, EN 61000-6-2/4'],
    ],

    title_de: 'Technisches Datenblatt: Industrie-Ethernet-Switch 8x RJ45 Fast Ethernet',
    subtitle_de: 'wienet UMS 8-C SLIM, unmanaged Ethernet-Switch, 12-48V DC, Tragschiene',
    desc_de: 'Industrieller unmanaged Ethernet-Switch der wienet UMS 8-C SLIM Serie für die platzsparende Tragschienenmontage in Schaltschränken. Ausgestattet mit einem ultraschmalen Metallgehäuse (nur 30 mm Breite), 8 geschirmten RJ45-Ports 10/100 Mbit/s (Auto-Negotiation, Auto-MDI/MDI-X) sowie redundanter 12 – 48 V DC Spannungsversorgung. Bietet höchste elektromagnetische Verträglichkeit (EMV) und ausfallsicheren Dauerbetrieb unter anspruchsvollen industriellen Umgebungsbedingungen.',
    params_de: [
      ['Hersteller / Serie', 'Wieland Electric GmbH / wienet UMS'],
      ['Netzwerkports & Schnittstelle', '8 × RJ45 (geschirmt), 10/100 Mbit/s (Fast Ethernet)'],
      ['IEEE-Netzwerkstandards', 'IEEE 802.3 10Base-T, IEEE 802.3u 100Base-TX, IEEE 802.3x Flow Control'],
      ['Automatische Erkennung', 'Auto-Negotiation (Geschwindigkeit / Duplex), Auto-MDI/MDI-X'],
      ['Versorgungsspannung', '12 – 48 V DC (redundante zweifache Stromeinspeisung PWR1 / PWR2)'],
      ['Leistungsaufnahme', 'Max. < 4,7 W (typisch 2,5 W)'],
      ['LED-Statusanzeigen', 'Spannungsversorgung (PWR1, PWR2), Alarm (P-Fail), Link/Act pro Port'],
      ['Verpolungsschutz', 'Integrierter elektronischer Verpolungsschutz'],
    ],
    mech_de: [
      ['Spannungs- und Alarmanschluss', 'Steckbare 6-polige Schraubklemme (0,25 – 2,5 mm² / AWG 26–12)'],
      ['Abisolierlänge', '8 mm'],
      ['Montageart', 'Tragschiene TS 35 (EN 60715) mit integriertem Metall-Rastfuß'],
      ['Gehäusewerkstoff', 'Robustes Industrie-Metallgehäuse (Stahlblech / Aluminium)'],
      ['Schutzart', 'IP30 (Fremdkörperschutz)'],
      ['Betriebstemperaturbereich', '-10 °C bis +60 °C'],
      ['Lagertemperaturbereich', '-40 °C bis +85 °C / relative Luftfeuchte 10 – 95 % (nicht kondensierend)'],
    ],
    dim_de: [
      ['Abmessungen (B × H × T)', '30 mm × 140 mm × 95 mm (SLIM-Schmalbauform)'],
      ['Nettogewicht', '0,450 kg (450 g) / Bruttogewicht inkl. Verpackung: 0,750 kg'],
      ['EAN / GTIN-Nummer', '4049088600982'],
      ['Alternative Wieland Artikelnummer', '83.040.1281.0 (Bestellbezeichnung: PL.040.1281.0)'],
      ['ETIM / eClass Klassifizierung', 'ETIM 8.0/9.0: EC000734 / eClass 11: 19170130'],
      ['Normen und Zulassungen', 'CE, cULus (UL 61010), RoHS, REACH, FCC Part 15 Class A, EN 61000-6-2/4'],
    ],
  },
];

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  
  for (const art of articles) {
    const html = generateDatasheetHTML(art);
    const tempHtmlPath = path.resolve(`scripts/${art.orderNr.replace(/\./g, '_')}_datasheet.html`);
    const absPdfPath = path.resolve(art.pdfPath);

    fs.writeFileSync(tempHtmlPath, html, 'utf8');
    console.log(`Wrote temp HTML: ${tempHtmlPath}`);

    const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${absPdfPath}" "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;
    cp.execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync(absPdfPath) && fs.statSync(absPdfPath).size > 0) {
      console.log(`Generated PDF: ${absPdfPath} (${fs.statSync(absPdfPath).size} bytes)`);
      fs.unlinkSync(tempHtmlPath);
    } else {
      console.error(`Failed generating PDF for ${art.partNr}`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
