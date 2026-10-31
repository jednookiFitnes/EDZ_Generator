const cp = require('child_process');
const path = require('path');
const fs = require('fs');

const inputHtml = process.argv[2];
const outputPdf = process.argv[3];

if (!inputHtml || !outputPdf) {
  console.error('Usage: node html_to_pdf.js <input.html> <output.pdf>');
  process.exit(1);
}

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlResolved = path.resolve(inputHtml);
const pdfResolved = path.resolve(outputPdf);

const cmd = '"' + edge + '" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="' + pdfResolved + '" --no-pdf-header-footer "' + htmlResolved + '"';
cp.execSync(cmd);
console.log('PDF rendered successfully:', pdfResolved, fs.statSync(pdfResolved).size, 'bytes');
