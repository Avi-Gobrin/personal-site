/* ============================================================
   Preview the site on your own machine, the way GitHub Pages
   serves it (folders open their index.html; missing pages get
   404.html).

     node tools/serve.mjs        then open http://localhost:8000/personal-site/
   ============================================================ */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.env.PORT || 8000);
const PREFIX = '/personal-site/';
const LIVE = 'https://avi-gobrin.github.io/personal-site/';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf',
  '.xml': 'application/xml', '.txt': 'text/plain'
};

/* The 404 page uses absolute links to the live site; point them here instead. */
const local = html => html.replaceAll(LIVE, `http://localhost:${PORT}${PREFIX}`);

http.createServer((req, res) => {
  const path = decodeURIComponent(req.url.split(/[?#]/)[0]);
  if (path === '/') { res.writeHead(302, { location: PREFIX }); return res.end(); }
  let file = path.startsWith(PREFIX) ? normalize(join(ROOT, path.slice(PREFIX.length))) : '';
  if (file && existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith('/')) { res.writeHead(301, { location: path + '/' }); return res.end(); }
    file = join(file, 'index.html');
  }
  if (!file || !file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    return res.end(local(readFileSync(join(ROOT, '404.html'), 'utf8')));
  }
  const type = TYPES[extname(file)] || 'application/octet-stream';
  res.writeHead(200, { 'content-type': type });
  res.end(type.startsWith('text/html') ? local(readFileSync(file, 'utf8')) : readFileSync(file));
}).listen(PORT, () => console.log(`Serving the site at http://localhost:${PORT}${PREFIX}  (Ctrl+C to stop)`));
