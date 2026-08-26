const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const mediaAssetsPath = path.join(root, 'lib', 'mediaAssets.ts');
const publicDir = path.join(root, 'public');
const text = fs.readFileSync(mediaAssetsPath, 'utf8');
const aliases = {};
for (const m of text.matchAll(/const\s+(CS|CT|FP|GD|RR|SM|WS)\s*=\s*'([^']+)'/g)) {
  aliases[m[1]] = m[2];
}
const paths = new Set();
function addPath(p) {
  if (!p) return;
  if (p.startsWith('/')) paths.add(p);
}
for (const m of text.matchAll(/img\((CS|CT|FP|GD|RR|SM|WS),\s*'([^']+)'\)/g)) {
  const folder = aliases[m[1]];
  const name = m[2];
  if (!folder) continue;
  addPath('/multimedia/img/' + encodeURIComponent(folder) + '/' + encodeURIComponent(name));
}
for (const m of text.matchAll(/poster:\s*'([^']+)'/g)) addPath(m[1]);
for (const m of text.matchAll(/src:\s*'([^']+)'/g)) addPath(m[1]);
const results = [];
for (const assetPath of paths) {
  const rel = assetPath.slice(1);
  const physical = path.join(publicDir, ...rel.split('/').map(decodeURIComponent));
  const exists = fs.existsSync(physical);
  results.push({ assetPath, physical, exists });
}
console.log(`Checked ${results.length} unique asset references.`);
const missing = results.filter((r) => !r.exists);
if (missing.length) {
  console.log(`Missing files: ${missing.length}`);
  missing.forEach((m) => console.log(`${m.assetPath} -> ${m.physical}`));
} else {
  console.log('No missing files.');
}
const actual = new Set();
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) actual.add(full);
  }
}
walk(path.join(publicDir, 'multimedia', 'img'));
console.log(`Found ${actual.size} actual image files under public/multimedia/img.`);
