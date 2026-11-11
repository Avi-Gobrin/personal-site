/* ============================================================
   Builds every part of the site that comes from data.

     node tools/build.mjs      (from anywhere; it finds the site)

   1. Fills every block marked <!-- build:NAME --> ... <!-- /build:NAME -->
      in the hand-written pages: head, nav, footer, the project and
      report lists, and pixel icons (<!-- build:icon-laptop --> and
      so on; see tools/icons.mjs).
   2. Writes one page per item in content/work.js (projects/<id>/ and
      research/<id>/), the 404 page, sitemap.xml, and robots.txt.

   Everything else on a page is hand-written HTML: edit it directly.
   Safe to run repeatedly. Files are written with LF line endings.
   ============================================================ */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { svg, ICON_NAMES, logoLink } from './icons.mjs';
import { BASE, WORK, isReport, dirOf, ALL_PAGES } from './site.mjs';

const GITHUB_USER = 'Avi-Gobrin';
const EMAIL = 'avichaigobrin@gmail.com';
const RESUME = 'assets/Resumes/Avi_Gobrin_Resume_2026_ML.pdf';

/* ---------- small helpers ---------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* Links in work.js are relative to the site root; fix them up for the page they land on. */
const hrefFrom = (href, root) => (/^(https?:|mailto:)/.test(href) ? href : root + href);
const linkHtml = (l, root) => `<a href="${esc(hrefFrom(l.href, root))}">${esc(l.label)}</a>`;
const metaLine = w => [w.kind, w.course].filter(Boolean).map(esc).join(' · ');

/* ---------- shared head, nav, and footer ---------- */
const FONTS = 'https://fonts.googleapis.com/css2?family=Alegreya:wght@500&family=Inter:wght@400;500;600&family=Silkscreen&display=swap';

/* Runs before first paint so the page never flashes the wrong theme. */
const THEME_BOOT = `(function(){var t;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='dark'&&t!=='light'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)})();`;

function head(root) {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<script>${THEME_BOOT}</script>
<link rel="stylesheet" href="${root}assets/css/style.css">`;
}

const NAV = [
  ['experience/', 'Experience'],
  ['projects/', 'Projects'],
  ['research/', 'Research'],
  ['about/', 'About']
];

/* `current` is the section you are in. On a section's own page it is
   aria-current="page"; on a project or report inside it, "true". */
function nav(current, root, section = false) {
  const home = current === '' ? '' : `\n  <a class="name-link" href="${root || './'}">Avi Gobrin</a>`;
  const mark = section ? ' aria-current="true"' : ' aria-current="page"';
  const links = NAV.map(([href, label]) =>
    `<a href="${root}${href}"${href === current ? mark : ''}>${label}</a>`).join('\n    ');
  return `<div class="bar">${home}
  <nav class="nav" aria-label="Main">
    ${links}
  </nav>
  <button class="theme-toggle" type="button"><span class="to-dark">Lights off<span class="sr-only"> (switch to dark theme)</span></span><span class="to-light">Lights on<span class="sr-only"> (switch to light theme)</span></span></button>
</div>`;
}

const CONTACT = {
  email: [`mailto:${EMAIL}`, 'Email'],
  resume: [RESUME, 'Resume (PDF)'],
  github: [`https://github.com/${GITHUB_USER}`, 'GitHub'],
  linkedin: ['https://www.linkedin.com/in/avigobrin/', 'LinkedIn'],
  x: ['https://x.com/AvichaiGobrin', 'X']
};
function logos(names, root) {
  return names.map(n => logoLink(n, hrefFrom(CONTACT[n][0], root), CONTACT[n][1])).join('\n');
}

function footer(root) {
  return `<p class="logos">
${logos(['email', 'github', 'linkedin', 'x'], root)}
</p>
<p class="fine">Hand-built in plain HTML, CSS, and a little JavaScript. &copy; 2026 Avi Gobrin.</p>`;
}

/* The homepage's row under the name. */
const heroLinks = root => logos(['email', 'resume', 'github', 'linkedin'], root);

/* ---------- list pages ---------- */
function toolsLine(w) {
  return (w.tools || []).length ? `<p class="stack">${w.tools.map(esc).join(' · ')}</p>` : '';
}

/* One entry: the date in the margin, then the title, a line of
   context, and (for projects) one paragraph. Papers are just titled. */
function entry(w, root, level) {
  const href = root + dirOf(w);
  const links = (w.links || []).map(l => linkHtml(l, root)).join('');
  const body = isReport(w) ? '' : `
    <p>${esc(w.card)}</p>
    ${toolsLine(w)}`;
  return `<article class="entry" id="${w.id}">
  <p class="when">${esc(w.when)}</p>
  <div>
    <h${level} class="entry-title"><a href="${href}">${esc(w.title)}</a></h${level}>
    <p class="meta">${metaLine(w)}</p>${body}${links ? `
    <p class="links">${links}</p>` : ''}
  </div>
</article>`;
}

const projects = root => WORK.filter(w => !isReport(w)).map(w => entry(w, root, 2)).join('\n');
const reports = root => WORK.filter(isReport).map(w => entry(w, root, 3)).join('\n');

/* ---------- whole pages ---------- */
function metaDescription(w) {
  const raw = (w.card || w.desc || '').replace(/\s+/g, ' ').trim();
  if (raw.length <= 155) return esc(raw);
  const cut = raw.slice(0, 153);
  return esc(cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '...');
}

function shell({ title, description, url, ogType = 'website', root, current = '', section = false, robots = '', body }) {
  const indent = (s, n) => s.trim().split('\n').join('\n' + ' '.repeat(n));
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">${robots ? `\n  <meta name="robots" content="${robots}">` : ''}
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Avi Gobrin">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASE}assets/img/og-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${BASE}assets/img/og-card.png">
  ${indent(head(root), 2)}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header class="masthead">
    ${indent(nav(current, root, section), 4)}
  </header>
  <main id="main" class="wrap">
    ${indent(body, 4)}
  </main>
  <footer class="footer">
    ${indent(footer(root), 4)}
  </footer>
  <script src="${root}assets/js/theme.js"></script>
</body>
</html>
`;
}

function detailPage(w) {
  const root = '../../';
  const report = isReport(w);
  const [list, label] = report ? ['research/', 'Research'] : ['projects/', 'Projects'];
  const parts = [`<header class="page-head text">
  <p class="crumb"><a href="${root}${list}">${label}</a></p>
  <h1 class="title">${esc(w.title)}</h1>
  <p class="meta">${esc(w.when)} · ${metaLine(w)}</p>
</header>`, `<p class="lede">${esc(w.desc)}</p>`];
  if ((w.findings || []).length) parts.push(`<h2 class="kicker">${esc(w.findingsLabel || 'Details')}</h2>
<ul class="points">
  ${w.findings.map(f => `<li>${f}</li>`).join('\n  ')}
</ul>`);
  if ((w.tools || []).length) parts.push(`<h2 class="kicker">${report ? 'Methods' : 'Built with'}</h2>
${toolsLine(w)}`);
  if ((w.links || []).length) parts.push(`<p class="links">${w.links.map(l => linkHtml(l, root)).join('')}</p>`);
  return shell({
    title: `${esc(w.short || w.title)} | Avi Gobrin`,
    description: metaDescription(w),
    url: BASE + dirOf(w),
    ogType: 'article',
    root,
    current: list,
    section: true,
    body: parts.join('\n\n')
  });
}

/* GitHub Pages serves this for any missing path, at any depth, so
   every URL in it is absolute. */
function notFoundPage() {
  return shell({
    title: 'Page not found | Avi Gobrin',
    description: 'This page does not exist.',
    url: BASE + '404.html',
    root: BASE,
    robots: 'noindex',
    body: `<header class="page-head text">
  <p class="kicker">Error 404</p>
  <h1 class="title">This page wandered off</h1>
  <p class="intro">It may have moved, or it never existed. Either way, it is somewhere in the fog of war.</p>
  <p class="links"><a href="${BASE}">Back to the room</a></p>
</header>
<script>${forwardScript()}</script>`
  });
}

/* Addresses from the old site, some printed on resumes already sent.
   GitHub Pages cannot redirect, but it serves 404.html for any missing
   path, so this page forwards each old address to where it lives now. */
const MOVED = {
  'assets/oulad-sta437.pdf': 'assets/reports/oulad-sta437.pdf',
  'assets/apm-project.pdf': 'assets/reports/apm-project.pdf',
  'experience.html': 'experience/',
  'projects.html': 'projects/',
  'research.html': 'research/',
  'coursework.html': 'research/',
  'work-gpt.html': 'projects/tiny-gpt/',
  'work-agents.html': 'projects/agents/',
  'work-plantinarium.html': 'projects/plantinarium/',
  'work-oulad.html': 'research/oulad/',
  'work-apm.html': 'research/apm/'
};
function forwardScript() {
  const path = new URL(BASE).pathname;
  return `(function(){var m=${JSON.stringify(MOVED)};var p=location.pathname.replace(${JSON.stringify(path)},'');if(m[p])location.replace(${JSON.stringify(BASE)}+m[p]+location.hash);})();`;
}

/* ---------- filling marked blocks ---------- */
function fill(html, name, content, file) {
  const re = new RegExp(`([ \\t]*)([^\\n]*?)<!-- build:${name} -->[\\s\\S]*?<!-- /build:${name} -->`);
  const m = html.match(re);
  if (!m) {
    console.warn(`  ! ${file}: no build:${name} block`);
    return html;
  }
  const indent = m[1] + (m[2].trim() ? '  ' : '');
  const body = content.split('\n').map(l => (l ? indent + l : l)).join('\n');
  return html.replace(re, (_, lead, before) =>
    `${lead}${before}<!-- build:${name} -->\n${body}\n${indent}<!-- /build:${name} -->`);
}

/* Icons are one line each: <!-- build:icon-NAME -->svg<!-- /build:icon-NAME --> */
function fillIcons(html, file) {
  return html.replace(/<!-- build:icon-([a-z]+)(?: size=(\d+))? -->[\s\S]*?<!-- \/build:icon-\1 -->/g, (m, name, size) => {
    if (!ICON_NAMES.includes(name)) throw new Error(`${file}: no icon called "${name}"`);
    return `<!-- build:icon-${name}${size ? ` size=${size}` : ''} -->${svg(name, Number(size) || 4)}<!-- /build:icon-${name} -->`;
  });
}

/* Indenting a blank line leaves trailing spaces; strip them. Then stamp
   every stylesheet and script link with a hash of the file, so a browser
   never pairs new HTML with an old cached copy. */
const stamp = file => createHash('sha1').update(readFileSync(file)).digest('hex').slice(0, 8);
const tidy = html => html.replace(/[ \t]+$/gm, '')
  .replace(/((?:href|src)="[^"]*?(assets\/(?:css\/[a-z-]+\.css|js\/[a-z-]+\.js|img\/favicon\.svg)))(?:\?v=[0-9a-f]+)?"/g, (m, url, file) => `${url}?v=${stamp(file)}"`);

/* Canonical and preview URLs always derive from BASE. */
function rewriteUrls(html, path) {
  const url = BASE + path;
  const img = `${BASE}assets/img/og-card.png`;
  return html
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/("url": ")[^"]*(")/, `$1${BASE}$2`);
}

/* ---------- run ---------- */
/* The hand-written pages: the folder each lives in, and its extra blocks. */
const PAGES = {
  '': { links: heroLinks },
  'about/': {},
  'experience/': {},
  'projects/': { projects },
  'research/': { reports }
};

for (const [dir, blocks] of Object.entries(PAGES)) {
  const file = `${dir}index.html`;
  const root = dir ? '../' : '';
  let html = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  html = fill(html, 'head', head(root), file);
  html = fill(html, 'nav', nav(dir, root), file);
  if (dir) html = fill(html, 'footer', footer(root), file);   // the homepage is one screen, no footer
  for (const [name, render] of Object.entries(blocks)) html = fill(html, name, render(root), file);
  html = fillIcons(html, file);
  writeFileSync(file, tidy(rewriteUrls(html, dir)));
  console.log(`  ✓ ${file}`);
}

/* Generated pages: clear out folders for items that no longer exist, then write the rest. */
for (const section of ['projects', 'research']) {
  for (const d of readdirSync(section, { withFileTypes: true })) {
    if (d.isDirectory() && !WORK.some(w => dirOf(w) === `${section}/${d.name}/`)) {
      rmSync(`${section}/${d.name}`, { recursive: true });
      console.log(`  - removed ${section}/${d.name}/`);
    }
  }
}
for (const w of WORK) {
  mkdirSync(dirOf(w), { recursive: true });
  writeFileSync(`${dirOf(w)}index.html`, tidy(detailPage(w)));
  console.log(`  ✓ ${dirOf(w)}index.html`);
}

writeFileSync('404.html', tidy(notFoundPage()));
console.log('  ✓ 404.html');

/* No <lastmod>: stamping every page with the build date would be false. */
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ALL_PAGES.map(p => `  <url>\n    <loc>${BASE}${p}</loc>\n  </url>`).join('\n')}
</urlset>
`);
console.log('  ✓ sitemap.xml');

writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
console.log('  ✓ robots.txt');
if (!existsSync('assets/img/og-card.png')) console.warn('  ! assets/img/og-card.png is missing');
console.log('Done.');
