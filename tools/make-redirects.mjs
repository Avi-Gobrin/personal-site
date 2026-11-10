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
     node tools/make-redirects.mjs https://avi-gobrin.github.io/

   Output goes to redirects/ (gitignored). Copy its contents into the
   old repo, replacing everything, and leave GitHub Pages enabled.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(fileURLToPath(new URL('..', import.meta.url)));

const target = process.argv[2];
if (!target || !/^https?:\/\//.test(target)) {
  console.error('Usage: node tools/make-redirects.mjs <new-base-url>');
  console.error('   eg: node tools/make-redirects.mjs https://avi-gobrin.github.io/');
  process.exit(1);
}
const NEW_BASE = target.endsWith('/') ? target : target + '/';

/* Same WORK source as tools/build.mjs, so the page list can never drift. */
const WORK = new Function(`${readFileSync('content/work.js', 'utf8')}\nreturn WORK;`)();

/* Every page is a folder; '' is the homepage. */
const PAGES = ['', 'about/', 'experience/', 'projects/', 'research/']
  .concat(WORK.map(w => `${w.type === 'Report' ? 'research' : 'projects'}/${w.id}/`));

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
  <script>location.replace(${JSON.stringify(dest)} + location.search + location.hash);</script>
</head>
<body>
  <p>This page has moved to <a href="${dest}">${dest}</a>.</p>
</body>
</html>
`;
}

/* Catch-all for any path not listed above (PDFs, old anchors, typos,
   future pages). GitHub Pages serves 404.html for anything it cannot
   find, so this maps the whole requested path, below /personal-site/,
   onto the new site rather than dead-ending. */
const catchAll = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex">
  <title>Moved</title>
  <script>
    (function () {
      var base = ${JSON.stringify(NEW_BASE)};
      var path = location.pathname.replace(/^\\/personal-site\\//, '').replace(/^\\//, '');
      location.replace(base + path + location.search + location.hash);
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
  mkdirSync(dirname(`redirects/${p}index.html`), { recursive: true });
  writeFileSync(`redirects/${p}index.html`, stub(NEW_BASE + p));
}
writeFileSync('redirects/404.html', catchAll);

console.log(`Wrote ${PAGES.length + 1} redirect stubs to redirects/ pointing at ${NEW_BASE}`);
console.log('Copy the contents into the OLD repo, replacing everything else.');
