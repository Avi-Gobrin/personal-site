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
  /* Experience: the corkboard, with ML and SWE notes. */
  cork() {
    const g = grid(20, 15);
    g.r(0, 0, 20, 15, 'wood'); g.r(1, 1, 18, 13, 'cork');
    [[3, 3], [12, 2], [7, 10], [16, 11]].forEach(([x, y]) => g.px(x, y, 'cork-dark'));
    g.r(2, 2, 7, 6, 'note-a'); g.r(3, 4, 5, 1, 'scribble'); g.r(3, 6, 3, 1, 'scribble'); g.px(5, 2, 'pin');
    g.r(11, 3, 7, 5, 'note-b'); g.r(12, 5, 5, 1, 'scribble'); g.px(14, 3, 'pin');
    g.r(4, 9, 8, 4, 'note-c'); g.r(5, 11, 6, 1, 'scribble'); g.px(8, 9, 'pin');
    return g;
  },
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
  /* About: the chalkboard. */
  chalk() {
    const g = grid(20, 15);
    g.r(0, 0, 20, 13, 'wood'); g.r(1, 1, 18, 11, 'board');
    g.r(3, 3, 5, 1, 'chalk'); g.r(9, 3, 3, 1, 'chalk');
    g.r(3, 6, 3, 1, 'chalk'); g.r(7, 6, 6, 1, 'chalk');
    g.r(3, 9, 7, 1, 'chalk'); g.px(15, 4, 'chalk'); g.r(14, 5, 3, 1, 'chalk'); g.px(15, 6, 'chalk');
    g.r(2, 13, 16, 1, 'wood-dark'); g.r(5, 12, 2, 1, 'chalk');
    return g;
  },
  /* StarCraft II: the GM trophy. */
  trophy() {
    const g = grid(13, 16);
    g.r(2, 0, 9, 3, 'gold'); g.r(3, 3, 7, 1, 'gold'); g.r(4, 4, 5, 1, 'gold'); g.r(5, 5, 3, 1, 'gold');
    g.r(8, 1, 2, 4, 'gold-dark'); g.r(3, 1, 1, 2, 'shine');
    g.px(1, 1, 'gold-dark'); g.px(1, 2, 'gold-dark'); g.px(2, 3, 'gold-dark');
    g.px(11, 1, 'gold-dark'); g.px(11, 2, 'gold-dark'); g.px(10, 3, 'gold-dark');
    g.r(6, 6, 1, 2, 'gold-dark'); g.r(4, 8, 5, 1, 'gold');
    g.r(1, 9, 11, 7, 'line');
    letters(g, 'GM', 2, 10, 'gold');
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
    g.r(10, 7, 2, 4, 'belt'); g.r(11, 10, 2, 3, 'belt'); g.r(11, 11, 2, 1, 'gold');
    return g;
  },
  /* Toronto: the window, with the CN Tower. */
  window() {
    const g = grid(18, 15);
    g.r(0, 0, 18, 15, 'frame-dark'); g.r(1, 1, 16, 13, 'frame'); g.r(2, 2, 14, 11, 'sky');
    g.r(2, 10, 3, 3, 'city'); g.r(9, 9, 3, 4, 'city'); g.r(12, 11, 4, 2, 'city');
    g.r(6, 4, 1, 9, 'city'); g.r(5, 6, 3, 1, 'city'); g.px(6, 3, 'city');
    g.r(8, 2, 1, 11, 'frame'); g.r(2, 7, 14, 1, 'frame');
    g.px(4, 4, 'snow'); g.px(12, 3, 'snow'); g.px(14, 9, 'snow'); g.px(10, 5, 'snow');
    return g;
  },
  /* Email: the letter. */
  letter() {
    const g = grid(16, 11);
    g.r(0, 0, 16, 11, 'paper-dark'); g.r(1, 1, 14, 9, 'paper');
    for (let i = 0; i < 6; i++) { g.px(1 + i, 1 + Math.floor(i * 0.7), 'paper-dark'); g.px(14 - i, 1 + Math.floor(i * 0.7), 'paper-dark'); }
    g.r(6, 5, 4, 3, 'pin'); g.px(6, 5, 'paper'); g.px(9, 5, 'paper');
    return g;
  }
};

/* A 3 by 5 pixel font, just the letters the icons need. */
const FONT = {
  G: ['.##', '#..', '#.#', '#.#', '.##'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#']
};
function letters(g, text, x, y, k) {
  let cx = x;
  for (const ch of text) {
    const glyph = FONT[ch] || [];
    glyph.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') g.px(cx + i, y + j, k); }));
    cx += (glyph[0] || '..').length + 1;
  }
}

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
