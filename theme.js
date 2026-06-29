(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  function label(t) { return t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'; }
  btn.setAttribute('aria-label', label(root.getAttribute('data-theme')));

  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    btn.setAttribute('aria-label', label(next));
  });
})();
