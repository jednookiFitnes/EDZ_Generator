const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function findEdzFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findEdzFiles(fullPath));
    } else if (file.endsWith('.edz')) {
      results.push(fullPath);
    }
  }
  return results;
}

const edzFiles = findEdzFiles('EDZ');

function readZip(buf) {
  let pos = 0;
  const files = {};
  while (pos < buf.length - 4) {
    const sig = buf.readUInt32LE(pos);
    if (sig === 0x04034b50) {
      const nameLen = buf.readUInt16LE(pos + 26);
      const extraLen = buf.readUInt16LE(pos + 28);
      const compSize = buf.readUInt32LE(pos + 18);
      const method = buf.readUInt16LE(pos + 8);
      const name = buf.toString('utf8', pos + 30, pos + 30 + nameLen);
      const dataStart = pos + 30 + nameLen + extraLen;
      const compData = buf.subarray(dataStart, dataStart + compSize);
      let data = compData;
      if (method === 8) {
        data = zlib.inflateRawSync(compData);
      }
      files[name] = data;
      pos = dataStart + compSize;
    } else {
      break;
    }
  }
  return files;
}

console.log('--- EDZ Product Group Verification ---');
for (const edz of edzFiles) {
  if (!fs.existsSync(edz)) {
    console.log(edz, 'DOES NOT EXIST');
    continue;
  }
  const buf = fs.readFileSync(edz);
  const files = readZip(buf);
  const partXmlName = Object.keys(files).find(n => n.endsWith('.part.xml'));
  if (!partXmlName) {
    console.log(edz, 'NO PART XML!');
    continue;
  }
  const xml = files[partXmlName].toString('utf8');
  const mTop = xml.match(/P_ARTICLE_PRODUCTTOPGROUP="([^"]+)"/);
  const mGrp = xml.match(/P_ARTICLE_PRODUCTGROUP="([^"]+)"/);
  const mSub = xml.match(/P_ARTICLE_PRODUCTSUBGROUP="([^"]+)"/);
  console.log(
    path.basename(edz).padEnd(28),
    '-> Top:', (mTop ? mTop[1] : '?').padEnd(3),
    'Grp:', (mGrp ? mGrp[1] : '?').padEnd(3),
    'Sub:', (mSub ? mSub[1] : '?').padEnd(4)
  );
}
