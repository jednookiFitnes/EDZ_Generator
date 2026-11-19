const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const img1Base64 = fs.readFileSync('EDZ/BIR/BIR.5AP112M-2K/5AP112M-2K.png').toString('base64');
const img2Base64 = fs.readFileSync('EDZ/STU/STU.7AA112M-02/7AA112M-02.png').toString('base64');

// 1. HTML for Robert Birkenbeul 5AP112M-2K
const html1 = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>Karta katalogowa - Robert Birkenbeul 5AP112M-2K</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 15mm 14mm 15mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    font-size: 11px;
    line-height: 1.45;
  }
  .header {
    border-bottom: 3px solid #1a568c;
    padding-bottom: 10px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #1a568c;
    font-size: 20px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 20px;
    color: #1a568c;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .subtitle {
    font-size: 12px;
    color: #555;
    margin-top: 4px;
    font-weight: 500;
  }
  .overview-container {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
  }
  .overview-box {
    flex: 1.2;
    background: #f4f8fb;
    border-left: 4px solid #1a568c;
    padding: 10px 14px;
    font-size: 11px;
  }
  .overview-image {
    flex: 1;
    text-align: center;
    background: #ffffff;
    border: 1px solid #d8e2eb;
    border-radius: 4px;
    padding: 8px;
  }
  .overview-image img {
    max-width: 100%;
    max-height: 130px;
    object-fit: contain;
  }
  .overview-image .caption {
    font-size: 9.5px;
    color: #666;
    margin-top: 4px;
    font-style: italic;
  }
  h2 {
    color: #1a568c;
    font-size: 12px;
    border-bottom: 1px solid #c8dce8;
    padding-bottom: 3px;
    margin-top: 14px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }
  th, td {
    padding: 5px 8px;
    border-bottom: 1px solid #e1e7ec;
    text-align: left;
    font-size: 10.5px;
  }
  th {
    background-color: #ebf4fa;
    color: #103854;
    font-weight: 600;
    width: 38%;
  }
  td {
    color: #222;
  }
  .badge {
    display: inline-block;
    background: #1a568c;
    color: white;
    padding: 2px 7px;
    border-radius: 3px;
    font-weight: 600;
    font-size: 10px;
  }
  .footer {
    margin-top: 20px;
    padding-top: 8px;
    border-top: 1px solid #d8e2eb;
    font-size: 9.5px;
    color: #777;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>5AP112M-2K</h1>
    <div class="subtitle">Trójfazowy asynchroniczny silnik elektryczny klatkowy 4,0 kW (2-biegunowy)</div>
  </div>
  <div class="brand">
    BIRKENBEUL
    <div style="font-size: 10px; font-weight: normal; color: #555;">Robert Birkenbeul GmbH &amp; Co.KG &bull; Hamm/Sieg</div>
  </div>
</div>

<div class="overview-container">
  <div class="overview-box">
    <p style="margin: 0 0 6px 0;"><strong>Opis ogólny urządzenia:</strong></p>
    <p style="margin: 0 0 6px 0;">
      Przemysłowy trójfazowy silnik asynchroniczny prądu przemiennego (3~ Mot.) niemieckiego producenta <strong>Robert Birkenbeul GmbH &amp; Co.KG</strong>. Model <strong>5AP112M-2K</strong> w znormalizowanej wielkości mechanicznej <strong>IEC 112M</strong> charakteryzuje się mocą znamionową <strong>4,0 kW</strong> przy 50 Hz (2895 obr./min) oraz <strong>4,8 kW</strong> przy 60 Hz (3474 obr./min).
    </p>
    <p style="margin: 0;">
      Konstrukcja w klasie izolacji <strong>ThCl F (155&deg;C)</strong>, stopniu ochrony <strong>IP55</strong>, wykonana zgodnie z normami <strong>IEC 34 / EN 60034</strong> oraz oznakowana znakiem <strong>CE</strong>. Dedykowana do pracy ciągłej S1 w trudnych warunkach przemysłowych, napędów pomp, wentylatorów, przekładni i maszyn technologicznych.
    </p>
  </div>
  <div class="overview-image">
    <img src="data:image/png;base64,${img1Base64}" alt="Tabliczka znamionowa Birkenbeul 5AP112M-2K">
    <div class="caption">Fotografia tabliczki znamionowej silnika (Nr seryjny: 1010919)</div>
  </div>
</div>

<h2>Identyfikacja i klasyfikacja EPLAN</h2>
<table>
  <tr><th>Oznaczenie artykułu EPLAN</th><td><strong>BIR.5AP112M-2K</strong></td></tr>
  <tr><th>Producent</th><td>Robert Birkenbeul GmbH &amp; Co.KG (Kod: BIR)</td></tr>
  <tr><th>Typ / Oznaczenie modelu</th><td>5AP112M-2K (/AA)</td></tr>
  <tr><th>Numer fabryczny egzemplarza</th><td>1010919</td></tr>
  <tr><th>Klasyfikacja EPLAN</th><td>Elektrotechnika &gt; Silniki &gt; Ogólne (Top: 1, Grp: 9, Sub: 1)</td></tr>
  <tr><th>Oznaczenie literowe aparatu</th><td>M</td></tr>
</table>

<h2>Parametry elektryczne (Zasilanie 50 Hz)</h2>
<table>
  <tr><th>Moc znamionowa P<sub>N</sub></th><td><strong>4,0 kW</strong> (5,5 KM)</td></tr>
  <tr><th>Napięcie znamionowe U<sub>N</sub> (Układ trójkąt &Delta;)</th><td><strong>380 &ndash; 420 V AC</strong></td></tr>
  <tr><th>Prąd znamionowy I<sub>N</sub> (&Delta;)</th><td><strong>8,2 A</strong></td></tr>
  <tr><th>Napięcie znamionowe U<sub>N</sub> (Układ gwiazda Y)</th><td><strong>660 &ndash; 725 V AC</strong></td></tr>
  <tr><th>Prąd znamionowy I<sub>N</sub> (Y)</th><td><strong>4,74 A</strong></td></tr>
  <tr><th>Prędkość obrotowa znamionowa n<sub>N</sub></th><td><strong>2895 min<sup>-1</sup></strong> (2-biegunowy, 2p = 2)</td></tr>
  <tr><th>Współczynnik mocy cos &phi;</th><td><strong>0,82</strong></td></tr>
  <tr><th>Częstotliwość sieciowa f</th><td>50 Hz</td></tr>
</table>

<h2>Parametry elektryczne (Zasilanie 60 Hz)</h2>
<table>
  <tr><th>Moc znamionowa P<sub>N</sub> (60 Hz)</th><td><strong>4,8 kW</strong> (6,5 KM)</td></tr>
  <tr><th>Napięcie znamionowe U<sub>N</sub> (Układ trójkąt &Delta;)</th><td><strong>440 &ndash; 480 V AC</strong></td></tr>
  <tr><th>Prąd znamionowy I<sub>N</sub> (&Delta;)</th><td><strong>8,2 A</strong></td></tr>
  <tr><th>Prędkość obrotowa znamionowa n<sub>N</sub></th><td><strong>3474 min<sup>-1</sup></strong></td></tr>
  <tr><th>Współczynnik mocy cos &phi;</th><td><strong>0,82</strong></td></tr>
  <tr><th>Częstotliwość sieciowa f</th><td>60 Hz</td></tr>
</table>

<h2>Dane mechaniczne, montażowe i środowiskowe</h2>
<table>
  <tr><th>Wielkość mechaniczna IEC</th><td><strong>112M</strong> (Wysokość osi H = 112 mm)</td></tr>
  <tr><th>Wymiary gabarytowe (Szer. &times; Wys. &times; Głęb.)</th><td>230 &times; 280 &times; 395 mm</td></tr>
  <tr><th>Wymagana powierzchnia zabudowy</th><td>64 400 mm&sup2; (230 &times; 280 mm)</td></tr>
  <tr><th>Ciężar urządzenia</th><td><strong>29,5 kg</strong></td></tr>
  <tr><th>Średnica i długość wału napędowego</th><td>&Oslash; 28 mm &times; 60 mm (wpust pryzmatyczny 8 &times; 7 mm)</td></tr>
  <tr><th>Stopień ochrony obudowy</th><td><strong>IP55</strong> (ochrona przed wnikaniem pyłu i strugami wody)</td></tr>
  <tr><th>Klasa termiczna / izolacji</th><td><strong>ThCl F (155&deg;C)</strong></td></tr>
  <tr><th>Normy i zgodność</th><td>IEC 34, EN 60034, Deklaracja zgodności CE</td></tr>
  <tr><th>Logika zacisków (Szablon EPLAN)</th><td>Skrzynka 6-zaciskowa: U1, V1, W1, U2, V2, W2, zacisk ochronny PE</td></tr>
</table>

<div class="footer">
  <div>Wygenerowano dla bazy artykułów EPLAN Electric P8 / Pro Panel</div>
  <div>Robert Birkenbeul GmbH &amp; Co.KG &bull; Auf der Bitze 4, D-57577 Hamm/Sieg</div>
</div>

</body>
</html>`;

// 2. HTML for STÜBBE 7AA 112 M-02
const html2 = `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>Karta katalogowa - STÜBBE 7AA 112 M-02</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 15mm 14mm 15mm;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #222;
    margin: 0;
    padding: 0;
    font-size: 11px;
    line-height: 1.45;
  }
  .header {
    border-bottom: 3px solid #005a9c;
    padding-bottom: 10px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .header h1 {
    margin: 0;
    color: #005a9c;
    font-size: 20px;
    font-weight: 700;
  }
  .header .brand {
    font-size: 20px;
    color: #005a9c;
    font-weight: 800;
    letter-spacing: 1px;
    text-align: right;
  }
  .subtitle {
    font-size: 12px;
    color: #555;
    margin-top: 4px;
    font-weight: 500;
  }
  .overview-container {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
  }
  .overview-box {
    flex: 1.2;
    background: #f4f8fb;
    border-left: 4px solid #005a9c;
    padding: 10px 14px;
    font-size: 11px;
  }
  .overview-image {
    flex: 1;
    text-align: center;
    background: #ffffff;
    border: 1px solid #d8e2eb;
    border-radius: 4px;
    padding: 8px;
  }
  .overview-image img {
    max-width: 100%;
    max-height: 130px;
    object-fit: contain;
  }
  .overview-image .caption {
    font-size: 9.5px;
    color: #666;
    margin-top: 4px;
    font-style: italic;
  }
  h2 {
    color: #005a9c;
    font-size: 12px;
    border-bottom: 1px solid #c8dce8;
    padding-bottom: 3px;
    margin-top: 14px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }
  th, td {
    padding: 5px 8px;
    border-bottom: 1px solid #e1e7ec;
    text-align: left;
    font-size: 10.5px;
  }
  th {
    background-color: #ebf4fa;
    color: #0c3352;
    font-weight: 600;
    width: 38%;
  }
  td {
    color: #222;
  }
  .badge {
    display: inline-block;
    background: #005a9c;
    color: white;
    padding: 2px 7px;
    border-radius: 3px;
    font-weight: 600;
    font-size: 10px;
  }
  .footer {
    margin-top: 20px;
    padding-top: 8px;
    border-top: 1px solid #d8e2eb;
    font-size: 9.5px;
    color: #777;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>7AA 112 M-02</h1>
    <div class="subtitle">Trójfazowy asynchroniczny silnik elektryczny klatkowy 4,0 kW IE1 kołnierzowy IM B14</div>
  </div>
  <div class="brand">
    STÜBBE
    <div style="font-size: 10px; font-weight: normal; color: #555;">STÜBBE GmbH &amp; Co. KG &bull; Partner for Solutions &bull; Vlotho</div>
  </div>
</div>

<div class="overview-container">
  <div class="overview-box">
    <p style="margin: 0 0 6px 0;"><strong>Opis ogólny urządzenia:</strong></p>
    <p style="margin: 0 0 6px 0;">
      Przemysłowy trójfazowy silnik asynchroniczny prądu przemiennego (3~ Mot.) uznanego producenta aparatury pompowej i przemysłowej <strong>STÜBBE GmbH &amp; Co. KG</strong>. Model <strong>7AA 112 M-02</strong> w klasie sprawności energetycznej <strong>IE1</strong>, wielkości mechanicznej <strong>IEC 112M</strong>, w wykonaniu kołnierzowym <strong>IM B14</strong>.
    </p>
    <p style="margin: 0;">
      Zapewnia moc znamionową <strong>4,0 kW</strong> przy 50 Hz (2905 min<sup>-1</sup>, &eta; = 83,1%) oraz <strong>4,6 kW</strong> przy 60 Hz (3505 min<sup>-1</sup>, &eta; = 86,0%). Wykonany w stopniu ochrony <strong>IP55</strong>, klasie termicznej <strong>ThCl 155(F)</strong> wg normy <strong>IEC/EN 60034</strong>, masa własna <strong>29 kg</strong>. Przeznaczony do napędu pomp chemicznych, przemysłowych zespołów obiegowych oraz aplikacji napędowych.
    </p>
  </div>
  <div class="overview-image">
    <img src="data:image/png;base64,${img2Base64}" alt="Tabliczka znamionowa STÜBBE 7AA 112 M-02">
    <div class="caption">Fotografia tabliczki znamionowej silnika (Nr seryjny: 10/159565/3)</div>
  </div>
</div>

<h2>Identyfikacja i klasyfikacja EPLAN</h2>
<table>
  <tr><th>Oznaczenie artykułu EPLAN</th><td><strong>STU.7AA112M-02</strong></td></tr>
  <tr><th>Producent</th><td>STÜBBE GmbH &amp; Co. KG (Kod: STU)</td></tr>
  <tr><th>Typ / Oznaczenie modelu</th><td>7AA 112 M-02</td></tr>
  <tr><th>Numer fabryczny egzemplarza</th><td>10/159565/3</td></tr>
  <tr><th>Klasa sprawności</th><td><strong>IE1</strong> (Standard Efficiency wg IEC 60034-30-1)</td></tr>
  <tr><th>Forma wykonania montażowego</th><td><strong>IM B14</strong> (Wykonanie kołnierzowe z gwintowanymi otworami)</td></tr>
  <tr><th>Klasyfikacja EPLAN</th><td>Elektrotechnika &gt; Silniki &gt; Ogólne (Top: 1, Grp: 9, Sub: 1)</td></tr>
  <tr><th>Oznaczenie literowe aparatu</th><td>M</td></tr>
</table>

<h2>Parametry elektryczne (Zasilanie 50 Hz)</h2>
<table>
  <tr><th>Moc znamionowa P<sub>N</sub></th><td><strong>4,0 kW</strong></td></tr>
  <tr><th>Napięcie znamionowe U<sub>N</sub> (&Delta; / Y)</th><td><strong>400 / 690 V AC</strong></td></tr>
  <tr><th>Prąd znamionowy I<sub>N</sub> (&Delta; / Y)</th><td><strong>8,1 A / 4,7 A</strong></td></tr>
  <tr><th>Prędkość obrotowa znamionowa n<sub>N</sub></th><td><strong>2905 min<sup>-1</sup></strong> (2-biegunowy, 2p = 2)</td></tr>
  <tr><th>Współczynnik mocy cos &phi;</th><td><strong>0,84</strong></td></tr>
  <tr><th>Sprawność znamionowa &eta;</th><td><strong>IE1 &ndash; 83,1%</strong></td></tr>
  <tr><th>Częstotliwość sieciowa f</th><td>50 Hz</td></tr>
</table>

<h2>Parametry elektryczne (Zasilanie 60 Hz)</h2>
<table>
  <tr><th>Moc znamionowa P<sub>N</sub> (60 Hz)</th><td><strong>4,6 kW</strong></td></tr>
  <tr><th>Napięcie znamionowe U<sub>N</sub> (&Delta;)</th><td><strong>460 V AC</strong></td></tr>
  <tr><th>Prąd znamionowy I<sub>N</sub> (&Delta;)</th><td><strong>7,8 A</strong></td></tr>
  <tr><th>Prędkość obrotowa znamionowa n<sub>N</sub></th><td><strong>3505 min<sup>-1</sup></strong></td></tr>
  <tr><th>Współczynnik mocy cos &phi;</th><td><strong>0,87</strong></td></tr>
  <tr><th>Sprawność znamionowa &eta;</th><td><strong>IE1 &ndash; 86,0%</strong></td></tr>
  <tr><th>Częstotliwość sieciowa f</th><td>60 Hz</td></tr>
</table>

<h2>Dane mechaniczne, montażowe i środowiskowe</h2>
<table>
  <tr><th>Wielkość mechaniczna IEC</th><td><strong>112M</strong> (Forma IM B14)</td></tr>
  <tr><th>Wymiary gabarytowe (Szer. &times; Wys. &times; Głęb.)</th><td>225 &times; 270 &times; 390 mm</td></tr>
  <tr><th>Wymagana powierzchnia zabudowy</th><td>60 750 mm&sup2; (225 &times; 270 mm)</td></tr>
  <tr><th>Ciężar urządzenia</th><td><strong>29,0 kg</strong> (dokładna wartość z tabliczki znamionowej)</td></tr>
  <tr><th>Kołnierz montażowy</th><td>Kołnierz mały FT130 (&Oslash; kołnierza zewn. 160 mm, rozstaw otworów podziałowych &Oslash; 130 mm)</td></tr>
  <tr><th>Średnica i długość wału napędowego</th><td>&Oslash; 28 mm &times; 60 mm (28j6 &times; 60)</td></tr>
  <tr><th>Stopień ochrony obudowy</th><td><strong>IP55</strong></td></tr>
  <tr><th>Klasa termiczna / izolacji</th><td><strong>ThCl 155(F)</strong></td></tr>
  <tr><th>Normy i zgodność</th><td>IEC/EN 60034, Deklaracja zgodności CE</td></tr>
  <tr><th>Logika zacisków (Szablon EPLAN)</th><td>Skrzynka 6-zaciskowa: U1, V1, W1, U2, V2, W2, zacisk ochronny PE</td></tr>
</table>

<div class="footer">
  <div>Wygenerowano dla bazy artykułów EPLAN Electric P8 / Pro Panel</div>
  <div>STÜBBE GmbH &amp; Co. KG &bull; Hollwieser Straße 5, 32602 Vlotho, Niemcy</div>
</div>

</body>
</html>`;

fs.writeFileSync('scripts/5AP112M-2K_datasheet.html', html1, 'utf8');
fs.writeFileSync('scripts/7AA112M-02_datasheet.html', html2, 'utf8');
console.log('Saved both HTML datasheets.');
