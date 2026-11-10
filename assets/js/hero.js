/* ============================================================
   The homepage hero: one living drawing behind the name.

   This file is the harness. A scene (hero-*.js) calls
   Hero(function (api) { return hooks; }) and the harness does the rest:
     - sizes the canvas for the screen's pixel ratio, and redraws
       sharp after zooming or moving to another screen;
     - keeps every stroke out from behind text: anything marked
       [data-avoid] inside the hero is cut out of the drawing;
     - runs only when it should: never off screen, never in a hidden
       tab, never after Pause (remembered per browser), and under
       prefers-reduced-motion it draws one still frame instead;
     - passes taps and the pointer to the scene, and refreshes the
       scene's one-line readout four times a second.

   Scene hooks, all optional except draw:
     resize(w, h)   the canvas changed size (CSS pixels)
     step(dt)       advance the model by dt seconds
     draw(ctx)      paint one frame
     still()        prepare a good-looking still frame
     tap(x, y)      the visitor tapped or clicked the drawing
     readout()      a short string for [data-readout]
     theme()        colours changed; re-read them
   and one optional flag:
     cut: false     do not cut the text blocks out; the scene lays
                    itself out around api.avoid instead
   ============================================================ */
window.Hero = function (makeScene) {
  var hero = document.querySelector('[data-hero]');
  var canvas = hero && hero.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var note = hero.querySelector('[data-hero-note]');
  var readoutEl = note && note.querySelector('[data-readout]');
  var pauseButton = note && note.querySelector('[data-pause]');
  var reduced = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;

  var api = { width: 0, height: 0, avoid: [], pointer: null, hero: hero };
  var onScreen = true, paused = false, frame = 0, lastTime = 0, sinceReadout = 1;
  var scene;
  var FEATHER = 22;   // pixels of soft fade around each text block

  /* Read a CSS custom property from the hero, so scenes follow the theme. */
  api.css = function (name, fallback) {
    var v = getComputedStyle(hero).getPropertyValue(name).trim();
    return v || fallback;
  };

  /* Is (x, y) clear of every text block, with some padding? */
  api.clear = function (x, y, pad) {
    pad = pad || 0;
    for (var i = 0; i < api.avoid.length; i++) {
      var r = api.avoid[i];
      if (x > r.x - pad && x < r.x + r.w + pad && y > r.y - pad && y < r.y + r.h + pad) return false;
    }
    return true;
  };

  function measure() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    api.width = rect.width;
    api.height = rect.height;
    api.avoid = [].map.call(hero.querySelectorAll('[data-avoid]'), function (el) {
      var r = el.getBoundingClientRect();
      return { x: r.left - rect.left - 10, y: r.top - rect.top - 8, w: r.width + 20, h: r.height + 16 };
    }).filter(function (r) { return r.w > 20 && r.h > 16; });
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (scene.resize) scene.resize(api.width, api.height);
    return true;
  }

  function paint() {
    if (scene.cut === false) {   // the scene keeps clear of the text itself
      ctx.clearRect(0, 0, api.width, api.height);
      scene.draw(ctx, api);
      return;
    }
    ctx.save();
    ctx.clearRect(0, 0, api.width, api.height);
    /* Cut the text blocks out of the drawing (even-odd fill rule)... */
    ctx.beginPath();
    ctx.rect(0, 0, api.width, api.height);
    api.avoid.forEach(function (r) { ctx.rect(r.x, r.y, r.w, r.h); });
    ctx.clip('evenodd');
    scene.draw(ctx, api);
    ctx.restore();
    /* ...and fade the drawing out as it nears them, so the cut has soft edges. */
    if ('filter' in ctx) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.filter = 'blur(' + FEATHER + 'px)';
      ctx.fillStyle = '#000';
      api.avoid.forEach(function (r) { ctx.fillRect(r.x - FEATHER, r.y - FEATHER, r.w + 2 * FEATHER, r.h + 2 * FEATHER); });
      ctx.restore();
    }
  }

  function still() { return reduced && reduced.matches; }
  function moving() { return onScreen && !paused && !document.hidden && !still(); }

  function showReadout(dt) {
    if (!readoutEl || !scene.readout) return;
    sinceReadout += dt;
    if (sinceReadout < 0.25) return;
    sinceReadout = 0;
    readoutEl.textContent = scene.readout();
  }

  function tick(now) {
    frame = 0;
    if (!moving()) return;
    var dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
    lastTime = now;
    if (scene.step) scene.step(dt);
    paint();
    showReadout(dt);
    frame = requestAnimationFrame(tick);
  }

  function update() {
    if (note) note.hidden = false;
    if (pauseButton) {
      pauseButton.hidden = still();
      pauseButton.textContent = paused ? 'Play' : 'Pause';
    }
    if (readoutEl) readoutEl.hidden = still();
    if (moving() && !frame) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
    if (!moving()) paint();
  }

  function local(e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  hero.addEventListener('pointermove', function (e) { api.pointer = local(e); });
  hero.addEventListener('pointerleave', function () { api.pointer = null; });
  hero.addEventListener('pointerdown', function (e) {
    if (e.target.closest('a, button, [data-avoid]')) return;   // links and text keep working as usual
    var p = local(e);
    if (scene.tap && moving()) scene.tap(p.x, p.y, e.pointerType);
  });

  if (pauseButton) {
    try { paused = localStorage.getItem('hero') === 'paused'; } catch (e) {}
    pauseButton.addEventListener('click', function () {
      paused = !paused;
      try { localStorage.setItem('hero', paused ? 'paused' : 'playing'); } catch (e) {}
      update();
    });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; update(); }).observe(hero);
  }
  document.addEventListener('visibilitychange', update);
  function onMotionSetting() { if (still() && scene.still) scene.still(); update(); }
  if (reduced && reduced.addEventListener) reduced.addEventListener('change', onMotionSetting);
  else if (reduced && reduced.addListener) reduced.addListener(onMotionSetting);
  new MutationObserver(function () { if (scene.theme) scene.theme(api); if (!moving()) paint(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () { if (measure() && !moving()) paint(); }).observe(hero);
  }
  (function watchRatio() {
    if (!window.matchMedia) return;
    var q = matchMedia('(resolution: ' + (window.devicePixelRatio || 1) + 'dppx)');
    var once = function () {
      if (q.removeEventListener) q.removeEventListener('change', once); else if (q.removeListener) q.removeListener(once);
      if (measure() && !moving()) paint();
      watchRatio();
    };
    if (q.addEventListener) q.addEventListener('change', once); else if (q.addListener) q.addListener(once);
  })();
  /* Fonts change the size of the text blocks, so measure again once they land. */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (measure() && !moving()) paint(); });

  scene = makeScene(api);
  if (scene.theme) scene.theme(api);
  measure();
  if (still() && scene.still) scene.still();
  update();
};
