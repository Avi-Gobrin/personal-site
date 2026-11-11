/* ============================================================
   What the build and the redirect tool both need to know: where
   the site lives, what is in content/work.js, and every page.
   ============================================================ */
import { readFileSync } from 'node:fs';
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
export const ALL_PAGES = HAND_PAGES.concat(WORK.map(dirOf));
