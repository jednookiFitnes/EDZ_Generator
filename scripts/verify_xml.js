const fs = require('fs');
const zlib = require('zlib');

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

const edz = process.argv[2] || 'EDZ/PXC.1333136/PXC.1333136.edz';
const buf = fs.readFileSync(edz);
const files = readZip(buf);

for (const [name, content] of Object.entries(files)) {
  if (name.endsWith('.xml')) {
    console.log(`Checking ${name} (${content.length} bytes)...`);
    const str = content.toString('utf8');
    if (!str.startsWith('<?xml')) {
      throw new Error(`${name} does not start with XML declaration`);
    }
    // simple tag balance check
    const tags = [];
    const re = /<(\/)?([a-zA-Z0-9_\-]+)([^>]*)>/g;
    let match;
    while ((match = re.exec(str)) !== null) {
      const isClosing = match[1] === '/';
      const tagName = match[2];
      const rest = match[3];
      const isSelfClosing = rest.trim().endsWith('/');
      if (isClosing) {
        const last = tags.pop();
        if (last !== tagName) {
          throw new Error(`Mismatched closing tag in ${name}: expected </${last}>, got </${tagName}>`);
        }
      } else if (!isSelfClosing) {
        tags.push(tagName);
      }
    }
    if (tags.length > 0) {
      throw new Error(`Unclosed tags in ${name}: ${tags.join(', ')}`);
    }
    console.log(`  -> OK: valid XML structure`);
  }
}
console.log('All XML files verified successfully!');
