/* Morning by day, dusk by night. The choice is remembered;
   until you make one, the site follows your system setting. */
(function () {
  var root = document.documentElement;
  var button = document.querySelector('.theme-toggle');
  if (!button) return;
  button.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* For the engineers who open DevTools on every site they visit. */
try {
  console.log('%cHi! If you opened the console, we would probably get along.\n%cavichaigobrin@gmail.com',
    'font: italic 16px Alegreya, Georgia, serif; color: #234e8c;', 'font: 13px Alegreya Sans, sans-serif; color: #566072;');
} catch (e) {}
