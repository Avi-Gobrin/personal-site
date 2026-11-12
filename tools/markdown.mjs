/* ============================================================
   A small Markdown converter for blog posts: the parts a post
   needs, nothing more, and no dependencies.

   Blocks: paragraphs; # to #### headings (# and ## both become
   <h2>, since the post's title is the page's <h1>); lists with
   -, *, + or 1. (one level); > quotes; ``` fenced code; ---
   rules; and HTML blocks (a block whose first line starts with <
   is copied as written).
   Inline: `code`, **bold**, *italics* or _italics_, [links](url),
   and ![images](src). A URL that does not start with a scheme
   (https:, mailto:), / or # is relative to the site root.
   ============================================================ */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const quote = s => s.replace(/"/g, '&quot;');
const BLOCK = /^(#{1,6}\s|```|>|\s*([-*+]|\d+[.)])\s)/;   // lines that end a paragraph

export function markdown(src, root = '') {
  const url = u => (/^([a-z][a-z0-9+.-]*:|\/|#)/i.test(u) ? u : root + u);

  function inline(text) {
    const kept = [];
    const keep = html => `\u0000${kept.push(html) - 1}\u0000`;
    const emphasis = s => s
      .replace(/\*\*(?=\S)(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^\w*])\*(?=[^\s*])(.+?)\*(?!\w)/g, '$1<em>$2</em>')
      .replace(/(^|\W)_(?=\S)(.+?)_(?!\w)/g, '$1<em>$2</em>');
    const s = emphasis(esc(text)
      .replace(/`([^`]+)`/g, (m, code) => keep(`<code>${code}</code>`))
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, s2) => keep(`<img src="${quote(url(s2))}" alt="${quote(alt)}" loading="lazy">`))
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, href) => keep(`<a href="${quote(url(href))}">${emphasis(label)}</a>`)));
    const restore = t => t.replace(/\u0000(\d+)\u0000/g, (m, i) => restore(kept[i]));
    return restore(s);
  }

  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const blank = l => !l.trim();
  const out = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    let m;
    if (blank(line)) { i++; continue; }
    if ((m = line.match(/^```\s*([\w+-]*)/))) {
      /* Code is kept exactly. Its lines are joined with &#10;, so the block is one line
         of HTML that the build's indenting and trailing-space trimming cannot change.
         tabindex lets a keyboard scroll a long line sideways. */
      const code = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); i++) code.push(esc(lines[i]));
      i++;
      out.push(`<pre tabindex="0"><code${m[1] ? ` class="language-${m[1]}"` : ''}>${code.join('&#10;')}</code></pre>`);
    } else if ((m = line.match(/^(#{1,6})\s+(.*?)(?:\s+#+)?\s*$/))) {
      const n = Math.min(Math.max(m[1].length, 2), 4);
      out.push(`<h${n}>${inline(m[2])}</h${n}>`);
      i++;
    } else if (/^ {0,3}([-*_])( *\1){2,} *$/.test(line)) {
      out.push('<hr>');
      i++;
    } else if (/^>/.test(line)) {
      const quoted = [];
      for (; i < lines.length && /^>/.test(lines[i]); i++) quoted.push(lines[i].replace(/^> ?/, ''));
      out.push(`<blockquote>\n${markdown(quoted.join('\n'), root)}\n</blockquote>`);
    } else if ((m = line.match(/^\s*([-*+]|\d+[.)])\s+/))) {
      const tag = /\d/.test(m[1]) ? 'ol' : 'ul', items = [];
      for (; i < lines.length && !blank(lines[i]); i++) {
        const item = lines[i].match(/^\s*(?:[-*+]|\d+[.)])\s+(.*)$/);
        if (item) items.push(item[1]);
        else items[items.length - 1] += ' ' + lines[i].trim();   // a wrapped line belongs to the item above
      }
      out.push(`<${tag}>\n${items.map(t => `  <li>${inline(t)}</li>`).join('\n')}\n</${tag}>`);
    } else if (/^</.test(line)) {
      const html = [];
      for (; i < lines.length && !blank(lines[i]); i++) html.push(lines[i]);
      out.push(html.join('\n'));
    } else {
      const para = [];
      do { para.push(lines[i].trim()); i++; } while (i < lines.length && !blank(lines[i]) && !BLOCK.test(lines[i]));
      out.push(`<p>${inline(para.join(' '))}</p>`);
    }
  }
  return out.join('\n');
}
