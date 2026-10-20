const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', '@camptocamp', 'inkmap', 'dist', 'inkmap-worker.js');
const dest = path.join(__dirname, '..', 'public', 'inkmap-worker.js');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('✅ Copied inkmap-worker.js to public/');
} else {
  console.warn('⚠️ inkmap-worker.js not found');
}