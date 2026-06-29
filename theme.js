(function () {
  var root = document.documentElement;

  // Theme toggle
  var btn = document.querySelector('.theme-toggle');
  if (btn) {
    function label(t) { return t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'; }
    btn.setAttribute('aria-label', label(root.getAttribute('data-theme')));
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      btn.setAttribute('aria-label', label(next));
    });
  }

  // Mobile nav toggle
  var nav = document.querySelector('nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) nav.classList.remove('open');
    });
  }
})();
