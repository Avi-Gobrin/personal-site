/* ============================================================
   What the build and the redirect tool both need to know: where
   the site lives, what is in content/work.js, and every page.
   ============================================================ */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/* Every script runs from the site root, wherever it was started. */
process.chdir(fileURLToPath(new URL('..', import.meta.url)));

/* Every absolute URL derives from BASE, so moving the site is a one-line change. */
export const BASE = 'https://avi-gobrin.github.io/personal-site/';

export const WORK = new Function(`${readFileSync('content/work.js', 'utf8')}\nreturn WORK;`)();
/* Each id becomes a folder name and an HTML id, so keep it plain. */
for (const w of WORK) {
  if (!/^[a-z0-9-]+$/.test(w.id)) throw new Error(`content/work.js: id "${w.id}" must be lowercase letters, digits, and hyphens`);
}

export const isReport = w => w.type === 'Report';
export const dirOf = w => `${isReport(w) ? 'research' : 'projects'}/${w.id}/`;

/* The hand-written pages, by folder ('' is the homepage). */
export const HAND_PAGES = ['', 'about/', 'experience/', 'projects/', 'research/'];

/* Blog posts: every Markdown file in content/blog/ except its README, newest first.
   Each starts with a header between --- lines: title, date (YYYY-MM-DD), and
   optionally description and draft. Drafts are left out. */
export const POSTS = readPosts();
export const postDir = p => `blog/${p.slug}/`;
export const ALL_PAGES = HAND_PAGES.concat(WORK.map(dirOf), POSTS.length ? ['blog/', ...POSTS.map(postDir)] : []);

function readPosts() {
  const dir = 'content/blog';
  if (!existsSync(dir)) return [];
  const posts = readdirSync(dir).filter(f => /\.md$/i.test(f) && f.toLowerCase() !== 'readme.md').map(f => {
    const src = readFileSync(`${dir}/${f}`, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    const m = src.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/);
    if (!m) throw new Error(`${dir}/${f}: start with a header between --- lines (see ${dir}/README.md)`);
    const meta = {};
    for (const line of m[1].split('\n')) {
      const kv = line.match(/^\s*([A-Za-z]+)\s*:\s*(.*?)\s*$/);
      if (kv) meta[kv[1].toLowerCase()] = kv[2].replace(/^(["'])(.*)\1$/, '$2');
    }
    const slug = f.replace(/\.md$/i, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`${dir}/${f}: name the file in lowercase letters, digits, and hyphens`);
    if (!meta.title) throw new Error(`${dir}/${f}: the header needs a title`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date || '') || isNaN(Date.parse(meta.date))) throw new Error(`${dir}/${f}: the header needs a date like 2026-12-01`);
    return { file: f, slug, title: meta.title, date: meta.date, description: meta.description || '', draft: /^(true|yes)$/i.test(meta.draft || ''), body: m[2] };
  }).filter(p => !p.draft);
  const seen = new Set();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`content/blog: two posts would both live at blog/${p.slug}/`);
    seen.add(p.slug);
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
