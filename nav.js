(function () {
  var NAV_LINKS = [
    { href: 'index.html',      label: 'Home' },
    { href: 'experience.html', label: 'Experience' },
    { href: 'projects.html',   label: 'Projects' },
    { href: 'writing.html',    label: 'Writing' },
    { href: 'coursework.html', label: 'Coursework' }
  ];

  var page = location.pathname.split('/').pop() || 'index.html';

  var links = NAV_LINKS.map(function (l) {
    var cls = l.href === page ? ' class="on"' : '';
    return '<li><a href="' + l.href + '"' + cls + '>' + l.label + '</a></li>';
  }).join('');

  document.querySelector('nav .wrap').innerHTML =
    '<a href="index.html" class="logo">Avi Gobrin</a>' +
    '<div class="nav-right">' +
      '<ul class="nav-links">' + links + '</ul>' +
      '<button class="nav-toggle" type="button" aria-label="Toggle navigation">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
      '</button>' +
      '<button class="theme-toggle" type="button" aria-label="Toggle dark mode">' +
        '<svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
        '<svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>' +
      '</button>' +
    '</div>';

  var nav = document.querySelector('nav');
  document.querySelector('.nav-toggle').addEventListener('click', function () {
    nav.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) nav.classList.remove('open');
  });
})();
