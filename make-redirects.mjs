/* ============================================================
   Builds redirect stubs for the site's OLD location.

   Why this exists: GitHub Pages does NOT redirect project-site URLs
   when you rename a repository. GitHub's own docs say "all existing
   information, with the exception of project site URLs, is
   automatically redirected to the new name." So moving the site
   silently breaks every link already printed on a resume.

   This generates a drop-in replacement for the old repo that
   forwards every old URL to the matching new one, permanently, for
   free. Resume links keep working whether or not you update them.

   Usage:
     node make-redirects.mjs https://avi-gobrin.github.io/

   Output goes to redirects/ (gitignored). Copy its contents into the
   old repo, replacing everything, and leave GitHub Pages enabled.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';

const target = process.argv[2];
if (!target || !/^https?:\/\//.test(target)) {
  console.error('Usage: node make-redirects.mjs <new-base-url>');
  console.error('   eg: node make-redirects.mjs https://avi-gobrin.github.io/');
  process.exit(1);
}
const NEW_BASE = target.endsWith('/') ? target : target + '/';

/* Same WORK source as prerender.mjs, so the page list can never drift. */
const workSrc = readFileSync('work.js', 'utf8');
const WORK = new Function(`${workSrc.split('/* ---------- rendering ----------')[0]}; return WORK;`)();

const PAGES = ['index.html', 'experience.html', 'projects.html', 'research.html', 'coursework.html']
  .concat(WORK.map(w => `work-${w.id}.html`));

/* A stub is a real 200 response, so search engines follow the canonical
   and humans never see a broken page. */
function stub(dest) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${dest}">
  <link rel="canonical" href="${dest}">
  <meta name="robots" content="noindex">
  <title>Moved</title>
  <script>location.replace(${JSON.stringify(dest)});</script>
</head>
<body>
  <p>This page has moved to <a href="${dest}">${dest}</a>.</p>
</body>
</html>
`;
}

/* Catch-all for any path not listed above (old anchors, typos, future
   pages). GitHub Pages serves 404.html for anything it cannot find, so
   this maps the requested path onto the new site rather than dead-ending. */
const catchAll = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex">
  <title>Moved</title>
  <script>
    (function () {
      var base = ${JSON.stringify(NEW_BASE)};
      var file = location.pathname.split('/').filter(Boolean).pop() || '';
      location.replace(base + (/\\.html?$/.test(file) ? file : '') + location.hash);
    })();
  </script>
</head>
<body>
  <p>This site has moved to <a href="${NEW_BASE}">${NEW_BASE}</a>.</p>
</body>
</html>
`;

rmSync('redirects', { recursive: true, force: true });
mkdirSync('redirects');

for (const p of PAGES) {
  writeFileSync(`redirects/${p}`, stub(NEW_BASE + (p === 'index.html' ? '' : p)));
}
writeFileSync('redirects/404.html', catchAll);

console.log(`Wrote ${PAGES.length + 1} redirect stubs to redirects/ pointing at ${NEW_BASE}`);
console.log('Copy the contents into the OLD repo, replacing everything else.');
