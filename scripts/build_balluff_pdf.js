const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { generateDatasheetHTML } = require('./generate_batch3_datasheets');

const articles = [
  // 1. BAL.BCC06U4
  {
    partNr: 'BAL.BCC06U4',
    orderNr: 'BCC06U4',
    typeNr: 'BCC M425-0000-1A-008-PX0434-150',
    imgPath: 'EDZ/261118/BAL.BCC06U4/BCC06U4.png',
    pdfPath: 'EDZ/261118/BAL.BCC06U4/BCC06U4_datasheet.pdf',

    title_pl: 'Karta katalogowa / DTR: Przewód czujnikowy M12 15m',
    subtitle_pl: 'Przewód ze złączem M12x1 kątowy żeński 5-pin, 3x LED PNP, PUR 4x0.34 mm², 15 m',
    desc_pl: 'Przemysłowy kabel przyłączeniowy czujnikowy ze złączem kątowym M12x1 żeńskim (A-kodowanym) oraz wolnym końcem. Wyposażony w 3 wbudowane diody LED sygnalizujące zasilanie oraz stan załączenia wyjść PNP (NO/NC). Przewód wykonany z wysoce elastycznego poliuretanu (PUR), odporny na oleje, chłodziwa oraz przystosowany do pracy w prowadnikach kablowych (przeciąganie, do 5 mln cykli zginania).',
    params_pl: [
      ['Producent / Seria', 'Balluff GmbH / BCC'],
      ['Typ złącza', 'M12x1 gniazdo kątowe (żeńskie), 5-biegunowe, kodowanie A'],
      ['Wskaźniki stanu LED', 'Zielona LED: zasilanie (Power), 2x Żółte LED: stan wyjść NO/NC (PNP)'],
      ['Napięcie robocze Ub', '10 – 30 V DC'],
      ['Prąd znamionowy (przy 40 °C)', '4.0 A'],
      ['Konfiguracja styków', 'Pin 1: BN (+), Pin 2: WH (NC), Pin 3: BU (-), Pin 4: BK (NO)'],
      ['Stopień ochrony obudowy', 'IP67 / IP68 / IP69K (w stanie zablokowanym)'],
      ['Zakres temperatur pracy', '-50 °C do +90 °C (ułożenie stałe) / -25 °C do +90 °C (ruchome)'],
    ],
    mech_pl: [
      ['Długość przewodu', '15.0 m'],
      ['Liczba i przekrój żył', '4 × 0.34 mm² (22 AWG)'],
      ['Średnica zewnętrzna kabla D', '4.7 ±0.20 mm'],
      ['Materiał płaszcza kabla', 'Poliuretan (PUR), bezhalogenowy, kolor czarny'],
      ['Promień gięcia przewodu', '≥ 5 × D (ułożenie stałe) / ≥ 10 × D (ruchome)'],
      ['Zastosowanie w łańcuchach', 'Tak, przystosowany do prowadników kablowych (≥ 5 mln cykli)'],
      ['Materiał nakrętki / korpusu złącza', 'Cynkowy odlew ciśnieniowy niklowany / TPU transparentny'],
      ['Materiał styków / powłoka', 'Brąz CuZn / złocenie galwaniczne'],
    ],
    dim_pl: [
      ['Wymiary główki złącza M12', 'Szerokość: 26.5 mm, Wysokość: 38.3 mm, Głębokość: 15.5 mm'],
      ['Całkowita długość z kablem', '15000 mm (15.0 m)'],
      ['Masa całkowita artykułu', '0.456 kg (456 g)'],
      ['Moment dokręcania nakrętki M12', '0.6 Nm'],
      ['Zgodność z normami i atesty', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],

    title_en: 'Technical Datasheet: Sensor Cordset M12 15m',
    subtitle_en: 'Single-ended cordset M12 angled female 5-pin, 3x LED PNP, PUR 4x0.34 mm², 15 m',
    desc_en: 'Industrial sensor single-ended cordset with an angled female M12x1 connector (A-coded) and bare flying leads. Features 3 integrated LEDs displaying operating voltage and PNP switching status (NO/NC antivalent). Made of highly flexible halogen-free PUR cable jacket, resistant to oils, chemicals, and welding sparks, optimized for drag chain applications (tested for up to 5 million bending cycles).',
    params_en: [
      ['Manufacturer / Series', 'Balluff GmbH / BCC'],
      ['Connector Type', 'M12x1 angled socket (female), 5-pin, A-coded'],
      ['LED Function Indicators', 'Green LED: Operating voltage, 2x Yellow LEDs: Switching status NO/NC (PNP)'],
      ['Operating Voltage Ub', '10 – 30 V DC'],
      ['Rated Current (at 40 °C)', '4.0 A'],
      ['Pinout Configuration', 'Pin 1: BN (+), Pin 2: WH (NC), Pin 3: BU (-), Pin 4: BK (NO)'],
      ['Degree of Protection', 'IP67 / IP68 / IP69K (when mated and locked)'],
      ['Operating Temperature Range', '-50 °C to +90 °C (fixed) / -25 °C to +90 °C (flexible)'],
    ],
    mech_en: [
      ['Cable Length', '15.0 m'],
      ['Conductor Count & Cross-Section', '4 × 0.34 mm² (22 AWG)'],
      ['Cable Diameter D', '4.7 ±0.20 mm'],
      ['Cable Jacket Material', 'Polyurethane (PUR), halogen-free, black'],
      ['Bending Radius', '≥ 5 × D (fixed installation) / ≥ 10 × D (flexible drag chain)'],
      ['Drag Chain Suitable', 'Yes, drag chain compatible (≥ 5 million cycles)'],
      ['Nut & Housing Material', 'Die-cast zinc nickel-plated / transparent TPU'],
      ['Contact Material & Plating', 'Brass CuZn / gold-plated'],
    ],
    dim_en: [
      ['M12 Connector Head Dimensions', 'Width: 26.5 mm, Height: 38.3 mm, Depth: 15.5 mm'],
      ['Overall Length with Cable', '15000 mm (15.0 m)'],
      ['Total Weight', '0.456 kg (456 g)'],
      ['Recommended Tightening Torque', '0.6 Nm (M12 coupling nut)'],
      ['Approvals & Compliance', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],

    title_de: 'Technisches Datenblatt: Sensorleitung M12 15m',
    subtitle_de: 'Anschlussleitung M12 gewinkelt Buchse 5-polig, 3x LED PNP, PUR 4x0,34 mm², 15 m',
    desc_de: 'Industrielle einseitig konfektionierte Sensorleitung mit gewinkelter M12x1-Buchse (A-codiert) und offenem Leitungsende. Ausgestattet mit 3 integrierten LEDs zur Signalisierung der Betriebsspannung sowie der PNP-Schaltzustände (Schließer/Öffner antivalent). Hochflexible, halogenfreie PUR-Leitung, beständig gegen Öle, Kühlschmierstoffe und Schweißfunken, optimal geeignet für Schleppkettenbetrieb (geprüft für bis zu 5 Mio. Biegezyklen).',
    params_de: [
      ['Hersteller / Serie', 'Balluff GmbH / BCC'],
      ['Steckverbindertyp', 'M12x1 Buchse gewinkelt, 5-polig, A-codiert'],
      ['LED-Funktionsanzeigen', 'Grüne LED: Betriebsspannung, 2x Gelbe LEDs: Schaltzustand NO/NC (PNP)'],
      ['Betriebsspannung Ub', '10 – 30 V DC'],
      ['Bemessungsstrom (bei 40 °C)', '4,0 A'],
      ['Anschlussbelegung', 'Pin 1: BN (+), Pin 2: WH (Öffner), Pin 3: BU (-), Pin 4: BK (Schließer)'],
      ['Schutzart', 'IP67 / IP68 / IP69K (im verschraubten Zustand)'],
      ['Temperaturbereich', '-50 °C bis +90 °C (fest) / -25 °C bis +90 °C (bewegt)'],
    ],
    mech_de: [
      ['Kabellänge', '15,0 m'],
      ['Aderanzahl & Querschnitt', '4 × 0,34 mm² (22 AWG)'],
      ['Kabeldurchmesser D', '4,7 ±0,20 mm'],
      ['Kabelmantelmaterial', 'Polyurethan (PUR), halogenfrei, schwarz'],
      ['Biegeradius', '≥ 5 × D (feste Verlegung) / ≥ 10 × D (Schleppkette)'],
      ['Schleppkettentauglich', 'Ja, schleppkettentauglich (≥ 5 Millionen Zyklen)'],
      ['Überwurfmutter & Gehäuse', 'Zinkdruckguss vernickelt / TPU transparent'],
      ['Kontaktmaterial & Oberfläche', 'Kupferlegierung CuZn / vergoldet'],
    ],
    dim_de: [
      ['Abmessungen M12 Steckerkopf', 'Breite: 26,5 mm, Höhe: 38,3 mm, Tiefe: 15,5 mm'],
      ['Gesamtlänge mit Kabel', '15000 mm (15,0 m)'],
      ['Gesamtgewicht', '0,456 kg (456 g)'],
      ['Empfohlenes Anzugsdrehmoment', '0,6 Nm (M12 Überwurfmutter)'],
      ['Zulassungen und Konformität', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],
  },

  // 2. BAL.BCC083H
  {
    partNr: 'BAL.BCC083H',
    orderNr: 'BCC083H',
    typeNr: 'BCC M425-0000-1A-017-VX8534-150',
    imgPath: 'EDZ/261118/BAL.BCC083H/BCC083H.png',
    pdfPath: 'EDZ/261118/BAL.BCC083H/BCC083H_datasheet.pdf',

    title_pl: 'Karta katalogowa / DTR: Przewód czujnikowy M12 5x0.34 15m',
    subtitle_pl: 'Przewód ze złączem M12x1 kątowy żeński 5-pin, PVC szary 5x0.34 mm², 15 m',
    desc_pl: 'Przemysłowy kabel przyłączeniowy czujnikowy ze złączem kątowym M12x1 żeńskim (5-pinowym, kodowanie A) oraz wolnym końcem. Konstrukcja 5-żyłowa o przekroju 0.34 mm² w odpornym płaszczu PVC w kolorze szarym. Przeznaczony do zasilania i transmisji sygnałów czujników oraz elementów wykonawczych w automatyce przemysłowej, maszynach i liniach montażowych.',
    params_pl: [
      ['Producent / Seria', 'Balluff GmbH / BCC'],
      ['Typ złącza', 'M12x1 gniazdo kątowe (żeńskie), 5-biegunowe, kodowanie A'],
      ['Napięcie robocze Ub', '60 V AC / 60 V DC'],
      ['Prąd znamionowy (przy 40 °C)', '4.0 A'],
      ['Konfiguracja styków', 'Pin 1: BN, Pin 2: WH, Pin 3: BU, Pin 4: BK, Pin 5: GY'],
      ['Stopień ochrony obudowy', 'IP67 / IP68 / IP69K (w stanie zablokowanym)'],
      ['Zakres temperatur pracy', '-40 °C do +105 °C (ułożenie stałe) / -5 °C do +105 °C (ruchome)'],
    ],
    mech_pl: [
      ['Długość przewodu', '15.0 m'],
      ['Liczba i przekrój żył', '5 × 0.34 mm² (22 AWG)'],
      ['Średnica zewnętrzna kabla D', '5.0 ±0.20 mm'],
      ['Materiał płaszcza kabla', 'Polichlorek winylu (PVC), kolor szary'],
      ['Promień gięcia przewodu', '≥ 5 × D (ułożenie stałe) / ≥ 10 × D (ruchome)'],
      ['Zastosowanie w łańcuchach', 'Tak, przystosowany do prowadników kablowych (do 2 mln cykli)'],
      ['Materiał nakrętki / korpusu złącza', 'Cynkowy odlew ciśnieniowy niklowany / TPU czarny'],
      ['Materiał styków / powłoka', 'Brąz CuZn / złocenie galwaniczne'],
    ],
    dim_pl: [
      ['Wymiary główki złącza M12', 'Szerokość: 26.5 mm, Wysokość: 38.3 mm, Głębokość: 15.5 mm'],
      ['Całkowita długość z kablem', '15000 mm (15.0 m)'],
      ['Masa całkowita artykułu', '0.610 kg (610 g)'],
      ['Moment dokręcania nakrętki M12', '0.6 Nm'],
      ['Zgodność z normami i atesty', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],

    title_en: 'Technical Datasheet: Sensor Cordset M12 5x0.34 15m',
    subtitle_en: 'Single-ended cordset M12 angled female 5-pin, PVC gray 5x0.34 mm², 15 m',
    desc_en: 'Industrial sensor single-ended cordset with an angled female M12x1 connector (5-pin, A-coded) and bare flying leads. 5-conductor configuration with 0.34 mm² wire cross-section in a durable gray PVC jacket. Designed for signal transmission and power supply in automated systems, industrial machines and robotics.',
    params_en: [
      ['Manufacturer / Series', 'Balluff GmbH / BCC'],
      ['Connector Type', 'M12x1 angled socket (female), 5-pin, A-coded'],
      ['Operating Voltage Ub', '60 V AC / 60 V DC'],
      ['Rated Current (at 40 °C)', '4.0 A'],
      ['Pinout Configuration', 'Pin 1: BN, Pin 2: WH, Pin 3: BU, Pin 4: BK, Pin 5: GY'],
      ['Degree of Protection', 'IP67 / IP68 / IP69K (when mated and locked)'],
      ['Operating Temperature Range', '-40 °C to +105 °C (fixed) / -5 °C to +105 °C (flexible)'],
    ],
    mech_en: [
      ['Cable Length', '15.0 m'],
      ['Conductor Count & Cross-Section', '5 × 0.34 mm² (22 AWG)'],
      ['Cable Diameter D', '5.0 ±0.20 mm'],
      ['Cable Jacket Material', 'Polyvinyl chloride (PVC), gray'],
      ['Bending Radius', '≥ 5 × D (fixed installation) / ≥ 10 × D (flexible drag chain)'],
      ['Drag Chain Suitable', 'Yes, drag chain compatible (up to 2 million cycles)'],
      ['Nut & Housing Material', 'Die-cast zinc nickel-plated / black TPU'],
      ['Contact Material & Plating', 'Brass CuZn / gold-plated'],
    ],
    dim_en: [
      ['M12 Connector Head Dimensions', 'Width: 26.5 mm, Height: 38.3 mm, Depth: 15.5 mm'],
      ['Overall Length with Cable', '15000 mm (15.0 m)'],
      ['Total Weight', '0.610 kg (610 g)'],
      ['Recommended Tightening Torque', '0.6 Nm (M12 coupling nut)'],
      ['Approvals & Compliance', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],

    title_de: 'Technisches Datenblatt: Sensorleitung M12 5x0,34 15m',
    subtitle_de: 'Anschlussleitung M12 gewinkelt Buchse 5-polig, PVC grau 5x0,34 mm², 15 m',
    desc_de: 'Industrielle einseitig konfektionierte Sensorleitung mit gewinkelter M12x1-Buchse (5-polig, A-codiert) und offenem Leitungsende. 5-adriger Aufbau mit 0,34 mm² Leiterquerschnitt im robusten grauen PVC-Mantel. Entwickelt für die Signalübertragung und Energieversorgung von Sensoren und Aktoren in der industriellen Automatisierung.',
    params_de: [
      ['Hersteller / Serie', 'Balluff GmbH / BCC'],
      ['Steckverbindertyp', 'M12x1 Buchse gewinkelt, 5-polig, A-codiert'],
      ['Betriebsspannung Ub', '60 V AC / 60 V DC'],
      ['Bemessungsstrom (bei 40 °C)', '4,0 A'],
      ['Anschlussbelegung', 'Pin 1: BN, Pin 2: WH, Pin 3: BU, Pin 4: BK, Pin 5: GY'],
      ['Schutzart', 'IP67 / IP68 / IP69K (im verschraubten Zustand)'],
      ['Temperaturbereich', '-40 °C bis +105 °C (fest) / -5 °C bis +105 °C (bewegt)'],
    ],
    mech_de: [
      ['Kabellänge', '15,0 m'],
      ['Aderanzahl & Querschnitt', '5 × 0,34 mm² (22 AWG)'],
      ['Kabeldurchmesser D', '5,0 ±0,20 mm'],
      ['Kabelmantelmaterial', 'Polyvinylchlorid (PVC), grau'],
      ['Biegeradius', '≥ 5 × D (feste Verlegung) / ≥ 10 × D (Schleppkette)'],
      ['Schleppkettentauglich', 'Ja, schleppkettentauglich (bis zu 2 Millionen Zyklen)'],
      ['Überwurfmutter & Gehäuse', 'Zinkdruckguss vernickelt / TPU schwarz'],
      ['Kontaktmaterial & Oberfläche', 'Kupferlegierung CuZn / vergoldet'],
    ],
    dim_de: [
      ['Abmessungen M12 Steckerkopf', 'Breite: 26,5 mm, Höhe: 38,3 mm, Tiefe: 15,5 mm'],
      ['Gesamtlänge mit Kabel', '15000 mm (15,0 m)'],
      ['Gesamtgewicht', '0,610 kg (610 g)'],
      ['Empfohlenes Anzugsdrehmoment', '0,6 Nm (M12 Überwurfmutter)'],
      ['Zulassungen und Konformität', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],
  },

  // 3. BAL.BCC0KE3
  {
    partNr: 'BAL.BCC0KE3',
    orderNr: 'BCC0KE3',
    typeNr: 'BCC M425-0000-1A-017-VX8534-250',
    imgPath: 'EDZ/261118/BAL.BCC0KE3/BCC0KE3.png',
    pdfPath: 'EDZ/261118/BAL.BCC0KE3/BCC0KE3_datasheet.pdf',

    title_pl: 'Karta katalogowa / DTR: Przewód czujnikowy M12 5x0.34 25m',
    subtitle_pl: 'Przewód ze złączem M12x1 kątowy żeński 5-pin, PVC szary 5x0.34 mm², 25 m',
    desc_pl: 'Przemysłowy kabel przyłączeniowy czujnikowy ze złączem kątowym M12x1 żeńskim (5-pinowym, kodowanie A) oraz wolnym końcem. Konstrukcja 5-żyłowa o przekroju 0.34 mm² w odpornym płaszczu PVC w kolorze szarym, o długości 25 metrów. Przeznaczony do zasilania i transmisji sygnałów czujników oraz elementów wykonawczych w automatyce przemysłowej, maszynach i liniach montażowych.',
    params_pl: [
      ['Producent / Seria', 'Balluff GmbH / BCC'],
      ['Typ złącza', 'M12x1 gniazdo kątowe (żeńskie), 5-biegunowe, kodowanie A'],
      ['Napięcie robocze Ub', '60 V AC / 60 V DC'],
      ['Prąd znamionowy (przy 40 °C)', '4.0 A'],
      ['Konfiguracja styków', 'Pin 1: BN, Pin 2: WH, Pin 3: BU, Pin 4: BK, Pin 5: GY'],
      ['Stopień ochrony obudowy', 'IP67 / IP68 / IP69K (w stanie zablokowanym)'],
      ['Zakres temperatur pracy', '-40 °C do +105 °C (ułożenie stałe) / -5 °C do +105 °C (ruchome)'],
    ],
    mech_pl: [
      ['Długość przewodu', '25.0 m'],
      ['Liczba i przekrój żył', '5 × 0.34 mm² (22 AWG)'],
      ['Średnica zewnętrzna kabla D', '5.0 ±0.20 mm'],
      ['Materiał płaszcza kabla', 'Polichlorek winylu (PVC), kolor szary'],
      ['Promień gięcia przewodu', '≥ 5 × D (ułożenie stałe) / ≥ 10 × D (ruchome)'],
      ['Zastosowanie w łańcuchach', 'Tak, przystosowany do prowadników kablowych (do 2 mln cykli)'],
      ['Materiał nakrętki / korpusu złącza', 'Cynkowy odlew ciśnieniowy niklowany / TPU czarny'],
      ['Materiał styków / powłoka', 'Brąz CuZn / złocenie galwaniczne'],
    ],
    dim_pl: [
      ['Wymiary główki złącza M12', 'Szerokość: 26.5 mm, Wysokość: 38.3 mm, Głębokość: 15.5 mm'],
      ['Całkowita długość z kablem', '25000 mm (25.0 m)'],
      ['Masa całkowita artykułu', '1.030 kg (1030 g)'],
      ['Moment dokręcania nakrętki M12', '0.6 Nm'],
      ['Zgodność z normami i atesty', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],

    title_en: 'Technical Datasheet: Sensor Cordset M12 5x0.34 25m',
    subtitle_en: 'Single-ended cordset M12 angled female 5-pin, PVC gray 5x0.34 mm², 25 m',
    desc_en: 'Industrial sensor single-ended cordset with an angled female M12x1 connector (5-pin, A-coded) and bare flying leads. 5-conductor configuration with 0.34 mm² wire cross-section in a durable gray PVC jacket with a total length of 25 meters. Designed for signal transmission and power supply in automated systems, industrial machines and robotics.',
    params_en: [
      ['Manufacturer / Series', 'Balluff GmbH / BCC'],
      ['Connector Type', 'M12x1 angled socket (female), 5-pin, A-coded'],
      ['Operating Voltage Ub', '60 V AC / 60 V DC'],
      ['Rated Current (at 40 °C)', '4.0 A'],
      ['Pinout Configuration', 'Pin 1: BN, Pin 2: WH, Pin 3: BU, Pin 4: BK, Pin 5: GY'],
      ['Degree of Protection', 'IP67 / IP68 / IP69K (when mated and locked)'],
      ['Operating Temperature Range', '-40 °C to +105 °C (fixed) / -5 °C to +105 °C (flexible)'],
    ],
    mech_en: [
      ['Cable Length', '25.0 m'],
      ['Conductor Count & Cross-Section', '5 × 0.34 mm² (22 AWG)'],
      ['Cable Diameter D', '5.0 ±0.20 mm'],
      ['Cable Jacket Material', 'Polyvinyl chloride (PVC), gray'],
      ['Bending Radius', '≥ 5 × D (fixed installation) / ≥ 10 × D (flexible drag chain)'],
      ['Drag Chain Suitable', 'Yes, drag chain compatible (up to 2 million cycles)'],
      ['Nut & Housing Material', 'Die-cast zinc nickel-plated / black TPU'],
      ['Contact Material & Plating', 'Brass CuZn / gold-plated'],
    ],
    dim_en: [
      ['M12 Connector Head Dimensions', 'Width: 26.5 mm, Height: 38.3 mm, Depth: 15.5 mm'],
      ['Overall Length with Cable', '25000 mm (25.0 m)'],
      ['Total Weight', '1.030 kg (1030 g)'],
      ['Recommended Tightening Torque', '0.6 Nm (M12 coupling nut)'],
      ['Approvals & Compliance', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],

    title_de: 'Technisches Datenblatt: Sensorleitung M12 5x0,34 25m',
    subtitle_de: 'Anschlussleitung M12 gewinkelt Buchse 5-polig, PVC grau 5x0,34 mm², 25 m',
    desc_de: 'Industrielle einseitig konfektionierte Sensorleitung mit gewinkelter M12x1-Buchse (5-polig, A-codiert) und offenem Leitungsende. 5-adriger Aufbau mit 0,34 mm² Leiterquerschnitt im robusten grauen PVC-Mantel mit einer Gesamtlänge von 25 Metern. Entwickelt für die Signalübertragung und Energieversorgung von Sensoren und Aktoren in der industriellen Automatisierung.',
    params_de: [
      ['Hersteller / Serie', 'Balluff GmbH / BCC'],
      ['Steckverbindertyp', 'M12x1 Buchse gewinkelt, 5-polig, A-codiert'],
      ['Betriebsspannung Ub', '60 V AC / 60 V DC'],
      ['Bemessungsstrom (bei 40 °C)', '4,0 A'],
      ['Anschlussbelegung', 'Pin 1: BN, Pin 2: WH, Pin 3: BU, Pin 4: BK, Pin 5: GY'],
      ['Schutzart', 'IP67 / IP68 / IP69K (im verschraubten Zustand)'],
      ['Temperaturbereich', '-40 °C bis +105 °C (fest) / -5 °C bis +105 °C (bewegt)'],
    ],
    mech_de: [
      ['Kabellänge', '25,0 m'],
      ['Aderanzahl & Querschnitt', '5 × 0,34 mm² (22 AWG)'],
      ['Kabeldurchmesser D', '5,0 ±0,20 mm'],
      ['Kabelmantelmaterial', 'Polyvinylchlorid (PVC), grau'],
      ['Biegeradius', '≥ 5 × D (feste Verlegung) / ≥ 10 × D (Schleppkette)'],
      ['Schleppkettentauglich', 'Ja, schleppkettentauglich (bis zu 2 Millionen Zyklen)'],
      ['Überwurfmutter & Gehäuse', 'Zinkdruckguss vernickelt / TPU schwarz'],
      ['Kontaktmaterial & Oberfläche', 'Kupferlegierung CuZn / vergoldet'],
    ],
    dim_de: [
      ['Abmessungen M12 Steckerkopf', 'Breite: 26,5 mm, Höhe: 38,3 mm, Tiefe: 15,5 mm'],
      ['Gesamtlänge mit Kabel', '25000 mm (25,0 m)'],
      ['Gesamtgewicht', '1,030 kg (1030 g)'],
      ['Empfohlenes Anzugsdrehmoment', '0,6 Nm (M12 Überwurfmutter)'],
      ['Zulassungen und Konformität', 'CE, cULus (E228687), UKCA, WEEE, RoHS'],
    ],
  },
];

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  
  for (const art of articles) {
    const html = generateDatasheetHTML(art);
    const tempHtmlPath = path.resolve(`scripts/${art.orderNr}_datasheet.html`);
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
