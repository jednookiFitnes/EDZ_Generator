const fs = require('fs');
const path = require('path');
const { createZip, copyToDesktopEdz } = require('./generate_edz');

function getTimestamp() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yy}${mm}${dd}-${hh}${min}${ss}`;
}

/**
 * Creates a flat zip archive containing only the specified .edz files
 * @param {string[]} edzFilePaths - List of paths to .edz files
 * @param {string} [outputDir] - Directory where the zip should be saved
 * @returns {string} Path to the created zip file
 */
function createBatchZip(edzFilePaths, outputDir) {
  const ts = getTimestamp();
  const zipFileName = `${ts}.zip`;

  const filesForZip = [];
  for (const filePath of edzFilePaths) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`EDZ file not found: ${filePath}`);
    }
    const baseName = path.basename(filePath);
    filesForZip.push({
      path: baseName, // Flat, no subfolders!
      data: fs.readFileSync(filePath),
    });
  }

  const zipBuffer = createZip(filesForZip);

  // If outputDir is not specified, place in the date folder of the first file or EDZ/
  const targetDir = outputDir || (edzFilePaths[0] ? path.dirname(path.dirname(edzFilePaths[0])) : 'EDZ');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputPath = path.join(targetDir, zipFileName);
  fs.writeFileSync(outputPath, zipBuffer);
  console.log(`Created flat EDZ batch zip: ${outputPath} (${zipBuffer.length} bytes, ${filesForZip.length} files)`);
  if (typeof copyToDesktopEdz === 'function') {
    copyToDesktopEdz(outputPath);
  }
  return outputPath;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let targetDir = null;
  let edzList = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--out' || args[i] === '-o') {
      targetDir = args[++i];
    } else {
      edzList.push(args[i]);
    }
  }

  if (edzList.length === 0) {
    // Default to today's EDZ files in EDZ/261027
    const today = getTimestamp().split('-')[0];
    const todayDir = path.join('EDZ', today);
    if (fs.existsSync(todayDir)) {
      const items = fs.readdirSync(todayDir);
      for (const it of items) {
        const itemDir = path.join(todayDir, it);
        if (fs.statSync(itemDir).isDirectory()) {
          const edzFile = path.join(itemDir, `${it}.edz`);
          if (fs.existsSync(edzFile)) edzList.push(edzFile);
        }
      }
      targetDir = todayDir;
    }
  }

  if (edzList.length === 0) {
    console.error('No .edz files found to package.');
    process.exit(1);
  }

  createBatchZip(edzList, targetDir);
}

module.exports = {
  createBatchZip,
  getTimestamp,
};
