/* ============================================================
   My room, in pixel art.

   A desk under a window: code types itself out on the laptop, the
   mug steams, and it snows on Toronto outside. Things in the room
   are doors to the rest of the site: the chalkboard is Experience,
   the laptop is Projects, the books are Research, the window is
   About, the trophy opens its part of About, the mug is email, and
   the lamp is the light switch (it flips the theme).

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
    kw: '#ef93a0', fn: '#9cc9e6', str: '#f3d27e', com: '#5d5a7a', plain: '#cfc5dc',
    gmTop: '#c46c24', gmEdge: '#6e3010', gmDark: '#4a2410', gmWing: '#c8964a', gmHi: '#fff3c4'
  };
  var PALETTES = {
    dusk: {
      dark: true, light: 'lamp',
      wall: ['#3a2d4b', '#463657', '#614661', '#86606a'],
      desk: ['#4a2f3c', '#5c3944', '#7c4d4b', '#a66c55'],
      deskEdge: '#6e4650', deskLip: '#35222e', deskFace: '#2f1e2a', shadow: '#3a2534',
      line: '#1b1222', sky: ['#7c4f8a', '#d0707c', '#f4a37f'], star: '#ffe3d1', starDim: '#b98aa8',
      moon: '#ffd28a', moonDark: '#f4b06a', sun: true, city: '#2b1d3d', cityWin: '#ffcf7a', cityWin2: '#c98bb0', snow: '#ffe9e0',
      frame: '#5c4670', frameDark: '#332641', cork: '#9a6a48', corkFrame: '#4e3430', board: '#241c2e',
      note1: '#f3d27e', note2: '#ef93a0', note3: '#9cc9e6',
      lamp: '#f0b45a', lampDark: '#a9703a', bulb: '#fff2c2', metal: '#a59ab4', metalLight: '#cfc5dc', metalDark: '#6a5d7c', bezel: '#22182e',
      screen: '#1d1530', dotA: '#ef93a0', dotB: '#f3d27e', dotC: '#9ad6a8',
      mug: '#f6e9dc', mugDark: '#bba69a', coffee: '#5a3a2a', steam: '#b892b0',
      book1: '#e0716a', book2: '#6c88c4', book3: '#f0c46a', book4: '#9a84c8', book5: '#f0a070', pages: '#f6e9dc',
      trophy: '#f0c46a',
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
      frame: '#fbf8f1', frameDark: '#cdbfa6', cork: '#c99a6a', corkFrame: '#8a6446', board: '#34404a',
      note1: '#f3d77e', note2: '#f0a0aa', note3: '#a3cfe9',
      lamp: '#d06a5a', lampDark: '#9a4a40', bulb: '#efe3c8', metal: '#b8bccb', metalLight: '#d9dce5', metalDark: '#7d8296', bezel: '#3a3d4c',
      screen: '#fdfaf3', dotA: '#e58f9a', dotB: '#e9c45a', dotC: '#6fbf86',
      mug: '#ffffff', mugDark: '#cfc6b6', coffee: '#6a4632', steam: '#ffffff',
      book1: '#c45a5a', book2: '#4f7fb0', book3: '#e2b44f', book4: '#7e6aa8', book5: '#d98a4e', pages: '#fffdf7',
      trophy: '#e3b34a',
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
  var SIZES = { chalk: [104, 59], win: [64, 54] };   // the window's height includes its sill

  function layout() {
    var text = api.avoid.map(function (a) { return { x: a.x / S, y: a.y / S, w: a.w / S, h: a.h / S }; });
    /* The nav starts at the top of the hero (its box is padded upward, so y <= 0); the rest is the name and its links. */
    var ceiling = 0, body = [];
    text.forEach(function (a) { if (a.y <= 0) ceiling = Math.max(ceiling, a.y + a.h); else body.push(a); });
    var tl = vw, tr = 0, tt = vh, tb = 0;
    body.forEach(function (a) { tl = Math.min(tl, a.x); tr = Math.max(tr, a.x + a.w); tt = Math.min(tt, a.y); tb = Math.max(tb, a.y + a.h); });
    var CW = SIZES.chalk[0], CH = SIZES.chalk[1], WW = SIZES.win[0], WH = SIZES.win[1];
    /* Wide screens: the chalkboard left of the name and the window right of it, all on one line.
       Tall ones (a phone held upright): both go on the wall under the name. */
    var tall = !body.length || tl < CW + 6 || vw - tr < WW + 6;
    var deskH = clamp(Math.round(vh * (tall ? 0.15 : 0.2)), 30, 70);
    var deskY = vh - deskH, top = clamp(Math.round(deskH * 0.34), 7, 13);
    /* On the narrowest phones the desk shifts right a few pixels, so the books keep clear of the screen edge. */
    var cx = Math.round(vw / 2) + (vw < 170 ? 4 : vw < 200 ? 3 : 0), by = deskY + 4;
    var lo = ceiling + 8, hi = by - 54;   // below the nav; above the lamp and the arrow over it
    var wall = {};
    function place(n, x, y, w) { wall[n] = { x: Math.round(x), y: Math.round(y), w: w || SIZES[n][0], h: SIZES[n][1] }; }
    if (!tall) {
      var mid = (tt + tb) / 2;
      place('chalk', (tl - CW) / 2, clamp(mid - CH / 2, lo, Math.max(lo, hi - CH)));
      place('win', tr + (vw - tr - WW) / 2, clamp(mid - WH / 2, lo, Math.max(lo, hi - WH)));
    } else if (body.length) {
      /* Side by side under the name, with a few pixels of wall past the tray and the sill. On narrower
         phones the window gets narrower (down to 34 wide) rather than leaving the room. */
      var zt = tb + 6, zone = hi - zt, room = vw - 8, fit = vw - 13 - CW;
      var ww = Math.min(WW, fit - 4), gap = Math.min(14, fit - ww);
      if (zone >= CH && ww >= 34) {
        var x0 = (vw - CW - gap - ww) / 2, y = zt + (zone - CH) * 0.35;
        place('chalk', x0, y);
        place('win', x0 + CW + gap, y + (gap < 6 ? 0 : (CH - WH) / 2), ww);   // too close for the sill to clear the tray: line the tops up
      } else if (zone >= CH + 8 + WH) {                   // too narrow: the board high on the left, the window lower on the right
        var y2 = zt + (zone - CH - 8 - WH) * 0.35;
        place('chalk', 6 + (room - CW) * 0.15, y2);
        place('win', vw - 6 - WW - (room - WW) * 0.15, y2 + CH + 8);
      } else if (zone >= CH) place('chalk', (vw - CW) / 2, zt + (zone - CH) * 0.35);   // the smallest phones: just the board
    }
    L = {
      deskY: deskY, top: top, by: by, cx: cx, ceiling: ceiling, wide: !tall,
      laptop: { x: cx - 24, y: by - 36, w: 48, h: 36 },
      chalk: wall.chalk || null,
      win: wall.win ? { x: wall.win.x, y: wall.win.y, w: wall.win.w, h: 50 } : null
    };
    desk(cx, by);
  }

  /* The desk, set up like a real one: the lamp leans over the laptop,
     the mug sits at its elbow, and the books and the trophy keep to
     the ends, a little further out on a wider desk (and pulled in on
     the narrowest phones, so the books stay on screen, with the lamp
     nudged toward the laptop to keep clear of them). */
  function desk(cx, by) {
    var half = Math.min(vw / 2 - 4, 150);
    var out = Math.min(clamp(Math.round(half * 0.72), 62, 110), cx - 31);
    L.lamp = { x: Math.max(cx - 58, cx - out + 2), y: by - 46, w: 30, h: 46 };
    L.mug = { x: cx + 33, y: by - 9, w: 11, h: 9 };
    L.books = { x: cx - out - 28, y: by - 22, w: 28, h: 22 };
    L.trophy = { x: cx + out, y: by - 23, w: 17, h: 23 };
    var lamp = L.lamp;
    lamp.bx = lamp.x + 8; lamp.hx = lamp.bx + 12; lamp.hy = by - 46;
    /* Where the lamp leans over its neighbours (the narrowest phones), its link keeps to the gap between them. */
    var left = L.books.x + L.books.w + 4, right = L.laptop.x - 4;
    if (lamp.x < left) { lamp.w -= left - lamp.x; lamp.x = left; }
    lamp.w = Math.min(lamp.w, right - lamp.x);
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
    if (!L.win || !L.wide) return 0;
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
    paintLamp(L.lamp);
    paintLaptop(L.laptop);
    paintMug(L.mug);
    paintBooks(L.books);
    paintTrophy(L.trophy);
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
    var mx = b.x + Math.floor(b.w / 2) - 1;   // the mullion; the tower stands in the middle of the left pane
    var tx = x0 + Math.round((mx - x0) / 2), ground = y0 + ph;
    r(tx, ground - 34, 2, 34, 'city');
    r(tx - 2, ground - 25, 6, 3, 'city'); r(tx - 1, ground - 26, 4, 1, 'city');
    r(tx - 1, ground - 31, 4, 1, 'city');
    r(tx, ground - 40, 1, 6, 'city');
    px(tx + 3, ground - 24, 'cityWin');
    /* Mullions, and the sill. */
    r(mx, y0, 2, ph, 'frame');
    r(x0, b.y + 22, pw, 2, 'frame');
    r(b.x - 3, b.y + b.h, b.w + 6, 3, 'frame');
    r(b.x - 3, b.y + b.h + 3, b.w + 6, 1, 'frameDark');
  }

  /* A 4 by 5 pixel font, just the letters the room writes (M, T, W, X, Y are 5 wide; I is 3). Add a glyph here if the board's words change. */
  var FONT = {
    A: ['.##.', '#..#', '####', '#..#', '#..#'], C: ['.###', '#...', '#...', '#...', '.###'], D: ['###.', '#..#', '#..#', '#..#', '###.'],
    E: ['####', '#...', '###.', '#...', '####'], F: ['####', '#...', '###.', '#...', '#...'], H: ['#..#', '#..#', '####', '#..#', '#..#'],
    I: ['###', '.#.', '.#.', '.#.', '###'], L: ['#...', '#...', '#...', '#...', '####'], M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
    N: ['#..#', '##.#', '#.##', '#..#', '#..#'], O: ['.##.', '#..#', '#..#', '#..#', '.##.'], P: ['###.', '#..#', '###.', '#...', '#...'],
    R: ['###.', '#..#', '###.', '#.#.', '#..#'], S: ['.###', '#...', '.##.', '...#', '###.'], T: ['#####', '..#..', '..#..', '..#..', '..#..'],
    U: ['#..#', '#..#', '#..#', '#..#', '####'], W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'], X: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
    Y: ['#...#', '.#.#.', '..#..', '..#..', '..#..'], 2: ['###.', '...#', '.##.', '#...', '####'], 7: ['####', '...#', '..#.', '.#..', '.#..'],
    "'": ['#', '#', '.', '.', '.'], ' ': ['..', '..', '..', '..', '..']
  };
  function textWidth(text) {
    var w = 0;
    for (var n = 0; n < text.length; n++) w += (FONT[text[n]] || FONT[' '])[0].length + 1;
    return w - 1;
  }
  function write(text, x, y, k) {
    for (var n = 0; n < text.length; n++) {
      var glyph = FONT[text[n]] || FONT[' '];
      for (var j = 0; j < 5; j++) for (var i = 0; i < glyph[j].length; i++) if (glyph[j][i] === '#') r(x + i, y + j, 1, 1, k);
      x += glyph[0].length + 1;
    }
    return x;
  }

  /* The chalkboard is Experience: a wooden frame, a board with old chalk
     dust (wiped clean behind the writing), each place in coloured chalk,
     and a tray. */
  function paintChalk(b) {
    var x = b.x, y = b.y, W = b.w, H = b.h - 3, mx = x + W / 2;   // H: the board and frame; the tray hangs below
    r(x, y, W, H, 'line');
    r(x + 1, y + 1, W - 2, H - 2, 'corkFrame');
    r(x + 1, y + 1, W - 2, 1, 'cork');
    r(x + 3, y + 3, W - 6, H - 6, 'board');
    ctx.globalAlpha = 0.18;
    for (var i = 0; i < 70; i++) px(x + 4 + Math.floor(rand() * (W - 8)), y + 4 + Math.floor(rand() * (H - 8)), 'chalkDim');
    ctx.globalAlpha = 1;
    var t = 'EXPERIENCE', tw = textWidth(t), tx = Math.round(mx - tw / 2);
    r(tx - 1, y + 6, tw + 2, 9, 'board');
    write(t, tx, y + 7, 'chalk');
    r(tx, y + 13, tw, 1, 'chalkDim');
    var lines = [
      ['NEXTDOOR', ' ML INTERN', 'note3'],
      ['SHOPIFY', ' SWE INTERN', 'note2'],
      ['U OF T', ' ML RESEARCH', 'note1'],
      ['U OF T', " MATH SPEC '27", 'note1']
    ];
    var widest = 0;
    lines.forEach(function (l) { widest = Math.max(widest, textWidth(l[0] + l[1])); });
    var lx = Math.round(mx - widest / 2);
    lines.forEach(function (l, n) {
      var ly = y + 18 + n * 8;
      r(lx - 1, ly - 1, textWidth(l[0] + l[1]) + 2, 7, 'board');
      write(l[1], write(l[0], lx, ly, l[2]), ly, 'chalk');
    });
    /* The tray: two sticks of chalk and an eraser. */
    r(x - 2, y + H - 1, W + 4, 3, 'corkFrame'); r(x - 2, y + H - 1, W + 4, 1, 'cork'); r(x - 2, y + H + 2, W + 4, 1, 'line');
    r(x + 9, y + H - 2, 6, 1, 'chalk'); r(x + 17, y + H - 2, 4, 1, 'note2');
    r(x + W - 22, y + H - 4, 10, 3, 'note3'); r(x + W - 22, y + H - 2, 10, 1, 'line');
  }

  /* The StarCraft II Grandmaster emblem: a winged hexagon with a star, on a little wooden stand. */
  var EMBLEM = [
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
  ];
  function paintTrophy(b) {
    shadow(b.x, 17);
    sprite(EMBLEM, b.x, b.y, { L: 'line', O: 'gmTop', G: 'trophy', D: 'gmEdge', K: 'gmDark', S: 'gmWing', W: 'gmHi' });
    r(b.x + 7, b.y + 19, 3, 2, 'line');
    r(b.x + 2, b.y + 21, 13, 2, 'corkFrame'); r(b.x + 2, b.y + 21, 13, 1, 'cork');
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
    shadow(b.x, 29);
    function book(x, y, w, h, k) {
      r(x, y, w, h, 'line');
      r(x + 1, y + 1, w - 2, h - 2, k);
      r(x + w - 3, y + 1, 2, h - 2, 'pages');
      r(x + 2, y + 1, 1, h - 2, 'pages');
    }
    book(b.x, L.by - 5, 28, 5, 'book1');
    book(b.x + 2, L.by - 9, 24, 4, 'book2');
    book(b.x + 1, L.by - 14, 26, 5, 'book3');
    book(b.x + 3, L.by - 18, 22, 4, 'book4');
    book(b.x + 2, L.by - 22, 24, 4, 'book5');
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
    var pw = L.win.w - 6;
    for (var i = 0; i < Math.round(26 * pw / 58); i++) snow.push({ x: Math.random() * pw, y: Math.random() * 44, v: 4 + Math.random() * 6, p: Math.random() * 6 });
  }

  function step(dt) {
    t += dt;
    for (var i = 0; i < snow.length; i++) {
      var s = snow[i];
      s.y += s.v * dt;
      if (s.y > 44) { s.y -= 44; s.x = Math.random() * (L.win.w - 6); }
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
      var x0 = L.win.x + 3, y0 = L.win.y + 3, pw = L.win.w - 6, m = Math.floor(L.win.w / 2) - 4;   // m: the mullion, from the left of the glass
      for (var i = 0; i < snow.length; i++) {
        var s = snow[i], x = Math.floor(s.x + Math.sin(t * 0.8 + s.p) * 1.5), y = Math.floor(s.y);
        if (x < 0 || x >= pw || x === m || x === m + 1 || y === 19 || y === 20) continue;
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
    /* Now and then the emblem glints. */
    if (L.trophy && t % 3.2 < 0.5) {
      var gx = L.trophy.x + 4, gy = L.trophy.y + 6;
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
    { key: 'chalk', href: 'experience/', title: 'Experience', hint: 'ML at Nextdoor, SWE at Shopify' },
    { key: 'books', href: 'research/', title: 'Research', hint: 'prompts as weight updates, and papers' },
    { key: 'mug', href: 'mailto:avichaigobrin@gmail.com', title: 'Coffee chat?', hint: 'happy to talk', act: 'click to write' },
    { key: 'lamp', lamp: true, title: 'The lamp', hint: 'lights on, lights off', act: 'click to switch' },
    { key: 'win', href: 'about/', title: 'About me', hint: 'Toronto, U of T, and the rest' },
    { key: 'trophy', href: 'about/#starcraft', title: 'StarCraft II', hint: 'Grandmaster, top 100 NA' }
  ];
  var HINT_ORDER = ['laptop', 'chalk', 'books', 'win', 'trophy', 'mug', 'lamp'];
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
      /* Labels open upward, unless that would cover the nav (or, on a phone, the name above the chalkboard and the window); and they never leave the screen. */
      if (top - TIP_H < L.ceiling * S || (!L.wide && (d.key === 'chalk' || d.key === 'win'))) tip.className += ' below';
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
      /* Phones held upright get 2 CSS px per room pixel (tablets a little more). On wider
         screens, step down a size if the chalkboard would not fit beside the name. */
      var nameW = 0;
      api.avoid.forEach(function (a) { if (a.y > 0) nameW = Math.max(nameW, a.w); });
      var s = w < h ? clamp(Math.round(w / 256), 2, 6) : clamp(Math.round(w / 340), 2, 6);
      for (;;) {
        P = Math.max(1, Math.round(s * ratio));
        S = P / ratio;
        if (w < h || s <= 2 || (w - nameW) / 2 >= (SIZES.chalk[0] + 16) * S) break;
        s--;
      }
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
