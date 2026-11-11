/* ============================================================
   The homepage hero: one living drawing behind the name.

   This file is the harness. A scene (room.js) calls
   Hero(function (api) { return hooks; }) and the harness does the rest:
     - sizes the canvas for the screen's pixel ratio, and redraws
       sharp after zooming or moving to another screen;
     - measures every [data-avoid] block (the nav and the name) into
       api.avoid, so the scene can lay itself out around them;
     - runs only when it should: never off screen, never in a hidden
       tab, never after the pause button (remembered per browser),
       and under prefers-reduced-motion it draws one still frame;
     - passes the pointer to the scene as api.pointer.

   Scene hooks, all optional except draw:
     resize(w, h)   the canvas changed size (CSS pixels)
     step(dt)       advance the model by dt seconds
     draw(ctx)      paint one frame
     still()        prepare a good-looking still frame
     theme()        colours changed; re-read them
   ============================================================ */
window.Hero = function (makeScene) {
  var hero = document.querySelector('[data-hero]');
  var canvas = hero && hero.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var pauseButton = hero.querySelector('[data-pause]');
  var reduced = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;

  var api = { width: 0, height: 0, avoid: [], pointer: null, hero: hero };
  var onScreen = true, paused = false, frame = 0, lastTime = 0;
  var scene;

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
    ctx.clearRect(0, 0, api.width, api.height);
    scene.draw(ctx, api);
  }

  function still() { return reduced && reduced.matches; }
  function moving() { return onScreen && !paused && !document.hidden && !still(); }

  function tick(now) {
    frame = 0;
    if (!moving()) return;
    var dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0.016;
    lastTime = now;
    if (scene.step) scene.step(dt);
    paint();
    frame = requestAnimationFrame(tick);
  }

  function update() {
    if (pauseButton) {
      pauseButton.hidden = still();
      pauseButton.setAttribute('aria-pressed', paused ? 'true' : 'false');
    }
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
  hero.addEventListener('pointermove', function (e) { api.pointer = local(e); if (!moving()) paint(); });
  hero.addEventListener('pointerleave', function () { api.pointer = null; if (!moving()) paint(); });

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
