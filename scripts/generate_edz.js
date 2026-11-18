const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Creates a standard ZIP archive buffer with UTF-8 filename support
 * Fully compatible with EPLAN EDZ format
 */
function createZip(files) {
  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      let b = buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc ^ b) & 1 ? (crc >>> 1) ^ 0xEDB88320 : crc >>> 1;
        b >>>= 1;
      }
    }
    return (crc ^ -1) >>> 0;
  }

  const entries = [];
  const localHeaders = [];
  let offset = 0;

  for (const f of files) {
    const nameBuf = Buffer.from(f.path.replace(/\\/g, '/'), 'utf8');
    const dataBuf = f.data;
    const crc = crc32(dataBuf);
    const compressed = zlib.deflateRawSync(dataBuf);

    // Local file header (30 bytes + name length)
    const lfh = Buffer.alloc(30 + nameBuf.length);
    lfh.writeUInt32LE(0x04034b50, 0); // signature
    lfh.writeUInt16LE(20, 4);         // version needed (2.0)
    lfh.writeUInt16LE(0x0800, 6);     // flags (bit 11 = UTF-8 encoding)
    lfh.writeUInt16LE(8, 8);          // compression method (deflate)
    lfh.writeUInt16LE(0, 10);         // last mod file time
    lfh.writeUInt16LE(0, 12);         // last mod file date
    lfh.writeUInt32LE(crc, 14);       // crc-32
    lfh.writeUInt32LE(compressed.length, 18); // compressed size
    lfh.writeUInt32LE(dataBuf.length, 22);   // uncompressed size
    lfh.writeUInt16LE(nameBuf.length, 26);    // file name length
    lfh.writeUInt16LE(0, 28);                 // extra field length
    nameBuf.copy(lfh, 30);

    entries.push({
      nameBuf,
      crc,
      compressedLen: compressed.length,
      uncompressedLen: dataBuf.length,
      offset,
    });

    localHeaders.push(lfh, compressed);
    offset += lfh.length + compressed.length;
  }

  const cdHeaders = [];
  let cdSize = 0;
  const cdOffset = offset;

  for (const e of entries) {
    // Central directory header (46 bytes + name length)
    const cdh = Buffer.alloc(46 + e.nameBuf.length);
    cdh.writeUInt32LE(0x02014b50, 0); // central dir signature
    cdh.writeUInt16LE(20, 4);         // version made by (2.0)
    cdh.writeUInt16LE(20, 6);         // version needed (2.0)
    cdh.writeUInt16LE(0x0800, 8);     // flags (UTF-8)
    cdh.writeUInt16LE(8, 10);         // compression method (deflate)
    cdh.writeUInt16LE(0, 12);         // last mod file time
    cdh.writeUInt16LE(0, 14);         // last mod file date
    cdh.writeUInt32LE(e.crc, 16);     // crc-32
    cdh.writeUInt32LE(e.compressedLen, 20); // compressed size
    cdh.writeUInt32LE(e.uncompressedLen, 24); // uncompressed size
    cdh.writeUInt16LE(e.nameBuf.length, 28);  // file name length
    cdh.writeUInt16LE(0, 30);         // extra field length
    cdh.writeUInt16LE(0, 32);         // file comment length
    cdh.writeUInt16LE(0, 34);         // disk number start
    cdh.writeUInt16LE(0, 36);         // internal file attributes
    cdh.writeUInt32LE(0, 38);         // external file attributes
    cdh.writeUInt32LE(e.offset, 42);  // relative offset of local header
    e.nameBuf.copy(cdh, 46);

    cdHeaders.push(cdh);
    cdSize += cdh.length;
  }

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4);          // disk number
  eocd.writeUInt16LE(0, 6);          // start disk
  eocd.writeUInt16LE(entries.length, 8);  // total entries this disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(cdSize, 12);         // size of central directory
  eocd.writeUInt32LE(cdOffset, 16);       // offset of start of central directory
  eocd.writeUInt16LE(0, 20);              // comment length

  return Buffer.concat([...localHeaders, ...cdHeaders, eocd]);
}

/**
 * Escapes XML attribute values
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\r\n/g, '&#10;')
    .replace(/\r/g, '&#10;')
    .replace(/\n/g, '&#10;');
}

/**
 * Official EPLAN Product Classification (Product Grouping)
 * Matches official EPLAN Electric P8 XML schema properties:
 * P_ARTICLE_PRODUCTTOPGROUP (22138)
 * P_ARTICLE_PRODUCTGROUP    (22041)
 * P_ARTICLE_PRODUCTSUBGROUP (22028)
 */
const EPLAN_PRODUCT_TOP_GROUPS = {
  ELECTRICAL_ENGINEERING: 1, // Elektrotechnika
  FLUID_POWER: 2,            // Płyny
  MECHANICS: 3,              // Mechanika
  PROCESS_ENGINEERING: 4,    // Inżynieria procesowa
};

const EPLAN_PRODUCT_GROUPS = {
  // Elektrotechnika (TOPGROUP=1)
  UNDEFINED: 0,
  GENERAL: 1,
  RELAYS_CONTACTORS: 2,
  TERMINALS: 3,
  PLUGS: 4,
  CONVERTERS: 5,
  PROTECTION_DEVICES: 6,
  SEMICONDUCTORS: 7,
  SIGNAL_DEVICES: 8,
  MOTORS: 9,
  MEASURING_INSTRUMENTS: 10,
  RESISTORS: 11,
  SENSORS_SWITCHES_BUTTONS: 12,
  TRANSFORMERS: 13,
  MODULATORS: 14,
  ELECTRICALLY_OPERATED_MECHANICAL: 15,
  ELECTRICAL_SPECIAL_ITEMS: 16,
  MISCELLANEOUS: 17,
  CAPACITORS: 18,
  LOGIC_ITEMS: 19,
  VOLTAGE_SOURCES_GENERATORS: 20,
  INDUCTORS: 21,
  AMPLIFIERS_CONTROLLERS: 22,
  POWER_SWITCHGEAR: 23,
  TERMINATORS_FILTERS: 24,
  TRANSMISSION_PATHS: 25,
  PLC: 26,
  CABLES: 29,
  POWER_SUPPLY_PLANTS: 30,

  // Płyny / Fluid power (TOPGROUP=2)
  FLUID_ACTUATORS_GENERAL: 32,
  FLUID_MOTOR: 33,
  FLUID_FILTERS: 34,
  FLUID_CONTROL_TERMINAL: 35,
  FLUID_COUPLINGS: 36,
  FLUID_CONNECTIONS: 37,
  FLUID_MEASURING_POINTS: 38,
  FLUID_MEASURING_INSTRUMENTS: 39,
  FLUID_PUMPS: 40,
  FLUID_SENSORS: 41,
  FLUID_SPECIAL_ITEMS: 42,
  FLUID_ACCUMULATORS: 43,
  FLUID_VALVES: 44,
  FLUID_HEAT_EXCHANGERS: 46,
  FLUID_ACCESSORIES: 47,
  FLUID_SUB_PLATES: 48,

  // Mechanika (TOPGROUP=3)
  HOUSINGS: 49,
  HOUSING_ACCESSORIES_EXTERNAL: 50,
  HOUSING_ACCESSORIES_INTERNAL: 51,
  LOCK_SYSTEMS: 52,
  CABLE_DUCTS: 53,
  BUSBARS: 54,
  ENCLOSURE: 55,
  EXTRACTION_HOOD: 56,
  ELECTROLYSIS_CELL: 57,
  SUSPENSION: 58,

  // Inżynieria procesowa (TOPGROUP=4)
  CHIMNEY: 59,
  PROCESS_ENGINE: 61,
  SHUT_OFF_CONTROL_VALVE: 62,
  THREE_WAY_CONTROL_VALVE: 63,
  CHECK_CONTROL_VALVE: 64,
  CONTAINER: 65,
  CONTAINER_CONNECTION_POINT: 66,
  SEPARATOR: 67,
  PROCESS_FILTERS: 68,
  STRAINER: 69,
  CONVEYOR: 70,
  LIFTER: 71,
  TRANSPORTER: 72,
  CONTAINER_SHEATH: 73,
  CONTAINER_PIPE_COIL: 74,
  STEAM_BOILER: 75,
  COOLER: 76,
  FURNACE: 77,
  DRYER: 78,
  EVAPORATOR: 79,
  HEAT_EXCHANGERS: 80,
  KNEADER: 81,
  MIXER: 82,
  STIRRER: 83,
  COMPRESSOR: 84,
  PROCESS_PUMPS: 85,
  VACUUM_PUMP: 86,
};

const EPLAN_PRODUCT_SUBGROUPS = {
  GENERAL: 1,
  CONTACTORS: 2,
  AUXILIARY_BLOCK: 3,
  TERMINAL: 4,
  MOUNTING_RAIL: 5,
  END_CLAMP: 6,
  TERMINAL_LABEL: 7,
  OTHER_LABELS: 8,
  STRIP_LABEL: 9,
  CROSS_CONNECTOR: 10,
  RAILS: 11,
  COVER: 12,
  TERMINATOR: 13,
  PLUG_HOUSING: 15,
  CABLES_PREFABRICATED: 184, // Kable konfekcjonowane (z wtykami, patchcordy)
  CABLES_RIBBON: 228,        // Kable taśmowe
};

/**
 * Standard known manufacturer address metadata
 */
const KNOWN_MANUFACTURERS = {
  ELB: {
    shortName: 'ELB',
    longName: 'ELB Füllstandsgeräte Bundschuh GmbH & Co. KG',
    name1: 'Fluid.iO Sensor + Control GmbH & Co. KG',
    email: 'info@fluidio.de',
    phone: '+49-6251-8462-0',
    fax: '+49-6251-8462-72',
    note: '??_??@www.fluidio.de;',
    town: 'Bensheim',
    state: 'DEUTSCHLAND',
  },
  SIE: {
    shortName: 'SIE',
    longName: 'Siemens AG',
    name1: 'Siemens AG',
    name2: 'Automatisierungs- und Antriebstechnik',
    email: 'contact@siemens.com',
    phone: '+49 (0)221 - 576-2501',
    fax: '+49 (0)221 - 576-2988',
    note: '??_??@http://www.siemens.de&#10;https://eb.automation.siemens.com&#10;http://support.automation.siemens.com&#10;http://www.automation.siemens.com/doconweb/&#10;http://www.cad-creator.com;',
    street: 'WITTELSBACHERPLATZ 2 ',
    town: 'MUENCHEN',
    zipTown: '80333',
    state: 'DEUTSCHLAND',
    number: '102239',
    pobox: '301166',
    title: 'FIRMA',
  },
  FRAKO: {
    shortName: 'FRAKO',
    longName: 'FRAKO Kondensatoren- und Anlagen GmbH',
    name1: 'FRAKO Kondensatoren- und Anlagen GmbH',
    email: 'info@frako.de',
    phone: '+49-7641-453-0',
    fax: '+49-7641-453-535',
    note: '??_??@http://www.frako.de;',
    street: 'Tscheulinstraße 21a',
    town: 'Teningen',
    zipTown: '79331',
    state: 'DEUTSCHLAND',
  },
  ESKA: {
    shortName: 'ESKA',
    longName: 'ESKA Erich Schweizer GmbH',
    name1: 'ESKA Erich Schweizer GmbH',
    name2: 'Elektrotechnische Fabrik',
    email: 'mail@eska-fuses.de',
    phone: '+49 (0) 561 58904-0',
    fax: '+49 (0) 561 58904-22',
    note: '??_??@www.eska-fuses.de;',
    street: 'Antonius-Raab-Str. 10',
    town: 'Kassel',
    zipTown: '34123',
    state: 'DEUTSCHLAND',
  },
  EFB: {
    shortName: 'EFB',
    longName: 'EFB-Elektronik GmbH',
    name1: 'EFB-Elektronik GmbH',
    email: 'info@efb-elektronik.de',
    phone: '+49 521 40418-0',
    note: '??_??@www.efb-elektronik.de;',
    street: 'Striegauer Straße 1',
    town: 'Bielefeld',
    zipTown: '33719',
    state: 'DEUTSCHLAND',
  },
  PXC: {
    shortName: 'PXC',
    longName: 'Phoenix Contact GmbH & Co. KG',
    name1: 'Phoenix Contact GmbH & Co. KG',
    email: 'info@phoenixcontact.de',
    phone: '+49 52 35/3-01',
    fax: '+49 52 35/3-4 12 00',
    note: '??_??@www.phoenixcontact.com;',
    street: 'Flachsmarktstraße 8',
    town: 'Blomberg',
    zipTown: '32825',
    state: 'DEUTSCHLAND',
  },
  GFK: {
    shortName: 'GFK',
    longName: 'Glasfaserkabel.de (ServiceNet EDV Vertriebs GmbH)',
    name1: 'ServiceNet EDV Vertriebs GmbH',
    email: 'info@servicenet.biz',
    phone: '+49 228 7228111',
    note: '??_??@www.glasfaserkabel.de;',
    street: 'Kasinostraße 35c',
    town: 'Troisdorf',
    zipTown: '53840',
    state: 'DEUTSCHLAND',
  },
  LIN: {
    shortName: 'LIN',
    longName: 'LINDY-Elektronik GmbH',
    name1: 'LINDY-Elektronik GmbH',
    email: 'info@lindy.de',
    phone: '+49 621 47005-0',
    fax: '+49 621 47005-990',
    note: '??_??@www.lindy.de;',
    street: 'Markircher Str. 20',
    town: 'Mannheim',
    zipTown: '68229',
    state: 'DEUTSCHLAND',
  },
  PF: {
    shortName: 'PF',
    longName: 'Pepperl+Fuchs SE',
    name1: 'Pepperl+Fuchs SE',
    name2: 'Factory Automation',
    email: 'fa-info@de.pepperl-fuchs.com',
    phone: '+49 621 776-0',
    fax: '+49 621 776-1000',
    note: '??_??@www.pepperl-fuchs.com;',
    street: 'Lilienthalstraße 200',
    town: 'Mannheim',
    zipTown: '68307',
    state: 'DEUTSCHLAND',
  },
  HP: {
    shortName: 'HP',
    longName: 'HP Inc.',
    name1: 'HP Inc.',
    email: 'support@hp.com',
    phone: '+1 650 857 1501',
    note: '??_??@www.hp.com;',
    street: '1501 Page Mill Road',
    town: 'Palo Alto',
    zipTown: 'CA 94304',
    state: 'USA',
  },
  BIR: {
    shortName: 'BIR',
    longName: 'Robert Birkenbeul GmbH & Co. KG',
    name1: 'Robert Birkenbeul GmbH & Co. KG',
    name2: 'Antriebstechnik und Elektromotoren',
    email: 'info@birkenbeul.de',
    phone: '+49 (0) 2682 709 0',
    note: '??_??@www.birkenbeul.de;',
    street: 'Auf der Bitze 4',
    town: 'Hamm/Sieg',
    zipTown: '57577',
    state: 'DEUTSCHLAND',
  },
  STU: {
    shortName: 'STU',
    longName: 'STÜBBE GmbH & Co. KG',
    name1: 'STÜBBE GmbH & Co. KG',
    name2: 'Partner for Solutions - Pumpen & Armaturen',
    email: 'sales@stuebbe.com',
    phone: '+49 (0) 5733 7 99-0',
    fax: '+49 (0) 5733 7 99-5000',
    note: '??_??@www.stuebbe.com;',
    street: 'Hollwieser Straße 5',
    town: 'Vlotho',
    zipTown: '32602',
    state: 'DEUTSCHLAND',
  },
  PHG: {
    shortName: 'PHG',
    longName: 'phg Peter Hengstler GmbH + Co. KG',
    name1: 'phg Peter Hengstler GmbH + Co. KG',
    name2: 'Datentechnik & Verbindungstechnik',
    email: 'datentechnik@phg.de',
    phone: '+49 7420 89-0',
    note: '??_??@www.phg.de;',
    street: 'Dauchinger Straße 12',
    town: 'Deißlingen',
    zipTown: '78652',
    state: 'DEUTSCHLAND',
  },
  TPL: {
    shortName: 'TPL',
    longName: 'TP-Link Technologies Co., Ltd.',
    name1: 'TP-Link Technologies Co., Ltd.',
    name2: 'Networking & Smart Home Solutions',
    email: 'support@tp-link.com',
    phone: '+86 755 2650 4400',
    note: '??_??@www.tp-link.com;',
    street: 'Building 24 (floors 1,3,4,5) and 28 (floors 1-4) Central Science and Tech Park, Nanshan',
    town: 'Shenzhen',
    zipTown: '518057',
    state: 'CHINA',
  },
  WIE: {
    shortName: 'WIE',
    longName: 'Wieland Electric GmbH',
    name1: 'Wieland Electric GmbH',
    name2: 'Verbindungstechnik & Elektronische Schnittstellen',
    email: 'info@wieland-electric.com',
    phone: '+49 951 9324-0',
    fax: '+49 951 9324-198',
    note: '??_??@www.wieland-electric.com;',
    street: 'Brennerstraße 10 - 14',
    town: 'Bamberg',
    zipTown: '96052',
    state: 'DEUTSCHLAND',
  },
};

function buildManufacturerXml(mfgData) {
  const attrs = [
    `class="12"`,
    `P_PART_ADDRESS_SHORTNAME="${escapeXml(mfgData.shortName || '')}"`,
    `P_PART_ADDRESS_LONGNAME="${escapeXml(mfgData.longName || mfgData.shortName || '')}"`,
    `P_PART_ADDRESS_NAME1="${escapeXml(mfgData.name1 || mfgData.longName || '')}"`,
  ];
  if (mfgData.name2) attrs.push(`P_PART_ADDRESS_NAME2="${escapeXml(mfgData.name2)}"`);
  if (mfgData.email) attrs.push(`P_PART_ADDRESS_EMAIL="${escapeXml(mfgData.email)}"`);
  if (mfgData.phone) attrs.push(`P_PART_ADDRESS_PHONE="${escapeXml(mfgData.phone)}"`);
  if (mfgData.fax) attrs.push(`P_PART_ADDRESS_FAX="${escapeXml(mfgData.fax)}"`);
  if (mfgData.note) attrs.push(`P_PART_ADDRESS_NOTE="${mfgData.note}"`);
  if (mfgData.street) attrs.push(`P_PART_ADDRESS_STREET="${escapeXml(mfgData.street)}"`);
  if (mfgData.town) attrs.push(`P_PART_ADDRESS_TOWN="${escapeXml(mfgData.town)}"`);
  if (mfgData.zipTown) attrs.push(`P_PART_ADDRESS_ZIPTOWN="${escapeXml(mfgData.zipTown)}"`);
  if (mfgData.state) attrs.push(`P_PART_ADDRESS_STATE="${escapeXml(mfgData.state)}"`);
  if (mfgData.number) attrs.push(`P_PART_ADDRESS_NUMBER="${escapeXml(mfgData.number)}"`);
  if (mfgData.pobox) attrs.push(`P_PART_ADDRESS_POBOX="${escapeXml(mfgData.pobox)}"`);
  if (mfgData.title) attrs.push(`P_PART_ADDRESS_TITLE="${escapeXml(mfgData.title)}"`);

  return `<?xml version="1.0" encoding="utf-8" ?>\n<partsmanagement count="1" length-unit="mm" weight-unit="kg" type="EPLAN.PartsManagement" build="137.1">\n <address ${attrs.join(' ')}/>\n</partsmanagement>\n`;
}

function generateEDZ(options) {
  const {
    partNr,
    typeNr = partNr,
    orderNr = typeNr,
    manufacturer,
    productTopGroup = 1, // Elektrotechnika
    productGroup = 2,    // Przekaźniki, styczniki
    productSubGroup = 1,
    craftElectrical = 1,
    codeLetter = 'K',
    isAccessory = 0,
    weight = '0.1',
    width = '22.5',
    height = '90',
    depth = '100',
    descr1 = {},
    descr2 = {},
    note = {},
    characteristics = '',
    functionTemplates = [],
    pictureRelPath,
    pictureLocalPath,
    docs = [],
    outputEdzPath,
    mfgData,
  } = options || {};

  if (!partNr || !manufacturer) {
    throw new Error('partNr and manufacturer are required.');
  }

  const mountingSpace = (parseFloat(width) * parseFloat(height)).toFixed(1);

  const formatMultiLang = (map) => {
    return Object.entries(map)
      .map(([lang, val]) => `${lang}@${val};`)
      .join('');
  };

  const descr1Str = escapeXml(formatMultiLang(descr1));
  const descr2Str = escapeXml(formatMultiLang(descr2));
  const noteStr = escapeXml(formatMultiLang(note));

  // 1. Build manifest.xml
  const manifestItems = [
    `     <item type="partxml" name="part" locator="${partNr}.part.xml"/>`,
    `     <item type="partxml" name="manufacturer" locator="${manufacturer}.manufacturer.xml"/>`,
    `     <item type="partxml" name="supplier" locator="${manufacturer}.manufacturer.xml"/>`,
  ];

  if (pictureRelPath) {
    manifestItems.push(
      `     <item type="picture" name="picturefile" locator="${pictureRelPath.replace(/\//g, '\\')}"/>`
    );
  }

  docs.forEach((d, idx) => {
    manifestItems.push(
      `     <item type="document" name="externalDocument${idx + 1}" locator="${d.relPath.replace(/\//g, '\\')}"/>`
    );
  });

  if (options.constructionXml) {
    manifestItems.push(
      `     <item type="partxml" name="construction" locator="${partNr}.construction.xml"/>`
    );
  }

  const manifestXml = `<?xml version="1.0" encoding="utf-8" ?>\n<manifest version="2.0">\n <packages>\n  <package type="part" key="${partNr}" name="${partNr}">\n   <items>\n${manifestItems.join('\n')}\n   </items>\n  </package>\n </packages>\n</manifest>\n`;

  // 2. Build manufacturer.xml
  const finalMfgData = mfgData || KNOWN_MANUFACTURERS[manufacturer] || {
    shortName: manufacturer,
    longName: manufacturer,
    name1: manufacturer,
  };
  const manufacturerXml = buildManufacturerXml(finalMfgData);

  // 3. Build part.xml
  const extDocAttrs = docs
    .map(
      (d, idx) =>
        ` P_ARTICLE_EXTERNAL_DOCUMENT_${idx + 1}="$(MD_DOCUMENTS)\\${d.relPath.replace(/\//g, '\\')}"`
    )
    .join('');

  const picAttr = pictureRelPath
    ? ` P_ARTICLE_PICTUREFILE="$(MD_IMG)\\${pictureRelPath.replace(/\//g, '\\')}"`
    : '';

  const constructionAttr = options.constructionXml
    ? ` P_ARTICLE_CONSTRUCTION_FILE="$(MD_PARTS)\\items\\partxml\\${partNr}.construction.xml"`
    : '';

  const functionTemplatesXml = functionTemplates
    .map((ft) => {
      const connDesig = ft.connectionDesignation ? ` connectionDesignation="${escapeXml(ft.connectionDesignation)}"` : '';
      const connDesc = ft.connectionDescription ? ` connectiondescription="${escapeXml(ft.connectionDescription)}"` : '';
      const cat = ft.functiondefcategory || '300';
      const grp = ft.functiondefgroup || '1';
      const id = ft.functiondefid || '1';
      const sym = ft.symbol || 'IEC_symbol;1;20;0';
      const pos = ft.pos || 1;
      return `   <functiontemplate${connDesig}${connDesc} functiondefcategory="${cat}" functiondefgroup="${grp}" functiondefid="${id}" symbol="${sym}" pos="${pos}" terminalfunction="0" safetyrelevant="0" intrinsicsafety="0" plcbussystem="0" indexstartaddress="0" hasplugadapter="0" hasled="0"/>`;
    })
    .join('\n');

  const variantXml = `  <variant P_ARTICLE_VARIANT="1" P_ARTICLE_CHARACTERISTICS="${escapeXml(characteristics)}">\n${functionTemplatesXml}\n  </variant>`;

  const extraAttrsStr = options.extraPartAttrs
    ? Object.entries(options.extraPartAttrs)
        .map(([k, v]) => ` ${k}="${escapeXml(String(v))}"`)
        .join('')
    : '';

  const partXml = `<?xml version="1.0" encoding="utf-8" ?>\n<partsmanagement count="1" length-unit="mm" weight-unit="kg" type="EPLAN.PartsManagement" build="137.1">\n <part P_ARTICLE_PARTTYPE="1" P_ARTICLE_PARTNR="${partNr}" P_ARTICLE_TYPENR="${typeNr}" P_ARTICLE_ORDERNR="${orderNr}" P_ARTICLE_MANUFACTURER="${manufacturer}" P_ARTICLE_SUPPLIER="${manufacturer}" P_ARTICLE_PRODUCTTOPGROUP="${productTopGroup}" P_ARTICLE_PRODUCTGROUP="${productGroup}" P_ARTICLE_PRODUCTSUBGROUP="${productSubGroup}" P_ARTICLE_CRAFT_ELECTRICAL="${craftElectrical}" P_ARTICLE_CODELETTER="${codeLetter}" P_ARTICLE_WEIGHT="${weight}" P_ARTICLE_WIDTH="${width}" P_ARTICLE_HEIGHT="${height}" P_ARTICLE_DEPTH="${depth}" P_ARTICLE_MOUNTINGSPACE="${mountingSpace}"${picAttr}${extDocAttrs}${constructionAttr}${extraAttrsStr} P_ARTICLE_DESCR1="${descr1Str}" P_ARTICLE_DESCR2="${descr2Str}" P_ARTICLE_NOTE="${noteStr}" P_ARTICLE_DISCONTINUED="0" P_ARTICLE_IS_ACCESSORY="${isAccessory}" P_ARTICLE_EXTERNAL_PLACEMENT="0" P_ARTICLE_CAN_BE_LINED_UP="0" P_ARTICLE_PACKAGINGQUANTITY="1">\n${variantXml}\n </part>\n</partsmanagement>\n`;

  // 4. Assemble files list for ZIP
  const zipFiles = [];

  // manifest.xml
  zipFiles.push({
    path: 'manifest.xml',
    data: Buffer.from(manifestXml, 'utf8'),
  });

  // items/partxml/
  zipFiles.push({
    path: `items/partxml/${partNr}.part.xml`,
    data: Buffer.from(partXml, 'utf8'),
  });

  zipFiles.push({
    path: `items/partxml/${manufacturer}.manufacturer.xml`,
    data: Buffer.from(manufacturerXml, 'utf8'),
  });

  if (options.constructionXml) {
    zipFiles.push({
      path: `items/partxml/${partNr}.construction.xml`,
      data: Buffer.from(options.constructionXml, 'utf8'),
    });
  }

  // items/picture/
  if (pictureLocalPath && fs.existsSync(pictureLocalPath)) {
    zipFiles.push({
      path: `items/picture/${pictureRelPath.replace(/\\/g, '/')}`,
      data: fs.readFileSync(pictureLocalPath),
    });
  } else if (pictureLocalPath) {
    console.warn('Warning: Picture file not found at:', pictureLocalPath);
  }

  // items/document/
  for (const doc of docs) {
    if (fs.existsSync(doc.localPath)) {
      zipFiles.push({
        path: `items/document/${doc.relPath.replace(/\\/g, '/')}`,
        data: fs.readFileSync(doc.localPath),
      });
    } else {
      console.warn('Warning: Document not found at:', doc.localPath);
    }
  }

  // 5. Generate ZIP
  const targetPath = outputEdzPath || path.join('EDZ', partNr, `${partNr}.edz`);
  console.log(`Packaging ${zipFiles.length} items into EDZ archive: ${targetPath}`);
  const edzBuffer = createZip(zipFiles);
  fs.writeFileSync(targetPath, edzBuffer);
  console.log(`Successfully generated EDZ: ${targetPath} (${edzBuffer.length} bytes)`);

  return {
    edzPath: targetPath,
    size: edzBuffer.length,
    fileCount: zipFiles.length,
  };
}

// Preset catalog definitions
const CATALOG = {
  'ELB.KR-163B': {
    partNr: 'ELB.KR-163B',
    typeNr: 'KR-163B',
    orderNr: 'KR-163B',
    manufacturer: 'ELB',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 2,    // Przekaźniki, styczniki
    productSubGroup: 1, // Przekaźniki
    craftElectrical: 1,
    codeLetter: 'K',
    isAccessory: 0,
    weight: '0.15',     // kg (150 g)
    width: '22.5',      // mm
    height: '99',       // mm
    depth: '114.5',     // mm
    descr1: {
      pl_PL: 'Przekaźnik ochrony styków / przetwornik pomiarowy 1-kanałowy',
      en_US: 'Contact protective relay / measuring transducer 1-channel',
      de_DE: 'Kontaktschutzrelais / Messumformer 1-Kanal',
    },
    descr2: {
      pl_PL: 'KR-163/B',
      en_US: 'KR-163/B',
      de_DE: 'KR-163/B',
    },
    note: {
      pl_PL: '1-kanałowy przekaźnik ochrony styków / przetwornik pomiarowy (wg DIN EN 60947 NAMUR). Atest budowlany Z-65.11-404, Z-65.40-153. Obudowa na szynę DIN 35 mm ze złączami śrubowymi wtykowymi (B). Wyjście: 2 bezpotencjałowe zestyki przełączne (max. 250 V AC / 150 V DC, 3 A, 1250 VA). Zastosowanie w układach zabezpieczenia przed przepełnieniem i wyciekiem.',
      en_US: '1-channel contact protective relay / measuring transducer (acc. to DIN EN 60947 NAMUR). General construction approval Z-65.11-404, Z-65.40-153. Housing for 35 mm DIN rail with pluggable screw terminals (B). Output: 2 potential-free changeover contacts (max. 250 V AC / 150 V DC, 3 A, 1250 VA). Overfill and leakage protection systems.',
      de_DE: '1-Kanal Kontaktschutzrelais / Messumformer (nach DIN EN 60947 NAMUR). Allgemeine bauaufsichtliche Zulassung Z-65.11-404, Z-65.40-153. Gehäuse für 35 mm Tragschiene mit steckbaren Schraubklemmen (B). Ausgang: 2 potentialfreie Wechselkontakte (max. 250 V AC / 150 V DC, 3 A, 1250 VA). Überfüllsicherung und Leckagesicherung.',
    },
    characteristics: '1-Kanal, NAMUR, 2W (250V/3A), B=Schraubklemmen',
    functionTemplates: [
      { connectionDesignation: 'A1\nA2', connectionDescription: '+\n-', functiondefcategory: '200', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 1 },
      { connectionDesignation: 'E0\nE1', connectionDescription: 'NAMUR\nNAMUR', functiondefcategory: '200', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 2 },
      { connectionDesignation: '11\n12\n14', connectionDescription: 'COM\nNC\nNO', functiondefcategory: '202', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;1261;0', pos: 3 },
      { connectionDesignation: '21\n22\n24', connectionDescription: 'COM\nNC\nNO', functiondefcategory: '202', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;1261;0', pos: 4 },
    ],
    pictureRelPath: 'ELB/KR-163B.png',
    pictureLocalPath: 'EDZ/261008/ELB.KR-163B/KR-163B.png',
    docs: [
      {
        relPath: 'ELB/10-05-01-E_kr_allgemein_kr-163a_1-kanal.pdf',
        localPath: 'EDZ/261008/ELB.KR-163B/10-05-01-E_kr_allgemein_kr-163a_1-kanal.pdf',
      },
      {
        relPath: 'ELB/Z-65.11-404 -- EN -- 04 Technische Beschreibung.pdf',
        localPath: 'EDZ/261008/ELB.KR-163B/Z-65.11-404 -- EN -- 04 Technische Beschreibung.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261008/ELB.KR-163B/ELB.KR-163B.edz',
  },

  'ELB.KR-163-B-2W600': {
    partNr: 'ELB.KR-163-B-2W600',
    typeNr: 'KR-163-B-2W600',
    orderNr: 'KR-163-B-2W600',
    manufacturer: 'ELB',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 2,    // Przekaźniki, styczniki
    productSubGroup: 1, // Przekaźniki
    craftElectrical: 1,
    codeLetter: 'K',
    isAccessory: 0,
    weight: '0.15',     // kg (150 g)
    width: '22.5',      // mm
    height: '99',       // mm
    depth: '114.5',     // mm
    descr1: {
      pl_PL: 'Przekaźnik ochrony styków / przetwornik pomiarowy 1-kanałowy 230 V AC',
      en_US: 'Contact protective relay / measuring transducer 1-channel 230 V AC',
      de_DE: 'Kontaktschutzrelais / Messumformer 1-Kanal 230 V AC',
    },
    descr2: {
      pl_PL: 'KR-163/B/2W600',
      en_US: 'KR-163/B/2W600',
      de_DE: 'KR-163/B/2W600',
    },
    note: {
      pl_PL: '1-kanałowy przekaźnik ochrony styków / przetwornik pomiarowy (wg DIN EN 60947 NAMUR). Zasilanie: 230 V AC (48...62 Hz, max. 1 VA). Atest budowlany Z-65.11-404, Z-65.40-153. Obudowa na szynę DIN 35 mm ze złączami śrubowymi wtykowymi (B). Wyjście: 2 bezpotencjałowe zestyki przełączne (max. 250 V AC / 150 V DC, 3 A, 1250 VA). Zastosowanie w układach zabezpieczenia przed przepełnieniem i wyciekiem.',
      en_US: '1-channel contact protective relay / measuring transducer (acc. to DIN EN 60947 NAMUR). Supply voltage: 230 V AC (48...62 Hz, max. 1 VA). General construction approval Z-65.11-404, Z-65.40-153. Housing for 35 mm DIN rail with pluggable screw terminals (B). Output: 2 potential-free changeover contacts (max. 250 V AC / 150 V DC, 3 A, 1250 VA). Overfill and leakage protection systems.',
      de_DE: '1-Kanal Kontaktschutzrelais / Messumformer (nach DIN EN 60947 NAMUR). Versorgungsspannung: 230 V AC (48...62 Hz, max. 1 VA). Allgemeine bauaufsichtliche Zulassung Z-65.11-404, Z-65.40-153. Gehäuse für 35 mm Tragschiene mit steckbaren Schraubklemmen (B). Ausgang: 2 potentialfreie Wechselkontakte (max. 250 V AC / 150 V DC, 3 A, 1250 VA). Überfüllsicherung und Leckagesicherung.',
    },
    characteristics: '1-Kanal, NAMUR, 230V AC, 2W (250V/3A), B=Schraubklemmen',
    functionTemplates: [
      { connectionDesignation: 'A1\nA2', connectionDescription: 'L\nN', functiondefcategory: '200', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 1 },
      { connectionDesignation: 'E0\nE1', connectionDescription: 'NAMUR\nNAMUR', functiondefcategory: '200', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 2 },
      { connectionDesignation: '11\n12\n14', connectionDescription: 'COM\nNC\nNO', functiondefcategory: '202', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;1261;0', pos: 3 },
      { connectionDesignation: '21\n22\n24', connectionDescription: 'COM\nNC\nNO', functiondefcategory: '202', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;1261;0', pos: 4 },
    ],
    pictureRelPath: 'ELB/KR-163-B-2W600.png',
    pictureLocalPath: 'EDZ/261019/ELB.KR-163-B-2W600/KR-163-B-2W600.png',
    docs: [
      {
        relPath: 'ELB/10-05-01-E_kr_allgemein_kr-163a_1-kanal.pdf',
        localPath: 'EDZ/261019/ELB.KR-163-B-2W600/10-05-01-E_kr_allgemein_kr-163a_1-kanal.pdf',
      },
      {
        relPath: 'ELB/Z-65.11-404 -- EN -- 04 Technische Beschreibung.pdf',
        localPath: 'EDZ/261019/ELB.KR-163-B-2W600/Z-65.11-404 -- EN -- 04 Technische Beschreibung.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261019/ELB.KR-163-B-2W600/ELB.KR-163-B-2W600.edz',
  },

  'SIE.5SH5050': {
    partNr: 'SIE.5SH5050',
    typeNr: '5SH5050',
    orderNr: '5SH5050',
    manufacturer: 'SIE',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 6,    // Zabezpieczenia (Protection devices)
    productSubGroup: 1, // Bezpieczniki / ogólne (General)
    craftElectrical: 1,
    codeLetter: 'F',
    isAccessory: 1,
    weight: '0.0008',   // kg (0.8 g)
    width: '15',        // mm
    height: '15',       // mm
    depth: '10.5',      // mm
    descr1: {
      pl_PL: 'Wstawka kalibrowa NEOZED D02 50 A',
      en_US: 'NEOZED adapter sleeve D02 50 A',
      de_DE: 'NEOZED-Passhülse D02 50 A',
    },
    descr2: {
      pl_PL: 'SENTRON NEOZED D02',
      en_US: 'SENTRON NEOZED D02',
      de_DE: 'SENTRON NEOZED D02',
    },
    note: {
      pl_PL: 'Wstawka kalibrowa / tulejka dopasowująca NEOZED do wkładek bezpiecznikowych D02. Prąd znamionowy: 50 A. Kod barwny wkładki topikowej: biały. Zgodność z normą EN 60269-1. Akcesoria systemu bezpiecznikowego SENTRON NEOZED.',
      en_US: 'NEOZED adapter sleeve for D02 fuse links. Rated current: 50 A. Color coding of the fuse link: white. According to EN 60269-1. SENTRON NEOZED fuse system accessories.',
      de_DE: 'NEOZED-Passhülse für D02-Sicherungseinsätze. Bemessungsstrom: 50 A. Farbkennzeichnung des Sicherungseinsatzes: weiß. Nach EN 60269-1. Zubehör für SENTRON NEOZED-Sicherungssystem.',
    },
    characteristics: 'D02, 50 A, biały / white',
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'D02 50A',
        functiondefcategory: '1302',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'SIE/5SH5050.png',
    pictureLocalPath: 'EDZ/261009/SIE.5SH5050/5SH5050.png',
    docs: [
      {
        relPath: 'SIE/5SH5050_datasheet_en.pdf',
        localPath: 'EDZ/261009/SIE.5SH5050/5SH5050_datasheet_en.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261009/SIE.5SH5050/SIE.5SH5050.edz',
  },

  'FRAKO.DVH3113': {
    partNr: 'FRAKO.DVH3113',
    typeNr: 'DVH3113',
    orderNr: 'DVH3113',
    manufacturer: 'FRAKO',
    productTopGroup: 1,  // Elektrotechnika
    productGroup: 10,    // Przyrządy pomiarowe, testowe (Measuring instruments, test devices)
    productSubGroup: 1,  // Ogólne (General)
    craftElectrical: 1,
    codeLetter: 'P',
    isAccessory: 0,
    weight: '0.5',       // kg (500 g)
    width: '125',        // mm (~7 TE)
    height: '96',        // mm
    depth: '66',         // mm
    descr1: {
      pl_PL: 'Elektroniczny 3-fazowy licznik energii elektrycznej kWh',
      en_US: 'Electronic 3-phase kWh energy meter for DIN rail',
      de_DE: 'Elektronischer 3-Phasen Drehstrom-Energiezähler für Tragschiene',
    },
    descr2: {
      pl_PL: 'EMC 1203 DVH / DVH3113',
      en_US: 'EMC 1203 DVH / DVH3113',
      de_DE: 'EMC 1203 DVH / DVH3113',
    },
    note: {
      pl_PL: 'Elektroniczny 3-fazowy licznik energii elektrycznej czynnej kWh na szynę DIN 35 mm (7 TE). Napięcie znamionowe: 3x230/400 V AC, 50 Hz. Prąd znamionowy / maksymalny: 5(65) A (pomiar bezpośredni). Wyświetlacz LCD, wyjście impulsowe (transoptorowe wg DIN 43864, 100 mA, 230 V AC/DC). Dioda LED impulsowa (1000 imp/kWh). Zastosowanie: pomiary energii w rozdzielnicach sieciowych.',
      en_US: 'Electronic 3-phase kWh active energy meter for 35 mm DIN rail mounting (7 modules). Nominal voltage: 3x230/400 V AC, 50 Hz. Nominal / max current: 5(65) A (direct connection). LCD display, solid-state pulse output (acc. to DIN 43864, 100 mA, 230 V AC/DC). Pulse LED (1000 imp/kWh). Application: energy measurement in power distribution.',
      de_DE: 'Elektronischer 3-Phasen Wirkenergiezähler (Drehstromzähler) für 35 mm Tragschiene (7 TE). Nennspannung: 3x230/400 V AC, 50 Hz. Nenn-/Grenzstrom: 5(65) A (Direktanschluss). LC-Display, Impulsausgang (Halbleiterrelais nach DIN 43864, 100 mA, 230 V AC/DC). Impuls-LED (1000 Imp/kWh).',
    },
    characteristics: '3x230/400V, 5(65)A, 50Hz, S0',
    functionTemplates: [
      { connectionDesignation: '1\n3', connectionDescription: 'L1 In\nL1 Out', functiondefcategory: '300', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 1 },
      { connectionDesignation: '4\n6', connectionDescription: 'L2 In\nL2 Out', functiondefcategory: '300', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 2 },
      { connectionDesignation: '7\n9', connectionDescription: 'L3 In\nL3 Out', functiondefcategory: '300', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 3 },
      { connectionDesignation: '11', connectionDescription: 'N', functiondefcategory: '300', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 4 },
      { connectionDesignation: '+\n-', connectionDescription: '+\n-', functiondefcategory: '300', functiondefgroup: '1', functiondefid: '1', symbol: 'IEC_symbol;1;20;0', pos: 5 },
    ],
    pictureRelPath: 'FRAKO/DVH3113.png',
    pictureLocalPath: 'EDZ/261009/FRAKO.DVH3113/DVH3113.png',
    docs: [
      {
        relPath: 'FRAKO/55-00592_emc1203mdvh_dvh_ba.pdf',
        localPath: 'EDZ/261009/FRAKO.DVH3113/55-00592_emc1203mdvh_dvh_ba.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261009/FRAKO.DVH3113/FRAKO.DVH3113.edz',
  },

  'ESKA.522715': {
    partNr: 'ESKA.522715',
    typeNr: '522.715',
    orderNr: '522.715',
    manufacturer: 'ESKA',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 6,    // Zabezpieczenia (Protection devices)
    productSubGroup: 1, // Bezpieczniki / ogólne (General)
    craftElectrical: 1,
    codeLetter: 'F',
    isAccessory: 0,
    weight: '0.001',    // kg (1 g)
    width: '5',         // mm
    height: '5',        // mm
    depth: '20',        // mm
    descr1: {
      pl_PL: 'Wkładka bezpiecznikowa ceramiczna 5x20 mm T 630 mA 250 V',
      en_US: 'Miniature ceramic fuse link 5x20 mm time-lag T 630 mA 250 V',
      de_DE: 'G-Sicherungseinsatz Keramik 5x20 mm träge T 630 mA 250 V',
    },
    descr2: {
      pl_PL: 'Seria 522.700 (522.715)',
      en_US: 'Series 522.700 (522.715)',
      de_DE: 'Serie 522.700 (522.715)',
    },
    note: {
      pl_PL: 'Wkładka bezpiecznikowa miniaturowa topikowa G 5x20 mm wg DIN EN 60127-2 k. 5. Prąd znamionowy: 630 mA (0,63 A). Napięcie znamionowe: 250 V AC. Charakterystyka: zwłoczna (T / träge). Zdolność wyłączania: 1500 A @ 250 V AC. Korpus ceramiczny z piaskiem gaśniczym, końcówki stykowe mosiężne niklowane. Maks. spadek napięcia: 650 mV, maks. strata mocy: 1,6 W, całka topnienia I²t: 1,725 A²s.',
      en_US: 'Miniature fuse link G 5x20 mm acc. to IEC / DIN EN 60127-2 sheet 5. Rated current: 630 mA (0.63 A). Rated voltage: 250 V AC. Characteristic: time-lag (T). Breaking capacity: 1500 A @ 250 V AC. Ceramic tube with extinguishing agent (sand), nickel-plated brass contact caps. Max. voltage drop: 650 mV, max. power dissipation: 1.6 W, melting integral I²t: 1.725 A²s.',
      de_DE: 'G-Sicherungseinsatz 5x20 mm nach DIN EN 60127-2 Normblatt 5. Bemessungsstrom: 630 mA (0,63 A). Bemessungsspannung: 250 V AC. Kennzeichnung: träge (T). Ausschaltvermögen: 1500 A @ 250 V AC. Keramikrohr mit Löschmittel, Kontaktkappen Messing vernickelt. Max. Spannungsfall: 650 mV, Verlustleistung: 1,6 W, Schmelzintegral I²t: 1,725 A²s.',
    },
    characteristics: 'T 630mA, 250V AC, 1.5kA, 5x20mm',
    functionTemplates: [
      {
        connectionDesignation: '1\n2',
        connectionDescription: '1\n2',
        functiondefcategory: '100',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;15;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'ESKA/522715.png',
    pictureLocalPath: 'EDZ/261019/ESKA.522715/522715.png',
    docs: [
      {
        relPath: 'ESKA/DS_522700.pdf',
        localPath: 'EDZ/261019/ESKA.522715/DS_522700.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261019/ESKA.522715/ESKA.522715.edz',
  },

  'ESKA.522718': {
    partNr: 'ESKA.522718',
    typeNr: '522.718',
    orderNr: '522.718',
    manufacturer: 'ESKA',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 6,    // Zabezpieczenia (Protection devices)
    productSubGroup: 1, // Bezpieczniki / ogólne (General)
    craftElectrical: 1,
    codeLetter: 'F',
    isAccessory: 0,
    weight: '0.001',    // kg (1 g)
    width: '5',         // mm
    height: '5',        // mm
    depth: '20',        // mm
    descr1: {
      pl_PL: 'Wkładka bezpiecznikowa ceramiczna 5x20 mm T 1,25 A 250 V',
      en_US: 'Miniature ceramic fuse link 5x20 mm time-lag T 1.25 A 250 V',
      de_DE: 'G-Sicherungseinsatz Keramik 5x20 mm träge T 1,25 A 250 V',
    },
    descr2: {
      pl_PL: 'Seria 522.700 (522.718)',
      en_US: 'Series 522.700 (522.718)',
      de_DE: 'Serie 522.700 (522.718)',
    },
    note: {
      pl_PL: 'Wkładka bezpiecznikowa miniaturowa topikowa G 5x20 mm wg DIN EN 60127-2 k. 5. Prąd znamionowy: 1,25 A. Napięcie znamionowe: 250 V AC. Charakterystyka: zwłoczna (T / träge). Zdolność wyłączania: 1500 A @ 250 V AC. Korpus ceramiczny z piaskiem gaśniczym, końcówki stykowe mosiężne niklowane. Maks. spadek napięcia: 300 mV, maks. strata mocy: 2,5 W, całka topnienia I²t: 1,10 A²s.',
      en_US: 'Miniature fuse link G 5x20 mm acc. to IEC / DIN EN 60127-2 sheet 5. Rated current: 1.25 A. Rated voltage: 250 V AC. Characteristic: time-lag (T). Breaking capacity: 1500 A @ 250 V AC. Ceramic tube with extinguishing agent (sand), nickel-plated brass contact caps. Max. voltage drop: 300 mV, max. power dissipation: 2.5 W, melting integral I²t: 1.10 A²s.',
      de_DE: 'G-Sicherungseinsatz 5x20 mm nach DIN EN 60127-2 Normblatt 5. Bemessungsstrom: 1,25 A. Bemessungsspannung: 250 V AC. Kennzeichnung: träge (T). Ausschaltvermögen: 1500 A @ 250 V AC. Keramikrohr mit Löschmittel, Kontaktkappen Messing vernickelt. Max. Spannungsfall: 300 mV, Verlustleistung: 2,5 W, Schmelzintegral I²t: 1,10 A²s.',
    },
    characteristics: 'T 1.25A, 250V AC, 1.5kA, 5x20mm',
    functionTemplates: [
      {
        connectionDesignation: '1\n2',
        connectionDescription: '1\n2',
        functiondefcategory: '100',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;15;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'ESKA/522718.png',
    pictureLocalPath: 'EDZ/261019/ESKA.522718/522718.png',
    docs: [
      {
        relPath: 'ESKA/DS_522700.pdf',
        localPath: 'EDZ/261019/ESKA.522718/DS_522700.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261019/ESKA.522718/ESKA.522718.edz',
  },

  'EFB.537051V3': {
    partNr: 'EFB.537051V3',
    typeNr: '53705.1V3',
    orderNr: '53705.1V3',
    manufacturer: 'EFB',
    productTopGroup: 3, // Mechanika (Mechanics)
    productGroup: 49,   // Obudowy (Housings)
    productSubGroup: 1, // Ogólne (General)
    craftElectrical: 1,
    codeLetter: 'X',
    isAccessory: 0,
    weight: '0.49',     // kg (490 g)
    width: '61',        // mm
    height: '115',      // mm
    depth: '113',       // mm
    descr1: {
      pl_PL: 'Przemysłowa przełącznica światłowodowa na szynę DIN (obudowa)',
      en_US: 'Industrial splice distributor with metal housing for DIN-RAIL',
      de_DE: 'Industrie-Spleißverteiler DIN-Hutschiene Metallgehäuse',
    },
    descr2: {
      pl_PL: 'DIN Rail Box 61x115x113 mm, RAL 7035',
      en_US: 'DIN Rail Box 61x115x113 mm, RAL 7035',
      de_DE: 'DIN Rail Box 61x115x113 mm, RAL 7035',
    },
    note: {
      pl_PL: 'Przemysłowa skrzynka rozdzielcza / przełącznica światłowodowa na szynę DIN 35 mm. W pełni zmontowana obudowa metalowa (blacha stalowa, lakierowana proszkowo, RAL 7035 jasnoszary). Wpusty kablowe góra/dół przystosowane pod dławnicę M20. W zestawie: kaseta spawów, grzebień na 12 spawów, 1x dławnica M20, aluminiowy uchwyt na szynę DIN oraz śruby mocujące panel przedni. Dostawa bez płyty czołowej i adapterów.',
      en_US: 'Industrial splice distributor with metal housing for 35 mm DIN rail mounting. Fully assembled sheet steel metal housing (powder-coated, light grey RAL 7035). Top/bottom cable entries prepared for M20 cable gland. Included in delivery: 1x splice cassette, 1x splice holder for 12 splices, 1x cable gland M20, 1x aluminum DIN rail clip, mounting screws for front panel. Delivered without front panel and adapters.',
      de_DE: 'Industrie-Spleißverteiler mit Metallgehäuse für 35 mm DIN-Tragschienenmontage. Vollständig montiertes Stahlblechgehäuse (pulverbeschichtet, lichtgrau RAL 7035). Kabeleinführung oben/unten vorbereitet für M20. Lieferumfang: 1x Spleißkassette, 1x Spleißhalter für 12 Crimp-/Schrumpfspleiße, 1x Kabelverschraubung M20, 1x Alu-Hutschienenclip, Schrauben für Frontplatte. Lieferung unbestückt ohne Frontplatte und Kupplungen.',
    },
    characteristics: 'DIN-Rail, 61x115x113mm, M20, RAL7035',
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: '',
        functiondefcategory: '1302',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'EFB/537051V3.png',
    pictureLocalPath: 'EDZ/261020/EFB.537051V3/537051V3.png',
    docs: [
      {
        relPath: 'EFB/53705.1V3_EN.pdf',
        localPath: 'EDZ/261020/EFB.537051V3/53705.1V3_EN.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261020/EFB.537051V3/EFB.537051V3.edz',
  },

  'EFB.537053V2B2': {
    partNr: 'EFB.537053V2B2',
    typeNr: '53705.3V2B2',
    orderNr: '53705.3V2B2',
    manufacturer: 'EFB',
    productTopGroup: 3, // Mechanika (Mechanics)
    productGroup: 51,   // Akcesoria obudowy, rozbudowa wewnętrzna (Housing accessories, internal)
    productSubGroup: 1, // Ogólne (General)
    craftElectrical: 1,
    codeLetter: 'X',
    isAccessory: 1,
    weight: '0.05',     // kg (50 g)
    width: '61',        // mm
    height: '115',      // mm
    depth: '1.7',       // mm
    descr1: {
      pl_PL: 'Płyta czołowa przełącznicy DIN na 6x SC Simplex / LC Duplex / E2000 (1,7 mm)',
      en_US: 'DIN Rail Box Front Panel empty 1.7 mm for 6x SC Simplex / LC Duplex / E2000',
      de_DE: 'Frontplatte für Hutschiene Spleißbox 6x SC-Simplex / LC-Duplex / E2000 (1,7 mm)',
    },
    descr2: {
      pl_PL: 'Do 53705.1V3, RAL 7035, otwory mocujące Ø 1,7 mm',
      en_US: 'For 53705.1V3, RAL 7035, mounting holes Ø 1.7 mm',
      de_DE: 'Für 53705.1V3, RAL 7035, Befestigungslöcher Ø 1,7 mm',
    },
    note: {
      pl_PL: 'Płyta czołowa / panel przedni do przemysłowej skrzynki rozdzielczej światłowodowej EFB 53705.1V3 na szynę DIN. Przystosowana do montażu 6 adapterów SC Simplex, LC Duplex lub E2000®. Wersja z otworami mocującymi o średnicy 1,7 mm do bezpośredniego przykręcania adapterów. Materiał: blacha stalowa, kolor jasnoszary RAL 7035. Dostawa bez adapterów.',
      en_US: 'Empty front panel for industrial DIN rail splice box EFB 53705.1V3. Designed for mounting up to 6x SC Simplex, LC Duplex, or E2000® fiber optic adapters. Version with 1.7 mm screw holes for direct adapter fixing. Material: sheet steel, powder-coated light grey RAL 7035. Adapters not included.',
      de_DE: 'Frontplatte unbestückt für Industrie-Hutschienen-Spleißverteiler EFB 53705.1V3. Geeignet für 6x SC-Simplex, LC-Duplex oder E2000® LWL-Kupplungen. Ausführung mit 1,7 mm Befestigungslöchern zur direkten Verschraubung der Kupplungen. Material: Stahlblech, lichtgrau RAL 7035. Kupplungen nicht im Lieferumfang enthalten.',
    },
    characteristics: '6x SC-S / LC-D / E2000, 1.7mm, RAL7035',
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: '',
        functiondefcategory: '1302',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'EFB/537053V2B2.png',
    pictureLocalPath: 'EDZ/261020/EFB.537053V2B2/537053V2B2.png',
    docs: [
      {
        relPath: 'EFB/53705.1V3_EN.pdf',
        localPath: 'EDZ/261020/EFB.537053V2B2/53705.1V3_EN.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261020/EFB.537053V2B2/EFB.537053V2B2.edz',
  },

  'PXC.1115634': {
    partNr: 'PXC.1115634',
    typeNr: 'FOC-LC:PA-LC:PA-OM2:D01/2',
    orderNr: '1115634',
    manufacturer: 'PXC',
    productTopGroup: 1, // Elektrotechnika (Electrical engineering)
    productGroup: 29,   // Kable (Cables)
    productSubGroup: 184, // Kable konfekcjonowane (Prefabricated)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 0,
    weight: '0.021',    // kg (21 g)
    width: '15',        // mm
    height: '10',       // mm
    depth: '2000',      // mm (długość kabla 2.0 m)
    descr1: {
      pl_PL: 'Światłowodowy kabel połączeniowy LC-Duplex / LC-Duplex OM2 2,0 m',
      en_US: 'Assembled FO cable LC duplex / LC duplex OM2 2.0 m',
      de_DE: 'Konfektioniertes LWL-Kabel LC-Duplex / LC-Duplex OM2 2,0 m',
    },
    descr2: {
      pl_PL: 'OM2 50/125 µm, LSZH, pomarańczowy RAL 2003, IP20',
      en_US: 'OM2 50/125 µm, LSZH, orange RAL 2003, IP20',
      de_DE: 'OM2 50/125 µm, LSZH, orange RAL 2003, IP20',
    },
    note: {
      pl_PL: 'Konfekcjonowany kabel światłowodowy (patchcord) Phoenix Contact FOC-LC:PA-LC:PA-OM2:D01/2 (nr kat. 1115634). Złącza LC-Duplex na LC-Duplex, wielomodowy OM2 (50/125 µm), długość 2,0 m. Bezhalogenowa powłoka LSZH, klasa palności UL 94 V0, odporny na rozprzestrzenianie płomienia zgodnie z IEC 60332-1-2 / IEC 60332-3-22 Cat. A. Tłumienność wtrąceniowa <= 0,5 dB, tłumienność odbiciowa >= 35 dB (UPC). Zakres temperatur pracy: od -10 °C do +70 °C. Stopień ochrony: IP20.',
      en_US: 'Assembled fiber optic cable (patch cable) Phoenix Contact FOC-LC:PA-LC:PA-OM2:D01/2 (order no. 1115634). Connectors LC duplex to LC duplex, multimode OM2 (50/125 µm), length 2.0 m. Halogen-free LSZH outer sheath, flammability rating UL 94 V0, flame retardant per IEC 60332-1-2 / IEC 60332-3-22 Cat. A. Insertion loss <= 0.5 dB, return loss >= 35 dB (UPC). Operating temperature range: -10 °C to +70 °C. Degree of protection: IP20.',
      de_DE: 'Konfektioniertes Lichtwellenleiterkabel (Patchkabel) Phoenix Contact FOC-LC:PA-LC:PA-OM2:D01/2 (Art.-Nr. 1115634). Steckverbinder LC-Duplex auf LC-Duplex, Multimode OM2 (50/125 µm), Länge 2,0 m. Halogenfreier LSZH-Außenmantel, Brennbarkeitsklasse UL 94 V0, flammwidrig nach IEC 60332-1-2 / IEC 60332-3-22 Cat. A. Einfügedämpfung <= 0,5 dB, Rückflussdämpfung >= 35 dB (UPC). Betriebstemperaturbereich: -10 °C bis +70 °C. Schutzart: IP20.',
    },
    characteristics: '2x LC-Duplex, OM2 50/125, 2.0m, LSZH',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4063151040703',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: '2x OM2 50/125',
        functiondefcategory: '400',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;35;0',
        pos: 1,
      },
      {
        connectionDesignation: '1',
        connectionDescription: 'OM2 50/125',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 2,
      },
      {
        connectionDesignation: '2',
        connectionDescription: 'OM2 50/125',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 3,
      },
    ],
    pictureRelPath: 'PXC/1115634.png',
    pictureLocalPath: 'EDZ/261020/PXC.1115634/1115634.png',
    docs: [
      {
        relPath: 'PXC/1115634_datasheet.pdf',
        localPath: 'EDZ/261020/PXC.1115634/1115634_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261020/PXC.1115634/PXC.1115634.edz',
  },

  'PXC.1333136': {
    partNr: 'PXC.1333136',
    typeNr: 'NBC-USB2.0-UAM/1,0-PVC/UAM',
    orderNr: '1333136',
    manufacturer: 'PXC',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.CABLES,                       // 29 (Kable)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.CABLES_PREFABRICATED,   // 184 (Kable konfekcjonowane)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 0,
    weight: '0.0402',   // kg (40.2 g)
    width: '15',        // mm (szerokość wtyku USB-A)
    height: '8',        // mm (wysokość wtyku USB-A)
    depth: '1000',      // mm (długość kabla 1.0 m)
    descr1: {
      pl_PL: 'Konfekcjonowany kabel danych USB 2.0 Typ A męski / Typ A męski 1,0 m',
      en_US: 'USB data cable pre-assembled USB-A male / USB-A male 1.0 m',
      de_DE: 'Konfektioniertes USB-Datenkabel USB-A Stecker / USB-A Stecker 1,0 m',
    },
    descr2: {
      pl_PL: 'NBC-USB2.0-UAM/1,0-PVC/UAM, 480 Mbit/s, IP20, czarny, PVC',
      en_US: 'NBC-USB2.0-UAM/1,0-PVC/UAM, 480 Mbps, IP20, black, PVC',
      de_DE: 'NBC-USB2.0-UAM/1,0-PVC/UAM, 480 Mbit/s, IP20, schwarz, PVC',
    },
    note: {
      pl_PL: 'Konfekcjonowany kabel transmisji danych USB 2.0 marki Phoenix Contact (nr art. 1333136, typ NBC-USB2.0-UAM/1,0-PVC/UAM) o długości 1,0 m. Wyposażony w proste złącza USB Typ A (męski) na obu końcach. Szybkość transmisji danych do 480 Mbit/s (High Speed). Stopień ochrony IP20, prąd znamionowy 1,5 A, napięcie znamionowe 30 V AC / 30 V DC. Płaszcz zewnętrzny PVC w kolorze czarnym, średnica zewnętrzna 5,5 mm. Podwójnie ekranowany (folia + oplot), 4 bieguny. Zakres temperatur pracy: od -25 °C do +85 °C. GTIN/EAN: 4063151630638.',
      en_US: 'Pre-assembled USB 2.0 data cable by Phoenix Contact (item no. 1333136, type NBC-USB2.0-UAM/1,0-PVC/UAM), length: 1.0 m. Features straight USB Type-A plugs on both ends. Data transmission speed up to 480 Mbps (High Speed). IP20 degree of protection, rated current 1.5 A, rated voltage 30 V AC / 30 V DC. PVC outer sheath in black, outer cable diameter 5.5 mm. Shielded design, 4 positions. Operating temperature range: -25 °C to +85 °C. GTIN/EAN: 4063151630638.',
      de_DE: 'Konfektioniertes USB 2.0 Datenkabel von Phoenix Contact (Art.-Nr. 1333136, Typ NBC-USB2.0-UAM/1,0-PVC/UAM), Länge: 1,0 m. Beidseitig mit geraden USB-A Steckern konfektioniert. Datenübertragungsrate bis zu 480 Mbit/s (High Speed). Schutzart IP20, Bemessungsstrom 1,5 A, Bemessungsspannung 30 V AC / 30 V DC. PVC-Außenmantel in schwarz, Kabelaußendurchmesser 5,5 mm. Geschirmte Ausführung, 4-polig. Betriebstemperaturbereich: -25 °C bis +85 °C. GTIN/EAN: 4063151630638.',
    },
    characteristics: 'USB 2.0, 1.0m, USB-A/USB-A, 480Mbps, 1.5A, IP20, PVC',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4063151630638',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'NBC-USB2.0-UAM/1,0-PVC/UAM',
        functiondefcategory: '400',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;35;0',
        pos: 1,
      },
      {
        connectionDesignation: '1',
        connectionDescription: 'VBUS (+5V DC / 1.5A)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 2,
      },
      {
        connectionDesignation: '2',
        connectionDescription: 'D- (Data -)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 3,
      },
      {
        connectionDesignation: '3',
        connectionDescription: 'D+ (Data +)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 4,
      },
      {
        connectionDesignation: '4',
        connectionDescription: 'GND (Masse)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 5,
      },
      {
        connectionDesignation: 'SH',
        connectionDescription: 'Shield (Schirm)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 6,
      },
    ],
    pictureRelPath: 'PXC/1333136.png',
    pictureLocalPath: 'EDZ/261021/PXC.1333136/1333136.png',
    docs: [
      {
        relPath: 'PXC/1333136_datasheet.pdf',
        localPath: 'EDZ/261021/PXC.1333136/1333136_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261021/PXC.1333136/PXC.1333136.edz',
  },

  'GFK.113030': {
    partNr: 'GFK.113030',
    typeNr: 'U-DQ(ZN)BH 4G OM3 30m LC/LC',
    orderNr: '113030',
    manufacturer: 'GFK',
    productTopGroup: 1, // Elektrotechnika (Electrical engineering)
    productGroup: 29,   // Kable (Cables)
    productSubGroup: 184, // Kable konfekcjonowane (Prefabricated)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 0,
    weight: '1.5',      // kg (ok. 50 kg/km -> 1.5 kg dla 30 m)
    width: '16',        // mm (średnica rozdzielacza)
    height: '16',       // mm
    depth: '30000',     // mm (długość kabla 30 m)
    descr1: {
      pl_PL: 'Uniwersalny kabel światłowodowy 30m, 4G OM3 50/125 LC/LC U-DQ(ZN)BH',
      en_US: 'Universal FO cable 30m, 4G OM3 50/125 LC/LC U-DQ(ZN)BH',
      de_DE: 'LWL Universalkabel 30m, 4G OM3 50/125 LC/LC U-DQ(ZN)BH',
    },
    descr2: {
      pl_PL: '4 włókna OM3 50/125 µm, LSZH, z ochroną przed gryzoniami, IP20',
      en_US: '4 fibers OM3 50/125 µm, LSZH, rodent protection, IP20',
      de_DE: '4 Fasern OM3 50/125 µm, LSZH, Nagetierschutz, IP20',
    },
    note: {
      pl_PL: 'Uniwersalny kabel światłowodowy (zewnętrzny/wewnętrzny) U-DQ(ZN)BH 4G OM3 (50/125 µm) o długości 30 m, obustronnie fabrycznie zakończony złączami LC (LC-Duplex) z ochroną i rozdzielaczami. Zastosowanie wewnątrz i na zewnątrz budynków, w kanałach kablowych oraz rurociągach. Konstrukcja z centralną tubą buforową wypełnioną żelem (wzdłużnie wodoszczelny wg IEC 60794-1-2 F5), dielektryczna ochrona przed gryzoniami (włókna szklane), bezhalogenowa i nierozprzestrzeniająca płomienia powłoka zewnętrzna LSZH (IEC 60332-1, IEC 60332-3). Odporny na UV. Długość całkowita wraz z biczami wynosi 30 m. W zestawie indywidualny protokół pomiaru tłumienności.',
      en_US: 'Pre-assembled universal fiber optic installation cable (indoor/outdoor) U-DQ(ZN)BH 4G OM3 (50/125 µm), 30 m length, factory-terminated on both ends with LC connectors (LC duplex) and fan-out splitters. Central gel-filled loose tube (water-blocking per IEC 60794-1-2 F5), non-metallic dielectric glass-yarn rodent protection, halogen-free flame-retardant LSZH outer jacket (IEC 60332-1, IEC 60332-3). UV-resistant. Total length 30 m (including fan-out whips). Individual attenuation test report included.',
      de_DE: 'LWL Kabel 30m, 4G OM3 - 50/125, LC / LC Multimode LWL Kabel / Glasfaserkabel, fertig konfektioniert mit LC Steckern an beiden Kabelenden. Die Kabellänge (inklusive der Kabelpeitschen) beträgt 30 Meter. Das LWL-Kabel ist zur universellen Verwendung im Innen- und Außenbereich geeignet. Zentrale Bündelader gelgefüllt (längswasserdicht nach IEC 60794-1-2 F5), metallfreier Glasgarn-Nagetierschutz, flammwidriger und halogenfreier LSZH-Außenmantel (IEC 60332-1, IEC 60332-3). UV-beständig. Inklusive individuellem Dämpfungsmessprotokoll.',
    },
    characteristics: '4G OM3 50/125, 30m, 4x LC, U-DQ(ZN)BH, LSZH',
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: '4G OM3 50/125',
        functiondefcategory: '400',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;35;0',
        pos: 1,
      },
      {
        connectionDesignation: '1',
        connectionDescription: 'OM3 50/125 (Faser 1)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 2,
      },
      {
        connectionDesignation: '2',
        connectionDescription: 'OM3 50/125 (Faser 2)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 3,
      },
      {
        connectionDesignation: '3',
        connectionDescription: 'OM3 50/125 (Faser 3)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 4,
      },
      {
        connectionDesignation: '4',
        connectionDescription: 'OM3 50/125 (Faser 4)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 5,
      },
    ],
    pictureRelPath: 'GFK/113030.png',
    pictureLocalPath: 'EDZ/261021/GFK.113030/113030.png',
    docs: [
      {
        relPath: 'GFK/113030_datasheet.pdf',
        localPath: 'EDZ/261021/GFK.113030/113030_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261021/GFK.113030/GFK.113030.edz',
  },

  'SIE.9LA1110-6SP31-7EA0': {
    partNr: 'SIE.9LA1110-6SP31-7EA0',
    typeNr: '9LA1110-6SP31-7EA0',
    orderNr: '9LA1110-6SP31-7EA0',
    manufacturer: 'SIE',
    productTopGroup: 1, // Elektrotechnika (Electrical engineering)
    productGroup: 26,   // Sterowniki PLC / Komputery przemysłowe (PLC)
    productSubGroup: 1, // Urządzenie kompaktowe / ogólne (General)
    craftElectrical: 1,
    codeLetter: 'A',
    isAccessory: 0,
    weight: '1.12',     // kg (1,12 kg terminal / 3,90 kg kompletny zestaw)
    width: '35',        // mm (szerokość obudowy bez podstawy)
    height: '200',      // mm (wysokość obudowy)
    depth: '200',       // mm (głębokość obudowy)
    descr1: {
      pl_PL: 'Terminal kliencki SIMATIC SIVaaS Thin Client HP t655 Dual Screen Win11 IoT (de)',
      en_US: 'SIMATIC SIVaaS Thin Client HP t655 Dual Screen Win11 IoT (de)',
      de_DE: 'SIMATIC SIVaaS Thin Client HP t655 Dual Screen Win11 IoT (de)',
    },
    descr2: {
      pl_PL: 'IADC SIVaaS, AMD Ryzen, 8GB RAM, 256GB SSD, 3x DP, 1x GbE RJ45',
      en_US: 'IADC SIVaaS, AMD Ryzen, 8GB RAM, 256GB SSD, 3x DP, 1x GbE RJ45',
      de_DE: 'IADC SIVaaS, AMD Ryzen, 8GB RAM, 256GB SSD, 3x DP, 1x GbE RJ45',
    },
    note: {
      pl_PL: 'SIMATIC Virtualization as a Service (SIVaaS) / Industrial Automation DataCenter (IADC) Thin Client oparty na sprzęcie HP t655. Wstępnie zainstalowany system operacyjny Microsoft Windows 11 IoT Enterprise (lokalizacja niemiecka). Konfiguracja Dual Screen z obsługą dwóch monitorów operatorskich w systemach SCADA/DCS (SIMATIC PCS 7, WinCC). Wyposażenie sprzętowe: procesor AMD Ryzen Embedded, 8 GB pamięci RAM, 256 GB pamięci masowej M.2 NVMe SSD, układ graficzny AMD Radeon Graphics, interfejs sieciowy 1x 1 Gbit/s RJ45, 3x wyjście DisplayPort, porty USB-A oraz USB-C. W zestawie klawiatura z niemieckim układem klawiszy, mysz oraz zasilacz zewnętrzny. Zakres temperatur pracy: od 10 °C do 40 °C.',
      en_US: 'SIMATIC Virtualization as a Service (SIVaaS) / Industrial Automation DataCenter (IADC) Thin Client based on HP t655 hardware. Pre-installed with Microsoft Windows 11 IoT Enterprise operating system (German localization). Dual-screen configuration supporting two operator displays in industrial SCADA/DCS environments (SIMATIC PCS 7, WinCC). Hardware specifications: AMD Ryzen Embedded processor, 8 GB RAM, 256 GB M.2 NVMe SSD, AMD Radeon Graphics, 1x 1 Gbit/s RJ45 Ethernet, 3x DisplayPort outputs, USB-A and USB-C ports. Includes German layout keyboard, optical mouse, and external AC power adapter. Operating temperature range: 10 °C to 40 °C.',
      de_DE: 'SIMATIC Virtualization as a Service (SIVaaS) / Industrial Automation DataCenter (IADC) Thin Client basierend auf HP t655 Hardware. Vorinstalliertes Betriebssystem Microsoft Windows 11 IoT Enterprise (deutsche Lokalisierung). Dual-Screen-Konfiguration für den Betrieb von zwei Bedienmonitoren in industriellen SCADA/DCS-Umgebungen (SIMATIC PCS 7, WinCC). Hardwareausstattung: AMD Ryzen Embedded Prozessor, 8 GB RAM, 256 GB M.2 NVMe SSD, AMD Radeon Graphics, 1x 1 Gbit/s RJ45 Netzwerkschnittstelle, 3x DisplayPort-Ausgänge, USB-A- und USB-C-Anschlüsse. Inklusive Tastatur mit deutschem Tastaturlayout, optischer Maus und externem Netzteil. Betriebstemperaturbereich: 10 °C bis 40 °C.',
    },
    characteristics: 'AMD Ryzen, 8GB RAM, 256GB SSD, Win11 IoT, Dual Screen',
    functionTemplates: [
      {
        connectionDesignation: '+\n-',
        connectionDescription: '+19.5V\nGND',
        functiondefcategory: '200',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 1,
      },
      {
        connectionDesignation: 'X1',
        connectionDescription: 'LAN 1GbE RJ45',
        functiondefcategory: '1202',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 2,
      },
      {
        connectionDesignation: 'X2',
        connectionDescription: 'DisplayPort 1',
        functiondefcategory: '1202',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 3,
      },
      {
        connectionDesignation: 'X3',
        connectionDescription: 'DisplayPort 2',
        functiondefcategory: '1202',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 4,
      },
      {
        connectionDesignation: 'X4',
        connectionDescription: 'DisplayPort 3',
        functiondefcategory: '1202',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 5,
      },
      {
        connectionDesignation: 'X5',
        connectionDescription: 'USB-C 3.2',
        functiondefcategory: '1202',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 6,
      },
    ],
    pictureRelPath: 'SIE/9LA1110-6SP31-7EA0.png',
    pictureLocalPath: 'EDZ/261021/SIE.9LA1110-6SP31-7EA0/9LA1110-6SP31-7EA0.png',
    docs: [
      {
        relPath: 'SIE/9LA1110-6SP31-7EA0_datasheet.pdf',
        localPath: 'EDZ/261021/SIE.9LA1110-6SP31-7EA0/9LA1110-6SP31-7EA0_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261021/SIE.9LA1110-6SP31-7EA0/SIE.9LA1110-6SP31-7EA0.edz',
  },

  'LIN.41081': {
    partNr: 'LIN.41081',
    typeNr: '41081',
    orderNr: '41081',
    manufacturer: 'LIN',
    productTopGroup: 1, // Elektrotechnika (Electrical engineering)
    productGroup: 29,   // Kable (Cables)
    productSubGroup: 184, // Kable konfekcjonowane (Prefabricated)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 0,
    weight: '1.45',     // kg (waga kabla 20 m)
    width: '20',        // mm (szerokość wtyku DP)
    height: '12',       // mm (wysokość wtyku DP)
    depth: '20000',     // mm (długość kabla 20 m)
    descr1: {
      pl_PL: 'Aktywny kabel DisplayPort 1.2 20m 4K UHD (ThinClient - TouchScreen)',
      en_US: 'Active DisplayPort 1.2 Cable 20m 4K UHD (ThinClient - TouchScreen)',
      de_DE: 'Displayport-Kabel Aktiv 20m DP 1.2 4K UHD (ThinClient - TouchScreen)',
    },
    descr2: {
      pl_PL: 'LINDY 41081, 4K@60Hz 4:4:4, 21.6 Gbps, 24K pozłacane styki, PVC',
      en_US: 'LINDY 41081, 4K@60Hz 4:4:4, 21.6 Gbps, 24K gold plated, PVC',
      de_DE: 'LINDY 41081, 4K@60Hz 4:4:4, 21.6 Gbps, 24K vergoldet, PVC',
    },
    note: {
      pl_PL: 'Aktywny kabel połączeniowy DisplayPort 1.2 marki LINDY (nr kat. 41081) o długości 20 m. Przeznaczony do bezpośredniego, stabilnego połączenia stacji klienckiej Thin Client (np. Siemens SIMATIC SIVaaS) z dotykowym panelem operatorskim TouchScreen lub monitorem przemysłowym na duże odległości bez utraty jakości sygnału. Zintegrowany aktywny chipset wzmacniający sygnał w obudowie wtyku. Obsługa rozdzielczości do 4K UHD (3840x2160 @ 60Hz 4:4:4 8bit) oraz przepustowości do 21,6 Gbit/s (HBR2). Zgodność z HDCP i DPCP, obsługa 8-kanałowego dźwięku cyfrowego. Pozłacane styki 24K, potrójne ekranowanie, solidne wtyki z blokadą mechaniczną (latch). Średnica zewnętrzna kabla: 7,0 mm. Temperatura pracy: od 0 °C do +70 °C.',
      en_US: 'Active DisplayPort 1.2 connection cable from LINDY (part no. 41081), 20 m length. Designed for reliable long-distance connection of industrial Thin Clients (e.g. Siemens SIMATIC SIVaaS) with operator TouchScreen displays or monitors without signal degradation. Features an integrated active signal repeater chipset inside the connector housing. Supports resolutions up to 4K UHD (3840x2160 @ 60Hz 4:4:4 8-bit) and bandwidths up to 21.6 Gbps (HBR2). HDCP and DPCP compliant, supports 8-channel uncompressed digital audio. 24K gold-plated contacts, triple shielding, latching DisplayPort connectors. Cable outer diameter: 7.0 mm. Operating temperature: 0 °C to +70 °C.',
      de_DE: 'Displayport-Kabel Aktiv für die Verbindung des ThinClients mit dem TouchScreen - LINDY DisplayPort 1.2 Aktivkabel, 20m (Art.-Nr. 41081). Zur verlustfreien Signalübertragung über lange Distanzen zwischen Industrie-ThinClient (z. B. Siemens SIMATIC SIVaaS) und TouchScreen-Bedienstation bzw. Monitor. Integrierter aktiver Verstärker-Chipsatz im Steckergehäuse. Unterstützt Auflösungen bis 4K UHD (3840x2160 @ 60Hz 4:4:4 8-bit) und Bandbreiten bis 21,6 Gbit/s (HBR2). HDCP- und DPCP-konform, unterstützt 8-Kanal-Audio. 24K vergoldete Kontakte, dreifache Schirmung, Stecker mit Arretierung. Kabeldurchmesser: 7,0 mm. Betriebstemperaturbereich: 0 °C bis +70 °C.',
    },
    characteristics: 'DP 1.2 Aktiv, 20m, 4K@60Hz, 21.6Gbps, 24K',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4002888410816',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'DisplayPort 1.2 Aktiv 20m',
        functiondefcategory: '400',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;35;0',
        pos: 1,
      },
      {
        connectionDesignation: 'ML_L0',
        connectionDescription: 'Main Link Lane 0',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 2,
      },
      {
        connectionDesignation: 'ML_L1',
        connectionDescription: 'Main Link Lane 1',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 3,
      },
      {
        connectionDesignation: 'ML_L2',
        connectionDescription: 'Main Link Lane 2',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 4,
      },
      {
        connectionDesignation: 'ML_L3',
        connectionDescription: 'Main Link Lane 3',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 5,
      },
      {
        connectionDesignation: 'AUX',
        connectionDescription: 'Auxiliary Channel',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 6,
      },
      {
        connectionDesignation: 'HPD',
        connectionDescription: 'Hot Plug Detect',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 7,
      },
      {
        connectionDesignation: 'PWR',
        connectionDescription: 'DP_PWR +3.3V DC',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 8,
      },
    ],
    pictureRelPath: 'LIN/41081.png',
    pictureLocalPath: 'EDZ/261021/LIN.41081/41081.png',
    docs: [
      {
        relPath: 'LIN/41081_datasheet.pdf',
        localPath: 'EDZ/261021/LIN.41081/41081_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261021/LIN.41081/LIN.41081.edz',
  },

  'LIN.42782': {
    partNr: 'LIN.42782',
    typeNr: '42782',
    orderNr: '42782',
    manufacturer: 'LIN',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.CABLES,                       // 29 (Kable)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.CABLES_PREFABRICATED,   // 184 (Kable konfekcjonowane)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 0,
    weight: '0.42',     // kg (420 g)
    width: '20',        // mm (szerokość obudowy żeńskiej repeatera)
    height: '13',       // mm (wysokość obudowy repeatera)
    depth: '12000',     // mm (długość kabla 12 m)
    descr1: {
      pl_PL: 'Przedłużacz aktywny USB 2.0 Pro 12m (Active Extension Pro)',
      en_US: '12m USB 2.0 Active Extension Pro',
      de_DE: '12m USB 2.0 Aktivverlängerung Pro',
    },
    descr2: {
      pl_PL: 'LINDY 42782, USB-A męski / USB-A żeński z blokadą, 480 Mbps',
      en_US: 'LINDY 42782, USB-A male / USB-A female latching, 480 Mbps',
      de_DE: 'LINDY 42782, USB-A Stecker / USB-A Buchse verriegelbar, 480 Mbit/s',
    },
    note: {
      pl_PL: 'Aktywny kabel przedłużający USB 2.0 High Speed marki LINDY (nr kat. 42782) o długości 12 m z wbudowanym wzmacniaczem sygnału (Active Repeater) i gniazdem USB-A z mechaniczną blokadą zatrzaskową (latching connector). Element modułowego systemu Lindy Active Extension System Pro umożliwiającego stabilną rozbudowę toru USB do 60 m (np. segment początkowy 8 m [42780] + segment 12 m [42782] = linia 20 m). Przepustowość do 480 Mbit/s, pełna kompatybilność z USB 1.1/1.0. Złącza: USB Typ A męski na USB Typ A żeński ze stykami pozłacanymi. Podwójne ekranowanie (folia Al-Mylar + oplot miedziany cynowany), przewody 26/20 AWG. Średnica zewnętrzna kabla: 5,0 mm. Zasilanie z portu USB (bus-powered). Temperatura pracy: 0 °C do +50 °C.',
      en_US: 'LINDY 12m USB 2.0 Active Extension Pro (part no. 42782) with integrated active signal repeater and latching female USB-A connector. Part of the modular Lindy USB 2.0 Active Extension System Pro enabling distance extensions up to 60m (e.g., initial 8m segment [42780] + 12m segment [42782] = 20m run). High Speed data rates up to 480 Mbps, backwards compatible with USB 1.1/1.0. Connectors: USB Type A Male to USB Type A Female with locking latch and gold-plated pins. Double shielding (Al-Mylar foil + tinned copper braid), 26/20 AWG conductors. Outer cable diameter: 5.0 mm. Bus-powered from USB port. Operating temperature: 0 °C to +50 °C.',
      de_DE: 'LINDY 12m USB 2.0 Aktivverlängerung Pro (Art.-Nr. 42782) mit integriertem aktiven Signalverstärker und verriegelbarer USB-A Buchse. Teil des modularen Lindy USB 2.0 Active Extension System Pro zur Signalübertragung bis zu 60 m (z.B. Startsegment 8 m [42780] + Verlängerungssegment 12 m [42782] = 20m Verbindung). High Speed Übertragungsrate bis 480 Mbit/s, abwärtskompatibel zu USB 1.1/1.0. Anschlüsse: USB Typ A Stecker an USB Typ A Buchse mit Verriegelungshaken und vergoldeten Kontakten. Doppelte Schirmung (Alu-Mylar-Folie + verzinntes Kupfergeflecht), Leiterquerschnitt 26/20 AWG. Kabeldurchmesser: 5,0 mm. Bus-powered über USB-Schnittstelle. Betriebstemperatur: 0 °C bis +50 °C.',
    },
    characteristics: 'USB 2.0 Aktiv Pro, 12m, 480Mbps, Latching, 26/20AWG',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4002888427821',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'USB 2.0 Aktiv Pro 12m',
        functiondefcategory: '400',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;35;0',
        pos: 1,
      },
      {
        connectionDesignation: '1',
        connectionDescription: 'VBUS (+5V DC)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 2,
      },
      {
        connectionDesignation: '2',
        connectionDescription: 'D- (Data -)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 3,
      },
      {
        connectionDesignation: '3',
        connectionDescription: 'D+ (Data +)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 4,
      },
      {
        connectionDesignation: '4',
        connectionDescription: 'GND (Masse)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 5,
      },
      {
        connectionDesignation: 'SH',
        connectionDescription: 'Shield (Schirm)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 6,
      },
    ],
    pictureRelPath: 'LIN/42782.png',
    pictureLocalPath: 'EDZ/261021/LIN.42782/42782.png',
    docs: [
      {
        relPath: 'LIN/42782_datasheet.pdf',
        localPath: 'EDZ/261021/LIN.42782/42782_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261021/LIN.42782/LIN.42782.edz',
  },

  'SIE.6XV1840-2AH10': {
    partNr: 'SIE.6XV1840-2AH10',
    typeNr: '6XV1840-2AH10',
    orderNr: '6XV1840-2AH10',
    manufacturer: 'SIE',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.CABLES,                       // 29 (Kable)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,                // 1 (Kable ogólne / z metrażu / Verlegekabel)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 0,
    weight: '0.067',    // kg/m (67 kg/km)
    width: '6.5',       // mm (średnica zewnętrzna kabla)
    height: '6.5',      // mm
    depth: '1000',      // mm (długość 1 m)
    descr1: {
      pl_PL: 'Kabel Industrial Ethernet FastConnect Standard GP 2x2 (PROFINET Typ A)',
      en_US: 'Industrial Ethernet FC TP Standard Cable GP 2x2 (PROFINET Type A)',
      de_DE: 'Industrial Ethernet FC TP Standard Cable GP 2x2 (PROFINET Typ A)',
    },
    descr2: {
      pl_PL: '6XV1840-2AH10, Cat5e, 100 Mbit/s, 4-żyłowy ekranowany, PVC zielony RAL 6018',
      en_US: '6XV1840-2AH10, Cat5e, 100 Mbps, 4-core shielded, PVC green RAL 6018',
      de_DE: '6XV1840-2AH10, Cat5e, 100 Mbit/s, 4-adrig geschirmt, PVC grün RAL 6018',
    },
    note: {
      pl_PL: 'Przewód instalacyjny Industrial Ethernet FastConnect Standard Cable GP 2x2 (PROFINET Typ A) marki Siemens (nr kat. 6XV1840-2AH10). 4-żyłowy, podwójnie ekranowany kabel symetryczny TP kategorii 5e (Cat5e) do transmisji danych z prędkością do 100 Mbit/s (Fast Ethernet). Przeznaczony do stałych instalacji przemysłowych (Type A), odporny na zakłócenia elektromagnetyczne w trudnych warunkach środowiskowych. Zoptymalizowany do szybkiego montażu ze złączami przemysłowymi IE FC RJ45 2x2 (FastConnect) bez konieczności zdejmowania izolacji z poszczególnych żył (przy użyciu narzędzia IE FC Stripping Tool 6GK1901-1GA00). Konstrukcja: żyły miedziane jednodrutowe AWG 22/1 (średnica 0,64 mm), izolacja PE, ekran z folii aluminiowej oraz oplotu z drutów miedzianych cynowanych, płaszcz zewnętrzny PVC w kolorze zielonym (RAL 6018). Średnica zewnętrzna kabla: 6,5 mm ± 0,2 mm. Waga: ok. 67 kg/km (0,067 kg/m). Zakres temperatur pracy: od -40 °C do +85 °C. Samogasnący wg IEC 60332-1-2 / UL 1685. Odporny na promieniowanie UV i oleje mineralne.',
      en_US: 'SIMATIC NET Industrial Ethernet FastConnect Standard Cable GP 2x2 (PROFINET Type A) by Siemens (order no. 6XV1840-2AH10). 4-core, double-shielded twisted pair TP installation cable category 5e (Cat5e) for data transmission rates up to 100 Mbps (Fast Ethernet). Designed for universal stationary industrial installations (Type A), offering high electromagnetic compatibility (EMC) in harsh industrial environments. Specially optimized for fast and reliable assembly with IE FC RJ45 2x2 connectors using the FastConnect stripping tool (6GK1901-1GA00). Construction: solid copper conductors AWG 22/1 (0.64 mm diameter), PE insulation, overlapped aluminum-clad foil shield and tinned copper wire braid shield, green PVC outer jacket (RAL 6018). Outer cable diameter: 6.5 mm ± 0.2 mm. Weight: approx. 67 kg/km (0.067 kg/m). Operating temperature: -40 °C to +85 °C. Flame retardant per IEC 60332-1-2 / UL 1685. UV and mineral oil resistant.',
      de_DE: 'SIMATIC NET Industrial Ethernet FastConnect Standard Cable GP 2x2 (PROFINET Typ A) von Siemens (Bestell-Nr. 6XV1840-2AH10). 4-adrige, doppelt geschirmte TP-Installationsleitung der Kategorie 5e (Cat5e) für Datenübertragungsraten bis 100 Mbit/s (Fast Ethernet). Ausgelegt für feste Verlegung in industriellen Anlagen (Typ A) mit hoher Störfestigkeit gegenüber elektromagnetischen Beeinflussungen. Optimiert für den schnellen Vor-Ort-Anschluss an IE FC RJ45 2x2 Steckverbinder mit dem IE FC Stripping Tool (6GK1901-1GA00). Aufbau: massive Kupferleiter AWG 22/1 (0,64 mm Durchmesser), PE-Aderisolation, überlappte alukaschierte Folie und verzinntes Kupferdrahtgeflecht, grüner PVC-Außenmantel (RAL 6018). Kabelaußendurchmesser: 6,5 mm ± 0,2 mm. Gewicht: ca. 67 kg/km (0,067 kg/m). Betriebstemperaturbereich: -40 °C bis +85 °C. Flammwidrig nach IEC 60332-1-2 / UL 1685. UV- und mineralölbeständig.',
    },
    characteristics: 'Cat5e, 2x2xAWG22/1, 100Mbps, PROFINET Type A, FastConnect, PVC grün',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4019169400473',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'IE FC TP Standard Cable GP 2x2',
        functiondefcategory: '400',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;35;0',
        pos: 1,
      },
      {
        connectionDesignation: 'YE',
        connectionDescription: 'TX+ (Yellow / Gelb)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 2,
      },
      {
        connectionDesignation: 'OG',
        connectionDescription: 'TX- (Orange)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 3,
      },
      {
        connectionDesignation: 'WH',
        connectionDescription: 'RX+ (White / Weiß)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 4,
      },
      {
        connectionDesignation: 'BU',
        connectionDescription: 'RX- (Blue / Blau)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 5,
      },
      {
        connectionDesignation: 'SH',
        connectionDescription: 'Shield (Schirm / Cu-Geflecht)',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 6,
      },
    ],
    pictureRelPath: 'SIE/6XV1840-2AH10.png',
    pictureLocalPath: 'EDZ/261021/SIE.6XV1840-2AH10/6XV1840-2AH10.png',
    docs: [
      {
        relPath: 'SIE/6XV1840-2AH10_datasheet.pdf',
        localPath: 'EDZ/261021/SIE.6XV1840-2AH10/6XV1840-2AH10_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261021/SIE.6XV1840-2AH10/SIE.6XV1840-2AH10.edz',
  },

  'PF.205804': {
    partNr: 'PF.205804',
    typeNr: 'RL28-8-H-2000-IR-3974/47/112',
    orderNr: '205804',
    manufacturer: 'PF',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.SENSORS_SWITCHES_BUTTONS,     // 12 (Czujniki, łączniki i przyciski)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,                // 1 (Ogólne)
    craftElectrical: 1,
    codeLetter: 'B',
    isAccessory: 0,
    weight: '0.1',      // kg (100 g)
    width: '25.8',      // mm
    height: '88',       // mm
    depth: '65.5',      // mm
    mountingSpace: '2270.4', // mm² (25.8 x 88)
    descr1: {
      pl_PL: 'Czujnik optoelektroniczny odbiciowy z tłumieniem tła 20...2000 mm',
      en_US: 'Background suppression sensor 20...2000 mm',
      de_DE: 'Reflexionslichttaster mit Hintergrundausblendung 20...2000 mm',
    },
    descr2: {
      pl_PL: 'RL28-8-H-2000-IR-3974/47/112, 10-30V DC, 2x PNP komplementarne, M12 5-pin, IP67',
      en_US: 'RL28-8-H-2000-IR-3974/47/112, 10-30V DC, 2x PNP complementary, M12 5-pin, IP67',
      de_DE: 'RL28-8-H-2000-IR-3974/47/112, 10-30V DC, 2x PNP antivalent, M12 5-polig, IP67',
    },
    note: {
      pl_PL: 'Czujnik optoelektroniczny odbiciowy z eliminacją wpływu tła (HGA) marki Pepperl+Fuchs (nr art. 205804, typ RL28-8-H-2000-IR-3974/47/112). Zasięg detekcji: 20...2000 mm, regulowany potencjometrem. Źródło światła: dioda podczerwona IRED (modulowane światło podczerwone 880 nm). Minimalna różnica czarny-biały (< 40%). Odporny na oświetlenie zewnętrzne do 50 000 luksów. Wyjście sygnałowe: 2 wyjścia tranzystorowe PNP, komplementarne (Q i /Q), z zabezpieczeniem zwarciowym i przed odwrotną polaryzacją, otwarty kolektor (prąd łączeniowy max. 200 mA, częstotliwość 250 Hz, czas odpowiedzi 2 ms). Przełącznik trybu jasno/ciemno. Napięcie zasilania: 10...30 V DC (tętnienia 10%, prąd jałowy <= 40 mA). Wytrzymała obudowa z tworzywa sztucznego ABS z mocowaniem jaskółczy ogon (dovetail), stopień ochrony IP67, klasa ochronności II. Złącze wtykowe metalowe M12 x 1, 5-stykowe, obrotowe w zakresie 90°. Wskaźniki LED stanu pracy (zielona) i przełączenia (2 żółte). Temperatura pracy: od -40 °C do +60 °C. Certyfikaty: CE, cULus Listed (E87056), UKCA.',
      en_US: 'Background suppression photoelectric sensor by Pepperl+Fuchs (part no. 205804, type RL28-8-H-2000-IR-3974/47/112). Detection range: 20...2000 mm, adjustable via potentiometer. Light source: modulated infrared IRED (880 nm). Minimal black-white difference (< 40%). Not sensitive to ambient light up to 50,000 Lux. Signal output: 2 PNP outputs, complementary (Q and /Q), short-circuit protected, reverse polarity protected, open collectors (switching current max. 200 mA, switching frequency 250 Hz, response time 2 ms). Light-on/dark-on changeover switch. Operating voltage: 10...30 V DC (ripple 10%, no-load supply current <= 40 mA). Robust plastic ABS housing with dovetail mount, degree of protection IP67, protection class II. Metal M12 x 1 connector, 5-pin, 90° rotatable. LED indicators for operation (green) and switching state (2 yellow). Operating temperature: -40 °C to +60 °C. Approvals: CE, cULus Listed (E87056), UKCA.',
      de_DE: 'Reflexionslichttaster mit Hintergrundausblendung (HGA) von Pepperl+Fuchs (Art.-Nr. 205804, Typ RL28-8-H-2000-IR-3974/47/112). Tastbereich: 20...2000 mm, einstellbar über Tastweiteneinsteller. Lichtsender: moduliertes Infrarotlicht IRED (880 nm). Geringe Schwarz-Weiß-Differenz (< 40%). Fremdlichtunempfindlich bis 50.000 Lux. Signalausgang: 2 PNP-Ausgänge, antivalent (Q und /Q), kurzschlussfest, verpolgeschützt, offene Kollektoren (Schaltstrom max. 200 mA, Schaltfrequenz 250 Hz, Ansprechzeit 2 ms). Hell-/Dunkel-Umschalter. Betriebsspannung: 10...30 V DC (Restwelligkeit 10%, Leerlaufstrom <= 40 mA). Robustes ABS-Kunststoffgehäuse mit Schwalbenschwanzführung, Schutzart IP67, Schutzklasse II. Metallstecker M12 x 1, 5-polig, um 90° drehbar. LED-Anzeigen für Betrieb (grün) und Schaltzustand (2 gelb). Betriebstemperatur: -40 °C bis +60 °C. Zulassungen: CE, cULus Listed (E87056), UKCA.',
    },
    characteristics: 'HGA, 20-2000mm, IR, 10-30VDC, 2xPNP, M12 5-pin, IP67',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4050143024926',
    },
    functionTemplates: [
      {
        connectionDesignation: '1\n3',
        connectionDescription: '+UB\n0 V',
        functiondefcategory: '200',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 1,
      },
      {
        connectionDesignation: '4',
        connectionDescription: 'Q (Light-on PNP NO)',
        functiondefcategory: '200',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 2,
      },
      {
        connectionDesignation: '2',
        connectionDescription: '/Q (Dark-on PNP NC)',
        functiondefcategory: '200',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 3,
      },
      {
        connectionDesignation: '5',
        connectionDescription: 'n.c.',
        functiondefcategory: '200',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 4,
      },
    ],
    pictureRelPath: 'PF/205804.png',
    pictureLocalPath: 'EDZ/261023/PF.205804/205804.png',
    docs: [
      {
        relPath: 'PF/205804_datasheet.pdf',
        localPath: 'EDZ/261023/PF.205804/205804_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261023/PF.205804/PF.205804.edz',
  },

  'SIE.5SG6206': {
    partNr: 'SIE.5SG6206',
    typeNr: '5SG6206',
    orderNr: '5SG6206',
    manufacturer: 'SIE',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 6,    // Zabezpieczenia (Protection devices)
    productSubGroup: 1, // Bezpieczniki / ogólne (General)
    craftElectrical: 1,
    codeLetter: 'F',
    isAccessory: 0,
    weight: '0.146',    // kg (146 g)
    width: '27',        // mm
    height: '200',      // mm
    depth: '43',        // mm
    descr1: {
      pl_PL: 'Podstawa bezpiecznikowa NEOZED D02 3-biegunowa 63 A na szyny 60 mm',
      en_US: 'NEOZED bus-mounting fuse base D02 3-pole 63 A for 60 mm busbar systems',
      de_DE: 'NEOZED-Reitersockel D02 3-polig 63 A für 60 mm Sammelschienensysteme',
    },
    descr2: {
      pl_PL: 'SENTRON 8US 60 mm, D02, 63 A, 400 V AC / 250 V DC',
      en_US: 'SENTRON 8US 60 mm, D02, 63 A, 400 V AC / 250 V DC',
      de_DE: 'SENTRON 8US 60 mm, D02, 63 A, 400 V AC / 250 V DC',
    },
    note: {
      pl_PL: 'Podstawa bezpiecznikowa SENTRON NEOZED (reitersockel) do montażu na systemach szyn zbiorczych 8US o rozstawie 60 mm. Rozmiar: D02, 3-biegunowa. Prąd znamionowy In: 63 A. Napięcie znamionowe Un: 400 V AC / 250 V DC. Strata mocy: 3 W na biegun przy prądzie znamionowym. Szerokość modułu: 27 mm. Wyposażona w pokrywę osłonową o szerokości 27 mm. Przyłącze zasilania: bezpośredni styk wtykowy na szynę Cu 60 mm. Przyłącze odpływowe: zacisk ramowy obejmujący przewody od 1,5 mm² do 25 mm². Zgodność z normami IEC / DIN EN 60269-1, DIN VDE 0636-3.',
      en_US: 'SENTRON NEOZED fuse base (bus-mounting base / Reitersockel) for 60 mm 8US busbar systems. Size: D02, 3-pole. Rated operational current In: 63 A. Rated operational voltage Un: 400 V AC / 250 V DC. Power loss: 3 W per pole at rated current. Module width: 27 mm. Includes protective cover (27 mm width). Busbar connection: direct plug-on contact onto 60 mm copper busbars. Outgoing terminal: box terminal for conductors from 1.5 mm² to 25 mm². Compliant with IEC / DIN EN 60269-1, DIN VDE 0636-3.',
      de_DE: 'SENTRON NEOZED-Sicherungsunterteil (Reitersockel) für 60 mm 8US-Sammelschienensysteme. Baugröße: D02, 3-polig. Bemessungsstrom In: 63 A. Bemessungsspannung Un: 400 V AC / 250 V DC. Verlustleistung: 3 W je Pol bei Bemessungsstrom. Baubreite: 27 mm. Inklusive Abdeckung 27 mm breit. Schienenanschluss: Direktaufsteckkontakt auf 60 mm Sammelschienen. Abgangsklemme: Rahmenklemme für Leiterquerschnitte 1,5 mm² bis 25 mm². Normen: IEC / DIN EN 60269-1, DIN VDE 0636-3.',
    },
    characteristics: 'D02, 3P, 63A, 400V AC / 250V DC, 8US 60mm',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4001869392424',
    },
    functionTemplates: [
      {
        connectionDesignation: 'L1\n2',
        connectionDescription: 'L1 (Busbar)\n2 (Load)',
        functiondefcategory: '100',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;15;0',
        pos: 1,
      },
      {
        connectionDesignation: 'L2\n4',
        connectionDescription: 'L2 (Busbar)\n4 (Load)',
        functiondefcategory: '100',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;15;0',
        pos: 2,
      },
      {
        connectionDesignation: 'L3\n6',
        connectionDescription: 'L3 (Busbar)\n6 (Load)',
        functiondefcategory: '100',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;15;0',
        pos: 3,
      },
    ],
    pictureRelPath: 'SIE/5SG6206.png',
    pictureLocalPath: 'EDZ/261027/SIE.5SG6206/5SG6206.png',
    docs: [
      {
        relPath: 'SIE/5SG6206_datasheet.pdf',
        localPath: 'EDZ/261027/SIE.5SG6206/5SG6206_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261027/SIE.5SG6206/SIE.5SG6206.edz',
  },

  'SIE.5SH4163': {
    partNr: 'SIE.5SH4163',
    typeNr: '5SH4163',
    orderNr: '5SH4163',
    manufacturer: 'SIE',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 6,    // Zabezpieczenia (Protection devices)
    productSubGroup: 1, // Bezpieczniki / ogólne (General)
    craftElectrical: 1,
    codeLetter: 'F',
    isAccessory: 1,
    weight: '0.011',    // kg (11 g)
    width: '24',        // mm
    height: '24',       // mm
    depth: '26',        // mm
    descr1: {
      pl_PL: 'Główka bezpiecznikowa NEOZED D02 63 A z tworzywa z otworem kontrolnym',
      en_US: 'NEOZED screw cap D02 63 A plastic with test hole',
      de_DE: 'NEOZED-Schraubkappe D02 63 A Kunststoff mit Prüfloch',
    },
    descr2: {
      pl_PL: 'SENTRON NEOZED D02, gwint E18, do 63 A',
      en_US: 'SENTRON NEOZED D02, thread E18, up to 63 A',
      de_DE: 'SENTRON NEOZED D02, Gewinde E18, bis 63 A',
    },
    note: {
      pl_PL: 'Główka bezpiecznikowa SENTRON NEOZED wykonana z tworzywa sztucznego (materiału izolacyjnego), z otworem kontrolnym do sprawdzania stanu zadziałania wkładki topikowej. Rozmiar: D02, gwint E18. Prąd znamionowy: do 63 A. Napięcie znamionowe: 400 V AC. Zgodna z normami IEC / DIN EN 60269-1, DIN VDE 0636-3. Przeznaczona do gniazd i rozłączników bezpiecznikowych NEOZED D02.',
      en_US: 'SENTRON NEOZED screw cap made of molded plastic (insulating material) with inspection/test hole for verifying fuse link status. Size: D02, thread: E18. Rated current: up to 63 A. Rated voltage: 400 V AC. Compliant with IEC / DIN EN 60269-1, DIN VDE 0636-3. For NEOZED D02 fuse bases and fuse disconnectors.',
      de_DE: 'SENTRON NEOZED-Schraubkappe aus Isolierstoff (Kunststoff) mit Prüfloch zur Sichtkontrolle des Sicherungszustands. Baugröße: D02, Gewinde: E18. Bemessungsstrom: bis 63 A. Bemessungsspannung: 400 V AC. Nach IEC / DIN EN 60269-1, DIN VDE 0636-3. Zubehör für NEOZED D02-Sicherungsunterteile und -Lasttrennschalter.',
    },
    characteristics: 'D02, E18, 63A, 400V AC, tworzywo / plastic',
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'D02 63A E18',
        functiondefcategory: '1302',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'SIE/5SH4163.png',
    pictureLocalPath: 'EDZ/261027/SIE.5SH4163/5SH4163.png',
    docs: [
      {
        relPath: 'SIE/5SH4163_datasheet.pdf',
        localPath: 'EDZ/261027/SIE.5SH4163/5SH4163_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261027/SIE.5SH4163/SIE.5SH4163.edz',
  },

  'ESKA.522517': {
    partNr: 'ESKA.522517',
    typeNr: '522.517',
    orderNr: '522.517',
    manufacturer: 'ESKA',
    productTopGroup: 1, // Elektrotechnika
    productGroup: 6,    // Zabezpieczenia (Protection devices)
    productSubGroup: 1, // Bezpieczniki / ogólne (General)
    craftElectrical: 1,
    codeLetter: 'F',
    isAccessory: 0,
    weight: '0.001',    // kg (1 g)
    width: '5',         // mm
    height: '5',        // mm
    depth: '20',        // mm
    descr1: {
      pl_PL: 'Wkładka bezpiecznikowa szklana 5x20 mm T 1 A 250 V',
      en_US: 'Miniature glass fuse link 5x20 mm time-lag T 1 A 250 V',
      de_DE: 'G-Sicherungseinsatz Glas 5x20 mm träge T 1 A 250 V',
    },
    descr2: {
      pl_PL: 'Seria 522.500 (522.517)',
      en_US: 'Series 522.500 (522.517)',
      de_DE: 'Serie 522.500 (522.517)',
    },
    note: {
      pl_PL: 'Wkładka bezpiecznikowa miniaturowa topikowa G 5x20 mm wg IEC 60127-2-3 / DIN EN 60127-2 k. 3. Prąd znamionowy: 1,0 A (1 A). Napięcie znamionowe: 250 V AC. Charakterystyka: zwłoczna (T / träge). Zdolność wyłączania: 35 A @ 250 V AC. Korpus szklany przezroczysty bez środka gaszącego, końcówki stykowe mosiężne niklowane. Maks. spadek napięcia: 150 mV, maks. strata mocy: 1,6 W, całka topnienia I²t: ~2,8 A²s.',
      en_US: 'Miniature fuse link G 5x20 mm acc. to IEC 60127-2-3 / DIN EN 60127-2 sheet 3. Rated current: 1.0 A (1 A). Rated voltage: 250 V AC. Characteristic: time-lag (T). Breaking capacity: 35 A @ 250 V AC. Transparent glass tube without extinguishing agent, nickel-plated brass contact caps. Max. voltage drop: 150 mV, max. power dissipation: 1.6 W, melting integral I²t: ~2.8 A²s.',
      de_DE: 'G-Sicherungseinsatz 5x20 mm nach IEC 60127-2-3 / DIN EN 60127-2 Normblatt 3. Bemessungsstrom: 1,0 A (1 A). Bemessungsspannung: 250 V AC. Kennzeichnung: träge (T). Ausschaltvermögen: 35 A @ 250 V AC. Glasrohr durchsichtig ohne Löschmittel, Kontaktkappen Messing vernickelt. Max. Spannungsfall: 150 mV, Verlustleistung: 1,6 W, Schmelzintegral I²t: ~2,8 A²s.',
    },
    characteristics: 'T 1A, 250V AC, 35A, 5x20mm, szkło / glass',
    functionTemplates: [
      {
        connectionDesignation: '1\n2',
        connectionDescription: '1\n2',
        functiondefcategory: '100',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;15;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'ESKA/522517.png',
    pictureLocalPath: 'EDZ/261027/ESKA.522517/522517.png',
    docs: [
      {
        relPath: 'ESKA/DS_522500.pdf',
        localPath: 'EDZ/261027/ESKA.522517/DS_522500.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261027/ESKA.522517/ESKA.522517.edz',
  },

  'PXC.3270531': {
    partNr: 'PXC.3270531',
    typeNr: 'LPO 16/E',
    orderNr: '3270531',
    manufacturer: 'PXC',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.PLUGS,                       // 4 (Wtyki / Plugs)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,               // 1 (Ogólne / General)
    craftElectrical: 1,
    codeLetter: 'X',
    isAccessory: 0,
    weight: '0.0065',    // kg (6.48 g)
    width: '12.2',       // mm
    height: '18.3',      // mm
    depth: '63.8',       // mm
    descr1: {
      pl_PL: 'Wtyk odczepu LPO 16/E 1-biegunowy Push-in 800 V / 24 A szary',
      en_US: 'Pick-off plug LPO 16/E 1-pos. Push-in 800 V / 24 A gray',
      de_DE: 'Abgriffstecker LPO 16/E 1-polig Push-in 800 V / 24 A grau',
    },
    descr2: {
      pl_PL: 'Seria LPO, przekrój znamionowy: 2,5 mm² (0,14-4 mm²)',
      en_US: 'LPO series, rated cross section: 2.5 mm² (0.14-4 mm²)',
      de_DE: 'LPO-Serie, Bemessungsquerschnitt: 2,5 mm² (0,14-4 mm²)',
    },
    note: {
      pl_PL: 'Wtyk odczepu / wtyk probierczy Phoenix Contact LPO 16/E (nr art. 3270531). 1-biegunowy wtyk odgałęźny z szybką technologią przyłączeniową Push-in do złączek szynowych serii PT / PTV / PTPOWER. Napięcie znamionowe: 800 V, prąd znamionowy: 24 A. Przekrój znamionowy: 2,5 mm², zakres przekrojów przewodu: 0,14...4 mm² (drut/linka), AWG 26-12. Długość odizolowania: 8...10 mm. Wymiary (szer. x wys. x dł.): 12,2 x 18,3 x 63,8 mm. Tworzywo: poliamid PA, klasa palności UL 94 V0, kolor szary (RAL 7042). Norma kolejowa DIN EN 45545-2 (R22/R23, HL 1 - HL 3). GTIN/EAN: 4063151855369.',
      en_US: 'Phoenix Contact LPO 16/E pick-off plug / test connector (Item no. 3270531). 1-position tap-off connector with Push-in connection technology for modular terminal blocks (PT / PTV / PTPOWER series). Rated voltage: 800 V, rated current: 24 A. Rated cross section: 2.5 mm², wire range: 0.14...4 mm² (rigid/flexible), AWG 26-12. Stripping length: 8...10 mm. Dimensions (W x H x D): 12.2 x 18.3 x 63.8 mm. Housing: polyamide PA, flammability class UL 94 V0, gray (RAL 7042). Railway fire safety DIN EN 45545-2 (R22/R23, HL 1 - HL 3). GTIN/EAN: 4063151855369.',
      de_DE: 'Phoenix Contact LPO 16/E Abgriffstecker / Prüfstecker (Art.-Nr. 3270531). 1-poliger Abgriffstecker mit Push-in-Anschlusstechnik für Reihenklemmen der Serien PT / PTV / PTPOWER. Bemessungsspannung: 800 V, Bemessungsstrom: 24 A. Bemessungsquerschnitt: 2,5 mm², Leiterquerschnitt: 0,14...4 mm² (starr/flexibel), AWG 26-12. Abisolierlänge: 8...10 mm. Abmessungen (B x H x T): 12,2 x 18,3 x 63,8 mm. Isolierstoff: Polyamid PA, Brennbarkeitsklasse nach UL 94 V0, grau (RAL 7042). Brandschutz in Schienenfahrzeugen DIN EN 45545-2 (R22/R23, HL 1 - HL 3). GTIN/EAN: 4063151855369.',
    },
    characteristics: '1-pol, Push-in, 800V, 24A, 2.5mm² (0.14-4mm²), szary/gray',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4063151855369',
    },
    functionTemplates: [
      {
        connectionDesignation: '1\n2',
        connectionDescription: 'Tap\nPush-in',
        functiondefcategory: '401',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;36;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'PXC/3270531.png',
    pictureLocalPath: 'EDZ/261028/PXC.3270531/3270531.png',
    docs: [
      {
        relPath: 'PXC/3270531_datasheet.pdf',
        localPath: 'EDZ/261028/PXC.3270531/3270531_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261028/PXC.3270531/PXC.3270531.edz',
  },

  'HP.2FT00AA': {
    partNr: 'HP.2FT00AA',
    typeNr: '2FT00AA',
    orderNr: '2FT00AA',
    manufacturer: 'HP',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.MECHANICS,                               // 3 (Mechanika)
    productGroup: EPLAN_PRODUCT_GROUPS.HOUSING_ACCESSORIES_EXTERNAL,                  // 50 (Akcesoria obudowy, rozbudowa zewnętrzna)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,                                 // 1 (Ogólne)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 1,
    weight: '2.3',       // kg
    width: '330',        // mm
    height: '230',       // mm
    depth: '88.9',       // mm
    descr1: {
      pl_PL: 'Uchwyt montażowy HP Thin Client Mount Bracket VESA 100x100 do 25,5 kg',
      en_US: 'HP Thin Client Mount Bracket VESA 100x100 up to 25.5 kg',
      de_DE: 'HP Thin Client Montagehalterung VESA 100x100 bis 25,5 kg',
    },
    descr2: {
      pl_PL: 'Do HP t420-t655, zintegrowana wnęka na zasilacz, osłona portów',
      en_US: 'For HP t420-t655, integrated power brick holder, port security cover',
      de_DE: 'Für HP t420-t655, integrierte Netzteilhalterung, Port-Sicherheitsabdeckung',
    },
    note: {
      pl_PL: 'Wytrzymały zestaw montażowy HP Thin Client Mounting Bracket (kod produktu: 2FT00AA / 2FT00AA#ABB). Przeznaczony do bezpiecznego montażu terminali HP Thin Client (m.in. t420, t430, t520, t530, t540, t620, t630, t640, t655, Pro t550) z tyłu monitora ze standardem VESA 100x100 mm, na ścianie, ramieniu nośnym lub w szafie sterowniczej. Solidna konstrukcja z tłoczonej blachy stalowej w kolorze czarnym (Jet Black). Maksymalne dopuszczalne obciążenie: 25,5 kg (56,2 lbs). Wymiary gabarytowe: 330 x 230 x 88,9 mm, waga: 2,30 kg. Wyposażony w adapter HP Quick Release z mechanizmem Sure-Lock, dedykowaną wnękę do bezpiecznego osadzenia zasilacza sieciowego oraz demontowalną tylną osłonę zabezpieczającą złącza i przewody przed manipulacją. GTIN/EAN: 0191628341870.',
      en_US: 'Rugged HP Thin Client Mounting Bracket kit (part number: 2FT00AA / 2FT00AA#ABB). Designed for securely mounting HP Thin Clients (including t420, t430, t520, t530, t540, t620, t630, t640, t655, Pro t550) behind a VESA 100x100 mm monitor, onto a wall, articulated arm, or control cabinet. Heavy-duty sheet steel cage construction in matte black (Jet Black). Maximum supported weight capacity: 25.5 kg (56.2 lbs). Dimensions: 330 x 230 x 88.9 mm, weight: 2.30 kg. Features an integrated HP Quick Release adapter with Sure-Lock mechanism, a dedicated power brick compartment, and a removable rear port security cover to protect cables and connectors against unauthorized access. GTIN/EAN: 0191628341870.',
      de_DE: 'Robuste HP Thin Client Montagehalterung (Artikel-Nr.: 2FT00AA / 2FT00AA#ABB). Entwickelt für die sichere Befestigung von HP Thin Clients (u. a. t420, t430, t520, t530, t540, t620, t630, t640, t655, Pro t550) an der Rückseite eines VESA 100x100 mm Monitors, an einer Wand, einem Tragarm oder im Schaltschrank. Robuste Stahlblechkäfig-Konstruktion in Schwarz (Jet Black). Maximale Traglast: 25,5 kg (56,2 lbs). Abmessungen: 330 x 230 x 88,9 mm, Gewicht: 2,30 kg. Ausgestattet mit integriertem HP Quick Release-Adapter mit Sure-Lock-Verriegelung, separater Netzteilaufnahme und abnehmbarer hinterer Port-Sicherheitsabdeckung zum Schutz der Anschlüsse und Kabel. GTIN/EAN: 0191628341870.',
    },
    characteristics: 'VESA 100x100, max. 25.5 kg, stal / steel, czarny / black',
    extraPartAttrs: {
      P_ARTICLE_EAN: '0191628341870',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: '',
        functiondefcategory: '1302',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'HP/2FT00AA.png',
    pictureLocalPath: 'EDZ/261028/HP.2FT00AA/2FT00AA.png',
    docs: [
      {
        relPath: 'HP/2FT00AA_datasheet.pdf',
        localPath: 'EDZ/261028/HP.2FT00AA/2FT00AA_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261028/HP.2FT00AA/HP.2FT00AA.edz',
  },

  'HP.9UB87AA': {
    partNr: 'HP.9UB87AA',
    typeNr: '9UB87AA',
    orderNr: '9UB87AA',
    manufacturer: 'HP',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.MECHANICS, // 3 (Mechanika)
    productGroup: EPLAN_PRODUCT_GROUPS.HOUSING_ACCESSORIES_EXTERNAL, // 50 (Akcesoria obudowy, rozbudowa zewnętrzna)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL, // 1 (Ogólne)
    craftElectrical: 1,
    codeLetter: 'W',
    isAccessory: 1,
    weight: '0.725',
    width: '166.0',
    height: '275.2',
    depth: '62.5',
    descr1: {
      pl_PL: 'Podwójny uchwyt montażowy HP Dual VESA Mount Bracket do Thin Client',
      en_US: 'HP Dual VESA Mount Bracket for HP Thin Client',
      de_DE: 'HP Dual-VESA-Montagehalterung für HP Thin Clients',
    },
    descr2: {
      pl_PL: 'VESA 100x100 mm, nośność do 10,5 kg / 32", uchwyt zasilacza',
      en_US: 'VESA 100x100 mm, load up to 10.5 kg / 32", power supply holder',
      de_DE: 'VESA 100x100 mm, Traglast bis 10,5 kg / 32", Netzteilhalterung',
    },
    note: {
      pl_PL: 'Wytrzymały podwójny zestaw montażowy HP Dual VESA Mount Bracket (kod produktu: 9UB87AA / 9UB87AA#ABB) renomowanej marki HP Inc. Umożliwia jednoczesną, zwartą instalację terminala HP Thin Client (m.in. t640, t540, t430, t240, Elite t655, Pro t550) oraz monitora o przekątnej do 32 cali i masie do 10,5 kg (23,15 lbs) na pojedynczym ramieniu nośnym ze standardem VESA 100x100 mm, na ścianie, wózku mobilnym lub w szafie sterowniczej. Solidna konstrukcja ze stali malowanej proszkowo w kolorze czarnym (Jet Black). Wymiary gabarytowe: 166 x 275,2 x 62,5 mm, waga: 0,725 kg. Wyposażony w mechanizm Quick Release ze śrubami radełkowanymi do szybkiej wymiany terminala bez demontażu monitora, dedykowany uchwyt na zasilacz sieciowy oraz zintegrowane prowadzenie przewodów. GTIN/EAN: 0194850785189.',
      en_US: 'Rugged dual-sided HP Dual VESA Mount Bracket mounting kit (part number: 9UB87AA / 9UB87AA#ABB) by HP Inc. Enables simultaneous, compact mounting of an HP Thin Client (including t640, t540, t430, t240, Elite t655, Pro t550) and a display up to 32 inches and 10.5 kg (23.15 lbs) onto a single VESA 100x100 mm monitor arm, wall mount, mobile cart, or control cabinet. Heavy-duty powder-coated sheet steel construction in matte black (Jet Black). Dimensions: 166 x 275.2 x 62.5 mm, weight: 0.725 kg. Equipped with a built-in Quick Release mechanism with thumb screws for rapid thin client swap-out without dismantling the display, a dedicated power supply holder, and clean cable routing. GTIN/EAN: 0194850785189.',
      de_DE: 'Robuste zweiseitige HP Dual VESA Mount Bracket Montagehalterung (Artikel-Nr.: 9UB87AA / 9UB87AA#ABB) von HP Inc. Ermöglicht die gleichzeitige, platzsparende Montage eines HP Thin Clients (u. a. t640, t540, t430, t240, Elite t655, Pro t550) und eines Monitors bis zu 32 Zoll und 10,5 kg (23,15 lbs) an einem VESA 100x100 mm Monitor-Tragarm, einer Wand, einem mobilen Gerätewagen oder im Schaltschrank. Robuste Stahlblechkonstruktion in Mattschwarz (Jet Black). Abmessungen: 166 x 275,2 x 62,5 mm, Gewicht: 0,725 kg. Ausgestattet mit Quick-Release-Mechanismus mit Rändelschrauben für schnellen Gerätetausch ohne Monitordemontage, separater Netzteilaufnahme und optimierter Kabelführung. GTIN/EAN: 0194850785189.',
    },
    characteristics: 'VESA 100x100, max. 10.5 kg / 32", stal / steel, czarny / black',
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'VESA 100x100 Mounting Interface',
        functiondefcategory: '1302',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'HP/9UB87AA.png',
    pictureLocalPath: 'EDZ/261109/HP.9UB87AA/9UB87AA.png',
    docs: [
      {
        relPath: 'HP/9UB87AA_datasheet.pdf',
        localPath: 'EDZ/261109/HP.9UB87AA/9UB87AA_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261109/HP.9UB87AA/HP.9UB87AA.edz',
  },

  'BIR.5AP112M-2K': {
    partNr: 'BIR.5AP112M-2K',
    typeNr: '5AP112M-2K',
    orderNr: '5AP112M-2K',
    manufacturer: 'BIR',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.MOTORS,                        // 9 (Silniki)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,                 // 1 (Ogólne)
    craftElectrical: 1,
    codeLetter: 'M',
    isAccessory: 0,
    weight: '29.5',      // kg
    width: '230',        // mm
    height: '280',       // mm
    depth: '395',        // mm
    descr1: {
      pl_PL: 'Trójfazowy silnik asynchroniczny klatkowy 4,0 kW 50Hz / 4,8 kW 60Hz 2-bieg.',
      en_US: 'Three-phase asynchronous cage motor 4.0 kW 50Hz / 4.8 kW 60Hz 2-pole',
      de_DE: 'Drehstrom-Asynchronmotor Käfigläufer 4,0 kW 50Hz / 4,8 kW 60Hz 2-polig',
    },
    descr2: {
      pl_PL: '5AP112M-2K, IEC 112M, 380-420V D / 660-725V Y, 2895 min-1, IP55',
      en_US: '5AP112M-2K, IEC 112M, 380-420V D / 660-725V Y, 2895 rpm, IP55',
      de_DE: '5AP112M-2K, IEC 112M, 380-420V D / 660-725V Y, 2895 U/min, IP55',
    },
    note: {
      pl_PL: 'Przemysłowy trójfazowy silnik asynchroniczny prądu przemiennego (3~ Mot.) Robert Birkenbeul GmbH & Co.KG. Model 5AP112M-2K (/AA) w znormalizowanej wielkości mechanicznej IEC 112M. Parametry znamionowe przy 50 Hz: 4,0 kW (5,5 KM), 380-420 V Δ (8,2 A) / 660-725 V Y (4,74 A), 2895 obr./min, cos φ = 0,82. Parametry przy 60 Hz: 4,8 kW (6,5 KM), 440-480 V Δ (8,2 A), 3474 obr./min, cos φ = 0,82. Stopień ochrony: IP55. Klasa termiczna: ThCl F (155°C). Zgodność z normami IEC 34 / EN 60034, oznaczenie CE. Przeznaczony do pracy ciągłej S1 w napędach przemysłowych, pompach, wentylatorach i przekładniach.',
      en_US: 'Industrial three-phase asynchronous AC induction motor (3~ Mot.) by Robert Birkenbeul GmbH & Co.KG. Model 5AP112M-2K (/AA) in standard IEC 112M frame size. Rated parameters at 50 Hz: 4.0 kW (5.5 HP), 380-420 V Δ (8.2 A) / 660-725 V Y (4.74 A), 2895 rpm, cos φ = 0.82. Rated parameters at 60 Hz: 4.8 kW (6.5 HP), 440-480 V Δ (8.2 A), 3474 rpm, cos φ = 0.82. Degree of protection: IP55. Insulation class: ThCl F (155°C). Compliant with IEC 34 / EN 60034, CE marked. Designed for continuous duty S1 in industrial drives, pumps, fans, and gearboxes.',
      de_DE: 'Industrieller Drehstrom-Asynchronmotor (3~ Mot.) von Robert Birkenbeul GmbH & Co.KG. Modell 5AP112M-2K (/AA) in genormter IEC-Baugröße 112M. Bemessungsdaten bei 50 Hz: 4,0 kW (5,5 PS), 380-420 V Δ (8,2 A) / 660-725 V Y (4,74 A), 2895 U/min, cos φ = 0,82. Bemessungsdaten bei 60 Hz: 4,8 kW (6,5 PS), 440-480 V Δ (8,2 A), 3474 U/min, cos φ = 0,82. Schutzart: IP55. Wärmeklasse: ThCl F (155°C). Konform nach IEC 34 / EN 60034, CE-Kennzeichnung. Geeignet für Dauerbetrieb S1 in Industrieantrieben, Pumpen, Lüftern und Getrieben.',
    },
    characteristics: '4.0kW (50Hz) / 4.8kW (60Hz), 380-420V D / 660-725V Y, 2895/3474 rpm, IP55, ThCl F',
    extraPartAttrs: {
      P_ARTICLE_RATEDPOWER: '4.0',
      P_ARTICLE_RATEDSPEED: '2895',
      P_ARTICLE_RATEDVOLTAGE: '400',
      P_ARTICLE_RATEDCURRENT: '8.2',
    },
    functionTemplates: [
      {
        connectionDesignation: 'U1\nV1\nW1\nPE',
        connectionDescription: 'L1\nL2\nL3\nPE',
        functiondefcategory: '1000',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'BIR/5AP112M-2K.png',
    pictureLocalPath: 'EDZ/261029/BIR.5AP112M-2K/5AP112M-2K.png',
    docs: [
      {
        relPath: 'BIR/5AP112M-2K_datasheet.pdf',
        localPath: 'EDZ/261029/BIR.5AP112M-2K/5AP112M-2K_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261029/BIR.5AP112M-2K/BIR.5AP112M-2K.edz',
  },

  'STU.7AA112M-02': {
    partNr: 'STU.7AA112M-02',
    typeNr: '7AA 112 M-02',
    orderNr: '7AA 112 M-02',
    manufacturer: 'STU',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.MOTORS,                        // 9 (Silniki)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,                 // 1 (Ogólne)
    craftElectrical: 1,
    codeLetter: 'M',
    isAccessory: 0,
    weight: '29.0',      // kg (dokładnie ze zdjęcia: 29 kg)
    width: '225',        // mm
    height: '270',       // mm
    depth: '390',        // mm
    descr1: {
      pl_PL: 'Trójfazowy silnik asynchroniczny kołnierzowy IM B14 4,0 kW IE1 2-bieg.',
      en_US: 'Three-phase asynchronous flange motor IM B14 4.0 kW IE1 2-pole',
      de_DE: 'Drehstrom-Asynchronmotor Flanschmotor IM B14 4,0 kW IE1 2-polig',
    },
    descr2: {
      pl_PL: '7AA 112 M-02, IEC 112M, IM B14, 400/690V D/Y, 2905 min-1, IE1-83.1%, IP55',
      en_US: '7AA 112 M-02, IEC 112M, IM B14, 400/690V D/Y, 2905 rpm, IE1-83.1%, IP55',
      de_DE: '7AA 112 M-02, IEC 112M, IM B14, 400/690V D/Y, 2905 U/min, IE1-83.1%, IP55',
    },
    note: {
      pl_PL: 'Przemysłowy trójfazowy silnik asynchroniczny klatkowy (3~ Mot.) STÜBBE GmbH & Co. KG. Model 7AA 112 M-02 w wielkości mechanicznej IEC 112M, wykonanie kołnierzowe IM B14 (kołnierz mały FT130 / Ø160 mm). Klasa sprawności: IE1 (Standard Efficiency). Parametry przy 50 Hz: 4,0 kW, 400/690 V Δ/Y (8,1 / 4,7 A), 2905 obr./min, cos φ = 0,84, sprawność IE1-83,1%. Parametry przy 60 Hz: 4,6 kW, 460 V Δ (7,8 A), 3505 obr./min, cos φ = 0,87, sprawność IE1-86,0%. Stopień ochrony: IP55. Klasa termiczna: ThCl 155(F). Zgodność z normami IEC/EN 60034, oznaczenie CE. Masa własna: 29 kg. Dedykowany do bezpośredniego napędu pomp chemicznych, zespołów procesowych i urządzeń przemysłowych STÜBBE.',
      en_US: 'Industrial three-phase asynchronous induction motor (3~ Mot.) by STÜBBE GmbH & Co. KG. Model 7AA 112 M-02 in frame size IEC 112M, flange mounting IM B14 (face flange FT130 / Ø160 mm). Efficiency class: IE1 (Standard Efficiency). Operating parameters at 50 Hz: 4.0 kW, 400/690 V Δ/Y (8.1 / 4.7 A), 2905 rpm, cos φ = 0.84, efficiency IE1-83.1%. Operating parameters at 60 Hz: 4.6 kW, 460 V Δ (7.8 A), 3505 rpm, cos φ = 0.87, efficiency IE1-86.0%. Degree of protection: IP55. Thermal insulation class: ThCl 155(F). Compliant with IEC/EN 60034, CE marked. Net weight: 29 kg. Tailored for direct mounting onto STÜBBE chemical pumps, process skids, and industrial equipment.',
      de_DE: 'Industrieller Drehstrom-Asynchronmotor (3~ Mot.) von STÜBBE GmbH & Co. KG. Typ 7AA 112 M-02 in IEC-Baugröße 112M, Flanschbauform IM B14 (Kleinflansch FT130 / Ø160 mm). Wirkungsgradklasse: IE1 (Standard Efficiency). Bemessungsdaten bei 50 Hz: 4,0 kW, 400/690 V Δ/Y (8,1 / 4,7 A), 2905 U/min, cos φ = 0,84, Wirkungsgrad IE1-83,1%. Bemessungsdaten bei 60 Hz: 4,6 kW, 460 V Δ (7,8 A), 3505 U/min, cos φ = 0,87, Wirkungsgrad IE1-86,0%. Schutzart: IP55. Wärmeklasse: ThCl 155(F). Normkonform nach IEC/EN 60034, CE-Kennzeichnung. Eigengewicht: 29 kg. Speziell ausgelegt für den Direktaufbau auf STÜBBE Chemiepumpen, Prozessaggregate und Industrieanlagen.',
    },
    characteristics: '4.0kW (50Hz) / 4.6kW (60Hz), 400/690V D/Y, 2905/3505 rpm, IE1, IM B14, 29kg, IP55',
    extraPartAttrs: {
      P_ARTICLE_RATEDPOWER: '4.0',
      P_ARTICLE_RATEDSPEED: '2905',
      P_ARTICLE_RATEDVOLTAGE: '400',
      P_ARTICLE_RATEDCURRENT: '8.1',
    },
    functionTemplates: [
      {
        connectionDesignation: 'U1\nV1\nW1\nPE',
        connectionDescription: 'L1\nL2\nL3\nPE',
        functiondefcategory: '1000',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'STU/7AA112M-02.png',
    pictureLocalPath: 'EDZ/261029/STU.7AA112M-02/7AA112M-02.png',
    docs: [
      {
        relPath: 'STU/7AA112M-02_datasheet.pdf',
        localPath: 'EDZ/261029/STU.7AA112M-02/7AA112M-02_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261029/STU.7AA112M-02/STU.7AA112M-02.edz',
  },
  'PHG.ADMITTO-D': {
    partNr: 'PHG.ADMITTO-D',
    typeNr: 'ADMITTO-D',
    orderNr: 'ADMITTO-D',
    manufacturer: 'PHG',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1
    productGroup: EPLAN_PRODUCT_GROUPS.SENSORS_SWITCHES_BUTTONS,     // 12
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,                 // 1
    craftElectrical: 1,
    codeLetter: 'B',
    isAccessory: 0,
    weight: '0.18',
    width: '110.0',
    height: '62.0',
    depth: '24.0',
    descr1: {
      pl_PL: 'Czytnik kart zbliżeniowych OEM RFID (Ethernet z PoE, RJ45)',
      en_US: 'OEM RFID proximity reader module (Ethernet with PoE, RJ45)',
      de_DE: 'OEM-RFID-Lesemodul (Ethernet mit PoE, RJ45)',
    },
    descr2: {
      pl_PL: 'Multi-ISO 13,56 MHz i 125 kHz, TCP/IP, PoE Class 0',
      en_US: 'Multi-ISO 13.56 MHz and 125 kHz, TCP/IP, PoE Class 0',
      de_DE: 'Multi-ISO 13,56 MHz und 125 kHz, TCP/IP, PoE Class 0',
    },
    note: {
      pl_PL: 'Wieloczęstotliwościowy czytnik transponderów RFID OEM serii ADMITTO-D (phg Peter Hengstler). Zintegrowany interfejs sieciowy Ethernet 10/100 Mbps ze złączem RJ45 i bezpośrednim zasilaniem Power over Ethernet (PoE, IEEE 802.3af, Class 0, max. 2,2 W). Obsługa technologii RFID: LEGIC prime/advant, MIFARE Classic/DESFire EV1-EV3, 125 kHz (EM4102/Hitag), ISO 14443A/B, ISO 15693, Sony FeliCa. 3 diody sygnalizacyjne LED (zielona/żółta/czerwona). Stopień ochrony IP40. Temperatura pracy 0 °C do +50 °C. Zgodność z RED 2014/53/EU, RoHS.',
      en_US: 'Multi-frequency OEM RFID transponder reader ADMITTO-D series by phg Peter Hengstler. Integrated Ethernet 10/100 Mbps network interface with RJ45 socket and direct Power over Ethernet (PoE, IEEE 802.3af, Class 0, max. 2.2 W) power supply. Supports RFID technologies: LEGIC prime/advant, MIFARE Classic/DESFire EV1-EV3, 125 kHz (EM4102/Hitag), ISO 14443A/B, ISO 15693, Sony FeliCa. 3 front status LEDs (green/yellow/red). Degree of protection IP40. Operating temperature 0 °C to +50 °C. Compliant with RED 2014/53/EU, RoHS.',
      de_DE: 'Multifrequenz-OEM-RFID-Transponderleser der Baureihe ADMITTO-D von phg Peter Hengstler. Integrierte Ethernet 10/100 Mbit/s Netzwerkschnittstelle mit RJ45-Buchse und direkter Stromversorgung über Power over Ethernet (PoE, IEEE 802.3af, Class 0, max. 2,2 W). Unterstützt RFID-Technologien: LEGIC prime/advant, MIFARE Classic/DESFire EV1-EV3, 125 kHz (EM4102/Hitag), ISO 14443A/B, ISO 15693, Sony FeliCa. 3 Front-Status-LEDs (grün/gelb/rot). Schutzart IP40. Betriebstemperatur 0 °C bis +50 °C. Konform mit RED 2014/53/EU, RoHS.',
    },
    characteristics: 'Multi-ISO, 125kHz, Ethernet PoE, RJ45, 110x62x24mm',
    functionTemplates: [
      {
        connectionDesignation: 'ETH / PoE',
        connectionDescription: 'Ethernet 10/100 Mbps / Power over Ethernet (IEEE 802.3af)',
        functiondefcategory: '2600',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'PHG/ADMITTO-D.png',
    pictureLocalPath: 'EDZ/261109/PHG.ADMITTO-D/ADMITTO-D.png',
    docs: [
      {
        relPath: 'PHG/ADMITTO-D_datasheet.pdf',
        localPath: 'EDZ/261109/PHG.ADMITTO-D/ADMITTO-D_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261109/PHG.ADMITTO-D/PHG.ADMITTO-D.edz',
    constructionXml: `<?xml version="1.0" encoding="utf-8" ?>\n<partsmanagement count="1" length-unit="mm" weight-unit="kg" type="EPLAN.PartsManagement" build="137.1">\n <construction class="6" P_PART_CONSTRUCTION_NAME="PHG.ADMITTO-D" P_PART_CONSTRUCTION_CREATE="2026-11-09" P_PART_CONSTRUCTION_LASTCHANGE="2026-11-09">\n  <P_PART_CONSTRUCTION_DESCRIPTION>pl_PL@Szablon wycięcia płyty czołowej czytnika RFID ADMITTO-D (110x62 mm, montaż wpuszczany);en_US@Front panel cutout pattern for ADMITTO-D RFID reader (110x62 mm, flush mount);de_DE@Frontplatten-Ausschnitt für ADMITTO-D RFID-Leser (110x62 mm, Paneleinbau);</P_PART_CONSTRUCTION_DESCRIPTION>\n  <drillingpattern P_DRILLING_NAME="PHG.ADMITTO-D" P_DRILLING_WIDTH="110.0" P_DRILLING_HEIGHT="62.0" P_DRILLING_DEPTH="24.0">\n    <cutout type="cutout" shape="rectangle" width="110.0" height="62.0" x="0.0" y="0.0" depth="24.0" usage="flush_panel_cutout"/>\n  </drillingpattern>\n </construction>\n</partsmanagement>\n`,
  },
  'TPL.TL-POE150S': {
    partNr: 'TPL.TL-POE150S',
    typeNr: 'TL-POE150S',
    orderNr: 'TL-POE150S',
    manufacturer: 'TPL',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1
    productGroup: EPLAN_PRODUCT_GROUPS.POWER_SUPPLY_PLANTS,           // 30
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.GENERAL,                 // 1
    craftElectrical: 1,
    codeLetter: 'G',
    isAccessory: 0,
    weight: '0.10',
    width: '80.8',
    height: '54.0',
    depth: '24.0',
    descr1: {
      pl_PL: 'Injektor Gigabit PoE (IEEE 802.3af, max. 15,4W)',
      en_US: 'Gigabit PoE Injector (IEEE 802.3af, max. 15.4W)',
      de_DE: 'Gigabit-PoE-Injektor (IEEE 802.3af, max. 15,4W)',
    },
    descr2: {
      pl_PL: '1x LAN IN, 1x PoE OUT, 48V DC, zasięg do 100m',
      en_US: '1x LAN IN, 1x PoE OUT, 48V DC, range up to 100m',
      de_DE: '1x LAN IN, 1x PoE OUT, 48V DC, Reichweite bis 100m',
    },
    note: {
      pl_PL: 'Gigabitowy injektor Power over Ethernet (PoE) model TL-POE150S producenta TP-Link Technologies Co., Ltd. Pełna zgodność ze standardem IEEE 802.3af. Zapewnia równoczesną transmisję danych gigabitowych oraz zasilania 48V DC (maksymalnie 15,4 W) pojedynczym przewodem skrętkowym na dystans do 100 m. Wyposażony w port wejściowy 10/100/1000 Mbps RJ45 (LAN IN), port wyjściowy 10/100/1000 Mbps RJ45 PoE (POWER+DATA OUT) oraz gniazdo zasilacza zewnętrznego 48V DC. Automatyczne wykrywanie odbiorników PD (Auto-Sensing) oraz zabezpieczenie przeciwzwarciowe. Certyfikaty: FCC, CE, RoHS.',
      en_US: 'Gigabit Power over Ethernet (PoE) Injector model TL-POE150S by TP-Link Technologies Co., Ltd. Fully compliant with IEEE 802.3af standard. Delivers simultaneous gigabit data transmission and 48V DC power (up to 15.4 W) over a single twisted-pair cable up to 100 m. Equipped with 1x 10/100/1000 Mbps RJ45 input port (LAN IN), 1x 10/100/1000 Mbps RJ45 PoE output port (POWER+DATA OUT), and external 48V DC power adapter socket. Auto-Sensing algorithm detects IEEE 802.3af compliant PDs and provides short circuit protection. Certifications: FCC, CE, RoHS.',
      de_DE: 'Gigabit-PoE-Injektor Modell TL-POE150S von TP-Link Technologies Co., Ltd. Vollständig konform zum Standard IEEE 802.3af. Liefert simultane Gigabit-Datenübertragung und 48V DC Betriebsspannung (max. 15,4 W) über ein einziges Twisted-Pair-Kabel bis zu 100 m. Ausgestattet mit 1x 10/100/1000 Mbit/s RJ45 Eingangsport (LAN IN), 1x 10/100/1000 Mbit/s RJ45 PoE-Ausgangsport (POWER+DATA OUT) und 48V DC Hohlsteckerbuchse für externes Netzteil. Auto-Sensing Erkennungsalgorithmus für 802.3af PD-Endgeräte und Kurzschlussschutz. Zertifizierungen: FCC, CE, RoHS.',
    },
    characteristics: 'IEEE 802.3af, 10/100/1000M, 48V DC In, max. 15.4W Out',
    functionTemplates: [
      {
        connectionDesignation: 'LAN IN',
        connectionDescription: 'Data In (10/100/1000 Mbps RJ45)',
        functiondefcategory: '2600',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 1,
      },
      {
        connectionDesignation: 'PoE OUT',
        connectionDescription: 'Data + Power Out (48V DC / 15.4W IEEE 802.3af RJ45)',
        functiondefcategory: '2600',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 2,
      },
      {
        connectionDesignation: '+\n-',
        connectionDescription: 'DC 48V In\nGND',
        functiondefcategory: '300',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'IEC_symbol;1;20;0',
        pos: 3,
      },
    ],
    pictureRelPath: 'TPL/TL-POE150S.png',
    pictureLocalPath: 'EDZ/261109/TPL.TL-POE150S/TL-POE150S.png',
    docs: [
      {
        relPath: 'TPL/TL-POE150S_datasheet.pdf',
        localPath: 'EDZ/261109/TPL.TL-POE150S/TL-POE150S_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261109/TPL.TL-POE150S/TPL.TL-POE150S.edz',
  },
  'WIE.76.344.4035.0': {
    partNr: 'WIE.76.344.4035.0',
    typeNr: 'BAS GUT GR 16H M32 A0',
    orderNr: '76.344.4035.0',
    manufacturer: 'WIE',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.PLUGS,                       // 4 (Wtyki / Plugs)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.PLUG_HOUSING,          // 15 (Obudowa wtyku / Plug housing)
    craftElectrical: 1,
    codeLetter: 'X',
    isAccessory: 0,
    weight: '0.48',      // kg (480 g)
    width: '117',        // mm
    height: '98',        // mm
    depth: '57',         // mm
    descr1: {
      pl_PL: 'Obudowa cokołowa revos 16H - z pokrywą, 2x dławik M32, Ø 16 - 25 mm',
      en_US: 'Surface-mounted housing revos 16H - with cover, 2x cable gland M32, Ø 16 - 25 mm',
      de_DE: 'Sockelgehäuse revos 16H - mit Deckel, 2x Verschraubung M32, Ø 16 - 25 mm',
    },
    descr2: {
      pl_PL: 'BAS GUT GR 16H M32 A0, 2x M32 (dławnice IP54 Ø16-25mm)',
      en_US: 'BAS GUT GR 16H M32 A0, 2x M32 (cable glands IP54 Ø16-25mm)',
      de_DE: 'BAS GUT GR 16H M32 A0, 2x M32 (Verschraubung IP54 Ø16-25mm)',
    },
    note: {
      pl_PL: 'Wielostykowe złącze przemysłowe heavy-duty serii revos BASIC. Obudowa cokołowa (podstawa gniazda) wysoka (rozmiar 16H / 40-biegunowa) z odlewu aluminiowego, malowana proszkowo (szary). Wyposażona w pokrywę ochronną z tworzywa oraz pojedynczą dźwignię ryglującą (stal nierdzewna V2A / poliamid UL94-V0). Uszczelnienie NBR. Dwa boczne wprowadzenia kablowe M32 z fabrycznie zamontowanymi dławnicami kablowymi (zakres mocowania kabla Ø 16-25 mm). Stopień ochrony: IP54 (IP65 przy zastosowaniu dławnic szczelnych). Zakres temperatur pracy: od -40 °C do +120 °C. Zastosowanie: aplikacje przemysłowe, budowa maszyn i szaf sterowniczych.',
      en_US: 'Heavy-duty industrial multipole connector revos BASIC series. Surface-mounted housing base increased height design (size 16H / 40-pole) made of die-cast aluminum alloy, powder-coated (grey). Equipped with protective cover and single locking lever (stainless steel V2A / polyamide UL94-V0). NBR gasket. Two-sided M32 cable entries with pre-installed cable glands (cable clamping range Ø 16-25 mm). Degree of protection: IP54 (IP65 with appropriate sealed cable glands). Operating temperature range: -40 °C to +120 °C. Application: industrial machinery, automation systems and control cabinets.',
      de_DE: 'Schwerer Industriesteckverbinder der revos BASIC Serie. Sockelgehäuse hohe Bauform (Größe 16H / 40-polig) aus Aluminiumdruckguss, pulverbeschichtet (grau). Ausgestattet mit Kunststoff-Schutzdeckel und Längsbügel (Edelstahl V2A / Polyamid UL94-V0). NBR-Dichtung. Zwei seitliche M32 Leitungseinführungen mit vormontierten Kabelverschraubungen (Klemmbereich Ø 16-25 mm). Schutzart: IP54 (IP65 mit entsprechenden dichten Verschraubungen). Temperaturbereich: -40 °C bis +120 °C. Einsatzbereich: Industriemaschinen, Automatisierungsanlagen und Schaltschränke.',
    },
    characteristics: 'revos BASIC 16H, 2x M32, IP54 (Ø16-25mm), 1 Dźwignia / 1 Lever, z pokrywą / with cover',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4015573630048',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'revos BASIC 16H',
        functiondefcategory: '300',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'WIE/76.344.4035.0.png',
    pictureLocalPath: 'EDZ/261118/WIE.76.344.4035.0/76.344.4035.0.png',
    docs: [
      {
        relPath: 'WIE/76.344.4035.0_datasheet.pdf',
        localPath: 'EDZ/261118/WIE.76.344.4035.0/76.344.4035.0_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261118/WIE.76.344.4035.0/WIE.76.344.4035.0.edz',
  },
  'WIE.71.353.2435.0': {
    partNr: 'WIE.71.353.2435.0',
    typeNr: 'BAS GOT GG 24 M32 A0',
    orderNr: '71.353.2435.0',
    manufacturer: 'WIE',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.PLUGS,                       // 4 (Wtyki / Plugs)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.PLUG_HOUSING,          // 15 (Obudowa wtyku / Plug housing)
    craftElectrical: 1,
    codeLetter: 'X',
    isAccessory: 0,
    weight: '0.269',     // kg (269 g)
    width: '120',        // mm
    height: '70',        // mm
    depth: '43',         // mm
    descr1: {
      pl_PL: 'Obudowa górna revos 24 - boczna, z dławikiem M32, Ø 16 - 25 mm',
      en_US: 'Hood revos 24 - side entry, with cable gland M32, Ø 16 - 25 mm',
      de_DE: 'Tüllengehäuse revos 24 - seitlich, mit Verschraubung M32, Ø 16 - 25 mm',
    },
    descr2: {
      pl_PL: 'BAS GOT GG 24 M32 A0, 1x M32 (dławnica IP54 Ø16-25mm)',
      en_US: 'BAS GOT GG 24 M32 A0, 1x M32 (cable gland IP54 Ø16-25mm)',
      de_DE: 'BAS GOT GG 24 M32 A0, 1x M32 (Verschraubung IP54 Ø16-25mm)',
    },
    note: {
      pl_PL: 'Wielostykowe złącze przemysłowe heavy-duty serii revos BASIC. Obudowa wtyczki górna (hood / Tüllengehäuse) wielkość 24 (do wkładów 24/64-biegunowych) z odlewu aluminiowego, malowana proszkowo (szary RAL 7001). Ryglowanie: sworznie rygla wzdłużnego. Boczne wprowadzenie kablowe M32 z fabrycznie zamontowaną dławnicą kablową (zakres mocowania kabla Ø 16-25 mm). Stopień ochrony: IP54 (IP65 przy zastosowaniu dławnic szczelnych). Zakres temperatur pracy: od -40 °C do +120 °C. Zastosowanie: aplikacje przemysłowe, budowa maszyn i szaf sterowniczych.',
      en_US: 'Heavy-duty industrial multipole connector revos BASIC series. Hood size 24 (for 24/64-pole inserts) made of die-cast aluminum alloy, powder-coated (grey RAL 7001). Locking system: pins for single locking lever. Lateral M32 cable entry with pre-installed cable gland (cable clamping range Ø 16-25 mm). Degree of protection: IP54 (IP65 with appropriate sealed cable glands). Operating temperature range: -40 °C to +120 °C. Application: industrial machinery, automation systems and control cabinets.',
      de_DE: 'Schwerer Industriesteckverbinder der revos BASIC Serie. Tüllengehäuse Größe 24 (für 24/64-polige Einsätze) aus Aluminiumdruckguss, pulverbeschichtet (grau RAL 7001). Verriegelung: Bolzen für Längsbügel. Seitliche M32 Leitungseinführung mit vormontierter Kabelverschraubung (Klemmbereich Ø 16-25 mm). Schutzart: IP54 (IP65 mit entsprechenden dichten Verschraubungen). Temperaturbereich: -40 °C bis +120 °C. Einsatzbereich: Industriemaschinen, Automatisierungsanlagen und Schaltschränke.',
    },
    characteristics: 'revos BASIC 24, 1x M32 boczny, IP54 (Ø16-25mm), sworznie rygla',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4015573651685',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'revos BASIC 24',
        functiondefcategory: '300',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'WIE/71.353.2435.0.png',
    pictureLocalPath: 'EDZ/261118/WIE.71.353.2435.0/71.353.2435.0.png',
    docs: [
      {
        relPath: 'WIE/71.353.2435.0_datasheet.pdf',
        localPath: 'EDZ/261118/WIE.71.353.2435.0/71.353.2435.0_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261118/WIE.71.353.2435.0/WIE.71.353.2435.0.edz',
  },
  'WIE.76.334.6435.0': {
    partNr: 'WIE.76.334.6435.0',
    typeNr: 'BAS GUT GL 24H M32 A0',
    orderNr: '76.334.6435.0',
    manufacturer: 'WIE',
    productTopGroup: EPLAN_PRODUCT_TOP_GROUPS.ELECTRICAL_ENGINEERING, // 1 (Elektrotechnika)
    productGroup: EPLAN_PRODUCT_GROUPS.PLUGS,                       // 4 (Wtyki / Plugs)
    productSubGroup: EPLAN_PRODUCT_SUBGROUPS.PLUG_HOUSING,          // 15 (Obudowa wtyku / Plug housing)
    craftElectrical: 1,
    codeLetter: 'X',
    isAccessory: 0,
    weight: '0.465',     // kg (464.7 g)
    width: '144',        // mm
    height: '80',        // mm
    depth: '57',         // mm
    descr1: {
      pl_PL: 'Obudowa cokołowa revos 24H - 1 dźwignia, 2x dławik M32, Ø 16 - 25 mm',
      en_US: 'Surface-mounted housing revos 24H - 1 lever, 2x cable gland M32, Ø 16 - 25 mm',
      de_DE: 'Sockelgehäuse revos 24H - 1 Längsbügel, 2x Verschraubung M32, Ø 16 - 25 mm',
    },
    descr2: {
      pl_PL: 'BAS GUT GL 24H M32 A0, 2x M32 (dławnice IP54 Ø16-25mm)',
      en_US: 'BAS GUT GL 24H M32 A0, 2x M32 (cable glands IP54 Ø16-25mm)',
      de_DE: 'BAS GUT GL 24H M32 A0, 2x M32 (Verschraubung IP54 Ø16-25mm)',
    },
    note: {
      pl_PL: 'Wielostykowe złącze przemysłowe heavy-duty serii revos BASIC. Obudowa cokołowa (podstawa gniazda) wysoka (rozmiar 24H / do wkładów 24/64-biegunowych) z odlewu aluminiowego, malowana proszkowo (szary RAL 7001). Wersja bez pokrywy ochronnej. Wyposażona w pojedynczą dźwignię ryglującą wzdłużną (stal nierdzewna V2A / poliamid UL94-V0). Uszczelnienie NBR. Dwa boczne wprowadzenia kablowe M32 z fabrycznie zamontowanymi dławnicami kablowymi (zakres mocowania kabla Ø 16-25 mm). Rozstaw otworów montażowych: 132 x 32 mm (4 otwory Ø 4.5 mm). Stopień ochrony: IP54 (IP65 przy zastosowaniu dławnic szczelnych). Zakres temperatur pracy: od -40 °C do +120 °C. Zastosowanie: aplikacje przemysłowe, budowa maszyn i szaf sterowniczych.',
      en_US: 'Heavy-duty industrial multipole connector revos BASIC series. Surface-mounted housing base high design (size 24H / for 24/64-pole inserts) made of die-cast aluminum alloy, powder-coated (grey RAL 7001). Version without protective cover. Equipped with single longitudinal locking lever (stainless steel V2A / polyamide UL94-V0). NBR gasket. Two-sided M32 cable entries with pre-installed cable glands (cable clamping range Ø 16-25 mm). Mounting hole pattern: 132 x 32 mm (4 holes Ø 4.5 mm). Degree of protection: IP54 (IP65 with appropriate sealed cable glands). Operating temperature range: -40 °C to +120 °C. Application: industrial machinery, automation systems and control cabinets.',
      de_DE: 'Schwerer Industriesteckverbinder der revos BASIC Serie. Sockelgehäuse hohe Bauform (Größe 24H / für 24/64-polige Einsätze) aus Aluminiumdruckguss, pulverbeschichtet (grau RAL 7001). Ausführung ohne Schutzdeckel. Ausgestattet mit Längsbügel (Edelstahl V2A / Polyamid UL94-V0). NBR-Dichtung. Zwei seitliche M32 Leitungseinführungen mit vormontierten Kabelverschraubungen (Klemmbereich Ø 16-25 mm). Befestigungsbohrungen: 132 x 32 mm (4 Bohrungen Ø 4.5 mm). Schutzart: IP54 (IP65 mit entsprechenden dichten Verschraubungen). Temperaturbereich: -40 °C bis +120 °C. Einsatzbereich: Industriemaschinen, Automatisierungsanlagen und Schaltschränke.',
    },
    characteristics: 'revos BASIC 24H, 2x M32, IP54 (Ø16-25mm), 1 Dźwignia / 1 Lever, bez pokrywy / without cover',
    extraPartAttrs: {
      P_ARTICLE_EAN: '4015573624627',
    },
    functionTemplates: [
      {
        connectionDesignation: '',
        connectionDescription: 'revos BASIC 24H',
        functiondefcategory: '300',
        functiondefgroup: '1',
        functiondefid: '1',
        symbol: 'SPECIAL;0;0;0',
        pos: 1,
      },
    ],
    pictureRelPath: 'WIE/76.334.6435.0.png',
    pictureLocalPath: 'EDZ/261118/WIE.76.334.6435.0/76.334.6435.0.png',
    docs: [
      {
        relPath: 'WIE/76.334.6435.0_datasheet.pdf',
        localPath: 'EDZ/261118/WIE.76.334.6435.0/76.334.6435.0_datasheet.pdf',
      },
    ],
    outputEdzPath: 'EDZ/261118/WIE.76.334.6435.0/WIE.76.334.6435.0.edz',
  },
};

// Aliases for convenient CLI usage
CATALOG['ADMITTO-D'] = CATALOG['PHG.ADMITTO-D'];
CATALOG['TL-POE150S'] = CATALOG['TPL.TL-POE150S'];
CATALOG['RL28-8-H-2000-IR-3974/47/112'] = CATALOG['PF.205804'];
CATALOG['3270531'] = CATALOG['PXC.3270531'];
CATALOG['LPO 16/E'] = CATALOG['PXC.3270531'];
CATALOG['LPO16/E'] = CATALOG['PXC.3270531'];
CATALOG['2FT00AA'] = CATALOG['HP.2FT00AA'];
CATALOG['2FT00AA#ABB'] = CATALOG['HP.2FT00AA'];
CATALOG['9UB87AA'] = CATALOG['HP.9UB87AA'];
CATALOG['9UB87AA#ABB'] = CATALOG['HP.9UB87AA'];
CATALOG['5AP112M-2K'] = CATALOG['BIR.5AP112M-2K'];
CATALOG['5AP112M'] = CATALOG['BIR.5AP112M-2K'];
CATALOG['7AA112M-02'] = CATALOG['STU.7AA112M-02'];
CATALOG['7AA 112 M-02'] = CATALOG['STU.7AA112M-02'];
CATALOG['7AA112M'] = CATALOG['STU.7AA112M-02'];
CATALOG['76.344.4035.0'] = CATALOG['WIE.76.344.4035.0'];
CATALOG['76.344.4035'] = CATALOG['WIE.76.344.4035.0'];
CATALOG['BAS GUT GR 16H M32 A0'] = CATALOG['WIE.76.344.4035.0'];
CATALOG['BAS GUT GR 16HM32 A0'] = CATALOG['WIE.76.344.4035.0'];
CATALOG['BAS GUT GR 40HM32 50 A0'] = CATALOG['WIE.76.344.4035.0'];
CATALOG['71.353.2435.0'] = CATALOG['WIE.71.353.2435.0'];
CATALOG['71.353.2435'] = CATALOG['WIE.71.353.2435.0'];
CATALOG['BAS GOT GG 24 M32 A0'] = CATALOG['WIE.71.353.2435.0'];
CATALOG['76.334.6435.0'] = CATALOG['WIE.76.334.6435.0'];
CATALOG['76.334.6435'] = CATALOG['WIE.76.334.6435.0'];
CATALOG['BAS GUT GL 24H M32 A0'] = CATALOG['WIE.76.334.6435.0'];

// Automatic execution: generate EDZ for any articles in CATALOG that are missing an EDZ file,
// or for any key passed in argv
if (require.main === module) {
  const targetKey = process.argv[2];
  const force = process.argv.includes('--force') || process.argv.includes('-f') || targetKey === '--all';

  if (targetKey && targetKey !== '--all' && targetKey !== '--force' && targetKey !== '-f') {
    if (CATALOG[targetKey]) {
      console.log(`Generating EDZ for specified target: ${targetKey}`);
      generateEDZ(CATALOG[targetKey]);
    } else {
      console.error(`Error: Unknown target key "${targetKey}". Available: ${Object.keys(CATALOG).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.log(force ? 'Regenerating ALL catalog items (--force)...' : 'Checking all catalog items for missing EDZ files...');
    let generatedCount = 0;
    for (const [key, cfg] of Object.entries(CATALOG)) {
      const edzFile = cfg.outputEdzPath || path.join('EDZ', key, `${key}.edz`);
      if (force || !fs.existsSync(edzFile)) {
        console.log(`\n=== Generating EDZ for ${key} ===`);
        generateEDZ(cfg);
        generatedCount++;
      } else {
        console.log(`EDZ already exists for ${key}: ${edzFile}`);
      }
    }
    console.log(`\nCompleted. Generated ${generatedCount} EDZ archive(s).`);
  }
}

module.exports = {
  generateEDZ,
  createZip,
  CATALOG,
  KNOWN_MANUFACTURERS,
  EPLAN_PRODUCT_TOP_GROUPS,
  EPLAN_PRODUCT_GROUPS,
  EPLAN_PRODUCT_SUBGROUPS,
};
