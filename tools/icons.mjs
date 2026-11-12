/* ============================================================
   Pixel icons: the room's objects, small, as inline SVG.

   Each icon paints rectangles into a grid of colour names; svg()
   merges each row into runs and writes one <rect> per run, with
   crisp edges. The colours are CSS variables (see "pixel icons" in
   style.css), so the icons follow the theme like everything else.
   ============================================================ */

function grid(w, h) {
  const cells = Array.from({ length: h }, () => Array(w).fill(null));
  const r = (x, y, rw, rh, k) => {
    for (let j = y; j < y + rh; j++) for (let i = x; i < x + rw; i++) if (cells[j] && i >= 0 && i < w) cells[j][i] = k;
  };
  return { w, h, cells, r, px: (x, y, k) => r(x, y, 1, 1, k) };
}

const ICONS = {
  /* Projects: the laptop, with code on the screen. */
  laptop() {
    const g = grid(20, 15);
    g.r(2, 0, 16, 12, 'line'); g.r(3, 1, 14, 10, 'bezel'); g.r(4, 2, 12, 8, 'screen');
    g.r(5, 3, 3, 1, 'kw'); g.r(9, 3, 4, 1, 'fn');
    g.r(6, 5, 5, 1, 'str'); g.r(12, 5, 2, 1, 'fn');
    g.r(6, 7, 2, 1, 'kw'); g.r(9, 7, 5, 1, 'plain');
    g.r(1, 12, 18, 1, 'metal-light'); g.r(0, 13, 20, 1, 'metal'); g.r(0, 14, 20, 1, 'metal-dark'); g.r(8, 13, 4, 1, 'metal-dark');
    return g;
  },
  /* Research: the stack of books. */
  books() {
    const g = grid(20, 15);
    const book = (x, y, w, h, k) => { g.r(x, y, w, h, 'line'); g.r(x + 1, y + 1, w - 2, h - 2, k); g.r(x + w - 3, y + 1, 2, h - 2, 'pages'); g.r(x + 2, y + 1, 1, h - 2, 'pages'); };
    book(1, 10, 18, 5, 'book-a'); book(3, 5, 15, 5, 'book-b'); book(2, 0, 16, 5, 'book-c');
    return g;
  },
  /* Experience: the chalkboard. */
  chalk() {
    const g = grid(20, 15);
    g.r(0, 0, 20, 13, 'wood'); g.r(1, 1, 18, 11, 'board');
    g.r(3, 3, 5, 1, 'chalk'); g.r(9, 3, 3, 1, 'chalk');
    g.r(3, 6, 3, 1, 'chalk'); g.r(7, 6, 6, 1, 'chalk');
    g.r(3, 9, 7, 1, 'chalk'); g.px(15, 4, 'chalk'); g.r(14, 5, 3, 1, 'chalk'); g.px(15, 6, 'chalk');
    g.r(2, 13, 16, 1, 'wood-dark'); g.r(5, 12, 2, 1, 'chalk');
    return g;
  },
  /* StarCraft II: the Grandmaster emblem, as in the room. */
  trophy() {
    const g = grid(17, 19), keys = { L: 'line', O: 'gm-top', G: 'gold', D: 'gm-edge', K: 'gm-dark', S: 'gm-wing', W: 'gm-hi' };
    [
      '........L........',
      '......LLOLL......',
      '....LLOOOOOLL....',
      '..LLOOODGDOOOLL..',
      'LLOOOOODGDOOOOOLL',
      'LOOOOODWGGDOOOOOL',
      'LOOOOODWGGDOOOOOL',
      'LDWWWWWWGGGGGGGDL',
      'LODWWWWWGGGGGGDOL',
      'LSSDWWWWGGGGGDSSL',
      'LKKKDDWWGGGDDKKKL',
      'LSSSDWWWGGGGDSSSL',
      'LKKKDWWWGGGGDKKKL',
      'LSSSDWWDDDGGDSSSL',
      'LLKKKDDKKKDDKKKLL',
      '..LLKKKKKKKKKLL..',
      '....LLKKKKKLL....',
      '......LLKLL......',
      '........L........'
    ].forEach((row, y) => [...row].forEach((ch, x) => { if (keys[ch]) g.px(x, y, keys[ch]); }));
    return g;
  },
  /* Magic: a fanned hand, one card per colour, each rotated and sampled. */
  cards() {
    const g = grid(26, 18);
    const ox = 13, oy = 26, CW = 9, CH = 13, DROP = 8;
    ['mana-w', 'mana-u', 'mana-b', 'mana-r', 'mana-g'].forEach((colour, n) => {
      const a = [-32, -16, 0, 16, 32][n] * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      for (let y = 0; y < 18; y++) for (let x = 0; x < 26; x++) {
        const dx = x + 0.5 - ox, dy = y + 0.5 - oy;
        const u = dx * ca + dy * sa + CW / 2, v = -dx * sa + dy * ca + CH + DROP;
        if (u < 0 || u >= CW || v < 0 || v >= CH) continue;
        let k = colour;
        if (u < 1 || u >= CW - 1 || v < 1 || v >= CH - 1) k = 'line';
        else if (u >= 2 && u < CW - 2 && v >= 2 && v < 6) k = 'art';
        else if (u >= 2 && u < CW - 2 && v >= 7 && v < CH - 2) k = 'pages';
        g.px(x, y, k);
      }
    });
    return g;
  },
  /* Karate: a black belt, tied. */
  belt() {
    const g = grid(18, 13);
    g.r(2, 0, 14, 2, 'belt'); g.r(0, 1, 2, 3, 'belt'); g.r(16, 1, 2, 3, 'belt'); g.r(2, 4, 14, 2, 'belt');
    g.r(7, 3, 4, 4, 'belt'); g.r(8, 4, 2, 1, 'belt-shine');
    g.r(6, 7, 2, 4, 'belt'); g.r(5, 10, 2, 3, 'belt');
    g.r(10, 7, 2, 4, 'belt'); g.r(11, 10, 2, 3, 'belt');
    return g;
  },
  /* About and Toronto: the window, with the CN Tower. */
  window() {
    const g = grid(18, 15);
    g.r(0, 0, 18, 15, 'frame-dark'); g.r(1, 1, 16, 13, 'frame'); g.r(2, 2, 14, 11, 'sky');
    g.r(2, 10, 3, 3, 'city'); g.r(9, 9, 3, 4, 'city'); g.r(12, 11, 4, 2, 'city');
    g.r(6, 4, 1, 9, 'city'); g.r(5, 6, 3, 1, 'city'); g.px(6, 3, 'city');
    g.r(8, 2, 1, 11, 'frame'); g.r(2, 7, 14, 1, 'frame');
    g.px(4, 4, 'snow'); g.px(12, 3, 'snow'); g.px(14, 9, 'snow'); g.px(10, 5, 'snow');
    return g;
  }
};

/* One <rect> per horizontal run of a colour. */
export function svg(name, size = 4, label = '') {
  const g = ICONS[name]();
  const rects = [];
  g.cells.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const k = row[x];
      let e = x + 1;
      while (e < row.length && row[e] === k) e++;
      if (k) rects.push(`<rect x="${x}" y="${y}" width="${e - x}" height="1" class="p-${k}"/>`);
      x = e;
    }
  });
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="px" ${a11y} viewBox="0 0 ${g.w} ${g.h}" width="${g.w * size}" height="${g.h * size}" shape-rendering="crispEdges">${rects.join('')}</svg>`;
}

export const ICON_NAMES = Object.keys(ICONS);

/* ============================================================
   Logos for the contact links: plain vector marks in the text
   colour (currentColor), 16 by 16. Filled marks use even-odd fill,
   so their inner shapes are holes and show the page through.
   ============================================================ */
const LOGOS = {
  github: '<path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>',
  linkedin: '<path fill-rule="evenodd" d="M2.6 1h10.8c.9 0 1.6.7 1.6 1.6v10.8c0 .9-.7 1.6-1.6 1.6H2.6c-.9 0-1.6-.7-1.6-1.6V2.6C1 1.7 1.7 1 2.6 1zM4.5 3.2a1.2 1.2 0 1 0 0 2.4a1.2 1.2 0 1 0 0-2.4zM3.5 6.5h2v6.3h-2zM7 6.5h1.9v.9c.3-.5 1-1.1 2.1-1.1 1.9 0 2.5 1.2 2.5 3v3.5h-2V9.7c0-.8-.1-1.6-1.1-1.6s-1.4.8-1.4 1.6v3.1H7z"/>',
  x: '<path fill-rule="evenodd" d="M1 1.5h4.6l9.4 13h-4.6zM3 2.5l7.9 11h1.9L4.9 2.5z"/><path d="M13.4 1.5h1.5L9.3 7.8l-.8-1.1zM6.7 8.4l.8 1.1-4.8 5H1.2z"/>',
  email: '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" d="M1.75 3.25h12.5v9.5H1.75zM1.75 3.75 8 8.75l6.25-5"/>',
  resume: '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" d="M3.25 1.25h6.5l3 3v10.5h-9.5zM9.75 1.25v3h3"/><path d="M5.5 7.5h5v1.25h-5zM5.5 10h5v1.25h-5z"/>'
};

/* A logo link: the mark, a label for screen readers, and the same label on hover. */
export function logoLink(name, href, label) {
  if (!LOGOS[name]) throw new Error(`no logo called "${name}"`);
  return `<a class="logo" href="${href}" data-label="${label}"><svg aria-hidden="true" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">${LOGOS[name]}</svg><span class="sr-only">${label}</span></a>`;
}
