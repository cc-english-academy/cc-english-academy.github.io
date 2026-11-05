// After editing a file in assets/css or assets/js, run:  node scripts/bump-assets.mjs
// It stamps each file's fingerprint into the pages that load it (…site.css?v=1a2b3c4d), so visitors get the
// new file instead of the copy their browser kept.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const pages = {
  'index.html': ['assets/css/site.css', 'assets/js/app.js', 'assets/js/lang.js'],
  'tech-dashboard.html': ['assets/css/track.css', 'assets/js/track.js'],
  'french-dashboard.html': ['assets/css/track.css', 'assets/js/track.js']
};
for (const [page, files] of Object.entries(pages)) {
  let html = readFileSync(page, 'utf8');
  for (const f of files) {
    const v = createHash('md5').update(readFileSync(f)).digest('hex').slice(0, 8);
    const re = new RegExp(f.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&') + '\\?v=[0-9a-f]+');
    if (!re.test(html)) throw new Error(f + ' is not linked from ' + page);
    html = html.replace(re, f + '?v=' + v);
    console.log(page + ': ' + f + ' → v=' + v);
  }
  writeFileSync(page, html);
}
