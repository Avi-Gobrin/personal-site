/* ============================================================
   Bakes the dynamic parts of the site into the HTML files.

   Why: projects.html, research.html, and the homepage Featured list
   are rendered by work.js at runtime. Search engines and no-JS
   visitors should still see the content, so the same markup is
   written into the files between prerender markers.

   Also generates one page per WORK item (work-<id>.html) so every
   project and paper has its own focused, linkable page, and owns
   the nav, the footer, every canonical/OG URL, and sitemap.xml.

   Moving the site to a new URL is a one-line change: edit BASE,
   run this, then run make-redirects.mjs for the old location.

   Run after editing work.js:  node prerender.mjs
   Safe to run repeatedly.
   ============================================================ */
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'https://avi-gobrin.github.io/personal-site/';

/* Pull the WORK array straight out of work.js so there is one source of truth. */
const workSrc = readFileSync('work.js', 'utf8');
const dataPart = workSrc.split('/* ---------- rendering ----------')[0];
const WORK = new Function(`${dataPart}; return WORK;`)();

/* ---------- renderers (must mirror work.js output exactly) ---------- */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function tagsHtml(tags) {
  return (tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
}
function starHtml(w) {
  return w.featured ? '<span class="w-star" title="Featured">★</span>' : '';
}
function pageHref(w) {
  return `work-${w.id}.html`;
}
function linkHtml(l, cls) {
  const target = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
  const klass = cls ? ` class="${cls}"` : '';
  return `<a href="${l.href}"${target}${klass}>${esc(l.label)} &rarr;</a>`;
}

function cardHtml(w) {
  const links = [`<a href="${pageHref(w)}">Details &rarr;</a>`]
    .concat((w.links || []).map(l => linkHtml(l)))
    .join('');
  return `
    <article class="card">
      <p class="card-kicker">${esc(w.kicker)}</p>
      <h3 class="card-title">${starHtml(w)}<a href="${pageHref(w)}">${esc(w.title)}</a></h3>
      <p class="card-desc">${esc(w.card || w.desc || '')}</p>
      <div class="tags">${tagsHtml(w.tags)}</div>
      <div class="card-links">${links}</div>
    </article>`;
}

function renderFeaturedHome() {
  return WORK.filter(w => w.featured).map(w => `
    <a href="${pageHref(w)}" class="feat-item">
      <span class="feat-type">${esc(w.type)}</span>
      <span class="feat-title">${esc(w.title)}</span>
    </a>`).join('');
}

function renderProjects() {
  return WORK.filter(w => w.type === 'Project').map(cardHtml).join('');
}

function renderResearch() {
  return WORK.filter(w => w.type === 'Paper').map(cardHtml).join('');
}

/* ---------- static nav (must mirror nav.js output exactly) ---------- */
const NAV_LINKS = [
  { href: 'index.html',      label: 'Home' },
  { href: 'experience.html', label: 'Experience' },
  { href: 'projects.html',   label: 'Projects' },
  { href: 'research.html',   label: 'Research' },
  { href: 'coursework.html', label: 'Coursework' }
];

function renderNav(page) {
  const links = NAV_LINKS.map(l => {
    const cls = l.href === page ? ' class="on"' : '';
    return `<li><a href="${l.href}"${cls}>${l.label}</a></li>`;
  }).join('');
  return '<a href="index.html" class="logo">Avi Gobrin</a>' +
    '<div class="nav-right">' +
      '<ul class="nav-links">' + links + '</ul>' +
      '<button class="nav-toggle" type="button" aria-label="Toggle navigation">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
      '</button>' +
      '<button class="theme-toggle" type="button" aria-label="Toggle dark mode">' +
        '<svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
        '<svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>' +
      '</button>' +
    '</div>';
}

/* ---------- footer (same on every page, so it lives here) ---------- */
const ICON = 'xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"';
const STROKE = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/Avi-Gobrin',
    svg: `<svg ${ICON} ${STROKE}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>` },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/avigobrin/',
    svg: `<svg ${ICON} ${STROKE}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` },
  { label: 'X', href: 'https://x.com/AvichaiGobrin',
    svg: `<svg ${ICON} fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  { label: 'Email', href: 'mailto:avichaigobrin@gmail.com',
    svg: `<svg ${ICON} ${STROKE}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>` }
];

function renderFooter() {
  const icons = SOCIALS.map(s => {
    const ext = s.href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener noreferrer"';
    return `<a href="${s.href}"${ext} aria-label="${s.label}">${s.svg}</a>`;
  }).join('');
  return `<div class="footer-icons">${icons}</div><p>&copy; 2026 Avi Gobrin</p>`;
}

/* ---------- one page per work item ---------- */
function metaDescription(w) {
  const raw = (w.card || w.desc || '').replace(/\s+/g, ' ').trim();
  return esc(raw.length > 155 ? raw.slice(0, 152).trimEnd() + '...' : raw);
}

function detailPage(w) {
  const backHref = w.type === 'Paper' ? 'research.html' : 'projects.html';
  const backLabel = w.type === 'Paper' ? 'Research' : 'Projects';
  const title = esc(w.title);
  const desc = metaDescription(w);
  const url = BASE + pageHref(w);

  const points = w.findings ? `
      <div class="card-points">
        <p class="card-points-label">${esc(w.findingsLabel || 'Key Details')}</p>
        <ul>${w.findings.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>` : '';

  const actions = (w.links || []).length ? `
      <div class="detail-actions">${w.links.map(l => linkHtml(l, 'btn-ghost')).join('')}</div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} &middot; Avi Gobrin</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Avi Gobrin">
  <meta property="og:title" content="${title} &middot; Avi Gobrin">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${BASE}assets/og-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} &middot; Avi Gobrin">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${BASE}assets/og-card.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <script>(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();</script>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <nav><div class="wrap"><!-- prerender:start -->${renderNav(backHref)}<!-- prerender:end --></div></nav>
  <script src="nav.js"></script>

  <section class="page"><div class="wrap">
    <a class="back-link" href="${backHref}">&larr; ${backLabel}</a>
    <p class="page-label">${esc(w.kicker)}</p>
    <h1 class="page-title detail-title">${title}</h1>
    <p class="detail-meta">${esc(w.meta)}</p>
    <div class="tags">${tagsHtml(w.tags)}</div>
    <p class="detail-desc">${esc(w.desc || '')}</p>${points}${actions}
  </div></section>

  <footer><div class="wrap" id="js-footer"><!-- prerender:start -->${renderFooter()}<!-- prerender:end --></div></footer>

  <script src="theme.js"></script>
</body>
</html>
`;
}

/* ---------- marker-based injection (idempotent) ---------- */
const S = '<!-- prerender:start -->';
const E = '<!-- prerender:end -->';

function inject(html, openTag, content, file, what) {
  const block = `${openTag}${S}${content}${E}`;
  const markedRe = new RegExp(escapeRe(openTag) + escapeRe(S) + '[\\s\\S]*?' + escapeRe(E));
  if (markedRe.test(html)) return html.replace(markedRe, block);
  if (html.includes(openTag + closer(openTag))) {
    return html.replace(openTag + closer(openTag), block + closer(openTag));
  }
  console.warn(`  ! ${file}: could not find ${what} target, skipped`);
  return html;
}
function closer(openTag) {
  const m = openTag.match(/^<(\w+)/);
  return `</${m[1]}>`;
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* Every absolute URL in the head is derived from BASE, so moving the site
   is a one-line change rather than a hunt through five files. */
function rewriteUrls(html, file) {
  const url = BASE + (file === 'index.html' ? '' : file);
  const img = `${BASE}assets/og-card.png`;
  return html
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`);
}

const PAGES = [
  { file: 'index.html',      targets: [['<div class="feat-list" id="js-featured-home">', renderFeaturedHome]] },
  { file: 'projects.html',   targets: [['<div class="cards" id="js-projects">', renderProjects]] },
  { file: 'research.html',   targets: [['<div class="cards" id="js-research">', renderResearch]] },
  { file: 'experience.html', targets: [] },
  { file: 'coursework.html', targets: [] }
];

for (const { file, targets } of PAGES) {
  let html = readFileSync(file, 'utf8');
  html = inject(html, '<div class="wrap">', renderNav(file), file, 'nav');
  html = inject(html, '<div class="wrap" id="js-footer">', renderFooter(), file, 'footer');
  for (const [openTag, renderer] of targets) {
    html = inject(html, openTag, renderer(), file, openTag);
  }
  html = rewriteUrls(html, file);
  writeFileSync(file, html);
  console.log(`  ✓ ${file}`);
}

for (const w of WORK) {
  writeFileSync(pageHref(w), detailPage(w));
  console.log(`  ✓ ${pageHref(w)}`);
}

/* ---------- sitemap ---------- */
const SITE_PAGES = ['', 'experience.html', 'projects.html', 'research.html', 'coursework.html']
  .concat(WORK.map(pageHref));

const today = new Date().toISOString().slice(0, 10);
const urls = SITE_PAGES
  .map(p => `  <url>\n    <loc>${BASE}${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n');
writeFileSync('sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log('  ✓ sitemap.xml');

console.log('Prerender complete.');
