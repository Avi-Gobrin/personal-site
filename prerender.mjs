/* ============================================================
   Prerender: bakes nav + work.js content into the HTML files.

   Why: projects.html, research.html, featured.html, and the
   homepage Featured list are rendered by work.js at runtime.
   Without JavaScript (search engines, link previews, some
   recruiter tools) those pages are empty shells. This script
   injects the same markup statically. work.js still re-renders
   on load, so the runtime behaviour is unchanged and the two
   never drift: this script reads the WORK array straight out
   of work.js.

   Run after editing work.js:   node prerender.mjs
   Idempotent: safe to run any number of times.
   ============================================================ */
import { readFileSync, writeFileSync } from 'node:fs';

/* ---------- load WORK from work.js (single source of truth) ---------- */
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
function linkHtml(l, cls) {
  const target = l.external ? ' target="_blank" rel="noopener noreferrer"' : '';
  const klass = cls ? ` class="${cls}"` : '';
  return `<a href="${l.href}"${target}${klass}>${esc(l.label)} &rarr;</a>`;
}

function renderFeaturedHome() {
  return WORK.filter(w => w.featured).map(w => `
    <a href="featured.html#${w.id}" class="feat-item">
      <span class="feat-type">${esc(w.type)}</span>
      <span class="feat-title">${esc(w.title)}</span>
    </a>`).join('');
}

function renderWriting() {
  let html = '', currentYear = '';
  WORK.filter(w => w.type === 'Paper').forEach(w => {
    const year = w.date.slice(-4);
    if (year !== currentYear) { html += `<p class="yr">${esc(year)}</p>`; currentYear = year; }
    const star = w.featured ? '<span class="w-star" title="Featured">★</span>' : '';
    const link = w.detailLinks?.[0]?.href || '#';
    html += `<div class="w-item">
      <span class="w-date">${esc(w.date)}</span>
      <div>
        <div class="w-title">${star}<a href="${link}" target="_blank" rel="noopener noreferrer">${esc(w.title)}</a></div>
        <div class="w-desc">${esc(w.desc || '')}</div>
      </div>
    </div>`;
  });
  return html;
}

function renderProjects() {
  return WORK.filter(w => w.type === 'Project').map(w => {
    const href = (w.cardLinks && w.cardLinks[0]) ? w.cardLinks[0].href : '#';
    return `
    <div class="proj">
      <h3><a href="${href}">${esc(w.title)}</a></h3>
      <p class="proj-desc">${esc(w.card || '')}</p>
      <div class="tags">${tagsHtml(w.tags)}</div>
      <div class="proj-links">${(w.cardLinks || []).map(l => linkHtml(l)).join('')}</div>
    </div>`;
  }).join('');
}

function renderFeaturedDetail() {
  return WORK.map(w => {
    const links = (w.detailLinks || []).map(l => linkHtml(l, 'btn-ghost')).join('');
    const findings = w.findings ? `
      <div class="feat-findings">
        <p class="feat-findings-label">${esc(w.findingsLabel || '')}</p>
        <ul>${w.findings.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>` : '';
    return `
    <div class="feat-work" id="${w.id}">
      <div class="feat-work-top">
        <div>
          <p class="feat-work-kicker">${esc(w.kicker)}</p>
          <h2 class="feat-work-title">${esc(w.title)}</h2>
          <p class="feat-work-meta">${esc(w.meta)}</p>
        </div>
        ${links}
      </div>
      <div class="tags">${tagsHtml(w.tags)}</div>
      <p class="feat-work-desc">${esc(w.desc || '')}</p>
      ${findings}
    </div>`;
  }).join('');
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

const PAGES = [
  { file: 'index.html',      targets: [['<div class="feat-list" id="js-featured-home">', renderFeaturedHome]] },
  { file: 'projects.html',   targets: [['<div class="projects" id="js-projects">', renderProjects]] },
  { file: 'research.html',   targets: [['<div id="js-writing">', renderWriting]] },
  { file: 'featured.html',   targets: [['<div class="feat-works" id="js-featured">', renderFeaturedDetail]] },
  { file: 'experience.html', targets: [] },
  { file: 'coursework.html', targets: [] }
];

for (const { file, targets } of PAGES) {
  let html = readFileSync(file, 'utf8');
  const navContent = renderNav(file);
  html = inject(html, '<div class="wrap">', navContent, file, 'nav');
  for (const [openTag, renderer] of targets) {
    html = inject(html, openTag, renderer(), file, openTag);
  }
  writeFileSync(file, html);
  console.log(`  ✓ ${file}`);
}
console.log('Prerender complete.');
