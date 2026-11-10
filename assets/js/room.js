/* ============================================================
   My room, in pixel art.

   A desk under a window: code types itself out on the laptop, the
   mug steams, and it snows on Toronto outside. Things in the room
   are doors to the rest of the site: the laptop is Projects, the
   corkboard is Experience, the books are Research, the chalkboard
   is About, the letter and the mug are email, the trophy, cards,
   belt, and window open their part of About, and the lamp is the
   light switch (it flips the theme).

   Everything is painted at a low resolution with plain rectangles,
   then scaled up by a whole number of device pixels, so every pixel
   is square and crisp. The lamplight is ordered (Bayer) dithering:
   four shades per surface, no gradients. No image files.
   ============================================================ */
Hero(function (api) {
  var hero = api.hero;

  /* Each palette is one look for the whole room, and the page text on top of it. */
  var PALETTES = {
    night: {
      dark: true, light: 'lamp',
      wall: ['#22263d', '#2d2f49', '#45404f', '#6a5553'],
      desk: ['#3a2a30', '#4d3534', '#6f4a3b', '#9a6a45'],
      deskEdge: '#5b4038', deskLip: '#2c1f25', deskFace: '#251b22', deskLine: '#1b1419', shadow: '#2b1f26',
      line: '#0f1120', sky: ['#0b1029', '#121c44', '#1c2c5e'], star: '#c9d3ff', starDim: '#5d6aa3',
      moon: '#f6e7b8', moonDark: '#d9c48e', sun: false, city: '#0a0e22', cityWin: '#f2c66d', cityWin2: '#6f82c4', snow: '#dfe6ff',
      frame: '#4a4361', frameDark: '#2a263b', cork: '#8a6240', corkDark: '#6e4c33', corkFrame: '#4a3428',
      note1: '#e9cf7a', note2: '#e58f9a', note3: '#8fc3e0', paper: '#efe6d2', paperDark: '#b8ad96', scribble: '#6b5a4a', pin: '#d8485a',
      lamp: '#d06a5a', lampDark: '#8e4038', bulb: '#fff2c2', metal: '#9aa0b4', metalLight: '#c3c8d6', metalDark: '#5d6278', bezel: '#1a1d2b',
      screen: '#121831', axis: '#2c3a66', curve: '#ffd27a', dotA: '#e58f9a', dotB: '#e9cf7a', dotC: '#8fd0a0',
      mug: '#e8e0d0', mugDark: '#a99f90', coffee: '#5a3a2a', steam: '#9a9ab8',
      book1: '#c45a5a', book2: '#4f7fb0', book3: '#d9b45a', pages: '#efe6d2', pencil: '#e9cf7a',
      leaf: '#6fae6a', leafDark: '#3f7a4e', pot: '#c9724e', potDark: '#8e4a34',
      cardBack: '#2c3f7a', cardGold: '#e3b34a', cardBorder: '#15131c', cardFace: '#c9b48a', cardArt: '#6f9fd0',
      belt: '#0b0b12', beltHi: '#3a3a4a', peg: '#8a6240', trophy: '#e3b34a', trophyDark: '#a8782a', seal: '#d8485a',
      accent: '#ffd27a',
      text: '#f6efe0', muted: '#bfc3d6', link: '#ffd98a', panel: '#151829'
    },
    dusk: {
      dark: true, light: 'lamp',
      wall: ['#3a2d4b', '#463657', '#614661', '#86606a'],
      desk: ['#4a2f3c', '#5c3944', '#7c4d4b', '#a66c55'],
      deskEdge: '#6e4650', deskLip: '#35222e', deskFace: '#2f1e2a', deskLine: '#231620', shadow: '#3a2534',
      line: '#1b1222', sky: ['#7c4f8a', '#d0707c', '#f4a37f'], star: '#ffe3d1', starDim: '#b98aa8',
      moon: '#ffd28a', moonDark: '#f4b06a', sun: true, city: '#2b1d3d', cityWin: '#ffcf7a', cityWin2: '#c98bb0', snow: '#ffe9e0',
      frame: '#5c4670', frameDark: '#332641', cork: '#9a6a48', corkDark: '#7a5238', corkFrame: '#4e3430',
      note1: '#f3d27e', note2: '#ef93a0', note3: '#9cc9e6', paper: '#f6e9dc', paperDark: '#c4ab9c', scribble: '#7a5a5a', pin: '#e05468',
      lamp: '#f0b45a', lampDark: '#a9703a', bulb: '#fff2c2', metal: '#a59ab4', metalLight: '#cfc5dc', metalDark: '#6a5d7c', bezel: '#22182e',
      screen: '#1d1530', axis: '#4a3a66', curve: '#ffcf7a', dotA: '#ef93a0', dotB: '#f3d27e', dotC: '#9ad6a8',
      mug: '#f6e9dc', mugDark: '#bba69a', coffee: '#5a3a2a', steam: '#b892b0',
      book1: '#e0716a', book2: '#6c88c4', book3: '#f0c46a', pages: '#f6e9dc', pencil: '#f3d27e',
      leaf: '#7fb87a', leafDark: '#4a8257', pot: '#d77e58', potDark: '#9a5038',
      cardBack: '#3d3a8a', cardGold: '#f0c46a', cardBorder: '#1b1222', cardFace: '#d7bf95', cardArt: '#e0716a',
      belt: '#120c16', beltHi: '#4a3a52', peg: '#9a6a48', trophy: '#f0c46a', trophyDark: '#b4803a', seal: '#e05468',
      accent: '#ffcf7a',
      text: '#fff1e4', muted: '#e2c9d0', link: '#ffd08a', panel: '#2a1f38'
    },
    morning: {
      dark: false, light: 'window',
      wall: ['#ece2cf', '#f0e7d6', '#f4ecdf', '#f8f2e7'],
      desk: ['#c3946a', '#cd9f74', '#d7ab80', '#e1b98e'],
      deskEdge: '#e6c49d', deskLip: '#a97c55', deskFace: '#b8875e', deskLine: '#946a47', shadow: '#b08660',
      line: '#3a3346', sky: ['#9cc5e6', '#b4d4ee', '#cfe4f4'], star: false, starDim: false,
      moon: '#fff1b8', moonDark: '#ffe08a', sun: true, city: '#8eaacb', cityWin: '#c7d8ea', cityWin2: '#a9c0dc', snow: '#ffffff',
      frame: '#fbf8f1', frameDark: '#cdbfa6', cork: '#c99a6a', corkDark: '#b0835a', corkFrame: '#8a6446',
      note1: '#f3d77e', note2: '#f0a0aa', note3: '#a3cfe9', paper: '#fffdf7', paperDark: '#cfc3ad', scribble: '#8a7a6a', pin: '#d8485a',
      lamp: '#d06a5a', lampDark: '#9a4a40', bulb: '#efe3c8', metal: '#b8bccb', metalLight: '#d9dce5', metalDark: '#7d8296', bezel: '#3a3d4c',
      screen: '#fdfaf3', axis: '#d7dce8', curve: '#2f5aa8', dotA: '#e58f9a', dotB: '#e9c45a', dotC: '#6fbf86',
      mug: '#ffffff', mugDark: '#cfc6b6', coffee: '#6a4632', steam: '#ffffff',
      book1: '#c45a5a', book2: '#4f7fb0', book3: '#e2b44f', pages: '#fffdf7', pencil: '#e9c45a',
      leaf: '#6fae6a', leafDark: '#3f7a4e', pot: '#c9724e', potDark: '#9a5038',
      cardBack: '#2c3f7a', cardGold: '#e3b34a', cardBorder: '#2b2a3a', cardFace: '#d9c49a', cardArt: '#6f9fd0',
      belt: '#16151c', beltHi: '#55525e', peg: '#a97c55', trophy: '#e3b34a', trophyDark: '#b07f2a', seal: '#d8485a',
      accent: '#d8485a',
      text: '#1f2638', muted: '#5a5f70', link: '#2f5aa8', panel: '#fffdf7'
    },
    ink: {
      dark: false, light: 'window',
      wall: ['#f3eee3', '#f5f1e7', '#f8f4ec', '#fbf8f2'],
      desk: ['#e6ddca', '#ebe3d2', '#efe8d9', '#f3ede1'],
      deskEdge: '#c9d3ee', deskLip: '#2a4596', deskFace: '#f0eadd', deskLine: '#9fb0dd', shadow: '#c9d3ee',
      line: '#2a4596', sky: ['#dde5f6', '#e6ecf8', '#eef2fa'], star: false, starDim: false,
      moon: '#f3eee3', moonDark: '#9fb0dd', sun: true, city: '#9fb0dd', cityWin: '#f3eee3', cityWin2: '#c9d3ee', snow: '#5b74c4',
      frame: '#f8f4ec', frameDark: '#2a4596', cork: '#e3e8f6', corkDark: '#b9c6ea', corkFrame: '#2a4596',
      note1: '#fbf8f2', note2: '#dfe6f7', note3: '#c9d3ee', paper: '#fbf8f2', paperDark: '#5b74c4', scribble: '#5b74c4', pin: '#2a4596',
      lamp: '#2a4596', lampDark: '#1d3270', bulb: '#f3eee3', metal: '#c9d3ee', metalLight: '#e6ecf8', metalDark: '#5b74c4', bezel: '#2a4596',
      screen: '#fbf8f2', axis: '#dfe6f7', curve: '#2a4596', dotA: '#5b74c4', dotB: '#9fb0dd', dotC: '#c9d3ee',
      mug: '#fbf8f2', mugDark: '#c9d3ee', coffee: '#2a4596', steam: '#9fb0dd',
      book1: '#2a4596', book2: '#5b74c4', book3: '#9fb0dd', pages: '#fbf8f2', pencil: '#5b74c4',
      leaf: '#5b74c4', leafDark: '#2a4596', pot: '#9fb0dd', potDark: '#5b74c4',
      cardBack: '#2a4596', cardGold: '#c9d3ee', cardBorder: '#2a4596', cardFace: '#fbf8f2', cardArt: '#9fb0dd',
      belt: '#1d3270', beltHi: '#5b74c4', peg: '#5b74c4', trophy: '#9fb0dd', trophyDark: '#2a4596', seal: '#2a4596',
      accent: '#2a4596',
      text: '#1d2f6b', muted: '#4a5a8a', link: '#2a4596', panel: '#fbf8f2'
    }
  };
  /* Keys every palette shares unless it sets its own. */
  PALETTES.night.board = '#161a2a'; PALETTES.dusk.board = '#241c2e'; PALETTES.morning.board = '#34404a'; PALETTES.ink.board = '#2a4596';
  PALETTES.ink.chalk = '#fbf8f2';
  var SHARED = {
    chalk: '#f4f1e8', chalkDim: '#b9bfc4',
    manaW: '#f3ead0', manaU: '#4f8fd6', manaB: '#3d3448', manaR: '#d8574a', manaG: '#4f9a5a',
    kw: '#ef93a0', fn: '#9cc9e6', str: '#f3d27e', com: '#5d5a7a', plain: '#cfc5dc'
  };
  PALETTES.morning.kw = '#c4505d'; PALETTES.morning.fn = '#2f5aa8'; PALETTES.morning.str = '#b07f2a';
  PALETTES.morning.com = '#d3ccbd'; PALETTES.morning.plain = '#6a6f80';
  PALETTES.ink.kw = '#2a4596'; PALETTES.ink.fn = '#5b74c4'; PALETTES.ink.str = '#9fb0dd'; PALETTES.ink.com = '#dfe6f7'; PALETTES.ink.plain = '#5b74c4';
  PALETTES.ink.manaW = '#fbf8f2'; PALETTES.ink.manaU = '#9fb0dd'; PALETTES.ink.manaB = '#2a4596'; PALETTES.ink.manaR = '#5b74c4'; PALETTES.ink.manaG = '#c9d3ee';
  Object.keys(PALETTES).forEach(function (n) {
    for (var k in SHARED) if (!(k in PALETTES[n])) PALETTES[n][k] = SHARED[k];
  });
  var PAIRS = { light: 'morning', dark: 'dusk' };

  var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  var low = document.createElement('canvas'), g = low.getContext('2d');
  var base = document.createElement('canvas'), bg = base.getContext('2d');
  var c = PALETTES.night, name = 'night';
  var W = 0, H = 0, S = 4, P = 4, vw = 0, vh = 0, L = null;
  var t = 0, snow = [], steam = [], steamClock = 0, code = [], codeLen = 0, codeT = 0;
  var spotsEl = null, spots = [];
  var hoverable = window.matchMedia ? matchMedia('(hover: hover)').matches : true;

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
  function overlaps(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; }

  /* ---------- where everything goes ---------- */
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
    var tl = vw, tr = 0, tt = deskY, tb = 0;
    body.forEach(function (a) { tl = Math.min(tl, a.x); tr = Math.max(tr, a.x + a.w); tt = Math.min(tt, a.y); tb = Math.max(tb, a.y + a.h); });
    var edge = Math.max(6, Math.round(vw * 0.07)), lo = ceiling + 6, hi = deskY - 46;
    var SIZES = { chalk: [64, 47], cork: [54, 38], win: [64, 54], shelf: [30, 20] };
    var wall = {};
    function column(names, x0, x1) {
      var fit = names.filter(function (n) { return SIZES[n][0] <= x1 - x0; });
      while (fit.length) {
        var total = fit.reduce(function (t, n) { return t + SIZES[n][1]; }, 0) + 12 * (fit.length - 1);
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
        wall.chalk = { x: x, y: y + 4, w: 64, h: 47 };
        wall.win = { x: x + 64 + gap, y: y, w: 64, h: 54 };
      }
    }
    var win = wall.win ? { x: wall.win.x, y: wall.win.y, w: 64, h: 50 } : null;
    var cork = wall.cork || null, chalk = wall.chalk || null, shelf = wall.shelf || null;
    var belt = cork ? { x: cork.x + 30, y: cork.y - 2, w: 28, h: 20 } : null;
    L = {
      deskY: deskY, top: top, by: by, cx: cx,
      laptop: { x: cx - 24, y: by - 36, w: 48, h: 36 },
      lamp: { x: cx - 74, y: by - 46, w: 30, h: 46, bx: cx - 66, hx: cx - 54, hy: by - 46 },
      cards: { x: cx - 52, y: by - 15, w: 25, h: 15 },
      mug: { x: cx + 30, y: by - 9, w: 11, h: 9 },
      envelope: { x: cx + 80, y: by - 16, w: 16, h: 16 },
      books: { x: cx + 46, y: by - 14, w: 26, h: 14 },
      trophy: shelf ? { x: shelf.x + 9, y: shelf.y, w: 11, h: 16 } : null,
      shelf: shelf, win: win, cork: cork, belt: belt, chalk: chalk
    };
    if (vw < 196) L.cards = null;
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

    /* The desk: an edge, the top (dithered above), the front lip, and a drawer. */
    r(0, L.deskY, vw, 1, 'deskEdge');
    r(0, L.deskY + L.top, vw, 2, 'deskLip');
    var dh = Math.min(12, vh - L.deskY - L.top - 8);
    if (dh > 5) {
      var dx = L.cx - 30, dy = L.deskY + L.top + 5;
      r(dx, dy, 60, 1, 'deskLine'); r(dx, dy + dh, 60, 1, 'deskLine'); r(dx, dy, 1, dh, 'deskLine'); r(dx + 59, dy, 1, dh + 1, 'deskLine');
      r(L.cx - 3, dy + Math.round(dh / 2) - 1, 6, 2, 'deskLine');
    }

    seed = 11;
    if (L.win) paintWindow(L.win);
    if (L.chalk) paintChalk(L.chalk);
    if (L.shelf) paintShelf(L.shelf);
    if (L.cork) paintCork(L.cork);
    if (L.belt) paintBelt(L.belt);
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
    /* The moon, or a low sun. */
    var mx = x0 + pw - 14, my = c.sun ? y0 + ph - 20 : y0 + 5;
    sprite(['.MMMM.', 'MMMMMM', 'MMMMmM', 'MmMMMM', 'MMMMMM', '.MMMM.'], mx, my, { M: 'moon', m: 'moonDark' });
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
    K: ['#.#', '#.#', '##.', '#.#', '#.#'], L: ['#..', '#..', '#..', '#..', '###'], M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
    O: ['.#.', '#.#', '#.#', '#.#', '.#.'], S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
    U: ['#.#', '#.#', '#.#', '#.#', '###'], W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'], 2: ['##.', '..#', '.#.', '#..', '###'],
    7: ['###', '..#', '.#.', '.#.', '.#.'], "'": ['#', '#', '.', '.', '.'], ' ': ['..', '..', '..', '..', '..']
  };
  function write(text, x, y, k) {
    for (var n = 0; n < text.length; n++) {
      var glyph = FONT[text[n]] || FONT[' '];
      for (var j = 0; j < 5; j++) for (var i = 0; i < glyph[j].length; i++) if (glyph[j][i] === '#') px(x + i, y + j, k);
      x += glyph[0].length + 1;
    }
    return x;
  }

  function paintChalk(b) {
    r(b.x, b.y, b.w, 44, 'corkFrame');
    r(b.x + 2, b.y + 2, b.w - 4, 40, 'board');
    var x = b.x + 6, y = b.y + 5;
    var end = write('ABOUT ME', x, y, 'chalk');
    r(x, y + 6, end - x - 1, 1, 'chalkDim');
    end = write('SC2 GM', x, y + 10, 'chalk');
    sprite(['..#..', '.###.', '#####', '.###.', '.#.#.'], end + 1, y + 10, { '#': 'trophy' });
    write('MTG', x, y + 17, 'chalk');
    write('BLACK BELT', x, y + 24, 'chalk');
    write("U OF T '27", x, y + 31, 'chalkDim');
    /* The tray, and a stick of chalk on it. */
    r(b.x - 1, b.y + 44, b.w + 2, 2, 'corkFrame'); r(b.x - 1, b.y + 46, b.w + 2, 1, 'frameDark');
    r(b.x + 44, b.y + 43, 6, 1, 'chalk');
  }

  function paintShelf(b) {
    var y = b.y + 16;
    r(b.x, y, b.w, 2, 'corkFrame'); r(b.x, y + 2, b.w, 1, 'frameDark');
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

  function paintBelt(b) {
    /* Hung over the corner of the corkboard: the band, the knot, two tails. */
    var x = b.x, y = b.y;
    r(x, y + 1, 24, 2, 'belt'); r(x, y + 1, 24, 1, 'beltHi');
    r(x + 22, y, 5, 4, 'belt'); r(x + 23, y + 1, 2, 1, 'beltHi');
    r(x + 25, y + 4, 2, 7, 'belt'); r(x + 26, y + 11, 2, 7, 'belt'); r(x + 26, y + 15, 2, 1, 'trophy');
    r(x + 22, y + 4, 2, 6, 'belt'); r(x + 21, y + 10, 2, 5, 'belt');
  }

  function paintTrophy(b) {
    var x = b.x, y = b.y;
    r(x + 1, y, 9, 3, 'trophy'); r(x + 2, y + 3, 7, 1, 'trophy'); r(x + 3, y + 4, 5, 1, 'trophy'); r(x + 4, y + 5, 3, 1, 'trophy');
    r(x + 7, y + 1, 2, 4, 'trophyDark'); r(x + 6, y + 4, 2, 1, 'trophyDark');
    r(x + 2, y + 1, 1, 2, 'pages'); px(x + 5, y + 1, 'pages');
    px(x, y + 1, 'trophyDark'); px(x, y + 2, 'trophyDark'); px(x + 1, y + 3, 'trophyDark');
    px(x + 10, y + 1, 'trophyDark'); px(x + 10, y + 2, 'trophyDark'); px(x + 9, y + 3, 'trophyDark');
    r(x + 5, y + 6, 1, 2, 'trophyDark');
    r(x + 3, y + 8, 5, 1, 'trophy');
    r(x, y + 9, 11, 7, 'line');
    write('GM', x + 1, y + 10, 'trophy');
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
    /* A letter standing in a little wooden rack. */
    shadow(b.x, 17);
    var x = b.x + 1, y = b.y;
    r(x, y, 14, 10, 'paperDark');
    r(x + 1, y + 1, 12, 8, 'paper');
    line(x + 1, y + 1, x + 6, y + 5, 'paperDark');
    line(x + 12, y + 1, x + 7, y + 5, 'paperDark');
    r(x + 5, y + 4, 4, 3, 'seal'); px(x + 5, y + 4, 'paper'); px(x + 8, y + 4, 'paper'); px(x + 5, y + 6, 'paper'); px(x + 8, y + 6, 'paper');
    r(b.x, L.by - 6, 16, 6, 'corkFrame'); r(b.x, L.by - 6, 16, 1, 'cork'); r(b.x + 1, L.by - 4, 14, 1, 'corkDark');
  }

  /* ---------- the moving parts ---------- */
  /* A few lines of made-up code: an indent, then tokens of a few kinds. */
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
    if (!L.win) return;
    var n = 26;
    for (var i = 0; i < n; i++) snow.push({ x: Math.random() * 58, y: Math.random() * 44, v: 4 + Math.random() * 6, p: Math.random() * 6 });
    steam = [];
    makeCode();
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
    { key: 'books', href: 'research/', title: 'Research', hint: 'rank reduction in LLMs' },
    { key: 'chalk', href: 'about/', title: 'About me', hint: 'school, games, and karate' },
    { key: 'envelope', href: 'mailto:avichaigobrin@gmail.com', title: 'Email me', hint: 'avichaigobrin@gmail.com', act: 'click to write' },
    { key: 'mug', href: 'mailto:avichaigobrin@gmail.com', title: 'Coffee chat?', hint: 'happy to talk', act: 'click to write' },
    { key: 'lamp', lamp: true, title: 'The lamp', hint: 'lights on, lights off', act: 'click to switch' },
    { key: 'win', href: 'about/#school', title: 'Toronto', hint: 'U of T, graduating 2027' },
    { key: 'trophy', href: 'about/#starcraft', title: 'StarCraft II', hint: 'Grandmaster, top 100 NA' },
    { key: 'cards', href: 'about/#magic', title: 'Magic: The Gathering', hint: 'competitive' },
    { key: 'belt', href: 'about/#karate', title: 'Karate', hint: 'black belt' }
  ];
  var HINT_ORDER = ['laptop', 'cork', 'chalk', 'books', 'trophy', 'envelope', 'lamp', 'win', 'cards', 'belt', 'mug'];
  var hinting = true, hintAt = 0;

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
      var pad = 2;
      el.style.left = ((box.x - pad) * S) + 'px';
      el.style.top = ((box.y - pad) * S) + 'px';
      el.style.width = ((box.w + 2 * pad) * S) + 'px';
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
      if (box.y * S < 90) tip.className += ' below';
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
    var forced = hero.getAttribute('data-palette');
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    name = PALETTES[forced] ? forced : PAIRS[dark ? 'dark' : 'light'];
    c = PALETTES[name];
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
      W = w; H = h;
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
    still: function () { for (var i = 0; i < 90; i++) step(1 / 30); codeT = codeLen / 16; },
    readout: function () { return hoverable ? 'Everything in the room is clickable' : 'Tap anything in the room'; },
    cut: false
  };
});
