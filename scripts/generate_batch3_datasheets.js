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

function generateDatasheetHTML(article) {
  const imgBase64 = fs.readFileSync(article.imgPath).toString('base64');
  const imgSrc = `data:image/png;base64,${imgBase64}`;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>${article.partNr} - Datasheet</title>
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
          <h1><span class="lang-tag">PL</span>${article.title_pl}</h1>
          <div class="subtitle">${article.subtitle_pl} | Nr art.: <strong>${article.orderNr}</strong> | Typ: <strong>${article.typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">revos BASIC</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          ${article.desc_pl}
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="${article.partNr}">
        </div>
      </div>

      <h2>Główne parametry techniczne</h2>
      <table>
        <tbody>
          ${article.params_pl.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Cechy konstrukcyjne i materiałowe</h2>
      <table>
        <tbody>
          ${article.mech_pl.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Wymiary gabarytowe i montażowe</h2>
      <table>
        <tbody>
          ${article.dim_pl.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
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
          <h1><span class="lang-tag">ENG</span>${article.title_en}</h1>
          <div class="subtitle">${article.subtitle_en} | Part No.: <strong>${article.orderNr}</strong> | Type: <strong>${article.typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">revos BASIC</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          ${article.desc_en}
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="${article.partNr}">
        </div>
      </div>

      <h2>Key Technical Specifications</h2>
      <table>
        <tbody>
          ${article.params_en.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Mechanical & Material Specifications</h2>
      <table>
        <tbody>
          ${article.mech_en.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Dimensions & Mounting Data</h2>
      <table>
        <tbody>
          ${article.dim_en.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
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
          <h1><span class="lang-tag">DE</span>${article.title_de}</h1>
          <div class="subtitle">${article.subtitle_de} | Art.-Nr.: <strong>${article.orderNr}</strong> | Typ: <strong>${article.typeNr}</strong></div>
        </div>
        <div class="brand">Wieland Electric<br><span style="font-size: 9px; font-weight: normal; color: #666;">revos BASIC</span></div>
      </div>

      <div class="overview-container">
        <div class="overview-box">
          ${article.desc_de}
        </div>
        <div class="overview-image">
          <img src="${imgSrc}" alt="${article.partNr}">
        </div>
      </div>

      <h2>Wichtigste technische Daten</h2>
      <table>
        <tbody>
          ${article.params_de.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Mechanische & Werkstoffdaten</h2>
      <table>
        <tbody>
          ${article.mech_de.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
        </tbody>
      </table>

      <h2>Abmessungen und Montagedaten</h2>
      <table>
        <tbody>
          ${article.dim_de.map(p => `<tr><th>${p[0]}</th><td>${p[1]}</td></tr>`).join('')}
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

module.exports = { generateDatasheetHTML };
