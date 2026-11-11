/* ============================================================
   My room, in pixel art.

   A desk under a window: code types itself out on the laptop, the
   mug steams, and it snows on Toronto outside. Things in the room
   are doors to the rest of the site: the laptop is Projects, the
   corkboard is Experience, the books are Research, the chalkboard
   is About, the letter and the mug are email, the trophy, cards,
   and window open their part of About, and the lamp is the light
   switch (it flips the theme).

   Everything is painted at a low resolution with plain rectangles,
   then scaled up by a whole number of device pixels, so every pixel
   is square and crisp. The lamplight is ordered (Bayer) dithering:
   four shades per surface, no gradients. No image files.
   ============================================================ */
Hero(function (api) {
  var hero = api.hero;

  /* Morning by day, dusk by night: one look for the whole room, and the page text on top of it. */
  var SHARED = {
    chalk: '#f4f1e8', chalkDim: '#b9bfc4',
    manaW: '#f3ead0', manaU: '#4f8fd6', manaB: '#3d3448', manaR: '#d8574a', manaG: '#4f9a5a',
    kw: '#ef93a0', fn: '#9cc9e6', str: '#f3d27e', com: '#5d5a7a', plain: '#cfc5dc'
  };
  var PALETTES = {
    dusk: {
      dark: true, light: 'lamp',
      wall: ['#3a2d4b', '#463657', '#614661', '#86606a'],
      desk: ['#4a2f3c', '#5c3944', '#7c4d4b', '#a66c55'],
      deskEdge: '#6e4650', deskLip: '#35222e', deskFace: '#2f1e2a', shadow: '#3a2534',
      line: '#1b1222', sky: ['#7c4f8a', '#d0707c', '#f4a37f'], star: '#ffe3d1', starDim: '#b98aa8',
      moon: '#ffd28a', moonDark: '#f4b06a', sun: true, city: '#2b1d3d', cityWin: '#ffcf7a', cityWin2: '#c98bb0', snow: '#ffe9e0',
      frame: '#5c4670', frameDark: '#332641', cork: '#9a6a48', corkDark: '#7a5238', corkFrame: '#4e3430', board: '#241c2e',
      note1: '#f3d27e', note2: '#ef93a0', note3: '#9cc9e6', paper: '#f6e9dc', paperDark: '#c4ab9c', scribble: '#7a5a5a', pin: '#e05468',
      lamp: '#f0b45a', lampDark: '#a9703a', bulb: '#fff2c2', metal: '#a59ab4', metalLight: '#cfc5dc', metalDark: '#6a5d7c', bezel: '#22182e',
      screen: '#1d1530', dotA: '#ef93a0', dotB: '#f3d27e', dotC: '#9ad6a8',
      mug: '#f6e9dc', mugDark: '#bba69a', coffee: '#5a3a2a', steam: '#b892b0',
      book1: '#e0716a', book2: '#6c88c4', book3: '#f0c46a', pages: '#f6e9dc', leaf: '#7fb87a',
      cardBorder: '#1b1222', cardFace: '#d7bf95', trophy: '#f0c46a', trophyDark: '#b4803a', seal: '#e05468',
      accent: '#ffcf7a',
      text: '#fff1e4', muted: '#e2c9d0', link: '#ffd08a', panel: '#2a1f38'
    },
    morning: {
      dark: false, light: 'window',
      wall: ['#ece2cf', '#f0e7d6', '#f4ecdf', '#f8f2e7'],
      desk: ['#c3946a', '#cd9f74', '#d7ab80', '#e1b98e'],
      deskEdge: '#e6c49d', deskLip: '#a97c55', deskFace: '#b8875e', shadow: '#b08660',
      line: '#3a3346', sky: ['#9cc5e6', '#b4d4ee', '#cfe4f4'], star: false, starDim: false,
      moon: '#fff1b8', moonDark: '#ffe08a', sun: true, city: '#8eaacb', cityWin: '#c7d8ea', cityWin2: '#a9c0dc', snow: '#ffffff',
      frame: '#fbf8f1', frameDark: '#cdbfa6', cork: '#c99a6a', corkDark: '#b0835a', corkFrame: '#8a6446', board: '#34404a',
      note1: '#f3d77e', note2: '#f0a0aa', note3: '#a3cfe9', paper: '#fffdf7', paperDark: '#cfc3ad', scribble: '#8a7a6a', pin: '#d8485a',
      lamp: '#d06a5a', lampDark: '#9a4a40', bulb: '#efe3c8', metal: '#b8bccb', metalLight: '#d9dce5', metalDark: '#7d8296', bezel: '#3a3d4c',
      screen: '#fdfaf3', dotA: '#e58f9a', dotB: '#e9c45a', dotC: '#6fbf86',
      mug: '#ffffff', mugDark: '#cfc6b6', coffee: '#6a4632', steam: '#ffffff',
      book1: '#c45a5a', book2: '#4f7fb0', book3: '#e2b44f', pages: '#fffdf7', leaf: '#6fae6a',
      cardBorder: '#2b2a3a', cardFace: '#d9c49a', trophy: '#e3b34a', trophyDark: '#b07f2a', seal: '#d8485a',
      accent: '#d8485a',
      text: '#1f2638', muted: '#5a5f70', link: '#2f5aa8', panel: '#fffdf7',
      kw: '#c4505d', fn: '#2f5aa8', str: '#b07f2a', com: '#d3ccbd', plain: '#6a6f80'
    }
  };
  Object.keys(PALETTES).forEach(function (n) {
    for (var k in SHARED) if (!(k in PALETTES[n])) PALETTES[n][k] = SHARED[k];
  });

  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  var low = document.createElement('canvas'), g = low.getContext('2d');
  var base = document.createElement('canvas'), bg = base.getContext('2d');
  var c = PALETTES.morning;
  var W = 0, S = 4, P = 4, vw = 0, vh = 0, L = null;
  var t = 0, snow = [], steam = [], steamClock = 0, code = [], codeLen = 0, codeT = 0;
  var spotsEl = null, spots = [];

  var seed = 1;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* Drawing helpers, all in low-resolution pixels. */
  var ctx = bg;
  function r(x, y, w, h, k) { ctx.fillStyle = c[k] || k; ctx.fillRect(x, y, w, h); }
  function px(x, y, k) { r(x, y, 1, 1, k); }
  function line(x0, y0, x1, y1, k, thick) {
    var dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy;
    for (;;) {
      r(x0, y0, thick || 1, thick || 1, k);
      if (x0 === x1 && y0 === y1) break;
      var e2 = 2 * e;
      if (e2 >= dy) { e += dy; x0 += sx; }
      if (e2 <= dx) { e += dx; y0 += sy; }
    }
  }
  /* A sprite is rows of characters; each character names a palette key. */
  function sprite(rows, x, y, keys) {
    for (var j = 0; j < rows.length; j++) for (var i = 0; i < rows[j].length; i++) {
      var k = keys[rows[j][i]];
      if (k) px(x + i, y + j, k);
    }
  }

  /* ---------- where everything goes ---------- */
  var SIZES = { chalk: [64, 50], cork: [54, 38], win: [64, 54], shelf: [30, 26] };

  function layout() {
    var deskH = clamp(Math.round(vh * 0.2), 30, 70);
    var deskY = vh - deskH, top = clamp(Math.round(deskH * 0.34), 7, 13);
    var cx = Math.round(vw / 2), by = deskY + 4;
    var text = api.avoid.map(function (a) { return { x: a.x / S, y: a.y / S, w: a.w / S, h: a.h / S }; });
    var ceiling = 0;
    text.forEach(function (a) { if (a.y < vh * 0.15) ceiling = Math.max(ceiling, a.y + a.h); });
    var body = text.filter(function (a) { return a.y >= vh * 0.15 && a.y < deskY; });
    /* Wall things stand in two columns, either side of the name. If
       the sides are too narrow (a phone), the chalkboard and window
       go in a row above the name instead, and the rest stay home. */
    var tl = vw, tr = 0, tt = deskY;
    body.forEach(function (a) { tl = Math.min(tl, a.x); tr = Math.max(tr, a.x + a.w); tt = Math.min(tt, a.y); });
    var edge = Math.max(6, Math.round(vw * 0.07)), lo = ceiling + 6, hi = deskY - 46;
    var wall = {};
    function column(names, x0, x1) {
      var fit = names.filter(function (n) { return SIZES[n][0] <= x1 - x0; }), total = 0;
      while (fit.length) {
        total = fit.reduce(function (s, n) { return s + SIZES[n][1]; }, 0) + 12 * (fit.length - 1);
        if (total <= hi - lo) break;
        fit.pop();
      }
      var y = Math.round(lo + (hi - lo - total) / 2);
      fit.forEach(function (n) {
        var w = SIZES[n][0], h = SIZES[n][1];
        wall[n] = { x: Math.round(x0 + (x1 - x0 - w) / 2), y: y, w: w, h: h };
        y += h + 12;
      });
    }
    if (body.length && tl - edge - 8 >= 64 && vw - edge - tr - 8 >= 64) {
      column(['chalk', 'cork'], edge, tl - 8);
      column(['win', 'shelf'], tr + 8, vw - edge);
    } else if (body.length) {
      var y = Math.round(tt - 10 - 54), gap = 10;
      if (y > ceiling + 4 && vw >= 64 * 2 + gap + 8) {
        var x = Math.round((vw - 64 * 2 - gap) / 2);
        wall.chalk = { x: x, y: y + 4, w: 64, h: 50 };
        wall.win = { x: x + 64 + gap, y: y, w: 64, h: 54 };
      }
    }
    var shelf = wall.shelf || null;
    L = {
      deskY: deskY, top: top, by: by, cx: cx, ceiling: ceiling,
      laptop: { x: cx - 24, y: by - 36, w: 48, h: 36 },
      trophy: shelf ? { x: shelf.x + 7, y: shelf.y, w: 15, h: 21 } : null,
      shelf: shelf, cork: wall.cork || null, chalk: wall.chalk || null,
      win: wall.win ? { x: wall.win.x, y: wall.win.y, w: 64, h: 50 } : null
    };
    desk(cx, by);
  }

  /* The desk, from the laptop outward: the gaps grow with the screen,
     so a wide desk is spread out and a narrow one stays tidy. */
  function desk(cx, by) {
    var half = Math.min(vw / 2 - 4, 168);
    var left = [['cards', 25, 15], ['lamp', 30, 46]];
    var right = [['mug', 11, 9], ['books', 26, 14], ['envelope', 20, 15]];
    function side(items) {
      var room = half - 28, used = items.reduce(function (s, it) { return s + it[1]; }, 0);
      return clamp(Math.floor((room - used) / items.length), 0, 30);
    }
    if (side(left) < 4) left.shift();   // no room for the cards on a small phone
    var gl = side(left), gr = side(right), x = cx - 28;
    left.forEach(function (it) { x -= gl + it[1]; L[it[0]] = { x: x, y: by - it[2], w: it[1], h: it[2] }; });
    x = cx + 28;
    right.forEach(function (it) { x += gr; L[it[0]] = { x: x, y: by - it[2], w: it[1], h: it[2] }; x += it[1]; });
    var lamp = L.lamp;
    lamp.bx = lamp.x + 8; lamp.hx = lamp.bx + 12; lamp.hy = by - 46;
  }

  /* ---------- the still parts, painted once per size or palette ---------- */
  function lightAt(x, y) {
    if (c.light === 'lamp') {
      var lx = L.lamp.hx + 3.5, ly = L.lamp.hy + 5, dx = x - lx, dy = y - ly;
      var R = clamp(vw * 0.16, 40, 64);
      if (y >= L.deskY) {   // the pool on the desk top: an ellipse, flattened by perspective
        var ex = dx / (R * 0.8), ey = (y - L.deskY - L.top * 0.45) / (L.top * 1.4);
        return clamp(1 - (ex * ex + ey * ey), 0, 1) * 1.2;
      }
      /* On the wall: a soft cone, bright below the shade, faint above it. */
      var d = Math.sqrt(dx * dx + dy * dy) / R, v = clamp(1 - d, 0, 1);
      return Math.min(v * v * clamp(0.3 + dy / 24, 0.3, 1.2), dy < 0 ? 0.4 : 1);
    }
    /* Daylight: the window throws one slanted patch down the wall and onto the desk. */
    if (!L.win || !L.shelf) return 0;
    var sill = L.win.y + L.win.h + 4;
    if (y < sill) return 0;
    var shift = (y - sill) * 0.75;
    var left = L.win.x + 3 - shift, right = L.win.x + L.win.w - 3 - shift;
    return x >= left && x < right ? 0.67 : 0;
  }

  function paintBase() {
    base.width = vw; base.height = vh;
    ctx = bg;
    var img = bg.createImageData(vw, vh), d = img.data;
    var ramps = [c.wall, c.desk].map(function (ramp) { return ramp.map(hex); });
    var face = hex(c.deskFace);
    for (var y = 0; y < vh; y++) for (var x = 0; x < vw; x++) {
      var col;
      if (y >= L.deskY + L.top) col = face;
      else {
        var lvl = clamp(Math.floor(lightAt(x, y) * 3 + BAYER[(y & 3) * 4 + (x & 3)] / 16), 0, 3);
        col = ramps[y < L.deskY ? 0 : 1][lvl];
      }
      var i = (y * vw + x) * 4;
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
    }
    bg.putImageData(img, 0, 0);

    /* The desk: an edge, the top (dithered above), and the front lip. */
    r(0, L.deskY, vw, 1, 'deskEdge');
    r(0, L.deskY + L.top, vw, 2, 'deskLip');

    seed = 11;
    if (L.win) paintWindow(L.win);
    if (L.chalk) paintChalk(L.chalk);
    if (L.shelf) paintShelf(L.shelf);
    if (L.cork) paintCork(L.cork);
    paintLamp(L.lamp);
    if (L.cards) paintCards(L.cards);
    paintLaptop(L.laptop);
    paintMug(L.mug);
    paintBooks(L.books);
    if (L.trophy) paintTrophy(L.trophy);
    paintEnvelope(L.envelope);
  }

  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }

  function shadow(x, w) { r(x + 1, L.by, w - 2, 1, 'shadow'); r(x + 3, L.by + 1, w - 6, 1, 'shadow'); }

  function paintWindow(b) {
    r(b.x - 1, b.y - 1, b.w + 2, b.h + 2, 'frameDark');
    r(b.x, b.y, b.w, b.h, 'frame');
    var x0 = b.x + 3, y0 = b.y + 3, pw = b.w - 6, ph = b.h - 6, i, j;
    /* Sky in three dithered bands, darkest at the top. */
    for (j = 0; j < ph; j++) for (i = 0; i < pw; i++) {
      var band = clamp(Math.floor((j / ph) * 2.6 + BAYER[(j & 3) * 4 + (i & 3)] / 16 * 0.9), 0, 2);
      px(x0 + i, y0 + j, c.sky[band]);
    }
    if (c.star) for (i = 0; i < 14; i++) px(x0 + Math.floor(rand() * pw), y0 + Math.floor(rand() * ph * 0.55), rand() < 0.4 ? 'star' : 'starDim');
    /* A low sun. */
    sprite(['.MMMM.', 'MMMMMM', 'MMMMmM', 'MmMMMM', 'MMMMMM', '.MMMM.'], x0 + pw - 14, y0 + ph - 20, { M: 'moon', m: 'moonDark' });
    /* Toronto: a few blocks and the CN Tower. */
    var gx = x0;
    while (gx < x0 + pw) {
      var bw = 4 + Math.floor(rand() * 6), bh = 5 + Math.floor(rand() * 12);
      bw = Math.min(bw, x0 + pw - gx);
      r(gx, y0 + ph - bh, bw, bh, 'city');
      for (j = y0 + ph - bh + 2; j < y0 + ph - 1; j += 2) for (i = gx + 1; i < gx + bw - 1; i += 2) if (rand() < 0.3) px(i, j, rand() < 0.7 ? 'cityWin' : 'cityWin2');
      gx += bw;
    }
    var tx = x0 + 14, ground = y0 + ph;
    r(tx, ground - 34, 2, 34, 'city');
    r(tx - 2, ground - 25, 6, 3, 'city'); r(tx - 1, ground - 26, 4, 1, 'city');
    r(tx - 1, ground - 31, 4, 1, 'city');
    r(tx, ground - 40, 1, 6, 'city');
    px(tx + 3, ground - 24, 'cityWin');
    /* Mullions, and the sill. */
    r(b.x + 31, y0, 2, ph, 'frame');
    r(x0, b.y + 22, pw, 2, 'frame');
    r(b.x - 3, b.y + b.h, b.w + 6, 3, 'frame');
    r(b.x - 3, b.y + b.h + 3, b.w + 6, 1, 'frameDark');
  }

  /* A 3 by 5 pixel font: just the letters the room writes. */
  var FONT = {
    A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], C: ['.##', '#..', '#..', '#..', '.##'],
    E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'], G: ['.##', '#..', '#.#', '#.#', '.##'],
    L: ['#..', '#..', '#..', '#..', '###'], M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
    O: ['.#.', '#.#', '#.#', '#.#', '.#.'], S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
    U: ['#.#', '#.#', '#.#', '#.#', '###'], W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'], 2: ['##.', '..#', '.#.', '#..', '###'],
    7: ['###', '..#', '.#.', '.#.', '.#.'], "'": ['#', '#', '.', '.', '.'], ' ': ['..', '..', '..', '..', '..']
  };
  function write(text, x, y, k, size) {
    var z = size || 1;
    for (var n = 0; n < text.length; n++) {
      var glyph = FONT[text[n]] || FONT[' '];
      for (var j = 0; j < 5; j++) for (var i = 0; i < glyph[j].length; i++) if (glyph[j][i] === '#') r(x + i * z, y + j * z, z, z, k);
      x += (glyph[0].length + 1) * z;
    }
    return x;
  }

  function paintChalk(b) {
    /* A wooden frame, a board with old chalk dust on it, and a tray. */
    var x = b.x, y = b.y;
    r(x, y, 64, 46, 'line');
    r(x + 1, y + 1, 62, 44, 'corkFrame');
    r(x + 1, y + 1, 62, 1, 'cork');
    r(x + 3, y + 3, 58, 40, 'board');
    ctx.globalAlpha = 0.18;
    for (var i = 0; i < 60; i++) px(x + 4 + Math.floor(rand() * 56), y + 4 + Math.floor(rand() * 38), 'chalkDim');
    r(x + 30, y + 40, 24, 1, 'chalkDim'); r(x + 34, y + 39, 16, 1, 'chalkDim');   // a half-wiped line
    ctx.globalAlpha = 1;
    var end = write('ABOUT', x + 7, y + 6, 'chalk', 2);
    r(x + 7, y + 17, end - x - 9, 1, 'chalkDim'); px(end - 3, y + 16, 'chalkDim');
    end = write('SC2 GM', x + 7, y + 21, 'chalk');
    sprite(['..#..', '.###.', '#####', '.###.', '.#.#.'], end + 1, y + 21, { '#': 'trophy' });
    end = write('MTG', x + 7, y + 28, 'chalk');
    sprite(['##.##', '#####', '.###.', '..#..'], end + 1, y + 28, { '#': 'manaR' });
    write("U OF T '27", x + 7, y + 35, 'chalkDim');
    /* A chalk smiley in the corner. */
    sprite(['..#####..', '.#.....#.', '#..#.#..#', '#.......#', '#.#...#.#', '#..###..#', '.#.....#.', '..#####..'], x + 49, y + 24, { '#': 'chalk' });
    /* The tray: two sticks of chalk and an eraser. */
    r(x - 2, y + 45, 68, 3, 'corkFrame'); r(x - 2, y + 45, 68, 1, 'cork'); r(x - 2, y + 48, 68, 1, 'line');
    r(x + 8, y + 44, 6, 1, 'chalk'); r(x + 16, y + 44, 4, 1, 'note2');
    r(x + 44, y + 42, 10, 3, 'note3'); r(x + 44, y + 44, 10, 1, 'line');
  }

  function paintShelf(b) {
    var y = b.y + 21;
    r(b.x, y, b.w, 2, 'corkFrame'); r(b.x, y, b.w, 1, 'cork'); r(b.x, y + 2, b.w, 1, 'frameDark');
    r(b.x + 3, y + 3, 2, 3, 'corkFrame'); r(b.x + b.w - 5, y + 3, 2, 3, 'corkFrame');
  }

  function paintCork(b) {
    r(b.x, b.y, b.w, b.h, 'corkFrame');
    r(b.x + 2, b.y + 2, b.w - 4, b.h - 4, 'cork');
    for (var i = 0; i < 46; i++) px(b.x + 2 + Math.floor(rand() * (b.w - 4)), b.y + 2 + Math.floor(rand() * (b.h - 4)), 'corkDark');
    function note(x, y, k, w, h) {
      r(x + 1, y + 1, w, h, 'corkDark');
      r(x, y, w, h, k);
      r(x + 2, y + 4, w - 4, 1, 'scribble');
      r(x + 2, y + 7, w - 7, 1, 'scribble');
      r(x + Math.floor(w / 2), y, 1, 2, 'pin');
    }
    function label(x, y, k, w, text) {
      r(x + 1, y + 1, w, 10, 'corkDark');
      r(x, y, w, 10, k);
      write(text, x + 2, y + 3, 'scribble');
      r(x + Math.floor(w / 2), y, 1, 2, 'pin');
    }
    label(b.x + 3, b.y + 4, 'note1', 13, 'ML');
    label(b.x + 17, b.y + 6, 'note2', 17, 'SWE');
    note(b.x + 38, b.y + 4, 'note3', 11, 12);
    /* A photo: a tiny sky over a tiny hill. */
    r(b.x + 10, b.y + 21, 15, 12, 'corkDark');
    r(b.x + 9, b.y + 20, 15, 12, 'paper');
    r(b.x + 10, b.y + 21, 13, 8, c.sky[2]);
    r(b.x + 10, b.y + 26, 13, 3, 'leaf'); r(b.x + 14, b.y + 25, 6, 1, 'leaf');
    r(b.x + 16, b.y + 20, 1, 2, 'pin');
    note(b.x + 30, b.y + 21, 'note1', 15, 11);
  }

  /* The Grandmaster trophy: a gold cup on a dark plaque. */
  var TROPHY = [
    '..LLLLLLLLLLL..',
    'LLLHTTTTTTTDLLL',
    'L.LHTTTTTTTDL.L',
    'L.LHTTTTTTTDL.L',
    '.LLHTTTTTTTDLL.',
    '...LTTTTTTDL...',
    '....LTTTTDL....',
    '.....LTTDL.....',
    '......LTL......',
    '......LDL......',
    '.....LTTDL.....',
    '....LTTTTDL....',
    '..LLLLLLLLLLL..',
    '..LLLLLLLLLLL..', '..LLLLLLLLLLL..', '..LLLLLLLLLLL..', '..LLLLLLLLLLL..',
    '..LLLLLLLLLLL..', '..LLLLLLLLLLL..', '..LLLLLLLLLLL..',
    '.LLLLLLLLLLLLL.'
  ];
  function paintTrophy(b) {
    sprite(TROPHY, b.x, b.y, { L: 'line', T: 'trophy', D: 'trophyDark', H: 'pages' });
    write('GM', b.x + 3, b.y + 14, 'trophy');
  }

  function paintLamp(b) {
    var bx = b.bx, by = L.by, hx = b.hx, hy = b.hy;
    shadow(bx - 7, 15);
    r(bx - 6, by - 3, 13, 2, 'lamp'); r(bx - 7, by - 1, 15, 1, 'lampDark');
    line(bx, by - 3, bx - 6, by - 30, 'lampDark', 2);
    line(bx - 5, by - 31, hx + 2, hy + 2, 'lampDark', 2);
    r(bx - 8, by - 33, 4, 4, 'lamp');
    r(hx + 2, hy, 4, 1, 'lamp');
    r(hx + 1, hy + 1, 6, 1, 'lamp');
    r(hx, hy + 2, 8, 1, 'lamp');
    r(hx - 1, hy + 3, 10, 1, 'lamp');
    r(hx - 1, hy + 4, 10, 1, 'lampDark');
    r(hx + 2, hy + 5, 4, 1, 'bulb');
  }

  function paintCards(b) {
    /* A fanned hand of five, one per colour of mana. Each card is
       rotated about a point below the hand, then sampled pixel by
       pixel, so the fan stays crisp. */
    shadow(b.x + 2, 22);
    var colours = ['manaW', 'manaU', 'manaB', 'manaR', 'manaG'], angles = [-32, -16, 0, 16, 32];
    var ox = b.x + 12.5, oy = b.y + 21, CW = 9, CH = 13, DROP = 8;
    for (var n = 0; n < 5; n++) {
      var a = angles[n] * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      for (var y = b.y - 2; y < oy; y++) for (var x = b.x - 4; x < b.x + 30; x++) {
        var dx = x + 0.5 - ox, dy = y + 0.5 - oy;
        var u = dx * ca + dy * sa + CW / 2, v = -dx * sa + dy * ca + CH + DROP;
        if (u < 0 || u >= CW || v < 0 || v >= CH) continue;
        var k = colours[n];
        if (u < 1 || u >= CW - 1 || v < 1 || v >= CH - 1) k = 'cardBorder';
        else if (u >= 2 && u < CW - 2 && v >= 2 && v < 6) k = 'cardFace';
        else if (u >= 2 && u < CW - 2 && v >= 7 && v < CH - 2) k = 'paper';
        px(x, y, k);
      }
    }
  }

  function paintLaptop(b) {
    shadow(b.x - 4, 56);
    r(b.x, b.y, 48, 33, 'line');
    r(b.x + 1, b.y + 1, 46, 31, 'bezel');
    r(b.x - 2, L.by - 3, 52, 1, 'metalLight');
    r(b.x - 4, L.by - 2, 56, 1, 'metal');
    r(b.x - 4, L.by - 1, 56, 1, 'metalDark');
    r(b.x + 19, L.by - 2, 10, 1, 'metalDark');
  }

  function paintMug(b) {
    shadow(b.x, 11);
    r(b.x, b.y, 8, 9, 'line');
    r(b.x + 1, b.y + 1, 6, 7, 'mug');
    r(b.x + 1, b.y + 1, 6, 1, 'coffee');
    r(b.x + 5, b.y + 2, 2, 6, 'mugDark');
    r(b.x + 8, b.y + 2, 2, 1, 'line'); r(b.x + 10, b.y + 3, 1, 3, 'line'); r(b.x + 8, b.y + 6, 2, 1, 'line');
  }

  function paintBooks(b) {
    shadow(b.x, 27);
    function book(x, y, w, h, k) {
      r(x, y, w, h, 'line');
      r(x + 1, y + 1, w - 2, h - 2, k);
      r(x + w - 3, y + 1, 2, h - 2, 'pages');
      r(x + 2, y + 1, 1, h - 2, 'pages');
    }
    book(b.x, L.by - 5, 26, 5, 'book1');
    book(b.x + 3, L.by - 9, 21, 4, 'book2');
    book(b.x + 1, L.by - 14, 24, 5, 'book3');
  }

  function paintEnvelope(b) {
    /* A sealed letter, standing in a little wooden rack: the flap is
       a shaded V, closed with a heart. */
    shadow(b.x, 20);
    var x = b.x + 1, y = b.y;
    r(x, y, 18, 12, 'line');
    r(x + 1, y + 1, 16, 10, 'paper');
    for (var j = 0; j < 6; j++) {
      r(x + 1 + j, y + 1 + j, 16 - 2 * j, 1, 'paperDark');
      px(x + 1 + j, y + 1 + j, 'line'); px(x + 16 - j, y + 1 + j, 'line');
    }
    sprite(['##.##', '#####', '.###.', '..#..'], x + 7, y + 5, { '#': 'seal' });
    r(b.x, L.by - 4, 20, 4, 'corkFrame'); r(b.x, L.by - 4, 20, 1, 'cork'); r(b.x + 1, L.by - 2, 18, 1, 'corkDark');
  }

  /* ---------- the moving parts ---------- */
  /* A few lines of made-up code: an indent, then words of a few kinds. */
  function makeCode() {
    code = []; codeLen = 0;
    var kinds = ['kw', 'fn', 'plain', 'str', 'plain', 'fn'], indent = 0;
    for (var i = 0; i < 7; i++) {
      var toks = [], x = indent * 3, n = 1 + Math.floor(Math.random() * 4);
      if (i === 0 || Math.random() < 0.15) toks.push({ x: x, w: 3 + Math.floor(Math.random() * 4), k: i === 0 ? 'kw' : 'com' });
      else for (var j = 0; j < n && x < 30; j++) {
        var w = Math.min(2 + Math.floor(Math.random() * 6), 33 - x);
        toks.push({ x: x, w: w, k: j === 0 && Math.random() < 0.5 ? 'kw' : kinds[Math.floor(Math.random() * kinds.length)] });
        x += w + 1;
      }
      var end = toks.length ? toks[toks.length - 1].x + toks[toks.length - 1].w : x;
      code.push({ toks: toks, start: codeLen, end: codeLen + end });
      codeLen += end;
      indent = i === 0 ? 1 : clamp(indent + (Math.random() < 0.3 ? 1 : Math.random() < 0.3 ? -1 : 0), 0, 3);
    }
  }

  function populate() {
    snow = [];
    steam = [];
    makeCode();
    if (!L.win) return;
    for (var i = 0; i < 26; i++) snow.push({ x: Math.random() * 58, y: Math.random() * 44, v: 4 + Math.random() * 6, p: Math.random() * 6 });
  }

  function step(dt) {
    t += dt;
    for (var i = 0; i < snow.length; i++) {
      var s = snow[i];
      s.y += s.v * dt;
      if (s.y > 44) { s.y -= 44; s.x = Math.random() * 58; }
    }
    steamClock += dt;
    if (steamClock > 0.35) {
      steamClock = 0;
      steam.push({ x: L.mug.x + 2 + Math.floor(Math.random() * 4), y: L.mug.y - 1, age: 0, life: 2.2 + Math.random(), p: Math.random() * 6 });
    }
    for (i = steam.length - 1; i >= 0; i--) {
      steam[i].age += dt;
      steam[i].y -= 5 * dt;
      if (steam[i].age > steam[i].life) steam.splice(i, 1);
    }
    codeT += dt;
    if (codeT > codeLen / 16 + 3) { codeT = 0; makeCode(); }
  }

  function paintFrame() {
    ctx = g;
    g.globalAlpha = 1;
    g.drawImage(base, 0, 0);
    /* Snow, behind the mullions. */
    if (L.win) {
      var x0 = L.win.x + 3, y0 = L.win.y + 3;
      for (var i = 0; i < snow.length; i++) {
        var s = snow[i], x = Math.floor(s.x + Math.sin(t * 0.8 + s.p) * 1.5), y = Math.floor(s.y);
        if (x < 0 || x > 57 || x === 28 || x === 29 || y === 19 || y === 20) continue;
        px(x0 + x, y0 + y, 'snow');
      }
    }
    /* Steam: a few pixels rising and fading. */
    for (i = 0; i < steam.length; i++) {
      var st = steam[i], f = st.age / st.life;
      g.globalAlpha = (1 - f) * 0.8;
      px(Math.round(st.x + Math.sin(st.age * 2.4 + st.p) * 1.2), Math.round(st.y), 'steam');
    }
    g.globalAlpha = 1;
    /* Now and then the trophy glints. */
    if (L.trophy && t % 3.2 < 0.5) {
      var gx = L.trophy.x + 4, gy = L.trophy.y + 2;
      px(gx, gy - 1, 'pages'); px(gx - 1, gy, 'pages'); px(gx + 1, gy, 'pages'); px(gx, gy + 1, 'pages');
    }
    paintScreen(L.laptop);
    /* Whatever the pointer is on gets selection corners and an arrow. */
    var on = hovered();
    /* Hovering the lamp in daylight hints that it switches on. */
    if (on && on.key === 'lamp' && c.light !== 'lamp') {
      r(L.lamp.hx + 2, L.lamp.hy + 5, 4, 1, '#fff2c2');
      g.globalAlpha = 0.5; r(L.lamp.hx + 1, L.lamp.hy + 6, 6, 1, '#fff2c2'); r(L.lamp.hx, L.lamp.hy + 7, 8, 1, '#fff2c2'); g.globalAlpha = 1;
    }
    if (on) {
      hinting = false;
      corners(on.box);
      arrow(on.box);
    } else if (hinting && spots.length) {
      /* Until the visitor finds one, an arrow wanders from thing to thing. */
      var order = HINT_ORDER.filter(function (k) { return spots.some(function (s) { return s.key === k; }); });
      var k = order[Math.floor(t / 2.4) % order.length];
      for (var n = 0; n < spots.length; n++) if (spots[n].key === k) arrow(spots[n].box);
    }
  }

  function arrow(box) {
    var ax = Math.round(box.x + box.w / 2) - 2, ay = box.y - 7 + (Math.sin(t * 5) > 0 ? 0 : 1);
    sprite(['AAAAA', '.AAA.', '..A..'], ax, ay, { A: 'accent' });
  }

  /* Selection corners, like picking a unit in a strategy game. */
  function corners(box) {
    var x0 = box.x - 3, y0 = box.y - 3, x1 = box.x + box.w + 2, y1 = box.y + box.h + 2;
    [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]].forEach(function (q) {
      r(Math.min(q[0], q[0] + q[2] * 3), q[1], 4, 1, 'accent');
      r(q[0], Math.min(q[1], q[1] + q[3] * 3), 1, 4, 'accent');
    });
  }

  function paintScreen(b) {
    var x = b.x + 3, y = b.y + 3, w = 42, h = 27;
    r(x, y, w, h, 'screen');
    px(x + 2, y + 2, 'dotA'); px(x + 4, y + 2, 'dotB'); px(x + 6, y + 2, 'dotC');
    var typed = Math.floor(codeT * 16), left = x + 6, cy = y + 6, cx = left;
    for (var i = 0; i < code.length; i++) {
      var ln = code[i], ly = y + 6 + i * 3;
      if (typed < ln.start && i > 0) break;
      px(x + 2, ly, 'com');
      for (var j = 0; j < ln.toks.length; j++) {
        var tk = ln.toks[j], shown = clamp(typed - ln.start - tk.x, 0, tk.w);
        if (shown > 0) r(left + tk.x, ly, shown, 1, tk.k);
      }
      cy = ly; cx = left + clamp(typed - ln.start, 0, ln.end - ln.start);
    }
    if (typed < codeLen) r(cx + 1, cy - 1, 1, 3, 'plain');
  }

  /* ---------- doors: real links over the drawing ---------- */
  var DOORS = [
    { key: 'laptop', href: 'projects/', title: 'Projects', hint: 'a GPT in pure NumPy, and more' },
    { key: 'cork', href: 'experience/', title: 'Experience', hint: 'ML at Nextdoor, SWE at Shopify' },
    { key: 'books', href: 'research/', title: 'Research', hint: 'prompts as weight updates, and papers' },
    { key: 'chalk', href: 'about/', title: 'About me', hint: 'school, StarCraft, and Magic' },
    { key: 'envelope', href: 'mailto:avichaigobrin@gmail.com', title: 'Email me', hint: 'avichaigobrin@gmail.com', act: 'click to write' },
    { key: 'mug', href: 'mailto:avichaigobrin@gmail.com', title: 'Coffee chat?', hint: 'happy to talk', act: 'click to write' },
    { key: 'lamp', lamp: true, title: 'The lamp', hint: 'lights on, lights off', act: 'click to switch' },
    { key: 'win', href: 'about/#school', title: 'Toronto', hint: 'U of T, graduating 2027' },
    { key: 'trophy', href: 'about/#starcraft', title: 'StarCraft II', hint: 'Grandmaster, top 100 NA' },
    { key: 'cards', href: 'about/#magic', title: 'Magic: The Gathering', hint: 'competitive' }
  ];
  var HINT_ORDER = ['laptop', 'cork', 'chalk', 'books', 'trophy', 'envelope', 'lamp', 'win', 'cards', 'mug'];
  var hinting = true;
  var TIP_H = 92, TIP_HALF = 130;   // a label's height and half its widest, in CSS pixels

  function placeDoors() {
    if (!spotsEl) {
      spotsEl = document.createElement('div');
      spotsEl.className = 'spots';
      hero.insertBefore(spotsEl, hero.querySelector('canvas').nextSibling);
    }
    spotsEl.textContent = '';
    spots = [];
    DOORS.forEach(function (d) {
      var box = L[d.key];
      if (!box) return;
      var el = document.createElement(d.lamp ? 'button' : 'a');
      el.className = 'spot';
      if (d.href) el.href = d.href;
      if (d.lamp) {
        el.type = 'button';
        el.addEventListener('click', function () { var tg = document.querySelector('.theme-toggle'); if (tg) tg.click(); });
      }
      el.setAttribute('aria-hidden', 'true');
      el.tabIndex = -1;
      var pad = 2, left = (box.x - pad) * S, top = (box.y - pad) * S, width = (box.w + 2 * pad) * S;
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.width = width + 'px';
      el.style.height = ((box.h + 2 * pad) * S) + 'px';
      var tip = document.createElement('span');
      tip.className = 'tip';
      var strong = document.createElement('b');
      strong.textContent = d.title;
      tip.appendChild(strong);
      tip.appendChild(document.createTextNode(d.hint));
      var act = document.createElement('i');
      act.textContent = d.act || 'click to open';
      tip.appendChild(act);
      /* Labels open upward, unless that would cover the nav; and they never leave the screen. */
      if (top - TIP_H < L.ceiling * S) tip.className += ' below';
      var mid = left + width / 2;
      if (mid - TIP_HALF < 8) tip.className += ' start';
      else if (mid + TIP_HALF > W - 8) tip.className += ' end';
      el.appendChild(tip);
      spotsEl.appendChild(el);
      spots.push({ box: box, el: el, key: d.key });
    });
  }

  function hovered() {
    var p = api.pointer;
    if (!p) return null;
    var u = p.x / S, v = p.y / S;
    for (var i = spots.length - 1; i >= 0; i--) {   // last placed is on top
      var b = spots[i].box;
      if (u > b.x - 2 && u < b.x + b.w + 2 && v > b.y - 2 && v < b.y + b.h + 2) return spots[i];
    }
    return null;
  }

  /* ---------- palette ---------- */
  function choose() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    c = PALETTES[dark ? 'dusk' : 'morning'];
    var s = hero.style;
    s.setProperty('--ink', c.text);
    s.setProperty('--graphite', c.muted);
    s.setProperty('--link', c.link);
    s.setProperty('--panel', c.panel);
    s.setProperty('--edge-ink', c.dark ? c.wall[3] : c.line);
    s.backgroundColor = c.wall[0];
    document.body.style.backgroundColor = c.deskFace;
  }

  return {
    theme: function () {
      choose();
      if (vw) paintBase();
    },
    resize: function (w, h) {
      W = w;
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      S = clamp(Math.round(w / 340), 2, 6);
      P = Math.max(1, Math.round(S * ratio));
      S = P / ratio;
      vw = Math.ceil(w / S); vh = Math.ceil(h / S);
      low.width = vw; low.height = vh;
      layout();
      paintBase();
      placeDoors();
      populate();
      codeT = 1.5;
      for (var i = 0; i < 60; i++) step(1 / 30);
    },
    step: step,
    draw: function (out) {
      paintFrame();
      out.save();
      out.setTransform(1, 0, 0, 1, 0, 0);
      out.imageSmoothingEnabled = false;
      out.drawImage(low, 0, 0, vw * P, vh * P);
      out.restore();
    },
    still: function () { for (var i = 0; i < 90; i++) step(1 / 30); codeT = codeLen / 16; }
  };
});
