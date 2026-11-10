/* ============================================================
   Builds every part of the site that comes from data.

     node prerender.mjs             refresh GitHub activity, then build
     node prerender.mjs --offline   build from the saved activity

   1. Fetches the public GitHub contribution calendar and saves it to
      assets/contributions.json. If GitHub cannot be reached, the
      saved copy is used and nothing breaks.
   2. Fills every block marked <!-- build:NAME --> ... <!-- /build:NAME -->
      in the hand-written pages (head, nav, footer, the homepage
      portrait, project list, and activity graph, and the project and
      report lists).
   3. Writes one page per item in work.js (work-<id>.html), the 404
      page, sitemap.xml, and robots.txt.

   Everything else on a page is hand-written HTML: edit it directly.
   Safe to run repeatedly. Files are written with LF line endings.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

/* Every absolute URL derives from BASE, so moving the site is a
   one-line change (see README, "Moving the site"). */
const BASE = 'https://avi-gobrin.github.io/personal-site/';
const GITHUB_USER = 'Avi-Gobrin';
const EMAIL = 'avichaigobrin@gmail.com';
const OFFLINE = process.argv.includes('--offline');

const WORK = new Function(`${readFileSync('work.js', 'utf8')}\nreturn WORK;`)();
/* Each id becomes a file name and an HTML id, so keep it plain. */
for (const w of WORK) {
  if (!/^[a-z0-9-]+$/.test(w.id)) throw new Error(`work.js: id "${w.id}" must be lowercase letters, digits, and hyphens`);
}

/* ---------- small helpers ---------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function pageHref(w) {
  return `work-${w.id}.html`;
}
/* ['a', 'b', 'c'] -> 'a, b, and c' */
function sentenceList(items) {
  if (items.length < 3) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
function linkHtml(l) {
  return `<a href="${esc(l.href)}">${esc(l.label)}</a>`;
}
function metaLines(w) {
  return [w.when, w.kind, w.course].filter(Boolean).map(s => `<p>${esc(s)}</p>`).join('');
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const DAY_MS = 86400000;
const toDate = s => new Date(`${s}T00:00:00Z`);
const toIso = d => d.toISOString().slice(0, 10);
const longDate = d => `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
const shortDate = d => `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

/* ---------- shared head, nav, and footer ---------- */
const FONTS = 'https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Alegreya+Sans:wght@400;500&display=swap';

/* Runs before first paint so the page never flashes the wrong theme. */
const THEME_BOOT = `(function(){var t;try{t=localStorage.getItem('theme')}catch(e){}if(t!=='dark'&&t!=='light'){t=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)})();`;

function head(root = '') {
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<script>${THEME_BOOT}</script>
<link rel="stylesheet" href="${root}style.css">`;
}

const NAV = [
  ['experience.html', 'Experience'],
  ['projects.html', 'Projects'],
  ['research.html', 'Research'],
  ['coursework.html', 'Coursework']
];

/* The homepage already shows the name in large type, so its margin
   slot stays empty. `current` marks the page you are on; on a project
   or report page it marks the section instead (aria-current="true"). */
function nav(current, root = '', section = false) {
  const home = current === 'index.html' ? '' : `<a class="name-link" href="${root || './'}">Avi Gobrin</a>`;
  const mark = section ? ' aria-current="true"' : ' aria-current="page"';
  const links = NAV.map(([href, label]) =>
    `<a href="${root}${href}"${href === current ? mark : ''}>${label}</a>`).join('\n      ');
  return `<div class="row">
  <p class="margin">${home}</p>
  <div class="page bar">
    <nav class="nav" aria-label="Main">
      ${links}
    </nav>
    <button class="theme-toggle" type="button"><span class="to-dark">Chalkboard<span class="sr-only"> (switch to dark theme)</span></span><span class="to-light">Notebook<span class="sr-only"> (switch to light theme)</span></span></button>
  </div>
</div>`;
}

function footer() {
  return `<div class="row">
  <p class="margin">Say hi</p>
  <div class="page">
    <p class="footer-links"><a href="mailto:${EMAIL}">${EMAIL}</a><span class="profiles"><a href="https://github.com/${GITHUB_USER}">GitHub</a><a href="https://www.linkedin.com/in/avigobrin/">LinkedIn</a><a href="https://x.com/AvichaiGobrin">X</a></span></p>
    <p class="fine">Hand-built in plain HTML, CSS, and a little JavaScript. &copy; 2026 Avi Gobrin.</p>
  </div>
</div>`;
}

/* ---------- GitHub activity ---------- */
const ACTIVITY_FILE = 'assets/contributions.json';

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return m ? m[1] : null;
}

/* GitHub's contribution calendar is server-rendered HTML: each day is a
   <td data-date="..." id="..."> and its count lives in a matching
   <tool-tip for="...">, as in "3 contributions on May 4th." */
function parseCalendar(html) {
  const dateById = {};
  for (const [tag] of html.matchAll(/<td\b[^>]*>/g)) {
    const date = attr(tag, 'data-date');
    const id = attr(tag, 'id');
    if (date && id) dateById[id] = date;
  }
  const days = {};
  for (const m of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)) {
    const date = dateById[m[1]];
    if (!date) continue;
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    const n = /^no contributions/i.test(text) ? 0 : parseInt(text.replace(/,/g, ''), 10);
    if (Number.isFinite(n)) days[date] = n;
  }
  const dates = Object.keys(days).sort();
  if (dates.length < 300) throw new Error(`only ${dates.length} days found; the page format may have changed`);
  const sum = dates.reduce((s, d) => s + days[d], 0);
  const stated = html.match(/([\d,]+)\s+contributions?\s+in the last year/i);
  const total = stated ? parseInt(stated[1].replace(/,/g, ''), 10) : sum;
  return { asOf: dates[dates.length - 1], total, days: Object.fromEntries(dates.map(d => [d, days[d]])) };
}

async function loadActivity() {
  let saved = null;
  try {
    if (existsSync(ACTIVITY_FILE)) saved = JSON.parse(readFileSync(ACTIVITY_FILE, 'utf8'));
  } catch (e) {
    console.warn(`  ! ${ACTIVITY_FILE} is unreadable (${e.message}). Ignoring it.`);
  }
  if (OFFLINE) return saved;
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USER}/contributions`, {
      headers: { 'User-Agent': 'personal-site-prerender' },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const fresh = parseCalendar(await res.text());
    writeFileSync(ACTIVITY_FILE, JSON.stringify(fresh, null, 1) + '\n');
    console.log(`  ✓ GitHub activity: ${fresh.total} contributions in the year to ${fresh.asOf}`);
    return fresh;
  } catch (e) {
    console.warn(`  ! Could not refresh GitHub activity (${e.message}). Using the saved copy.`);
    return saved;
  }
}

/* Shade by quartile of the non-zero days, the way GitHub does, so one
   huge day does not wash out the rest of the year. */
function shader(days) {
  const nz = Object.values(days).filter(n => n > 0).sort((a, b) => a - b);
  const q = p => (nz.length ? nz[Math.min(nz.length - 1, Math.floor(p * nz.length))] : 0);
  const [a, b, c] = [q(0.25), q(0.5), q(0.75)];
  return n => (n <= 0 ? 0 : n <= a ? 1 : n <= b ? 2 : n <= c ? 3 : 4);
}

/* One column per week (Sunday on top), ending with the current week. */
function heatmap(data, weeks, className, label) {
  const dates = Object.keys(data.days).sort();
  const last = toDate(dates[dates.length - 1]);
  const lastSunday = new Date(+last - last.getUTCDay() * DAY_MS);
  const start = new Date(+lastSunday - (weeks - 1) * 7 * DAY_MS);
  const shade = shader(data.days);
  const PITCH = 13, CELL = 10, TOP = 18;
  const width = weeks * PITCH - (PITCH - CELL);
  const height = TOP + 7 * PITCH - (PITCH - CELL);

  let cells = '';
  let months = [];
  let prev = -1;
  for (let w = 0; w < weeks; w++) {
    const sunday = new Date(+start + w * 7 * DAY_MS);
    if (sunday.getUTCMonth() !== prev) {
      months.push([w, sunday.getUTCMonth()]);
      prev = sunday.getUTCMonth();
    }
    for (let d = 0; d < 7; d++) {
      const day = new Date(+sunday + d * DAY_MS);
      if (day > last) break;
      const n = data.days[toIso(day)];
      if (n === undefined) continue;
      const what = n === 1 ? '1 contribution' : `${n} contributions`;
      cells += `<rect x="${w * PITCH}" y="${TOP + d * PITCH}" width="${CELL}" height="${CELL}" class="h${shade(n)}"><title>${what}, ${shortDate(day)}</title></rect>`;
    }
  }
  /* A partial first month gets no label if it would collide with the next. */
  if (months.length > 1 && months[1][0] - months[0][0] < 3) months = months.slice(1);
  const labels = months.map(([w, m]) =>
    `<text x="${w * PITCH}" y="11" class="heat-label">${MONTHS[m].slice(0, 3)}</text>`).join('');

  return `<svg class="${className}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(label)}">${labels}${cells}</svg>`;
}

function activity(data) {
  if (!data) return `<p class="caption">See my work on <a href="https://github.com/${GITHUB_USER}">GitHub</a>.</p>`;
  const asOf = toDate(data.asOf);
  const total = data.total.toLocaleString('en-US');
  return `<div class="heat">
  ${heatmap(data, 53, 'heat-year', `Daily GitHub contributions for the year to ${longDate(asOf)}`)}
  ${heatmap(data, 26, 'heat-half', `Daily GitHub contributions for the six months to ${longDate(asOf)}`)}
</div>
<p class="caption">${total} contributions by <a href="https://github.com/${GITHUB_USER}">@${GITHUB_USER}</a> in the year to ${longDate(asOf)}.<span class="half-note"> The graph shows the last six months.</span></p>`;
}

/* ---------- homepage pieces ---------- */
/* Drop a square photo at assets/photo.jpg (or .png, .webp) and rerun
   this script; until then the margin shows a monogram. */
function portrait() {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    const file = `assets/photo.${ext}`;
    if (existsSync(file)) return `<img class="portrait" src="${file}" alt="Avi Gobrin" width="92" height="92">`;
  }
  return `<span class="portrait monogram" aria-hidden="true">AG</span>`;
}

function featured() {
  return WORK.filter(w => w.featured).map(w => `<div class="item">
  <div class="item-head"><h3 class="item-title"><a href="${pageHref(w)}">${esc(w.title)}</a></h3><p class="item-meta">${esc(w.kind)}, ${esc(w.when)}</p></div>
  <p>${esc(w.line)}</p>
</div>`).join('\n');
}

/* ---------- list pages ---------- */
function toolsLine(w) {
  if (!w.tools || !w.tools.length) return '';
  return w.type === 'Report'
    ? `Methods: ${esc(sentenceList(w.tools))}.`
    : `Built with ${esc(sentenceList(w.tools))}.`;
}

function workRow(w, level) {
  const tools = toolsLine(w) ? `\n    <p class="tools">${toolsLine(w)}</p>` : '';
  const links = (w.links || []).length ? `\n    <p class="links">${w.links.map(linkHtml).join('')}</p>` : '';
  return `<article class="row" id="${w.id}">
  <div class="margin">${metaLines(w)}</div>
  <div class="page">
    <h${level} class="entry-title"><a href="${pageHref(w)}">${esc(w.title)}</a></h${level}>
    <p class="entry-text">${esc(w.card)}</p>${tools}${links}
  </div>
</article>`;
}

const projects = () => WORK.filter(w => w.type === 'Project').map(w => workRow(w, 2)).join('\n');
const reports = () => WORK.filter(w => w.type === 'Report').map(w => workRow(w, 3)).join('\n');

/* ---------- whole pages ---------- */
function metaDescription(w) {
  const raw = (w.card || w.desc || '').replace(/\s+/g, ' ').trim();
  if (raw.length <= 155) return esc(raw);
  const cut = raw.slice(0, 153);
  return esc(cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '...');
}

function shell({ title, description, url, ogType = 'website', root = '', current = '', section = false, robots = '', body }) {
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
  <meta property="og:image" content="${BASE}assets/og-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${BASE}assets/og-card.png">
  ${head(root).split('\n').join('\n  ')}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="notebook">
    <header class="masthead">
      ${nav(current, root, section).split('\n').join('\n      ')}
    </header>

    <main id="main">
      ${body.trim().split('\n').join('\n      ')}
    </main>

    <footer class="footer">
      ${footer().split('\n').join('\n      ')}
    </footer>
  </div>
  <script src="${root}theme.js"></script>
</body>
</html>
`;
}

function detailPage(w) {
  const report = w.type === 'Report';
  const [listHref, listLabel] = report ? ['research.html', 'Research'] : ['projects.html', 'Projects'];
  const rows = [`<div class="row">
  <p class="margin"><a href="${listHref}">${listLabel}</a></p>
  <div class="page"><h1 class="title">${esc(w.title)}</h1></div>
</div>`, `<div class="row tight">
  <div class="margin">${metaLines(w)}</div>
  <p class="page desc">${esc(w.desc)}</p>
</div>`];
  if (w.findings && w.findings.length) rows.push(`<div class="row">
  <h2 class="margin">${esc(w.findingsLabel || 'Details')}</h2>
  <div class="page">
    <ul class="points">
      ${w.findings.map(f => `<li>${f}</li>`).join('\n      ')}
    </ul>
  </div>
</div>`);
  if (w.tools && w.tools.length) rows.push(`<div class="row">
  <h2 class="margin">${report ? 'Methods' : 'Built with'}</h2>
  <p class="page">${esc(sentenceList(w.tools))}</p>
</div>`);
  if ((w.links || []).length) rows.push(`<div class="row">
  <div class="margin"></div>
  <p class="page links">${w.links.map(linkHtml).join('')}</p>
</div>`);
  return shell({
    title: `${esc(w.title)} | Avi Gobrin`,
    description: metaDescription(w),
    url: BASE + pageHref(w),
    ogType: 'article',
    current: listHref,
    section: true,
    body: rows.join('\n\n')
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
    body: `<div class="row">
  <p class="margin">Error 404</p>
  <div class="page">
    <h1 class="title">This page wandered off</h1>
    <p class="intro">It may have moved, or it never existed. Either way, it is somewhere in the fog of war.</p>
    <p class="links"><a href="${BASE}">Go to the homepage</a></p>
  </div>
</div>`
  });
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

/* Indenting a blank line leaves trailing spaces; strip them. */
const tidy = html => html.replace(/[ \t]+$/gm, '');

/* Canonical and preview URLs always derive from BASE. */
function rewriteUrls(html, file) {
  const url = BASE + (file === 'index.html' ? '' : file);
  const img = `${BASE}assets/og-card.png`;
  return html
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/("url": ")[^"]*(")/, `$1${BASE}$2`);
}

/* ---------- run ---------- */
const data = await loadActivity();

const PAGES = {
  'index.html': { portrait, featured, activity: () => activity(data) },
  'experience.html': {},
  'projects.html': { projects },
  'research.html': { reports },
  'coursework.html': {}
};

for (const [file, blocks] of Object.entries(PAGES)) {
  let html = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  html = fill(html, 'head', head(), file);
  html = fill(html, 'nav', nav(file), file);
  html = fill(html, 'footer', footer(), file);
  for (const [name, render] of Object.entries(blocks)) html = fill(html, name, render(), file);
  writeFileSync(file, tidy(rewriteUrls(html, file)));
  console.log(`  ✓ ${file}`);
}

for (const w of WORK) {
  writeFileSync(pageHref(w), tidy(detailPage(w)));
  console.log(`  ✓ ${pageHref(w)}`);
}

writeFileSync('404.html', tidy(notFoundPage()));
console.log('  ✓ 404.html');

const SITE_PAGES = ['', 'experience.html', 'projects.html', 'research.html', 'coursework.html']
  .concat(WORK.map(pageHref));
/* No <lastmod>: stamping every page with the build date would be false. */
writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITE_PAGES.map(p => `  <url>\n    <loc>${BASE}${p}</loc>\n  </url>`).join('\n')}
</urlset>
`);
console.log('  ✓ sitemap.xml');

writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${BASE}sitemap.xml\n`);
console.log('  ✓ robots.txt');
console.log('Done.');
