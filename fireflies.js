/* ============================================================
   Fireflies in the margin.

   Each firefly carries a clock that ticks toward its next flash.
   When it sees a neighbour flash, its clock jumps a little ahead,
   and the further along it was, the further it jumps. This is the
   pulse-coupled oscillator model of Mirollo and Strogatz (1990),
   the standard explanation for how real fireflies end up flashing
   together. Nobody leads, yet within a few seconds they blink as
   one. Tap or click one to knock it out of step and watch the
   others pull it back in. Tuned so that, from random clocks, the
   swarm is usually in step within about 15 seconds.

   Markup (see index.html): the field holds the canvas and the
   portrait, which the fireflies fly around; the note below it holds
   the live readout and the pause button, and stays hidden without
   JavaScript.
     <div class="fireflies" data-fireflies>
       <canvas aria-hidden="true"></canvas>
       <span class="portrait">...</span>
     </div>
     <p data-fireflies-note hidden> ... <span data-live> <span data-sync></span> <button data-knock></button> </span> <button data-pause></button></p>

   Colours come from the CSS variables --ink and --firefly, and are
   re-read whenever the theme changes. The animation pauses when the
   figure is off screen or the tab is hidden, never runs under
   prefers-reduced-motion, and can be paused with the button.
   ============================================================ */
(function () {
  var box = document.querySelector('[data-fireflies]');
  var canvas = box && box.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var note = document.querySelector('[data-fireflies-note]');
  var syncOut = note && note.querySelector('[data-sync]');
  var liveText = note && note.querySelector('[data-live]');
  var pauseButton = note && note.querySelector('[data-pause]');
  var knockButton = note && note.querySelector('[data-knock]');
  var portrait = box.querySelector('.portrait');
  var root = document.documentElement;
  var reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  /* The model. Change these to change the character of the swarm. */
  var COUNT = 13;        // fireflies
  var PERIOD = 1.6;      // seconds between one firefly's flashes, on average
  var SPREAD = 0.03;     // each firefly's period differs by up to 3%
  var NUDGE = 0.03;      // a seen flash moves a clock ahead by NUDGE times its phase
  var SIGHT = 0.43;      // how far a firefly can see, as a fraction of the field's width
  var SPEED = 9;         // pixels per second: a lazy drift
  var EDGE = 12;         // keep this far from the edges
  var GROUND = 14;       // height of the grass along the bottom

  var width = 0, height = 0, ratio = 1, sight = 110;
  var grassWidth = 0;
  var hole = null;       // the portrait, a circle the fireflies keep out of
  var flies = [], blades = [];
  var colours = { ink: '#1f2633', glow: '#f2c14e', dark: false };
  var onScreen = true, paused = false, frame = 0, lastTime = 0, clock = 0;
  var pointer = null, shownSync = 0, sinceReadout = 0;

  function between(a, b) { return a + Math.random() * (b - a); }

  /* '#f2c14e' -> 'rgba(242,193,78,0)', so a glow fades to its own colour. */
  function clear(hex) {
    var m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!m) return 'rgba(0,0,0,0)';
    var n = parseInt(m[1], 16);
    return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',0)';
  }

  function readColours() {
    var style = getComputedStyle(root);
    colours.ink = style.getPropertyValue('--ink').trim() || colours.ink;
    colours.glow = style.getPropertyValue('--firefly').trim() || colours.glow;
    colours.dark = root.getAttribute('data-theme') === 'dark';
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    sight = SIGHT * width;
    if (portrait) {
      var p = portrait.getBoundingClientRect();
      hole = { x: p.left - rect.left + p.width / 2, y: p.top - rect.top + p.height / 2, r: p.width / 2 + 7 };
    }
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!flies.length) hatch();
    flies.forEach(function (f) {
      f.x = Math.min(Math.max(f.x, EDGE), width - EDGE);
      f.y = Math.min(Math.max(f.y, EDGE), height - GROUND - EDGE / 2);
    });
    if (width !== grassWidth) { grassWidth = width; growGrass(); }   // keep the same grass unless the width changes
    return true;
  }

  function outsideHole(x, y) {
    if (!hole) return true;
    var dx = x - hole.x, dy = y - hole.y;
    return dx * dx + dy * dy > hole.r * hole.r;
  }

  function hatch() {
    flies = [];
    for (var i = 0; i < COUNT; i++) {
      var x, y, tries = 0;
      do {
        x = between(EDGE, width - EDGE);
        y = between(EDGE, height - GROUND - EDGE);
      } while (!outsideHole(x, y) && ++tries < 50);
      flies.push({
        x: x,
        y: y,
        vx: between(-1, 1) * SPEED,
        vy: between(-1, 1) * SPEED,
        phase: Math.random(),
        rate: 1 / (PERIOD * between(1 - SPREAD, 1 + SPREAD)),
        sinceFlash: 9,                       // seconds since its last flash
        wander: [between(0.15, 0.45), between(0.15, 0.45), between(0, 6.28), between(0, 6.28)]
      });
    }
  }

  /* Grass along the bottom, drawn the way you would doodle it: small
     clumps of two or three blades, now and then a taller one. */
  function growGrass() {
    blades = [];
    var x = between(0, 6);
    while (x < width) {
      var clump = Math.random() < 0.7 ? 2 + Math.floor(Math.random() * 2) : 1;
      for (var k = 0; k < clump; k++) {
        var tall = Math.random() < 0.15 ? 1.3 : 1;
        blades.push({ x: x + between(-2, 2), h: between(GROUND * 0.35, GROUND * 0.8) * tall, lean: between(-5, 5) });
      }
      x += between(8, 15);
    }
  }

  /* Advance the clocks, pass flashes along, and move everyone. */
  function step(dt) {
    var fired = [];
    flies.forEach(function (f) {
      f.sinceFlash += dt;
      f.phase += f.rate * dt;
      if (f.phase >= 1) { f.phase = 0; f.sinceFlash = 0; fired.push(f); }
    });
    /* A flash nudges every clock that can see it. A clock pushed past
       the end flashes at once and passes its own flash along, which is
       how a whole swarm locks together. */
    while (fired.length) {
      var source = fired.shift();
      flies.forEach(function (f) {
        if (f === source || f.sinceFlash === 0) return;
        var dx = f.x - source.x, dy = f.y - source.y;
        if (dx * dx + dy * dy > sight * sight) return;
        f.phase += NUDGE * f.phase;
        if (f.phase >= 1) { f.phase = 0; f.sinceFlash = 0; fired.push(f); }
      });
    }

    clock += dt;
    flies.forEach(function (f) {
      var w = f.wander;
      var ax = Math.sin(clock * w[0] + w[2]) * 6 + Math.sin(clock * w[1] * 1.7 + w[3]) * 3;
      var ay = Math.cos(clock * w[1] + w[3]) * 6 + Math.cos(clock * w[0] * 1.3 + w[2]) * 3;
      if (f.x < EDGE * 2) ax += (EDGE * 2 - f.x) * 1.5;
      if (f.x > width - EDGE * 2) ax -= (f.x - (width - EDGE * 2)) * 1.5;
      if (f.y < EDGE * 2) ay += (EDGE * 2 - f.y) * 1.5;
      if (f.y > height - GROUND - EDGE) ay -= (f.y - (height - GROUND - EDGE)) * 1.5;
      if (hole) {
        var hx = f.x - hole.x, hy = f.y - hole.y, h2 = hx * hx + hy * hy, reach = hole.r + 10;
        if (h2 < reach * reach && h2 > 0.01) {
          var hd = Math.sqrt(h2), shove = (reach - hd) * 4;
          ax += (hx / hd) * shove;
          ay += (hy / hd) * shove;
        }
      }
      if (pointer) {
        var px = f.x - pointer.x, py = f.y - pointer.y, d2 = px * px + py * py;
        if (d2 < 40 * 40 && d2 > 0.01) {
          var d = Math.sqrt(d2), push = (40 - d) * 2.5;
          ax += (px / d) * push;
          ay += (py / d) * push;
        }
      }
      f.vx = (f.vx + ax * dt) * (1 - 0.6 * dt);
      f.vy = (f.vy + ay * dt) * (1 - 0.6 * dt);
      var speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy), most = SPEED * 2.5;
      if (speed > most) { f.vx *= most / speed; f.vy *= most / speed; }
      f.x += f.vx * dt;
      f.y += f.vy * dt;
    });
  }

  /* How bright a firefly is, from 0 to 1, given seconds since its flash. */
  function glowAt(t) {
    if (t < 0.06) return t / 0.06;
    return Math.exp(-(t - 0.06) / 0.13);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    /* Grass, a few pen strokes along the bottom. */
    ctx.strokeStyle = colours.ink;
    ctx.globalAlpha = colours.dark ? 0.3 : 0.38;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.beginPath();
    blades.forEach(function (b) {
      ctx.moveTo(b.x, height - 1);
      ctx.quadraticCurveTo(b.x + b.lean * 0.15, height - b.h * 0.7, b.x + b.lean, height - b.h);
    });
    ctx.stroke();

    /* Glows first: highlighter on paper, light on the chalkboard. */
    ctx.globalCompositeOperation = colours.dark ? 'lighter' : 'multiply';
    flies.forEach(function (f) {
      var g = glowAt(f.sinceFlash);
      if (g < 0.02) return;
      var r = 4 + 9 * g;
      var gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      gradient.addColorStop(0, colours.glow);
      gradient.addColorStop(1, clear(colours.glow));
      ctx.globalAlpha = (colours.dark ? 0.85 : 0.9) * g;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, r, 0, 6.2832);
      ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over';

    /* Bodies: a small ink stroke pointing the way each one flies. */
    ctx.fillStyle = colours.ink;
    flies.forEach(function (f) {
      var heading = Math.atan2(f.vy, f.vx);
      ctx.globalAlpha = colours.dark ? 0.55 : 0.85;
      ctx.beginPath();
      ctx.ellipse(f.x, f.y, 2.1, 1.25, heading, 0, 6.2832);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  /* Kuramoto's order parameter: 1 when every clock reads the same. */
  function syncLevel() {
    if (!flies.length) return 0;
    var c = 0, s = 0;
    flies.forEach(function (f) { c += Math.cos(6.2832 * f.phase); s += Math.sin(6.2832 * f.phase); });
    return Math.sqrt(c * c + s * s) / flies.length;
  }

  function showSync(dt) {
    if (!syncOut) return;
    sinceReadout += dt;
    shownSync += (syncLevel() - shownSync) * Math.min(1, dt * 2.5);
    if (sinceReadout < 0.25) return;
    sinceReadout = 0;
    syncOut.textContent = Math.round(shownSync * 100) + '%';
  }

  function moving() {
    return onScreen && !paused && !document.hidden && !(reducedMotion && reducedMotion.matches);
  }

  function tick(now) {
    frame = 0;
    if (!moving()) return;
    var dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
    lastTime = now;
    step(dt);
    draw();
    showSync(dt);
    frame = requestAnimationFrame(tick);
  }

  function update() {
    var still = reducedMotion && reducedMotion.matches;
    if (note) note.hidden = false;
    if (liveText) liveText.hidden = still;
    if (pauseButton) {
      pauseButton.hidden = still;
      pauseButton.textContent = paused ? 'Let them fly' : 'Pause';
    }
    if (moving() && !frame) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
    if (!moving()) draw();
  }

  /* A still picture for reduced motion: a few fireflies caught mid-flash. */
  function stillLife() {
    flies.forEach(function (f, i) { f.sinceFlash = i % 3 === 0 ? 0.08 : 9; });
    draw();
  }

  function localPoint(event) {
    var rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener('pointermove', function (e) { pointer = localPoint(e); });
  canvas.addEventListener('pointerleave', function () { pointer = null; });
  /* Knock a firefly half a beat out of step and send it off, away from (x, y). */
  function knock(f, x, y) {
    f.phase = (f.phase + 0.5) % 1;
    var away = Math.atan2(f.y - y, f.x - x);
    f.vx += Math.cos(away) * SPEED * 3;
    f.vy += Math.sin(away) * SPEED * 3;
  }

  canvas.addEventListener('pointerdown', function (e) {
    var p = localPoint(e), nearest = null, best = (e.pointerType === 'touch' ? 26 : 18);
    flies.forEach(function (f) {
      var d = Math.hypot(f.x - p.x, f.y - p.y);
      if (d < best) { best = d; nearest = f; }
    });
    if (nearest) knock(nearest, p.x, p.y);
  });

  /* The same thing from the keyboard: knock out one firefly at random. */
  if (knockButton) {
    knockButton.addEventListener('click', function () {
      if (!flies.length) return;
      var f = flies[Math.floor(Math.random() * flies.length)];
      knock(f, f.x - f.vx, f.y - f.vy);
    });
  }

  if (pauseButton) {
    try { paused = localStorage.getItem('fireflies') === 'paused'; } catch (e) {}
    pauseButton.addEventListener('click', function () {
      paused = !paused;
      try { localStorage.setItem('fireflies', paused ? 'paused' : 'flying'); } catch (e) {}
      update();
    });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      update();
    }).observe(box);
  }
  document.addEventListener('visibilitychange', update);
  function onMotionSetting() { if (reducedMotion.matches) stillLife(); update(); }
  if (reducedMotion && reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionSetting);
  else if (reducedMotion && reducedMotion.addListener) reducedMotion.addListener(onMotionSetting);   // Safari before 14
  new MutationObserver(function () { readColours(); if (!moving()) draw(); })
    .observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { if (resize() && !moving()) draw(); }).observe(canvas);
  }
  /* Zooming or moving to another screen changes the pixel ratio but not
     the canvas's size, so watch the ratio too and redraw sharp. */
  function watchRatio() {
    if (!window.matchMedia) return;
    var query = matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
    var onChange = function () {
      if (query.removeEventListener) query.removeEventListener('change', onChange); else if (query.removeListener) query.removeListener(onChange);
      if (resize() && !moving()) draw();
      watchRatio();
    };
    if (query.addEventListener) query.addEventListener('change', onChange); else if (query.addListener) query.addListener(onChange);
  }
  watchRatio();

  readColours();
  resize();
  if (reducedMotion && reducedMotion.matches) stillLife();
  update();
})();
