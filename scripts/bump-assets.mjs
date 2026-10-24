// After editing assets/css/site.css or assets/js/*.js, run:  node scripts/bump-assets.mjs
// It stamps each file's fingerprint into index.html (…site.css?v=1a2b3c4d), so visitors get the new file
// instead of the copy their browser kept.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const files = ['assets/css/site.css', 'assets/js/app.js', 'assets/js/lang.js'];
let html = readFileSync('index.html', 'utf8');
for (const f of files) {
  const v = createHash('md5').update(readFileSync(f)).digest('hex').slice(0, 8);
  const re = new RegExp(f.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '\\?v=[0-9a-f]+');
  if (!re.test(html)) throw new Error(f + ' is not linked from index.html');
  html = html.replace(re, f + '?v=' + v);
  console.log(f + ' → v=' + v);
}
writeFileSync('index.html', html);
